const callInfo = require('./dataFrameClass.js') //call the class File and store in callInfo
const keyClass = require('./keyClass.js')
const analytics = require('./Analytics/analytics.js')
const operations = require('./Operations/operations.js')
const search = require('./Operations/search.js')
const processData = require('./Operations/processData.js')

var JSZip = require("jszip");
const fs = require('fs');

var whichData = "none";
var uberFrame = []
var lyftFrame = []
var dataFrame = []
var fhvTripFrame = []
var uberTripFrame = []
var PopulatedCitiesNY = [];
var PopulatedCitiesNJ = [];
var DaysOfWeekNY = [];
var DaysOfWeekNJ = [];
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
  var tempDate = req.query.date;
  var tempTime = req.query.time;
  var tempState = req.query.state;
  var tempCity = req.query.city;
  var tempAddress = req.query.address;
  console.log("Adding this: ", tempDate, tempTime, tempState, tempCity, tempAddress);
  var data = operations.addData(dataFrame, tempDate, tempTime, tempState, tempCity, tempAddress);
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
  var data = operations.deleteData(dataFrame, tempDate, tempTime, tempState, tempCity, tempAddress);
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
      var data = operations.editData(dataFrame, tempOld, tempNew);
      res.header("Content-Type", 'application/json');
      res.json(data);
    }
  }
});

app.get('/compare', (req, res) => {
  var startDate = req.query.startDate;
  var endDate = req.query.endDate;
  console.log("Start month: ", startDate);
  console.log("End month: ", endDate);
  if (Number(startDate) > Number(endDate)) {
    var data = "ErrorCode1";
  } else {
    var data = analytics.compareSearch(dataFrame, uberFrame, lyftFrame, startDate, endDate);
  }
  res.header("Content-Type", 'application/json');
  res.json(data);
});

app.get('/busiest', (req, res) => {
  var busyState = req.query.state;
  var busyCity = req.query.city;
  var busyAddress = req.query.address;
  var busyStreet = req.query.street;
  var data = [];
  //console.log("Target: " + busyState);

  if (busyCity == "" && busyAddress == "" && busyStreet == "") {
    if (busyState == "Ny") {
      if (DaysOfWeekNY === undefined || DaysOfWeekNY.length == 0) {
        // console.log("NY New");
        data = analytics.searchDaysOfWeek(dataFrame, busyState, busyCity, busyAddress, busyStreet);
        DaysOfWeekNY = data;
      }
      else {
        // console.log("NY OLD");
        data = DaysOfWeekNY;
      }
    }
    else if (busyState == "Nj") {
      if (DaysOfWeekNJ === undefined || DaysOfWeekNJ.length == 0) {
        // console.log("NJ New");
        data = analytics.searchDaysOfWeek(dataFrame, busyState, busyCity, busyAddress, busyStreet);
        DaysOfWeekNJ = data;
      }
      else {
        // console.log("NJ OLD");
        data = DaysOfWeekNJ;
      }
    }
  }
  else {
    data = analytics.searchDaysOfWeek(dataFrame, busyState, busyCity, busyAddress, busyStreet);
  }

  if (data.join() == "0,0,0,0,0,0,0") {
    data = "ErrorCode1";
  }
  res.header("Content-Type", 'application/json');
  res.json(data);
});

app.get('/population', (req, res) => {
  var searchTarget = req.query.search;
  //console.log("Target: " + searchTarget);
  var data = [];
  if (searchTarget == "ny") {
    if (PopulatedCitiesNY === undefined || PopulatedCitiesNY.length == 0) {
      //console.log("NY New");
      data = analytics.searchPopulatedCities(dataFrame, searchTarget.toLowerCase());  
      PopulatedCitiesNY = data;
    }
    else {
      //console.log("NY OLD");
      data = PopulatedCitiesNY;
    }
  }
  else if (searchTarget == "nj") {
    if (PopulatedCitiesNJ === undefined || PopulatedCitiesNJ.length == 0) {
      //console.log("NJ New");
      data = analytics.searchPopulatedCities(dataFrame, searchTarget.toLowerCase());  
      PopulatedCitiesNJ = data;
    }
    else {
      //console.log("NJ OLD");
      data = PopulatedCitiesNJ;
    }
  }

  res.header("Content-Type", 'application/json');
  res.json(data);
});

app.get('/quarterPopularity', (req, res) => {
  console.log("Init Quarter Pop Comparision");
  var data = analytics.compareMonths(dataFrame, uberFrame, lyftFrame);
  console.log("Done");
  res.header("Content-Type", 'application/json');
  res.json(data);
});

app.get('/timePopularity', (req, res) => {
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
});

app.get('/activeVehicle', (req, res) => {
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
      var data = operations.editLatLonData(uberFrame, lyftFrame, tempOld, tempNew);
      
      res.header("Content-Type", 'application/json');
      res.json(data);
    }
  }
});

app.get('/deleteLatLon', (req, res) => {
    var deleteData = req.query.data;
    console.log("deleting this:", deleteData);
    var data = operations.deleteDataLatLon(uberFrame, lyftFrame, deleteData);
    res.header("Content-Type", 'application/json');
    res.json(data);
});

app.get('/addLatLon', (req, res) => {
  var addData = req.query.data;
  console.log("Adding this:", addData);
  var data = operations.addDataLatLon(uberFrame, lyftFrame, addData);
  res.header("Content-Type", 'application/json');
  res.json(data);
});



app.listen(PORT, () => console.log('Listening on port', PORT));

