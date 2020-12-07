const callInfo = require('./dataFrameClass.js') //call the class File and store in callInfo

class keyClass {
    constructor(field, key) {
        this.field = field;
        this.key = key;
    }

    keySearch(dataFrame) {
        var tempDF = [];
        for (var i = 0; i < dataFrame.length; ++i) {
            switch (this.field) {
                case "State":
			if (this.key == "new york") {
				this.key = "ny";
			}
			if (this.key == "new jersey") {
				this.key = "nj";
			}
                    if (this.key == dataFrame[i].State) {
                        tempDF.push(dataFrame[i]);
                    }
                    break;
                case "City":
                    if (dataFrame[i].City.includes(this.key)) {
                        tempDF.push(dataFrame[i]);
                    }
                    break;
                case "Date":
                    if (dataFrame[i].Date.includes(this.key)) {
                        tempDF.push(dataFrame[i]);
                    }
                    break;
                case "Time":
                    if (dataFrame[i].Time.includes(this.key)) {
                        tempDF.push(dataFrame[i]);
                    }
                    break;
                case "Address":
                    if (dataFrame[i].Address.includes(this.key)) {
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
			if (this.key == "july" || this.key == "jul") {
                        	this.key = "7";
                        }
                        if (this.key == "august" || this.key == "aug") {
                                this.key = "8";
                        }
                        if (this.key == "september" || this.key == "sep") {
                                this.key = "9";
                        }
                    if (this.key == month) {
                        tempDF.push(dataFrame[i]);
                    }
                    break;
                case "Street":
                    if (dataFrame[i].street.includes(this.key)) {
                        tempDF.push(dataFrame[i]);
                    }
                    break;
                default:
                    //console.log(`No cases found for field: ${this.field} and key ${this.key}`)
                    break;
            }
        }

        //console.log(tempDF.length)
        return tempDF;
    }

}

module.exports = keyClass;
