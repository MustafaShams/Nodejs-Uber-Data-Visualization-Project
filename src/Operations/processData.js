const callInfo = require('../dataFrameClass.js')
const keyClass = require('../keyClass.js')

var completedFrame = false;
function processTripData(allText, type, fhvTripFrame, uberTripFrame) {
  completedFrame = false;
  allText = allText.replace(/['"]+/g, '') //remove all " from input
  allText = allText.toLowerCase();
  var allTextLines = allText.split(/\r\n|\n/); //Split the input based on new lines
  var headers = allTextLines[0].split(','); //Split the first line and get the headers based on comma
  for (var i = 1; i < allTextLines.length; i++) { //travarse all lines
    var data = allTextLines[i].split(','); //split each line based on comma
    if (data.length == headers.length) { //make sure to check if data exists
      if(data[2] == "03/01/2015"){
        console.log("Finished fhvTripFrame, Size:",fhvTripFrame.length);
        console.log("Sample", fhvTripFrame[0]);
        return fhvTripFrame;
      }
      var e = new callInfo(); //create a new callInfo object
      switch(type){
        case "uber":
          data[1] = data[1].replace(/\//g, '.');
          Object.assign(e.Date = data[1]);
          Object.assign(e.ActiveVehicle = data[2].trim());
          Object.assign(e.Trips = data[3].trim());
          uberTripFrame.push(e);
        case "FHV":
          if(data[2] && data[3] && data[4]){
            data[2] = data[2].replace(/\//g, '.');
            data[2] = data[2].replace(/\b0/g, '')
            Object.assign(e.Date = data[2]);
            Object.assign(e.ActiveVehicle = data[3].trim());
            Object.assign(e.Trips = data[4].trim());
            fhvTripFrame.push(e);
          }
      }
       //Push the object callInfo into the data frame
    }
  }
  console.log("Finished uberTripFrame, Size:",uberTripFrame.length);
  console.log("Sample", uberTripFrame[0]);
  switch(type) {
	  case "uber":
		return uberTripFrame;
        case "FHV":
		return fhvTripFrame;
  }
}


function processUberData(allText, uberFrame) {
  allText = allText.replace(/['"]+/g, '') //remove all " from input
  allText = allText.toLowerCase();
  var allTextLines = allText.split(/\r\n|\n/); //Split the input based on new lines
  var headers = allTextLines[0].split(','); //Split the first line and get the headers based on comma
  for (var i = 1; i < allTextLines.length; i++) { //travarse all lines
    var data = allTextLines[i].split(','); //split each line based on comma
    if (data.length == headers.length) { //make sure to check if data exists
      var e = new callInfo(); //create a new callInfo object
      var res = data[0].split(" "); //split the date and timew
      res[0] = res[0].replace(/\//g, '.');
      Object.assign(e.Date = res[0]); //assign the date
      Object.assign(e.Time = res[1].slice(0, -3)); //assign time
      Object.assign(e.Lat = data[1]); //assign Latitude
      Object.assign(e.Lon = data[2]); //assign Longitude
      //Object.assign(e.Base = data[3]); //assign Base ID
      uberFrame.push(e); //Push the object callInfo into the data frame
    }
  }
  if(uberFrame.length > 2000000){
    console.log("Finished uberFrame, Size:", uberFrame.length);
    console.log("Sample", uberFrame[0]);
  }
 return uberFrame; 
}


function processLyftData(allText, lyftFrame) {
  allText = allText.replace(/['"]+/g, '') //remove all " from input
  allText = allText.toLowerCase();
  var allTextLines = allText.split(/\r\n|\n/); //Split the input based on new lines
  var headers = allTextLines[0].split(','); //Split the first line and get the headers based on comma
  for (var i = 1; i < allTextLines.length; i++) { //travarse all lines
    var data = allTextLines[i].split(','); //split each line based on comma
    if (data.length == headers.length) { //make sure to check if data exists
      var e = new callInfo(); //create a new callInfo object
      var res = data[0].split(" "); //split the date and timew

      var tempHolder = res[0].split('/'); //same changes with uber date
      var tempRes = tempHolder[0];
      tempHolder[1] = tempHolder[1];
      tempHolder[0] = tempRes;
      res[0] = tempHolder.join();
      res[0] = res[0].replace(/,/g, '.');
      Object.assign(e.Date = res[0]); //assign the date
      Object.assign(e.Time = res[1]); //assign time
      Object.assign(e.Lat = data[1]); //assign Latitude
      Object.assign(e.Lon = data[2]); //assign Longitude
      //Object.assign(e.Date = data[0]);
      lyftFrame.push(e); //Push the object callInfo into the data frame
    }
  }
  console.log("Finished lyftFrame, Size:", lyftFrame.length);
  console.log("Sample", lyftFrame[0]);
  return lyftFrame;
}


function processData(allText, dataFrame) {
  dataFrame = [];
  allText = allText.replace(/['"]+/g, '') //remove all " from input
  allText = allText.toLowerCase();
  var allTextLines = allText.split(/\r\n|\n/); //Split the input based on new lines
  var headers = allTextLines[0].split(','); //Split the first line and get the headers based on comma
  for (var i = 1; i < allTextLines.length - 1; i++) { //travarse all lines
    var data = allTextLines[i].split(',');

    if (data[3].trim() != "" && data[4].trim() != "" && data[5].trim() != "") {
      try {
        var e = new callInfo(); //create a new callInfo object
        var newDate = data[0].trim().replace(/\b0/g, '').split('.');
        data[0] = newDate[1] + "." + newDate[2] + "." + newDate[0]; //data[0] = newDate[2] + "." + newDate[1] + "." + newDate[0];
        Object.assign(e.Date = data[0].trim()); //assign the date
        Object.assign(e.Time = data[1].trim()); //assign time
        Object.assign(e.State = data[2].trim());
        Object.assign(e.City = data[3].trim());
        Object.assign(e.Address = data[4].trim() + " " + data[5].trim());
        Object.assign(e.House = data[4].trim());
        Object.assign(e.Street = data[5].trim());
        Object.defineProperty(e, "houseNum", {
          enumerable: false
        });
        Object.defineProperty(e, "street", {
          enumerable: false
        });
        dataFrame.push(e);
      } catch (err) {
        console.log('PROBLEM Creating Data Frame', err)
      }
    }
  }
  console.log("Finished dataFrame, Size:", dataFrame.length);
  console.log("Sample", dataFrame[0]);
  return dataFrame;
}

module.exports = { completedFrame, processTripData, processUberData, processLyftData, processData };
