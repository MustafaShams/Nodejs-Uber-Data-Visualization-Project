const callInfo = require('./dataFrameClass.js') //call the class File and store in callInfo

class keyClass {
    constructor(field, key) {
        this.field = field;
        this.key = key;
    }    
    
    keySearch(dataFrame) {
        var tempDF = [];
        for (var i = 0; i < dataFrame.length; ++i) {
            switch(this.field) {
                case "State":
                    if (this.key == dataFrame[i].State) {
                        tempDF.push(dataFrame[i]);
                    }
                    break;
                case "City":
                    if (this.key == dataFrame[i].City) {
                        tempDF.push(dataFrame[i]);
                    }
                    break;
                case "Date":
                    if (this.key == dataFrame[i].Date) {
                        tempDF.push(dataFrame[i]);
                    }
                    break;
                case "Time":
                    if (this.key == dataFrame[i].Time) {
                        tempDF.push(dataFrame[i]);
                    }
                    break;
                case "Address":
                    if (this.key == dataFrame[i].Address) {
                        tempDF.push(dataFrame[i]);
                    }
                    break;
                case "Year":
                    var date = dataFrame[i].Date;
                    date = date.split('.');
                    var year = date[2];
                    if (this.key == year) {
                        tempDF.push(dataFrame[i]);
                    }
                    break;
                case "Month":
                    var date = dataFrame[i].Date;
                    date = date.split('.');
                    var month = date[0];
                    if (this.key == month) {
                        tempDF.push(dataFrame[i]);
                    }
                    break;
                case "Street": 
                    if (this.key == dataFrame[i].street) {
                        tempDF.push(dataFrame[i]);
                    }
                    break;
                default:
                    console.log(`No cases found for field: ${this.field} and key ${this.key}`)
                    break;
            }
        }

        console.log(tempDF.length)
        return tempDF;
    }

}

module.exports = keyClass;
