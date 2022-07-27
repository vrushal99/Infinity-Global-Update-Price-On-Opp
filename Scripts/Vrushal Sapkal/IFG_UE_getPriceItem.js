/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(["N/task", "N/ui/serverWidget","N/record"], function ( task, ui, record) {

  function beforeload(context) {

    try {
      var itemRecordLoad = context.newRecord;

      var contextForm = context.form;

      var usdPrice = itemRecordLoad.getSublistValue({
        sublistId: "price1",
        fieldId: "price_1_",
        line: 0,
      });

      log.debug({
        title: "usdPrice",
        details: usdPrice
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

      resultArray.push(objCurrencyAmount);

      var result = JSON.stringify(resultArray);

     
    var currencyField = contextForm.addField({
        "id": "custpage_currency_price_item",
        "label": "Currency Price Item",
        "type": ui.FieldType.TEXT,
    });

    currencyField.updateDisplayType({
        "displayType": ui.FieldDisplayType.HIDDEN
    });
    

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



  
    function aftersubmit(context) {

      try{

        var loadItemRecordSubmit = context.newRecord;

        var itemId = loadItemRecordSubmit.id;

        var contextFormSubmit = context.form;

        var loadItemRecord = record.load({

          type: 'inventoryitem',
          id: itemId,
        
          });
      

      var usdPrice1 = loadItemRecordSubmit.getSublistValue({
          sublistId: 'price1',
          fieldId: 'price_1_',
          line: 0

      });

      log.debug({
          title: 'usdPrice1',
          details: usdPrice1
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

  

        if(usdPrice1 != objCurrencyAmount1.usd || britishPrice1 != objCurrencyAmount1.british || canadaPrice1 != objCurrencyAmount1.canada || chinaPrice1 != objCurrencyAmount1.china || euroPrice1 != objCurrencyAmount1.euro || hongPrice1 != objCurrencyAmount1.hong || indiaPrice1 != objCurrencyAmount1.india || japanPrice1 != objCurrencyAmount1.japan || koreanPrice1 != objCurrencyAmount1.korean || singaporePrice1 != objCurrencyAmount1.singapore || swisPrice1 != objCurrencyAmount1.swis){

      
          loadItemRecord.setValue({
            fieldId: 'custitem_change_price',
            value: true,
          });


        }

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




// var opportunitySo =  task.create({

//   taskType: task.TaskType.SCHEDULED_SCRIPT,
//   scriptId: 'customscript_ifg_sch_setpricelevel',
//   params: {
//       'custscript_item_id': itemId,
//       'custscript_usd_base_price': usdPrice1,
//   }

// });

// opportunitySo.submit();