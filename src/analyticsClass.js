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

    weekDaysSearch(dataFrame, state, city, address, street) {
        this.tempDF = [0,0,0,0,0,0,0];
        var searchDF = [];
        let keycls = new keyClass();
        searchDF = dataFrame;

        if (state != null) {
            keycls.field = "State";
            keycls.key = state;
            searchDF = keycls.keySearch(searchDF);
        }
        if (city != null) {
            keycls.field = "City";
            keycls.key = city;
            searchDF = keycls.keySearch(searchDF);
        }
        if (address != null) {
            keycls.field = "Address";
            keycls.key = address;
            searchDF = keycls.keySearch(searchDF);
        }
        if (street != null) {
            keycls.field = "Street";
            keycls.key = street;
            searchDF = keycls.keySearch(searchDF);
        }

        for (var i = 0; i < searchDF.length; i++) {
            var date = new Date(searchDF[i].date);
            this.tempDF[date.getDay()]++;
        }

        return this.tempDF;
    }
}

module.exports = analyticsClass;