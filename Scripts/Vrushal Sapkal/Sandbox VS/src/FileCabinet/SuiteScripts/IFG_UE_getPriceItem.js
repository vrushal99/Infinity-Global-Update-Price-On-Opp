/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */

/***********************************************************************
 * Description:  This Script will work for Checked the 'Change Price' checkbox
 * in the Intventory Item record, when user Changed the Price from Pricing 
 * Group.
 
 * Version: 1.0.0 - Initial version
 * Author:  Caravel/Palavi Rajgude
 * Date:    09-05-2022
 
 ***********************************************************************/

/**
 * @param  {object} ui - User Interface object
 * @param  {object} record - Access all current record information
 */
define([ "N/ui/serverWidget","N/record"], function ( ui, record) {

  /**
   * @param {function} beforeLoad - Execute before the page is loaded and use to set the base price in the created field.
   * @param  {object} context - The context object contains the records related data
   */
  function beforeload(context) {

    try {
      var itemRecordLoad = context.newRecord;

      var contextForm = context.form;

      //get all the base price from the item record
      var usdPrice = itemRecordLoad.getSublistValue({
        sublistId: "price1",
        fieldId: "price_1_",
        line: 0,
      });


      var britishPrice = itemRecordLoad.getSublistValue({
        sublistId: "price2",
        fieldId: "price_1_",
        line: 0,
      });

      var canadaPrice = itemRecordLoad.getSublistValue({
        sublistId: "price3",
        fieldId: "price_1_",
        line: 0,
      });

      var chinaPrice = itemRecordLoad.getSublistValue({
        sublistId: "price4",
        fieldId: "price_1_",
        line: 0,
      });

      var euroPrice = itemRecordLoad.getSublistValue({
        sublistId: "price5",
        fieldId: "price_1_",
        line: 0,
      });

      var hongPrice = itemRecordLoad.getSublistValue({
        sublistId: "price6",
        fieldId: "price_1_",
        line: 0,
      });

      var indiaPrice = itemRecordLoad.getSublistValue({
        sublistId: "price7",
        fieldId: "price_1_",
        line: 0,
      });

      var japanPrice = itemRecordLoad.getSublistValue({
        sublistId: "price8",
        fieldId: "price_1_",
        line: 0,
      });

      var koreanPrice = itemRecordLoad.getSublistValue({
        sublistId: "price9",
        fieldId: "price_1_",
        line: 0,
      });

      var singaporePrice = itemRecordLoad.getSublistValue({
        sublistId: "price10",
        fieldId: "price_1_",
        line: 0,
      });

      var swisPrice = itemRecordLoad.getSublistValue({
        sublistId: "price11",
        fieldId: "price_1_",
        line: 0,
      });

      var resultArray = [];

      //object to store the base price
      var objCurrencyAmount = {
        usd: usdPrice,
        british: britishPrice,
        canada: canadaPrice,
        china: chinaPrice,
        euro: euroPrice,
        hong: hongPrice,
        india: indiaPrice,
        japan: japanPrice,
        korean: koreanPrice,
        singapore: singaporePrice,
        swis: swisPrice,
      };

      //push the base price to the result array
      resultArray.push(objCurrencyAmount);

      var result = JSON.stringify(resultArray);

    //create field for storing the base price before changing the price on item record
    var currencyField = contextForm.addField({
        "id": "custpage_currency_price_item",
        "label": "Currency Price Item",
        "type": ui.FieldType.TEXT,
    });

    currencyField.updateDisplayType({
        "displayType": ui.FieldDisplayType.HIDDEN
    });
    
    //set the base price to the field
      itemRecordLoad.setValue({
        fieldId: "custpage_currency_price_item",
        value: result,
        ignoreFieldChange: true
      });


    return true;


    } catch (e) {
      log.debug({
        title: "Error in beforeLoad() function",
        details: e.toString(),
      });
    }
  }



  
    /**
     * @param {function} beforeSubmit - Execute after save the record and check if 'base price' is changed then check the 'price change' checkbox.
     * @param  {object} context - The context object contains the records related data
     */
    function aftersubmit(context) {

      try{

        var loadItemRecordSubmit = context.newRecord;

        var itemId = loadItemRecordSubmit.id;

        //load the item record
        var loadItemRecord = record.load({

          type: 'inventoryitem',
          id: itemId,
        
          });
      

      var usdPrice1 = loadItemRecordSubmit.getSublistValue({
          sublistId: 'price1',
          fieldId: 'price_1_',
          line: 0

      });

   

      var britishPrice1 = loadItemRecordSubmit.getSublistValue({
          sublistId: 'price2',
          fieldId: 'price_1_',
          line: 0

      });

      var canadaPrice1 = loadItemRecordSubmit.getSublistValue({
          sublistId: 'price3',
          fieldId: 'price_1_',
          line: 0

      });

     var  chinaPrice1 = loadItemRecordSubmit.getSublistValue({
          sublistId: 'price4',
          fieldId: 'price_1_',
          line: 0

      });

     var  euroPrice1 = loadItemRecordSubmit.getSublistValue({
          sublistId: 'price5',
          fieldId: 'price_1_',
          line: 0

      });

     var  hongPrice1 = loadItemRecordSubmit.getSublistValue({
          sublistId: 'price6',
          fieldId: 'price_1_',
          line: 0

      });

      var indiaPrice1 = loadItemRecordSubmit.getSublistValue({
          sublistId: 'price7',
          fieldId: 'price_1_',
          line: 0

      });

     var  japanPrice1 = loadItemRecordSubmit.getSublistValue({
          sublistId: 'price8',
          fieldId: 'price_1_',
          line: 0

      });

     var  koreanPrice1 = loadItemRecordSubmit.getSublistValue({
          sublistId: 'price9',
          fieldId: 'price_1_',
          line: 0

      });

     var  singaporePrice1 = loadItemRecordSubmit.getSublistValue({
          sublistId: 'price10',
          fieldId: 'price_1_',
          line: 0

      });

     var  swisPrice1 = loadItemRecordSubmit.getSublistValue({
          sublistId: 'price11',
          fieldId: 'price_1_',
          line: 0

      });

      var getObjCurrencyAmount = loadItemRecordSubmit.getValue({
          fieldId: 'custpage_currency_price_item'
      });

      var objCurrencyAmount = JSON.parse(getObjCurrencyAmount);

    
      var objCurrencyAmount1 = objCurrencyAmount[0];

  
      //condition to check if the base price is changed then check the 'price change' checkbox on item record
        if(usdPrice1 != objCurrencyAmount1.usd || britishPrice1 != objCurrencyAmount1.british || canadaPrice1 != objCurrencyAmount1.canada || chinaPrice1 != objCurrencyAmount1.china || euroPrice1 != objCurrencyAmount1.euro || hongPrice1 != objCurrencyAmount1.hong || indiaPrice1 != objCurrencyAmount1.india || japanPrice1 != objCurrencyAmount1.japan || koreanPrice1 != objCurrencyAmount1.korean || singaporePrice1 != objCurrencyAmount1.singapore || swisPrice1 != objCurrencyAmount1.swis){

      
          loadItemRecord.setValue({
            fieldId: 'custitem_change_price',
            value: true,
          });


        }

        //save the record
        loadItemRecord.save();

    }
    catch(e){
      log.debug({
          title: 'Error in aftersubmit() function',
          details: e.toString()
      });

    }
  }

  return {
    beforeLoad: beforeload,
    afterSubmit: aftersubmit,
  };
});

