/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(["N/search", "N/runtime", "N/record"], function (
  search,
  runtime,
  record
) {
  /**
   * @param {function} getInputData - Beginning of the Map/Reduce process and generates input data.
   * @param  {object} context - The context object contains the records related data
   * @returns {search} - Search for getting opportunity records Id and item records Id
   */
  function getInputData(context) {
    try {
    
        return search.create({
            type: "opportunity",
            filters:
            [
               ["item.custitem_change_price","is","T"], 
           
            ],
            columns:
            [
               search.createColumn({name: "tranid", label: "Document Number"}),
               search.createColumn({name: "entity", label: "Customer"}),
               search.createColumn({name: "internalid", label: "Internal ID"}),
               search.createColumn({
                  name: "internalid",
                  join: "item",
                  label: "Internal ID"
               })
            ]
         });


    //   return search.create({
    //     type: "transaction",
    //     filters: [
    //       ["type", "anyof", "Opprtnty"],
    //       "AND",
    //       ["item.custitem_change_price", "is", "T"],
    //       "AND",
    //       ["mainline", "is", "F"],
    //     ],
    //     columns: [
    //       search.createColumn({ name: "tranid", label: "Document Number" }),
    //       search.createColumn({ name: "entity", label: "Name" }),
    //       search.createColumn({ name: "internalid", label: "Internal ID" }),
    //       search.createColumn({
    //         name: "internalid",
    //         join: "item",
    //         label: "Internal ID",
    //       }),
    //     ],
    //   });
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

      var resultArr = [];
      var itemArr = [];

      for (let i = 0; i < reduceContext.values.length; i++) {

        var result = JSON.parse(reduceContext.values[i]);

        resultArr.push(result);

      }

      log.debug("resultArr", resultArr);

      log.debug("resultArr length", resultArr.length);

        for(var i = 0; i < resultArr.length; i++){

            var item = resultArr[i].values["internalid.item"].value;

            itemArr.push(item);

        }

        log.debug("itemArr", itemArr);

      var loadOppoRecord = record.load({
        type: "opportunity",
        id: resultArr[0].id,
        isDynamic: true
      });

      log.debug("loadOppoRecord", loadOppoRecord);

      updateItemOnOppo(resultArr,loadOppoRecord,itemArr);

    } catch (e) {
      log.debug("Error in reduce() function", e.toString());
    }
  }



  /**
   * @param {function} updateItemOnOppo - Update line items on opportunity record
   * @param  {Array} resultArr - Store the result of reduce function
   * @param  {object} loadOppoRecord - Loaded opportunity record
   */
  function updateItemOnOppo(resultArr,loadOppoRecord,itemArr) {
    try {


    for(var i = 0; i < itemArr.length; i++){

    var itemId = itemArr[i];

    log.debug("itemId", itemId);

    var loadCount = loadOppoRecord.getLineCount({
      sublistId: "item",
    });


    for (var l = 0; l < loadCount; l++) {

        loadOppoRecord.selectLine({
            sublistId: 'item',
            line: l
        });

      var loadItemId = loadOppoRecord.getCurrentSublistValue({
        sublistId: "item",
        fieldId: "item",
      });

      if (loadItemId == itemId) {
        record.submitFields({
            type: "inventoryitem",
            id: itemId,
            values: {
              custitem_change_price: false,
            },
          });

        var getItem = loadOppoRecord.getCurrentSublistValue({
          sublistId: "item",
          fieldId: "item",
        });

        var getPriceLevel = loadOppoRecord.getCurrentSublistValue({
          sublistId: "item",
          fieldId: "price",
        });


        loadOppoRecord.setCurrentSublistValue({
          sublistId: "item",
          fieldId: "item",
          value: getItem,
        });

        loadOppoRecord.setCurrentSublistValue({
          sublistId: "item",
          fieldId: "price",
          value: getPriceLevel,
        });

        var getRate = loadOppoRecord.getCurrentSublistValue({
            sublistId: "item",
            fieldId: "rate",
        });

        log.debug('getRate', getRate);

        var getQuantity = loadOppoRecord.getCurrentSublistValue({
            sublistId: "item",
            fieldId: "quantity",
        });

        log.debug('getQuantity', getQuantity);

        var calAmount = getRate * getQuantity;

        log.debug('calAmount', calAmount);

        loadOppoRecord.setCurrentSublistValue({
            sublistId: "item",
            fieldId: "amount",
            value: calAmount,
        });

      }

      loadOppoRecord.commitLine({
        sublistId: 'item'
    });

   
    }

    }

    loadOppoRecord.save();
}

    catch (e) {
        log.debug("Error in updateItemOnOppo() function", e.toString());
    }
}

  return {
    getInputData: getInputData,
    reduce: reduce,
  };
});
