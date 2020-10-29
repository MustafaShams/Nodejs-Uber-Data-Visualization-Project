const callInfo = require('./dataFrameClass.js') //call the class File and store in callInfo
const keyClass = require('./keyClass.js')


const {
  parse
} = require('querystring'); //for parsing client-side html body for key

var JSZip = require("jszip");
const fs = require('fs');


function getBackUp(){
  fs.readFile('inputFile/dataFrame.csv', 'utf8', function (err, data) {
    if (err) {
      console.error(err)
      return
    }
    processData(data)
  });
}

function getRealData(){
  fs.readFile("inputFile/other-Dial7_B00887.zip", function (err, data) {
    if (err) throw err;
    JSZip.loadAsync(data).then(function (zip) {
      zip.files['other-Dial7_B00887.csv'].async("string")
        .then(function (data) {
          processData(data);
        });
    });
  });
}
var new_zip = new JSZip();
// more files !


var dataFrame = [];
var key;
var field;
function processData(allText) {
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
  console.log("Finished Parsing Data");
  //console.log(dataFrame);
  //exportData(dataFrame);
}

function searchDataFrame(dataFrame, key, field) { //returns an array of callInfo that matches key
  var tempDF = [];
  let keycls = new keyClass(field, key.toLowerCase());
  tempDF = keycls.keySearch(dataFrame);
  //console.log(tempDF.length);
  return tempDF;
}

function addData(dataFrame, date, time, state, city, address) {
	var e = new callInfo();
	if (date == "" || time == "" || state == "" || city == "" || address == "") {
		console.log("Error not adding anymore");
		return false;
	}
	date = date.toLowerCase();
	time = time.toLowerCase();
	state = state.toLowerCase();
	city = city.toLowerCase();
	address = address.toLowerCase();
	Object.assign(e.Date = date);
	Object.assign(e.Time = time);
	Object.assign(e.State = state);
	Object.assign(e.City = city);
	Object.assign(e.Address = address);
	var index = address.indexOf(" ");
	Object.assign(e.House = address.substr(0, index));
	Object.assign(e.Street = address.substr(index + 1));
	Object.defineProperty(e, "houseNum", {
		enumerable: false
	});
	Object.defineProperty(e, "street", {
		enumerable: false
	});
	dataFrame.push(e);
	return true;
}

function deleteData(dataFrame, date, time, state, city, address) {
	for (var i = 0; i < dataFrame.length; ++i) {
		if (date == dataFrame[i].Date && time == dataFrame[i].Time && state == dataFrame[i].State && city == dataFrame[i].City && address == dataFrame[i].Address) {
			dataFrame.splice(i, 1); //.splice(index, how many to delete)
			return true;
		}
	}
	return false;
}

function editData(dataFrame, tempOld, tempNew) {
	var editOld = tempOld.split(",");
	var editNew = tempNew.split(",");
	for (var i = 0; i < dataFrame.length; ++i) {
		if (editOld[0] == dataFrame[i].Date && editOld[1] == dataFrame[i].Time && editOld[2] == dataFrame[i].State && editOld[3] == dataFrame[i].City && editOld[4] == dataFrame[i].Address) {
			dataFrame[i].Date = editNew[0].toLowerCase();
			dataFrame[i].Time = editNew[1].toLowerCase();
			dataFrame[i].State = editNew[2].toLowerCase();
			dataFrame[i].City = editNew[3].toLowerCase();
			dataFrame[i].Address = editNew[4].toLowerCase();
			var index = editNew[4].indexOf(" ");
			dataFrame[i].House = editNew[4].substr(0, index).toLowerCase();
			dataFrame[i].Street = editNew[4].substr(index + 1).toLowerCase();
			return true;
		}
	}
	return false;
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

function checkBackUp(){
  if (fs.existsSync('inputFile/dataFrame.csv')) {
    return true;
  }
  else{
    return false;
  }
}


function exportData(arr){
  let csvContent = "Date, Time, State, City, Address, Street\n";


  for(var x = 0; x < arr.length; x++){
    var address = arr[x].Address
    var index = address.indexOf(" ");
    var house = address.substr(0,index);
    var street = address.substr(index + 1);
    csvContent += arr[x].Date + "," + arr[x].Time + "," + arr[x].State + "," + arr[x].City + "," + house + "," +  street + "\n";
  }

  
  try{
      fs.writeFile('inputFile/dataFrame.csv', csvContent, 'utf8', function (err) {
      if (err) {
        console.log('Some error occured - file either not saved or corrupted file saved.');
      } else{
        console.log('It\'s saved!');
      }
    });
  }
  catch(err){
    console.log(err);
    return false;
  }
  return true;
}

function deleteBackup(){
  const path = 'inputFile/dataFrame.csv'

  try {
    fs.unlinkSync(path)
    //file removed
  } catch(err) {
    if(err.code == 'ENOENT'){
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
  
  var data = searchDataFrame(dataFrame, key_name, field);
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
  console.log("Getting Real");
  getRealData();
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
	var data = addData(dataFrame, tempDate, tempTime, tempState, tempCity, tempAddress);
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
	var data = deleteData(dataFrame, tempDate, tempTime, tempState, tempCity, tempAddress);
	res.header("Content-Type", 'application/json');
	res.json(data);
});

app.get('/edit', (req, res) => {
        if (req.query.new == null) { var data = false; //more than one edit check
		                res.header("Content-Type", 'application/json');
		                res.json(data);
	}
	else {	//single edits
		var tempOld = req.query.old;
		var tempNew = req.query.new;
		if (tempOld.toLowerCase() == tempNew.toLowerCase()) {
			var data = false;
			res.header("Content-Type", 'application/json');
			res.json(data);
		}
		else {
			console.log("Editing this: ", tempOld);
			console.log("To look like this: ", tempNew);
        		var data = editData(dataFrame, tempOld, tempNew);
        		res.header("Content-Type", 'application/json');
        		res.json(data);
		}
	}
});

app.listen(PORT, () => console.log('Listening on port', PORT));

/*var http = require('http')
const port = 3000


const server = http.createServer(function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  })
  fs.readFile('public/index.html', function (error, data) {
    if (error) {
      res.writeHead(404)
      res.write('Error: file not found')
    } else {
      res.write(data)
    }
    res.end()
  })

  if (req.url === '/response') {
    console.log('received hello from client')
    res.writeHead(200, {
      'Content-Type': 'text/html'
    })
    res.write('<p>Hello From the Server</p>')
  }
	
	if (req.url === '/search') {
		console.log('\nsearching...\n'); //for testing purposes: checking to see if it works
		getKey(req, input => {
			key = input.searchBar;
			var temp = searchDataFrame(dataFrame, key);
			res.write(`Searched for ${input.searchBar}`); //change this to actual output!
/* ---------------- BELOW IS FOR TESTING PURPOSES ONLY ---------------------------
			//console.log(temp);
      //console.log(temp.length);

      var resJSON = createJSON(temp);
      for (i = 0; i < 20; i++) {
        res.write('<p>' + JSON.stringify(resJSON[i]).toUpperCase() + '</p>');
      }
    });
  }

  if (req.url == '/data') { //check the URL of the current request
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ message: "Hello World"}));  
    res.end();  
  }
    
})

server.listen(port, function (error) {
  if (error) {
    console.log('Something went wrong', error)
  } else {
    console.log('Server is listening on port', port)
  }
});*/
