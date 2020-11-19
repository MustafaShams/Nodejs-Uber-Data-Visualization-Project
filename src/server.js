const callInfo = require('./dataFrameClass.js') //call the class File and store in callInfo
const keyClass = require('./keyClass.js')
const analytics = require('./Analytics/analytics.js')
const operations = require('./Operations/operations.js')
const search = require('./Operations/search.js')
const processData = require('./Operations/processData.js')

var JSZip = require("jszip");
const fs = require('fs');
const {
  performance
} = require('perf_hooks');

var whichData = "none";
var uberFrame = []
var lyftFrame = []
var dataFrame = []
var fhvTripFrame = []
var uberTripFrame = []
var PopulatedCitiesNY = [];
var PopulatedCitiesNJ = [];
var DaysOfWeekNY = [];
var BusyDaysOfWeek = {};
var TimeOfDay = [];
var ActiveVechicleType = [];
var key;
var field;

function getBackUp() {
  uberFrame = []
  lyftFrame = []
  dataFrame = []
  uberTripFrame = []
  fhvTripFrame = []
  whichData = "backup";
  console.log(whichData);
  fs.readFile('inputFile/dataFrame.csv', 'utf8', function (err, data) {
    if (err) {
      console.error(err)
      return
    }
    processData.processData(data)
  });
}

function getRawData() {
  uberFrame = []
  lyftFrame = []
  dataFrame = []
  uberTripFrame = []
  fhvTripFrame = []
  whichData = "real";
  fileNames = ["other-Dial7_B00887",
                "uber-raw-data-jul14",
                "uber-raw-data-aug14",
                "uber-raw-data-sep14",
                "Uber-Jan-Feb-FOIL",
                "other-FHV-services_jan-aug-2015", 
                "other-Lyft_B02510"]

  var total = 0;
  fs.readFile("inputFile/other-Dial7_B00887.zip", function (err, data) {
    if (err) throw err;
    JSZip.loadAsync(data).then(function (zip) {
      zip.files['other-Dial7_B00887.csv'].async("string")
        .then(function (data) {
          dataFrame = processData.processData(data, dataFrame);
          total++;
        });
    });
  });
  fs.readFile("inputFile/uber-raw-data-jul14.zip", function (err, data) {
    if (err) throw err;
    JSZip.loadAsync(data).then(function (zip) {
      zip.files['uber-raw-data-jul14.csv'].async("string")
        .then(function (data) {
          uberFrame = processData.processUberData(data, uberFrame);
          total++;
        });
    });
  });
  fs.readFile("inputFile/uber-raw-data-aug14.zip", function (err, data) {
    if (err) throw err;
    JSZip.loadAsync(data).then(function (zip) {
      zip.files['uber-raw-data-aug14.csv'].async("string")
        .then(function (data) {
          uberFrame = processData.processUberData(data, uberFrame);
          total++;
        });
    });
  });
  fs.readFile("inputFile/uber-raw-data-sep14.zip", function (err, data) {
    if (err) throw err;
    JSZip.loadAsync(data).then(function (zip) {
      zip.files['uber-raw-data-sep14.csv'].async("string")
        .then(function (data) {
          uberFrame = processData.processUberData(data, uberFrame);
          total++;
          if(total == 7){
            console.log("DONE Fetching all Data");
          }
        });
    });
  });
  fs.readFile("inputFile/other-Lyft_B02510.zip", function (err, data) {
    if (err) throw err;
    JSZip.loadAsync(data).then(function (zip) {
      zip.files['other-Lyft_B02510.csv'].async("string")
        .then(function (data) {
          lyftFrame = processData.processLyftData(data, lyftFrame);
          total++;
        });
    });
  });
  fs.readFile("inputFile/other-FHV-services_jan-aug-2015.zip", function (err, data) {
    if (err) throw err;
    JSZip.loadAsync(data).then(function (zip) {
      zip.files['other-FHV-services_jan-aug-2015.csv'].async("string")
        .then(function (data) {
          fhvTripFrame = processData.processTripData(data, "FHV", fhvTripFrame, uberTripFrame);
          total++;
        });
    });
  });
  fs.readFile("inputFile/Uber-Jan-Feb-FOIL.zip", function (err, data) {
    if (err) throw err;
    JSZip.loadAsync(data).then(function (zip) {
      zip.files['Uber-Jan-Feb-FOIL.csv'].async("string")
        .then(function (data) {
          uberTripFrame = processData.processTripData(data, "uber", fhvTripFrame, uberTripFrame);
          total++;
        });
    });
  });
  
}

// FUNCTION TO FIND UNIQUE CITIES IN DATAFRAME
function uniqueValues(dataFrame) {
  var tempDF = [];
  var times = [];
  for (var i = 0; i < dataFrame.length; ++i) {
    if (tempDF.indexOf(dataFrame[i].City) == -1) {
      tempDF.push(dataFrame[i].City);
      times.push('1');
    } else {
      times[tempDF.indexOf(dataFrame[i].City)] = parseInt(times[tempDF.indexOf(dataFrame[i].City)]) + parseInt(1);
    }
  }
  var newArray = []
  for (var x = 0; x < tempDF.length; x++) {
    newArray[x] = tempDF[x] + " : " + times[x];
  }
  var json = JSON.stringify(newArray);
  fs.writeFile('myjsonfile.json', json, 'utf8', function (err) {
    if (err) throw err;
    console.log('complete');
  });

}

function checkBackUp() {
  if (fs.existsSync('inputFile/dataFrame.csv')) {
    return true;
  } else {
    return false;
  }
}


function exportData(arr) {
  let csvContent = "Date, Time, State, City, Address, Street\n";


  for (var x = 0; x < arr.length; x++) {
    var address = arr[x].Address
    var index = address.indexOf(" ");
    var house = address.substr(0, index);
    var street = address.substr(index + 1);
    csvContent += arr[x].Date + "," + arr[x].Time + "," + arr[x].State + "," + arr[x].City + "," + house + "," + street + "\n";
  }


  try {
    fs.writeFile('inputFile/dataFrame.csv', csvContent, 'utf8', function (err) {
      if (err) {
        console.log('Some error occured - file either not saved or corrupted file saved.');
      } else {
        console.log('It\'s saved!');
      }
    });
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
}

function deleteBackup() {
  const path = 'inputFile/dataFrame.csv'

  try {
    fs.unlinkSync(path)
    //file removed
  } catch (err) {
    if (err.code == 'ENOENT') {
      return false;
    }
  }
  return true;
}


function createJSON(tempDF) {
  var shortArray = [];
  for (i = 0; i < 20; i++) {
    shortArray.push(tempDF[i]);
  }
  var arrayToString = JSON.stringify(Object.assign({}, shortArray));
  var stringToJsonObject = JSON.parse(arrayToString);
  console.log(stringToJsonObject);
  return stringToJsonObject;
}

function busyIncrementalDesign(date, state, city, address){
  var currDate = new Date(date);
  var index = currDate.getDay()
  if(state in BusyDaysOfWeek){
    BusyDaysOfWeek[state][index] = BusyDaysOfWeek[state][index] +  1;
  }
  if(city in BusyDaysOfWeek){
    BusyDaysOfWeek[city][index] = BusyDaysOfWeek[city][index] +  1;
  }
  if(address in BusyDaysOfWeek){
    BusyDaysOfWeek[address][index] = BusyDaysOfWeek[address][index] +  1;
  }
}

function timeOfDayIncDesign(time){
  if(TimeOfDay.length > 0){
    var hour = time.split(':')[0];
    if(hour < 6){
      TimeOfDay[0] += 1
    }
    else if(hour < 12){
      TimeOfDay[1] += 1
    }
    else if(hour < 18){
      TimeOfDay[2] += 1
    }
    else if(hour < 24){
      TimeOfDay[3] += 1
    }
  }

}

function popInc(state, city){
  if(PopulatedCitiesNY.length > 0){
    if(state == "ny"){
      index = PopulatedCitiesNY.indexOf(city)
      PopulatedCitiesNY[337 + index] += 1
    }
  }
  if(PopulatedCitiesNJ.length > 0){
    if(state == "nj"){
      index = PopulatedCitiesNJ.indexOf(city)
      PopulatedCitiesNJ[340 + index] += 1
    }
  }
}



function incrementDesign(date, time, state, city, address){

  //Busy Days
  busyIncrementalDesign(date, state, city, address);
  timeOfDayIncDesign(time);
  popInc(state, city);
}


const express = require('express');
const {
  callbackify
} = require('util');
const app = express();
const PORT = 3000;

app.use(express.static('public'))
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({
  extended: true
})) // to support URL-encoded bodies

app.get('/search', (req, res) => {
  var id = req.query.id;
  field = req.query.field; //already init field
  var key_name = id;
  console.log("key name = " + key_name);
  console.log("field name = " + field);

  var data = search.searchDataFrame(dataFrame, key_name, field);

  res.header("Content-Type", 'application/json');
  res.json(data);
});

app.get('/checkBackup', (req, res) => {
  var exists = checkBackUp();
  res.send(exists);
});

app.get('/getBackup', (req, res) => {
  console.log("Getting Backup");
  getBackUp();
  res.send(true);
});

app.get('/noBackup', (req, res) => {
  if (whichData != "real") {
    console.log("Getting Real");
    getRawData();
  }
  res.send(true);
});

app.get('/exportData', (req, res) => {
  console.log("exporting data");
  var completed = exportData(dataFrame);
  res.send(completed);
});

app.get('/deleteBackup', (req, res) => {
  console.log("deleting backup data");
  var completed = deleteBackup();
  res.send(completed);
});

app.get('/add', (req, res) => {
  var tempDate = req.query.date.toLowerCase();
  var tempTime = req.query.time.toLowerCase();
  var tempState = req.query.state.toLowerCase();
  var tempCity = req.query.city.toLowerCase();
  var tempAddress = req.query.address.toLowerCase();
  incrementDesign(tempDate, tempTime, tempState, tempCity, tempAddress)
  console.log("Adding this: ", tempDate, tempTime, tempState, tempCity, tempAddress);
  var data = operations.addData(dataFrame, tempDate, tempTime, tempState, tempCity, tempAddress, tempQuarter);
  res.header("Content-Type", 'application/json');
  res.json(data);
});

app.get('/delete', (req, res) => {
  var tempDate = req.query.date;
  var tempTime = req.query.time;
  var tempState = req.query.state;
  var tempCity = req.query.city;
  var tempAddress = req.query.address;
  console.log("Deleting this: ", tempDate, tempTime, tempState, tempCity, tempAddress);
  var data = operations.deleteData(dataFrame, tempDate, tempTime, tempState, tempCity, tempAddress, tempQuarter);
  res.header("Content-Type", 'application/json');
  res.json(data);
});

app.get('/edit', (req, res) => {
  if (req.query.new == null) {
    var data = false; //more than one edit check
    res.header("Content-Type", 'application/json');
    res.json(data);
  } else { //single edits
    var tempOld = req.query.old;
    var tempNew = req.query.new;
    if (tempOld.toLowerCase() == tempNew.toLowerCase()) {
      var data = false;
      res.header("Content-Type", 'application/json');
      res.json(data);
    } else {
      console.log("Editing this: ", tempOld);
      console.log("To look like this: ", tempNew);
      var data = operations.editData(dataFrame, tempOld, tempNew, tempQuarter);
      res.header("Content-Type", 'application/json');
      res.json(data);
    }
  }
});

function getDateForCompare(tempCompare, startDate, endDate) {
	var tempTotalData = [];
    var tempUberCompare = [];
    var tempLyftCompare = [];
    var tempUberDate = [];
    var tempLyftDate = [];
    //var newArrayCounter = 0;
    for (var i = Number(startDate) - 7; i <= Number(endDate) - 7; ++i) {
        tempUberCompare.push(tempCompare[0][i]);
        tempLyftCompare.push(tempCompare[1][i]);
        //tempUberDate.push(tempCompare[2][i]);
        //tempLyftDate.push(tempCompare[3][i]);
	//Object.assign(tempUberDate, analytics.getDateUnique(tempUberCompare));
	//Object.assign(tempLyftDate, analytics.getDateUnique(tempLyftCompare));
	    //console.log("THIS IS U-date: ", tempUberDate);
	    //console.log("THIS IS L-date: ", tempLyftDate);
    }
	tempUberDate = tempCompare[2];
	tempLyftDate = tempCompare[3]
    tempTotalData.push(tempUberCompare);
    tempTotalData.push(tempLyftCompare);
    tempTotalData.push(tempUberDate);
    tempTotalData.push(tempLyftDate);

        console.log("THIS IS UBER: ", tempUberCompare);
          console.log("THIS IS lyft: ", tempLyftCompare);
          //console.log("THIS IS U-date: ", tempUberDate);
          //console.log("THIS IS L-date: ", tempLyftDate);

    return tempTotalData;
}

app.get('/population', (req, res) => {
  var t0 = performance.now()
  var searchTarget = req.query.search.toLowerCase();
  //console.log("Target: " + searchTarget);
  var data = [];
  if (searchTarget == "ny") {
    if (PopulatedCitiesNY === undefined || PopulatedCitiesNY.length == 0) {
      console.log("NY New");
      data = analytics.searchPopulatedCities(dataFrame, searchTarget.toLowerCase());  
      PopulatedCitiesNY = data;
    }
    else {
      console.log("NY OLD");
      data = PopulatedCitiesNY;
    }
  }
  else if (searchTarget == "nj") {
    if (PopulatedCitiesNJ === undefined || PopulatedCitiesNJ.length == 0) {
      console.log("NJ New");
      data = analytics.searchPopulatedCities(dataFrame, searchTarget.toLowerCase());  
      PopulatedCitiesNJ = data;
    }
    else {
      console.log("NJ OLD");
      data = PopulatedCitiesNJ;
    }
  }

  res.header("Content-Type", 'application/json');
  res.json(data);
  var t1 = performance.now()
  console.log("Call to Analyze Population took " + (t1 - t0) + " milliseconds.")
});

app.get('/busiest', (req, res) => {
  var t0 = performance.now()
  var busyState = req.query.state.toLowerCase();
  var busyCity = req.query.city.toLowerCase();
  var busyAddress = req.query.address.toLowerCase();
  var busyStreet = req.query.street.toLowerCase();
  var data = [];
  //console.log("Target: " + busyState);
  if(busyStreet){
    if(busyStreet in BusyDaysOfWeek){
      data = BusyDaysOfWeek[busyStreet]
    }
    else{
      data = analytics.searchDaysOfWeek(dataFrame, busyState, busyCity, busyAddress, busyStreet);;
      BusyDaysOfWeek[busyStreet] = data
    }
  }
  else if(busyAddress){
    if(busyAddress in BusyDaysOfWeek){
      data = BusyDaysOfWeek[busyAddress]
    }
    else{
      data = analytics.searchDaysOfWeek(dataFrame, busyState, busyCity, busyAddress, busyStreet);;
      BusyDaysOfWeek[busyAddress] = data
    }
  }
  else if(busyCity){
    if(busyCity in BusyDaysOfWeek){
      data = BusyDaysOfWeek[busyCity]
    }
    else{
      data = analytics.searchDaysOfWeek(dataFrame, busyState, busyCity, busyAddress, busyStreet);;
      BusyDaysOfWeek[busyCity] = data
    }
  }
  else if(busyState){
    if(busyState in BusyDaysOfWeek){
      data = BusyDaysOfWeek[busyState]
    }
    else{
      data = analytics.searchDaysOfWeek(dataFrame, busyState, busyCity, busyAddress, busyStreet);;
      BusyDaysOfWeek[busyState] = data
    }
  }
  res.header("Content-Type", 'application/json');
  res.json(data);

  var t1 = performance.now()
  console.log("Call to Analyze Busy Days took " + (t1 - t0) + " milliseconds.")
});

var tempCompare = "";
app.get('/compare', (req, res) => {
  var t0 = performance.now()
  var startDate = req.query.startDate;
  var endDate = req.query.endDate;
  console.log("Start month: ", startDate);
  console.log("End month: ", endDate);
  var data = "";
  if (Number(startDate) > Number(endDate)) {
    data = "ErrorCode1";
  } 
  if (data != "ErrorCode1" && tempCompare == "") {
    var data = analytics.compareSearch(dataFrame, uberFrame, lyftFrame, startDate, endDate);
    tempCompare = data;
    data = getDateForCompare(data, startDate, endDate);
  }
  else if (data != "ErrorCode1") {
	data = getDateForCompare(tempCompare, startDate, endDate);
}
  res.header("Content-Type", 'application/json');
  res.json(data);
  var t1 = performance.now()
  console.log("Call to Analyze Comparison took " + (t1 - t0) + " milliseconds.")
});

app.get('/timePopularity', (req, res) => {
  var t0 = performance.now()
  var data = [];

  if (TimeOfDay === undefined || TimeOfDay.length == 0) {
    data = analytics.timeOfDaySearch(dataFrame);
    TimeOfDay = data;
    //console.log("NEW");
  }
  else {
    data = TimeOfDay;
    //console.log("OLD");
  }

  if (data.join() == "0,0,0,0") {
    data = "ErrorCode1";
  }
  res.header("Content-Type", 'application/json');
  res.json(data);
  var t1 = performance.now()
  console.log("Call to Analyze Time of Day took " + (t1 - t0) + " milliseconds.")
});

app.get('/activeVehicle', (req, res) => {
  var t0 = performance.now()
  console.log(uberTripFrame.length, fhvTripFrame.length);
  var data = [];

  if (ActiveVechicleType === undefined || ActiveVechicleType.length == 0) {
    data = analytics.activeVechicleTypeSearch(fhvTripFrame, uberTripFrame);
    ActiveVechicleType = data;
    //console.log("NEW");
  }
  else {
    data = ActiveVechicleType;
    //console.log("OLD");
  }

  if (data.join() == "0,0,0,0,0,0,0,0") {
    data = "ErrorCode1";
  }
  res.header("Content-Type", 'application/json');
  res.json(data);
  var t1 = performance.now()
  console.log("Call to Analyze Active Vehicles took " + (t1 - t0) + " milliseconds.")
});

var tempQuarter = "";
app.get('/quarterPopularity', (req, res) => {
  var t0 = performance.now()
  console.log("Init Quarter Pop Comparision");
	var data;
	if (tempQuarter == "") {
		data = analytics.compareMonths(dataFrame, uberFrame, lyftFrame);
		tempQuarter = data;
	}
	else {
		data = tempQuarter;
	}
  console.log("Done");
  res.header("Content-Type", 'application/json');
  res.json(data);
  var t1 = performance.now()
  console.log("Call to Popular Vehicle took " + (t1 - t0) + " milliseconds.")
});

app.get('/searchLatLon', (req, res) => {
  var id = req.query.id;
  field = req.query.field; //already init field
  var key_name = id;
  console.log("Lat lon key name = " + key_name);
  console.log("field name = " + field);
  var data = []
  data[0] = search.searchDataFrame(uberFrame, key_name, field);
  data[1] = search.searchDataFrame(lyftFrame, key_name, field);
  res.header("Content-Type", 'application/json');
  res.json(data);
});

app.get('/addLatLon', (req, res) => {
  var addData = req.query.data;
  console.log("Adding this:", addData);
  var data = operations.addDataLatLon(uberFrame, lyftFrame, addData, tempQuarter, tempCompare);
  res.header("Content-Type", 'application/json');
  res.json(data);
});

app.get('/editLatLon', (req, res) => {
  if (req.query.new == null) {
    var data = false; //more than one edit check
    res.header("Content-Type", 'application/json');
    res.json(data);
  } else { //single edits
    var tempOld = req.query.old;
    var tempNew = req.query.new;
    if (tempOld.toLowerCase() == tempNew.toLowerCase()) {
      var data = false;
      res.header("Content-Type", 'application/json');
      res.json(data);
    } else {
      console.log("Editing this:", tempOld);
      console.log("To look like this:", tempNew);
      var data = operations.editLatLonData(uberFrame, lyftFrame, tempOld, tempNew, tempQuarter, tempCompare);
      
      res.header("Content-Type", 'application/json');
      res.json(data);
    }
  }
});

app.get('/deleteLatLon', (req, res) => {
    var deleteData = req.query.data;
    console.log("deleting this:", deleteData);
    var data = operations.deleteDataLatLon(uberFrame, lyftFrame, deleteData, tempQuarter, tempCompare);
    res.header("Content-Type", 'application/json');
    res.json(data);
});




app.listen(PORT, () => console.log('Listening on port', PORT));

