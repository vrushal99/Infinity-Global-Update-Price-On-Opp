/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */

/***********************************************************************
 * Description:  This Script will work for Updating the Price Level in the 
 * 'New Store Transfer to SO' record. When user Change the Price from Inventory 
 * Item record, then Script will update the Price Level and Rate for Particular 
 * Line-Item in 'New Store Transfer to SO' record.
 
 * Version: 1.0.0 - Initial version
 * Author:  Caravel/Palavi Rajgude
 * Date:    09-05-2022
 
 ***********************************************************************/

/**
 * @param  {object} search - search result
 * @param  {object} record - Access all current record information
 * @return {function} getInputData - return the input data to reduce function
 * @return {function} reduce - perform all operation and return the result
 */
define(["N/search", "N/record","N/runtime"], function (search, record, runtime) {
  /**
   * @param {function} getInputData - Beginning of the Map/Reduce process and generates input data.
   * @param  {object} context - The context object contains the records related data
   * @returns {search} - Search for getting opportunity records Id and item records Id
   */
  function getInputData(context) {
    try {
      let scriptObj = runtime.getCurrentScript();
  

      let tranType = scriptObj.getParameter({ name: "custscript_tran_type" });
      // return all data related to the opportunity record

      //current date
      let todayDate = new Date();
      let todayDateStr = (todayDate.getMonth() + 1) + "/" + todayDate.getDate() +  "/" + todayDate.getFullYear();

      if (tranType == "SO") {
        return search.create({
          type: "salesorder",
          filters: [
            ["type","anyof","SalesOrd"], 
            "AND", 
            ["status","anyof","SalesOrd:A","SalesOrd:B"], 
            "AND", 
            ["custbody_ig_order_dc_release_date","onorafter",todayDateStr],
            "AND",
            ["item.custitem_change_price", "is", "T"]
         ],
          columns: [
            search.createColumn({ name: "tranid", label: "Document Number" }),
            search.createColumn({ name: "entity", label: "Customer" }),
            search.createColumn({ name: "internalid", label: "Internal ID" }),
            search.createColumn({
              name: "internalid",
              join: "item",
              label: "Internal ID"
            })
          ]
        });
      } else if (tranType == "OPP") {
        return search.create({
          type: "opportunity",
          filters: [["item.custitem_change_price", "is", "T"]],
          columns: [
            search.createColumn({ name: "tranid", label: "Document Number" }),
            search.createColumn({ name: "entity", label: "Customer" }),
            search.createColumn({ name: "internalid", label: "Internal ID" }),
            search.createColumn({
              name: "internalid",
              join: "item",
              label: "Internal ID"
            })
          ]
        });
      }
    } catch (e) {
      log.debug("Error in getInputData() function", e.toString());
    }
  }

  /**
   * @param {function} reduce - Execute after getting data from getInputData() function and load data to be processed.
   * @param {ReduceSummary} reduceContext - Data collection containing the groups to process through the reduce stage
   */
  function reduce(reduceContext) {
    try {
      let scriptObj = runtime.getCurrentScript();

      let tranType = scriptObj.getParameter({ name: "custscript_tran_type" });
      var resultArr = [];
      var itemArr = [];

      //for loop use for store the search result in array
      for (let i = 0; i < reduceContext.values.length; i++) {
        let result = JSON.parse(reduceContext.values[i]);

        resultArr.push(result);
      }

      //for loop use for store the internal id of the item record
      for (let i = 0; i < resultArr.length; i++) {
        let item = resultArr[i].values["internalid.item"].value;

        itemArr.push(item);
      }

      tranType = tranType == "SO"? "salesorder" : "opportunity"
      //load 'new store transfer to so' record
      var loadOppoRecord = record.load({
        type: tranType,
        id: resultArr[0].id,
        isDynamic: true
      });

      //object to store the array
      let reduceObj = {
        itemArr: itemArr,
        loadOppoRecord: loadOppoRecord
      };

      //pass 'reduceObj' object to the updateItemOnOppo function
      updateItemOnOppo(reduceObj);
    } catch (e) {
      log.debug("Error in reduce() function", e.toString());
    }
  }

  /**
   * @param {function} updateItemOnOppo - Update line items on opportunity record
   * @param  {Array} resultArr - Store the result of reduce function
   * @param  {object} loadOppoRecord - Loaded opportunity record
   */
  function updateItemOnOppo(reduceObj) {
    try {
      var { itemArr: itemArr, loadOppoRecord: loadOppoRecord } = reduceObj;

      //for loop use to iterate the item array
      for (let i = 0; i < itemArr.length; i++) {
        let itemId = itemArr[i];

        let loadCount = loadOppoRecord.getLineCount({
          sublistId: "item"
        });

        //for loop use to iterate the line items on 'new store transfer to so' record
        for (let l = 0; l < loadCount; l++) {
          loadOppoRecord.selectLine({
            sublistId: "item",
            line: l
          });

          let loadItemId = loadOppoRecord.getCurrentSublistValue({
            sublistId: "item",
            fieldId: "item"
          });

          var updateItemObj = {
            itemId: itemId,
            loadItemId: loadItemId,
            loadOppoRecord: loadOppoRecord
          };

          //pass 'updateItemObj' object to the 'setItemPriceLevel' function
          setItemPriceLevel(updateItemObj);

          loadOppoRecord.commitLine({
            sublistId: "item"
          });
        }
      }

      loadOppoRecord.save();
      log.debug(
        "New Store Transfer to SO record updated successfully",
        loadOppoRecord.id
      );
    } catch (e) {
      log.debug("Error in updateItemOnOppo() function", e.toString());
    }
  }
  /**
   * @param {function} setItemPriceLevel - update the price level and rate for particular line item
   * @param {object} updateItemObj - Store the item id and opportunity record
   */
  function setItemPriceLevel(updateItemObj) {
    try {
      var {
        itemId: itemId,
        loadItemId: loadItemId,
        loadOppoRecord: loadOppoRecord
      } = updateItemObj;

      //condition to check the item id from search result is equal to the item id in the opportunity record
      if (loadItemId == itemId) {
        //uncheck the 'Change Price' checkbox for the particular line item
        record.submitFields({
          type: "inventoryitem",
          id: itemId,
          values: {
            custitem_change_price: false
          }
        });

        let getItem = loadOppoRecord.getCurrentSublistValue({
          sublistId: "item",
          fieldId: "item"
        });

        let getPriceLevel = loadOppoRecord.getCurrentSublistValue({
          sublistId: "item",
          fieldId: "price"
        });

        loadOppoRecord.setCurrentSublistValue({
          sublistId: "item",
          fieldId: "item",
          value: getItem
        });

        loadOppoRecord.setCurrentSublistValue({
          sublistId: "item",
          fieldId: "price",
          value: getPriceLevel
        });

        let getRate = loadOppoRecord.getCurrentSublistValue({
          sublistId: "item",
          fieldId: "rate"
        });

        let getQuantity = loadOppoRecord.getCurrentSublistValue({
          sublistId: "item",
          fieldId: "quantity"
        });

        //calculate amount on the basis of quantity and rate
        let calAmount = getRate * getQuantity;

        loadOppoRecord.setCurrentSublistValue({
          sublistId: "item",
          fieldId: "amount",
          value: calAmount
        });
      }
    } catch (e) {
      log.debug("Error in setItemPriceLevel() function", e.toString());
    }
  }

  return {
    getInputData: getInputData,
    reduce: reduce
  };
});
