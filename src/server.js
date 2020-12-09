const callInfo = require('./dataFrameClass.js') //call the class File and store in callInfo
const keyClass = require('./keyClass.js')
const analytics = require('./Analytics/analytics.js')
const operations = require('./Operations/operations.js')
const search = require('./Operations/search.js')
const processData = require('./Operations/processData.js')
const incrementDesign = require('./Analytics/incrementalDesign.js')

var JSZip = require("jszip");
const fs = require('fs');
const {
  performance
} = require('perf_hooks');
var dir = 'backup';
var whichData = "none";
var uberFrame = []
var lyftFrame = []
var dataFrame = []
var fhvTripFrame = []
var uberTripFrame = []
var backup = []

var key;
var field;

function getBackUp() {
  uberFrame = []
  lyftFrame = []
  dataFrame = []
  uberTripFrame = []
  fhvTripFrame = []
  whichData = "backup";
  dataFrame = backup[0];
  uberFrame = backup[1];
  lyftFrame = backup[2];
  uberTripFrame = backup[3];
  fhvTripFrame = backup[4];
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
            //console.log("DONE Fetching all Data");
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
  });

}

function checkBackUp() {
  if (backup.length < 1){
    return false;
  } else {
    return true;
  }
}

function exportData() {
  backup = [dataFrame, uberFrame, lyftFrame, uberTripFrame, fhvTripFrame];
  return true;
}

function deleteBackup() {
  if(backup.length == 0){
    return false;
  }
  else{
    backup =  [];
    return true
  }
  
}

function createJSON(tempDF) {
  var shortArray = [];
  for (i = 0; i < 20; i++) {
    shortArray.push(tempDF[i]);
  }
  var arrayToString = JSON.stringify(Object.assign({}, shortArray));
  var stringToJsonObject = JSON.parse(arrayToString);
  return stringToJsonObject;
}

const express = require('express');
const {
  callbackify
} = require('util');
const { get } = require('http')
const { updateFHV } = require('./Analytics/incrementalDesign.js')
const app = express();
const PORT = 3000;

app.use(express.static('public'))
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({
  extended: true
})) // to support URL-encoded bodies

app.get('/search', (req, res) => {
  var id = req.query.id;
  field = req.query.field;
  var key_name = id;
  //console.log("key name = " + key_name);
  //console.log("field name = " + field);

  var data = search.searchDataFrame(dataFrame, key_name, field);

  res.header("Content-Type", 'application/json');
  res.json(data);
});

app.get('/searchActive', (req, res) => {
  var id = req.query.id;
  //console.log("key name = " + id);
  var data;
  if(id == "Uber"){
    data = uberTripFrame;
  }
  else if(id == "For-Hire Vehicle"){
    data = fhvTripFrame;
  }
  res.header("Content-Type", 'application/json');
  res.json(data);
});

app.get('/checkBackup', (req, res) => {
  if(whichData != "backup"){
    var exists = checkBackUp();
    res.send(exists);
  }
});

app.get('/getBackup', (req, res) => {
  getBackUp();
  res.send(true);
});

app.get('/noBackup', (req, res) => {
  if (whichData != "real") {
    getRawData();
  }
  res.send(true);
});

app.get('/exportData', (req, res) => {
  var completed = exportData(dataFrame);
  res.send(completed);
});

app.get('/deleteBackup', (req, res) => {
  var completed = deleteBackup();
  res.send(completed);
});

app.get('/add', (req, res) => {
  var tempDate = req.query.date.toLowerCase();
  var tempTime = req.query.time.toLowerCase();
  var tempState = req.query.state.toLowerCase();
  var tempCity = req.query.city.toLowerCase();
  var tempAddress = req.query.address.toLowerCase();
  incrementDesign.addFHV(tempDate, tempTime, tempState, tempCity, tempAddress)
  //console.log("Adding this: ", tempDate, tempTime, tempState, tempCity, tempAddress);
  var data = operations.addData(dataFrame, tempDate, tempTime, tempState, tempCity, tempAddress, tempQuarter);
  res.header("Content-Type", 'application/json');
  res.json(data);
});

app.get('/addVehicle', (req, res) => {
  //console.log("Add vechicle called");
  var tempDate = req.query.date.toLowerCase();
  var tempVehicle = req.query.activeVehicle.toLowerCase();
  var temptrips = req.query.trips.toLowerCase();
  var type = req.query.type.toLowerCase();

  var data = operations.addVehicleData(uberTripFrame, fhvTripFrame, type, tempDate, tempVehicle, temptrips);
  incrementDesign.addAV(type, tempDate, tempVehicle)
  res.header("Content-Type", 'application/json');
  res.json(data);
});

app.get('/delete', (req, res) => {
  var tempDate = req.query.date.toLowerCase();
  var tempTime = req.query.time.toLowerCase();
  var tempState = req.query.state.toLowerCase();
  var tempCity = req.query.city.toLowerCase();
  var tempAddress = req.query.address.toLowerCase();
  //console.log("Deleting this: ", tempDate, tempTime, tempState, tempCity, tempAddress);
  incrementDesign.deleteFHV(tempDate, tempTime, tempState, tempCity, tempAddress);
  var data = operations.deleteData(dataFrame, tempDate, tempTime, tempState, tempCity, tempAddress, tempQuarter);
  res.header("Content-Type", 'application/json');
  res.json(data);
});

app.get('/deleteActive', (req, res) => {
  var tempDate = req.query.date.toLowerCase();
  var tempVehicle = req.query.activeVehicle.toLowerCase();
  var temptrips = req.query.trips.toLowerCase();
  var type = req.query.type.toLowerCase();
  //console.log("Deleting this: ", tempDate, tempVehicle, temptrips, type);
  incrementDesign.delAV(type, tempDate, tempVehicle)
  var data = operations.removeVehicleData(uberTripFrame, fhvTripFrame, type, tempDate, tempVehicle, temptrips);
  res.header("Content-Type", 'application/json');
  res.json(data);
});

app.get('/edit', (req, res) => {
  if (req.query.new == null) {
    var data = false; //more than one edit check
    res.header("Content-Type", 'application/json');
    res.json(data);
  } else { //single edits
    var tempOld = req.query.old.toLowerCase();
    var tempNew = req.query.new.toLowerCase();
    if (tempOld.toLowerCase() == tempNew.toLowerCase()) {
      var data = false;
      res.header("Content-Type", 'application/json');
      res.json(data);
    } else {
      incrementDesign.updateFHV(tempOld, tempNew);
      //console.log("Editing this: ", tempOld);
      //console.log("To look like this: ", tempNew);
      var data = operations.editData(dataFrame, tempOld, tempNew, tempQuarter);
      res.header("Content-Type", 'application/json');
      res.json(data);
    }
  }
});

app.get('/editActive', (req, res) => {
  if (req.query.new == null) {
    var data = false; //more than one edit check
    res.header("Content-Type", 'application/json');
    res.json(data);
  } else { //single edits
    var tempOld = req.query.old;
    var tempNew = req.query.new;
    var type = req.query.type.toLowerCase();
    if (tempOld.toLowerCase() == tempNew.toLowerCase()) {
      var data = false;
      res.header("Content-Type", 'application/json');
      res.json(data);
    } else {
      //console.log("Editing this: ", tempOld);
      //console.log("To look like this: ", tempNew);
      //console.log("Type: ", type);
      var data;
      incrementDesign.updateAV(tempOld, tempNew, type);
      var data = operations.editVehicleData(uberTripFrame, fhvTripFrame, tempOld, tempNew, type);
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
    for (var i = Number(startDate) - 7; i <= Number(endDate) - 7; ++i) {
        tempUberCompare.push(tempCompare[0][i]);
        tempLyftCompare.push(tempCompare[1][i]);
    }
	tempUberDate = tempCompare[2];
	tempLyftDate = tempCompare[3]
    tempTotalData.push(tempUberCompare);
    tempTotalData.push(tempLyftCompare);
    tempTotalData.push(tempUberDate);
    tempTotalData.push(tempLyftDate);

    return tempTotalData;
}

app.get('/population', (req, res) => {
  var t0 = performance.now()
  var searchTarget = req.query.search.toLowerCase();
  var data = [];
  someData = incrementDesign.getPopulationDesign(searchTarget)
  if (someData === undefined || someData == 0) {
    data = analytics.searchPopulatedCities(dataFrame, searchTarget);  
    incrementDesign.setPopulationDesign(searchTarget, data);
  }
  else {
    data = someData;
  }
  res.header("Content-Type", 'application/json');
  res.json(data);
  var t1 = performance.now()
  //console.log("Call to Analyze Population took " + (t1 - t0) + " milliseconds.")
});

app.get('/busiest', (req, res) => {
  var t0 = performance.now()
  var busyState = req.query.state.toLowerCase();
  var busyCity = req.query.city.toLowerCase();
  var busyAddress = req.query.address.toLowerCase();
  var busyStreet = req.query.street.toLowerCase();
  var data = [];
  ////console.log("Target: " + busyState);
  if(busyStreet){
    data = incrementDesign.getBusyDesign(busyStreet);
    if(!data){
      data = analytics.searchDaysOfWeek(dataFrame, busyState, busyCity, busyAddress, busyStreet);;
      incrementDesign.setBusyDesign(busyStreet, data);
    }
  }
  else if(busyAddress){
    data = incrementDesign.getBusyDesign(busyAddress);
    if(!data){
      data = analytics.searchDaysOfWeek(dataFrame, busyState, busyCity, busyAddress, busyStreet);;
      incrementDesign.setBusyDesign(busyAddress, data);
    }
  }
  else if(busyCity){
    data = incrementDesign.getBusyDesign(busyCity);
    if(!data){
      data = analytics.searchDaysOfWeek(dataFrame, busyState, busyCity, busyAddress, busyStreet);;
      incrementDesign.setBusyDesign(busyCity, data);
    }
  }
  else if(busyState){
    data = incrementDesign.getBusyDesign(busyState);
    if(!data){
      data = analytics.searchDaysOfWeek(dataFrame, busyState, busyCity, busyAddress, busyStreet);;
      incrementDesign.setBusyDesign(busyState, data);
    }
  }
  res.header("Content-Type", 'application/json');
  res.json(data);

  var t1 = performance.now()
  //console.log("Call to Analyze Busy Days took " + (t1 - t0) + " milliseconds.")
});

var tempCompare = "";
app.get('/compare', (req, res) => {
  var t0 = performance.now()
  var startDate = req.query.startDate;
  var endDate = req.query.endDate;
  //console.log("Start month: ", startDate);
  //console.log("End month: ", endDate);
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
  //console.log("Call to Analyze Comparison took " + (t1 - t0) + " milliseconds.")
});

app.get('/timePopularity', (req, res) => {
  var t0 = performance.now()
  var data = incrementDesign.getTimeOfDayDesign();

  if (data === undefined || data == 0) {
    data = analytics.timeOfDaySearch(dataFrame);
    incrementDesign.setTimeOfDayDesign(data);
  }
  if (data.join() == "0,0,0,0") {
    data = "ErrorCode1";
  }
  res.header("Content-Type", 'application/json');
  res.json(data);
  var t1 = performance.now()
  //console.log("Call to Analyze Time of Day took " + (t1 - t0) + " milliseconds.")
});

app.get('/activeVehicle', (req, res) => {
  var t0 = performance.now()
  var data = incrementDesign.getActiveDesign();
  if (data === undefined || data.length == 0) {
    data = analytics.activeVechicleTypeSearch(fhvTripFrame, uberTripFrame);
    incrementDesign.setActiveDesign(data);
  }
  res.header("Content-Type", 'application/json');
  res.json(data);
  var t1 = performance.now()
  //console.log("Call to Analyze Active Vehicles took " + (t1 - t0) + " milliseconds.")
});

var tempQuarter = "";
app.get('/quarterPopularity', (req, res) => {
  var t0 = performance.now()
  //console.log("Init Quarter Pop Comparision");
	var data;
	if (tempQuarter == "") {
		data = analytics.compareMonths(dataFrame, uberFrame, lyftFrame);
		tempQuarter = data;
	}
	else {
		data = tempQuarter;
	}
  //console.log("Done");
  res.header("Content-Type", 'application/json');
  res.json(data);
  var t1 = performance.now()
  //console.log("Call to Popular Vehicle took " + (t1 - t0) + " milliseconds.")
});

app.get('/searchLatLon', (req, res) => {
  var id = req.query.id;
  field = req.query.field; //already init field
  var key_name = id;
  //console.log("Lat lon key name = " + key_name);
  //console.log("field name = " + field);
  var data = []
  data[0] = search.searchDataFrame(uberFrame, key_name, field);
  data[1] = search.searchDataFrame(lyftFrame, key_name, field);
  res.header("Content-Type", 'application/json');
  res.json(data);
});

app.get('/addLatLon', (req, res) => {
  var addData = req.query.data;
  //console.log("Adding this:", addData);
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
      //console.log("Editing this:", tempOld);
      //console.log("To look like this:", tempNew);
      var data = operations.editLatLonData(uberFrame, lyftFrame, tempOld, tempNew, tempQuarter, tempCompare);
      res.header("Content-Type", 'application/json');
      res.json(data);
    }
  }
});

app.get('/deleteLatLon', (req, res) => {
    var deleteData = req.query.data;
    //console.log("deleting this:", deleteData);
    var data = operations.deleteDataLatLon(uberFrame, lyftFrame, deleteData, tempQuarter, tempCompare);
    res.header("Content-Type", 'application/json');
    res.json(data);
});

app.listen(PORT, () => console.log('Listening on port', PORT));

