/**
 * Created with JetBrains PhpStorm.
 * User: DucuGhita
 * Date: 2/12/14
 * Time: 2:48 PM
 * A JavaScript Class for generating a dynamic calendar
 */
var calendarCls = function(){

    /**
     * Month of the Calendar
     * @type {String}
     */
    this.month = '';

    /**
     * Year of the Calendar
     * @type {String}
     */
    this.year = '';

    /**
     * Type of the Calendar
     * monthly/weekly
     * @type {String}
     */
    this.type = 'monthly';

    /**
     *
     * @param month
     * @param year
     * @return {Array}
     */
    this.getDaysInMonth = function (month, year) {
        var date = new Date(year, month, 1);
        var days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }

    /**
     * Execution function
     * @return {Object}
     */
    this.execute = function(){
        var dayOfWeek = 0;
        switch(this.type){
            case 'monthly':
                /*TODO: Ajax call to get events per this month */
                    var to_return = {
                        'weeks': [
                            {'days':[]},
                            {'days':[]},
                            {'days':[]},
                            {'days':[]},
                            {'days':[]},
                            {'days':[]}
                        ]};
                    var days = this.getDaysInMonth(this.month,this.year);
                    $.each(days,function(index,value){
                        /*TODO: Get events from JSON of Ajax Call */

                        if(index == 0){
                            dayOfWeek = value.getDay();
                        }
                        var ind = parseInt((index+ dayOfWeek)/7);

                        /** Loop empty entries before 1st of month in order to keep day of the week**/
                        if(index == 0 && dayOfWeek > 0 && ind == 0){
                            for(var i=0; i < dayOfWeek; i++){
                                    to_return['weeks'][ind]['days'].push(null);
                            }

                        }
                        var aux = {
                            'i': value.getDate(),
//                            'dayOfWeek': calendarCls.daysOfWeek[value.getDay()]
                            'dayOfWeek': value.getDay()
                        };
//                        if (obj.hasOwnProperty("key1")) {
//                        object key exists
//                        }
                        to_return['weeks'][ind]['days'].push(aux);
                    });
                console.log(to_return);
                    return to_return;
                break;

        }
    }

}

/**
 * Static variable
 * Days of the week, in order to make the table headers full dynamic;
 * @type {Array}
 */
calendarCls.daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];