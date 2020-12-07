const callInfo = require('../dataFrameClass.js')
const keyClass = require('../keyClass.js')

function monthGenerator(startMonth) {
  	switch (startMonth) {
    		case '1':
      			return "Janurary";
      			break;
    		case '2':
      			return "February";
      			break;
    		case '3':
      			return "March";
      			break;
    		case '4':
      			return "April";
      			break;
    		case '5':
      			return "May";
      			break;
    		case '6':
      			return "June";
      			break;
    		case '7':
      			return "July";
      			break;
    		case '8':
      			return "August";
      			break;
    		case '9':
      			return "September";
      			break;
    		case '10':
      			return "October";
      			break;
    		case '11':
     			return "November";
      			break;
    		case '12':
      			return "December";
      			break;
  	}
  	return "Error In Month Calculation" //should never come here
}

function getDateUnique(arr) {
  var counts = {};
  for (var i = 0; i < arr.length; i++) {
    counts[arr[i].date] = 1 + (counts[arr[i].date] || 0);
  }
  return counts;
}

function compareSearch(dataFrame, uberFrame, lyftFrame, startDate, endDate) {
	var uberCompArr = [];
 	var lyftCompArr = [];
  	var totalArr = [];
  	var startMonth = startDate; //dont need this anymore maybe?
  	var endMonth = endDate;
  	var dateUber = {}
  	var dateLyFt = {}
	var tempCounter = 7; //start date
  	while (tempCounter != 10) {//(Number(startMonth) != Number(endMonth) + 1) {
    		let keycls = new keyClass("Month", (Number(tempCounter)).toString());
    		//console.log("Comparing This Month rn: ", (Number(tempCounter).toString()));
    		var uberArr = keycls.keySearch(uberFrame);
    		var lyftArr = keycls.keySearch(lyftFrame);

    		Object.assign(dateUber, getDateUnique(uberArr));
    		Object.assign(dateLyFt, getDateUnique(lyftArr));
    
    		//console.log("Uber size for this month: ", uberArr.length);
    		//console.log("Lyft size for this month: ", lyftArr.length);
    		uberCompArr.push((monthGenerator(Number(tempCounter).toString()) + ": " + uberArr.length).toString());
    		lyftCompArr.push((monthGenerator(Number(tempCounter).toString()) + ": " + lyftArr.length).toString());
    		//startMonth = Number(startMonth) + 1;
    		//startMonth = startMonth.toString();
		++tempCounter;
  	}
  	totalArr.push(uberCompArr)
  	totalArr.push(lyftCompArr)
  	totalArr.push(dateUber);
  	totalArr.push(dateLyFt);


	////console.log("This is dateLyft: ", totalArr[3]);
	////console.log("This is dateUber: ", totalArr[2]);
  	return totalArr; //will return null if no data in both sets
}
	
function weeksInMonth(dataFrame, compArr) {
	for (var i = 0; i < dataFrame.length; ++i) {
        	var tempDate = (dataFrame[i].Date).split('.');
        	switch(tempDate[0]) { //switch months
                	case '7':
                        	var getMonth = compArr[0];
                       		if (Number(tempDate[1]) <= 7) { //week 1
                        	        getMonth[0] = getMonth[0] + 1;
                        	}
                        	else if (Number(tempDate[1]) <= 14) { //week 2
                        	        getMonth[1] = getMonth[1] + 1;
                        	}
                        	else if (Number(tempDate[1]) <= 21) { //week 3
                        	        getMonth[2] = getMonth[2] + 1;
                        	}
                        	else { //week 4
                        	        getMonth[3] = getMonth[3] + 1;
                        	}
                       		compArr[0] = getMonth;
                        	break;
                	case '8':
                	        var getMonth = compArr[1];
                	        if (Number(tempDate[1]) <= 7) { //week 1
                	                getMonth[0] = getMonth[0] + 1;
                	        }
                	        else if (Number(tempDate[1]) <= 14) { //week 2
              	 		                getMonth[1] = getMonth[1] + 1;
               		        }
               		        else if (Number(tempDate[1]) <= 21) { //week 3
               		                getMonth[2] = getMonth[2] + 1;
               		        }
               		        else { //week 4
               		                getMonth[3] = getMonth[3] + 1;
               		        }
               		        compArr[1] = getMonth;
               		        break;
               		case '9':
               		        var getMonth = compArr[2];
               		        if (Number(tempDate[1]) <= 7) { //week 1
               		                getMonth[0] = getMonth[0] + 1;
               		        }
               		        else if (Number(tempDate[1]) <= 14) { //week 2
               		                getMonth[1] = getMonth[1] + 1;
               		        }
               	       		else if (Number(tempDate[1]) <= 21) { //week 3
               	        	        getMonth[2] = getMonth[2] + 1;
               	        	}
               	        	else { //week 4
               	        	        getMonth[3] = getMonth[3] + 1;
               	        	}
               	        	compArr[2] = getMonth;
               	        	break;
        		}
  	}
	return compArr;
}

function getWeeklyPercentage(compArr) {
	var prevCount = 0;
	var returningCompArr = [];
	for (var i = 0; i < 3; ++i) {
		var tempCompArr = compArr[i];
		var tempPlaceHolder = [];
	       	for (var j = 0; j < 4; ++j) {
			if (i == 0 && j == 0) {
				prevCount = tempCompArr[j];
				tempPlaceHolder.push(0);
			}
			else {
				tempPlaceHolder.push(((tempCompArr[j] / prevCount) - 1) * 100);
				prevCount = tempCompArr[j];
			}
		}
		returningCompArr.push(tempPlaceHolder);
	}
	return returningCompArr;
}

function compareMonths(dataFrame, uberFrame, lyftFrame) {
  	var dialCompArr = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  	var uberCompArr = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  	var lyftCompArr = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  	var totalArr = [];
	
  	var key;
  	var field;

  	dialCompArr = weeksInMonth(dataFrame, dialCompArr);
  	uberCompArr = weeksInMonth(uberFrame, uberCompArr);
  	lyftCompArr = weeksInMonth(lyftFrame, lyftCompArr);
	
  	var dialPercentArr = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  	var uberPercentArr = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  	var lyftPercentArr = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

  	dialPercentArr = getWeeklyPercentage(dialCompArr);	
  	uberPercentArr = getWeeklyPercentage(uberCompArr);
  	lyftPercentArr = getWeeklyPercentage(lyftCompArr);
	  
  	totalArr.push(dialCompArr);
  	totalArr.push(uberCompArr);
  	totalArr.push(lyftCompArr);
  	totalArr.push(dialPercentArr);
  	totalArr.push(uberPercentArr);
  	totalArr.push(lyftPercentArr);
	
  	return totalArr; //will return null if no data in both sets
}

function searchPopulatedCities(dataFrame, key) {
  var tempDF = [];
  tempDF = popCitiesSearch(dataFrame, key);
  tempDF.push("SEPARATOR");
  tempDF = tempDF.concat(count);
  return tempDF;
}

function searchDaysOfWeek(dataFrame, state, city, address, street) {
  var days = [];
  var searchDF = [];
  searchDF = dataFrame;
  var tempCheck = 1;

  if (state != "") {
    let keycls = new keyClass("State", state.toLowerCase());
    //console.log("Searching state");
    searchDF = keycls.keySearch(searchDF);
    tempCheck = 0;
  }
  if (city != "") {
    let keycls = new keyClass("City", city.toLowerCase());
    //console.log("Searching city");
    searchDF = keycls.keySearch(searchDF);
    tempCheck = 0;
  }
  if (address != "") {
    let keycls = new keyClass("Address", address.toLowerCase());
    //console.log("Searching address");
    searchDF = keycls.keySearch(searchDF);
    tempCheck = 0;
  }
  if (street != "") {
    let keycls = new keyClass("Street", street.toLowerCase());
    //console.log("Searching Street");
    searchDF = keycls.keySearch(searchDF);
    tempCheck = 0;
  }

  if (tempCheck) { //none was picked
    searchDF = "";
  }
  days = weekDaysSearch(searchDF);
  return days;
}
var count = [];
function popCitiesSearch(dataFrame, key) {
	var tempDF = [];
	count = [];
        for (var i = 0; i < dataFrame.length; i++) {
            if (key == dataFrame[i].State) {
                if (!(tempDF.includes(dataFrame[i].city))) {
                    tempDF.push(dataFrame[i].city);
                    count.push(1);
                } else if (tempDF.indexOf(dataFrame[i].city) != -1) {
                    var index = tempDF.indexOf(dataFrame[i].city);
                    count[index]++;
                }
            }
        }
        return tempDF;
}

function weekDaysSearch(dataFrame) {
        var tempDF = [0, 0, 0, 0, 0, 0, 0];
        //console.log("Total dataframe for parsing: ", dataFrame.length);
        for (var i = 0; i < dataFrame.length; i++) {
            var date = new Date(dataFrame[i].date);
            tempDF[date.getDay()]++;
        }
        //console.log("Add these numbers, they must equal to above: ", tempDF.join());
        return tempDF;
}

function timeOfDaySearch(dataFrame) {
	var tempDF = [0, 0, 0, 0];

	for (var i = 0; i < dataFrame.length; i++) {

		var hour = (dataFrame[i].time).split(':');
		// //console.log(hour);

		if (hour[0] < 6) {
			// //console.log("night: " + dataFrame[i].time);
			tempDF[0]++;
		}
		else if (hour[0] >= 6 && hour[0] < 12) {
			// //console.log("morning: " + dataFrame[i].time);
			tempDF[1]++;
		}
		else if (dataFrame[i].time >= "12:00" && dataFrame[i].time < "18:00") {
			if(dataFrame[i].time > "18:00"){

			}
			// //console.log("afternoon: " + dataFrame[i].time);
			tempDF[2]++;
		}
		else if (dataFrame[i].time >= "18:00" && dataFrame[i].time <= "23:59") {
			// //console.log("evening: " + dataFrame[i].time);
			tempDF[3]++;
		}
		else {
			// //console.log("Invalid time: " + dataFrame[i].time);
		}
	}
	//console.log("Total dataframe for parsing for timeOfDaySearch: ", dataFrame.length);
	console.dir(tempDF);
	return tempDF;
}

function activeVechicleTypeSearch(fhvTripFrame, uberTripFrame) {
	var tempDF = [];
	var uberDates = [];
	var fhvDates = [];
	
	fhvDates = activeVehicleLoop(fhvTripFrame);
	uberDates = activeVehicleLoop(uberTripFrame);

	tempDF.push(fhvDates);
	tempDF.push(uberDates);
	return tempDF;
}

function activeVehicleLoop(dataFrame) {
	var tempDF = [0,0,0,0,0,0,0,0];

	for(var i = 0; i < dataFrame.length; i++) {
		var date = new Date(dataFrame[i].date);
		//checks month of jan
		if (date.getMonth() == 0) {
			if (date.getDate() < 8) {
				tempDF[0]= +tempDF[0] + +dataFrame[i].ActiveVehicle;
			}
			else if (date.getDate() < 15) {
				tempDF[1]= +tempDF[1] + +dataFrame[i].ActiveVehicle;
			}
			else if (date.getDate() < 22) {
				tempDF[2]= +tempDF[2] + +dataFrame[i].ActiveVehicle;
			}
			else if (date.getDate() < 31) {
				tempDF[3]= +tempDF[3] + +dataFrame[i].ActiveVehicle;
			}
		}
		//checks month of feb
		else if (date.getMonth() == 1) {
			if (date.getDate() < 8) {
				tempDF[4]= +tempDF[4] + +dataFrame[i].ActiveVehicle;
			}
			else if (date.getDate() < 15) {
				tempDF[5]= +tempDF[5] + +dataFrame[i].ActiveVehicle;
			}
			else if (date.getDate() < 22) {
				tempDF[6]= +tempDF[6] + +dataFrame[i].ActiveVehicle;
			}
			else if (date.getDate() < 31) {
				tempDF[7]= +tempDF[7] + +dataFrame[i].ActiveVehicle;
			}
		}
		// else {
		// 	//console.log("Date is: " + date);
		// }
	}
	console.dir(tempDF);
	return tempDF;
}

module.exports = { monthGenerator, compareSearch, weeksInMonth, getWeeklyPercentage, compareMonths, searchPopulatedCities, searchDaysOfWeek, getDateUnique, popCitiesSearch, weekDaysSearch, timeOfDaySearch, activeVechicleTypeSearch};
