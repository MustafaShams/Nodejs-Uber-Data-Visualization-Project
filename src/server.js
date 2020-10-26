const callInfo = require('./dataFrameClass.js') //call the class File and store in callInfo
const {
  parse
} = require('querystring'); //for parsing client-side html body for key

var JSZip = require("jszip");
const fs = require('fs');

var new_zip = new JSZip();
// more files !
fs.readFile("inputFile/other-Dial7_B00887.zip", function (err, data) {
  if (err) throw err;
  JSZip.loadAsync(data).then(function (zip) {
    zip.files['other-Dial7_B00887.csv'].async("string")
      .then(function (data) {
        processData(data);
      });
  });
});

var dataFrame = [];
var key;
var field;
function processData(allText) {
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
        if(data[4].size > 1){
          console.log("MORE",data[4], data[4].length);
        }
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
  exportData(dataFrame);
}

function searchDataFrame(dataFrame, key, field) { //returns an array of callInfo that matches key
  var tempDF = [];
  key = key.toLowerCase();
  if (field == "Date") {
    for (var i = 1; i < dataFrame.length; ++i) {
      if (key == dataFrame[i].Date) {
        tempDF.push(dataFrame[i]);
      }
    }
  } else if (field == "Time") {
    for (var i = 1; i < dataFrame.length; ++i) {
      if (key == dataFrame[i].Time) {
        tempDF.push(dataFrame[i]);
      }
    }
  } else if (field == "State") {
    for (var i = 1; i < dataFrame.length; ++i) {
      if (key == dataFrame[i].State) {
        tempDF.push(dataFrame[i]);
      }
    }
  } else if (field == "City") {
    for (var i = 1; i < dataFrame.length; ++i) {
      if (key == dataFrame[i].City) {
        tempDF.push(dataFrame[i]);
      }
    }
  } else if (field == "Address") {
    for (var i = 1; i < dataFrame.length; ++i) {
      if (key == dataFrame[i].Address) {
        tempDF.push(dataFrame[i]);
      }
    }
    console.log(tempDF.length);
  } else if (field == "Year") {
    for (var i = 1; i < dataFrame.length; ++i) {
      var date = dataFrame[i].Date;
      date = date.split('.');
      var year = date[0];
      if (key == year) {
        tempDF.push(dataFrame[i]);
      }
    }
    console.log(tempDF.length);
  } else if (field == "Month") {
    for (var i = 1; i < dataFrame.length; ++i) {
      var date = dataFrame[i].Date;
      date = date.split('.');
      var month = date[1];
      if (key == month) {
        tempDF.push(dataFrame[i]);
      }
    }
    console.log(tempDF.length);
  } 
  else if (field == "Street") {
    for (var i = 1; i < dataFrame.length; ++i) {
      if (key == dataFrame[i].street) {
        tempDF.push(dataFrame[i]);
      }
    }
  }
  console.log(tempDF.length);
  return tempDF;
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


function exportData(arr){
  let csvContent = "Date, Time, State, City, Address, Street\n";


  for(var x = 0; x < arr.length; x++){
    var address = arr[x].Address
    var index = address.indexOf(" ");
    var house = address.substr(0,index);
    var street = address.substr(index + 1);
    csvContent += arr[x].Date + "," + arr[x].Time + "," + arr[x].State + "," + arr[x].City + "," + house + "," +  street + "\n";
  }

  
  fs.writeFile('dataFrame.csv', csvContent, 'utf8', function (err) {
    if (err) {
      console.log('Some error occured - file either not saved or corrupted file saved.');
    } else{
      console.log('It\'s saved!');
    }
  });
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

app.get('/', (req, res) => {
  res.send('Working!');
});

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



app.listen(PORT, () => console.log('Listening on port', PORT));

function getKey(request, returnValue) { // parses the html body to get searchBar key from client (nodejs doesn't allow document.getElementById)
  const urlencoded = 'application/x-www-form-urlencoded';
  var parser = '';
  request.on('data', data => {
    parser += data.toString();
  });
  request.on('end', () => {
    returnValue(parse(parser));
  });
}



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