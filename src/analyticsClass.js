const callInfo = require('./dataFrameClass.js') 
const keyClass = require('./keyClass.js')

class analyticsClass {
    constructor(field, key) {
        this.field = field;
        this.key = key;
        this.tempDF = [];
        this.count = [];
    }

    popCitiesSearch(dataFrame) {
        for (var i = 0; i < dataFrame.length; i++) {
            if (this.key == dataFrame[i].State) {
                if (!(this.tempDF.includes(dataFrame[i].city))) {
                    this.tempDF.push(dataFrame[i].city);
                    this.count.push(1);
                }
                else if (this.tempDF.indexOf(dataFrame[i].city) != -1) {
                    var index = this.tempDF.indexOf(dataFrame[i].city);
                    this.count[index]++;
                }
            }
        }        
        //console.log(this.tempDF.length)
        
        return this.tempDF;
    }

    weekDaysSearch(dataFrame) {
        this.tempDF = [0,0,0,0,0,0,0];
console.log("Total dataframe for parsing: ", dataFrame.length);
        for (var i = 0; i < dataFrame.length; i++) {
            var date = new Date(dataFrame[i].date);
            this.tempDF[date.getDay()]++;
        }
console.log("Add these numbers, they must equal to above: ", this.tempDF.join());
        return this.tempDF;
    }
}

module.exports = analyticsClass;
