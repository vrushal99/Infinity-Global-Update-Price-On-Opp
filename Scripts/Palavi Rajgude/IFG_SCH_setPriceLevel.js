
/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */

 define(['N/record','N/runtime',"N/search"], function ( record, runtime, search) {

    function execute(context){

        try{

        var itemRecId = runtime.getCurrentScript().getParameter({ name: 'custscript_item_id' });
        var usdBasePrice = runtime.getCurrentScript().getParameter({ name: 'custscript_usd_base_price' });


        var opportunitySearchObj = search.create({
            type: "opportunity",
            filters:
            [
            //    ["entitystatus","anyof","8"], 
            //    "AND", 
               ["user.isinactive","is","F"]
            ],
            columns:
            [
               search.createColumn({name: "internalid", label: "Internal ID"}),
               search.createColumn({name: "entity", label: "Customer"})
            ]
         });
    


        var opportunitySearchResult = opportunitySearchObj.run().getRange({ start: 0, end: 1000 });

       

        for(var i = 0; i < opportunitySearchResult.length; i++){

            var opportunityId = opportunitySearchResult[i].getValue({ name: 'internalid' });

            var loadOppoRec = record.load({
                type: 'opportunity',
                id: opportunityId,
            });


                
                var loadCount = loadOppoRec.getLineCount({
                    sublistId: 'item'
                });


                for(var j=0 ; j<loadCount ; j++){
                        
                    var loadItemId = loadOppoRec.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: j
                    });

                   

                      if(loadItemId == itemRecId){

            

                        loadOppoRec.setSublistValue({
                            sublistId: 'item',
                            fieldId: 'price',
                            value: -1,
                            line: j
                           
                        });

                        var quantityItem = loadOppoRec.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'quantity',
                            line : j
                        });


                        loadOppoRec.setSublistValue({
                            sublistId: 'item',
                            fieldId: 'rate',
                            value: usdBasePrice,
                            line: j

                        });

                        var rateItem = loadOppoRec.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'rate',
                            line : j
                        });
                        

                        var calAmount = quantityItem * rateItem;

                        loadOppoRec.setSublistValue({
                            sublistId: 'item',
                            fieldId: 'amount',
                            value: calAmount,
                            line: j

                        });

                    }
                    
                    }

                loadOppoRec.save();

                }

        }
        catch(e){
            log.debug({
                title: 'Error in execute() function',
                details: e.toString()
            });
        }

    }

  
    return {
        execute: execute
    }
})
