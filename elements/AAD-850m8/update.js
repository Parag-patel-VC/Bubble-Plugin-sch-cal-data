function(instance, properties, context) {
function objectMapper(item){
        let newObj = {};
        for (let key in item) {
            newObj['_p_' + key] = item[key];
        }
        return newObj;
    }    
    
    function custom_sort(a, b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    debugger;
    let list_length = properties.idata.length();
    var result_array=[];
    if(properties.idata!=null){
        var OraData=properties.idata.get(0,properties.idata.length());
        var OraDates=properties.idates.get(0,properties.idates.length());
        var TimeZ=properties.timezone;

        for(i=0;i<OraDates.length;i++){
        	let curDate=OraDates[i];
            let curDay=curDate.getDate();
            let curMonth=curDate.getMonth()+1;
            let curYear=curDate.getFullYear();
            let partial_result=[]
            for(k=0;k<OraData.length;k++){
                //Actual event data
                let startDate=OraData[k].get('start_date_date');
                let endDate=OraData[k].get('end_date_date');
                let duration=OraData[k].get('duration_number');
                let repeat=OraData[k].get("event_repeat_option_os_event_repeat").get("display").toLowerCase();
                let unique_id=OraData[k].get('_id');
                let title=OraData[k].get('title_text');
                let eventType=OraData[k].get('booking_type_option_os_event_type').get("display");
                let eventColor=OraData[k].get('event_color_text');
                //event duration overlap objects
                let eventSartDate=luxon.DateTime.fromJSDate(startDate).setZone(TimeZ);
                let eventEndDate=luxon.DateTime.fromJSDate(endDate).setZone(TimeZ);
                let EventDay=eventSartDate.day;
                let EventMonth=eventSartDate.month;
                let EventYear=eventSartDate.year;
                let EventEndDay=eventEndDate.day;
                let EventEndMonth=eventEndDate.month;
                let EventEndYear=eventEndDate.year;
                let EventHour=eventSartDate.hour;
                let EventMinute=eventSartDate.minute;
                let EventEndHour=eventEndDate.hour;
                let EventEndMinute=eventEndDate.minute;
                let EventWeekday=eventSartDate.weekday;
                let AdjustedStartDate=new Date(curYear,curMonth-1,curDay,EventHour,EventMinute);
                let AdjustedEndDate=new Date(curYear,curMonth-1,curDay,EventEndHour,EventEndMinute);
                if(repeat==="never"){
                    if(EventDay===curDay && EventMonth===curMonth && EventYear===curYear){
                       
                    	partial_result.push(objectMapper({"unique_id": unique_id,"Title": title,"StartDate": startDate,"EndDate": endDate,"EventRepeat": repeat,"EventTime": "8:15 PM","EventType": eventType,"FilterDate":curDate,"AdjustedStartDate":AdjustedStartDate,"AdjustedEndDate":AdjustedEndDate,"RoundoffDate":curDate,"EventColor":eventColor}));
                    }
                }else{
                    let CurEndTime=new Date(curDate);
                    CurEndTime.setHours(23,59,59);                   
                    let CompareDate=new Date(EventYear, EventMonth-1,EventDay,EventHour,EventMinute);                	
                    if(repeat==="daily"){
                        if(CompareDate<=CurEndTime){
                            partial_result.push(objectMapper({"unique_id": unique_id,"Title": title,"StartDate": startDate,"EndDate": endDate,"EventRepeat": repeat,"EventTime": "8:15 PM","EventType": eventType,"FilterDate":curDate,"AdjustedStartDate":AdjustedStartDate,"AdjustedEndDate":AdjustedEndDate,"RoundoffDate":curDate,"EventColor":eventColor}));
                        }

                    }else if(repeat==="weekly"){
                        let curWeekday=curDate.getDay();
                        if(curWeekday===0){
                            curWeekday=7;   
                        }

                        if(CompareDate<=CurEndTime && curWeekday===EventWeekday){
                            partial_result.push(objectMapper({"unique_id": unique_id,"Title": title,"StartDate": startDate,"EndDate": endDate,"EventRepeat": repeat,"EventTime": "8:15 PM","EventType": eventType,"FilterDate":curDate,"AdjustedStartDate":AdjustedStartDate,"AdjustedEndDate":AdjustedEndDate,"RoundoffDate":curDate,"EventColor":eventColor}));
                        }
                    }else{
						 if(CompareDate<=CurEndTime && curDay===EventDay){
                            partial_result.push(objectMapper({"unique_id": unique_id,"Title": title,"StartDate": startDate,"EndDate": endDate,"EventRepeat": repeat,"EventTime": "8:15 PM","EventType": eventType,"FilterDate":curDate,"AdjustedStartDate":AdjustedStartDate,"AdjustedEndDate":AdjustedEndDate,"RoundoffDate":curDate,"EventColor":eventColor}));
                        }
                    }                
                }
            }
            partial_result.sort(custom_sort);
            for(j=0;j<partial_result.length;j++){
                result_array.push(partial_result[j]);
            }
        }
        //window.myinstance.publishState("result",result_array);
        instance.publishState("result",result_array);
    }


}