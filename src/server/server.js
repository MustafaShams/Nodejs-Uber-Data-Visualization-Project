const callInfo = require('./dataFrameClass.js') //call the class File and store in callInfo


//READ CSV FILE
const fs = require('fs');

fs.readFile('inputFile/other-Dial7_B00887.csv', 'utf8', function (err, data) {
  if (err) {
    console.error(err)
    return
  }
  processData(data)
  
});

var dataFrame = [];
var key;
async function processData(allText) {
  allText = allText.replace(/['"]+/g, '') //remove all " from input
  allText = allText.toLowerCase();
  var allTextLines = allText.split(/\r\n|\n/); //Split the input based on new lines
  var headers = allTextLines[0].split(','); //Split the first line and get the headers based on comma
  for (var i = 1; i < allTextLines.length-1; i++) { //travarse all lines
    var data = allTextLines[i].split(',');

      if(data[4].trim() != ""){
        try {
          var e = new callInfo();                                    //create a new callInfo object
          Object.assign(e.Date = data[0].trim());                           //assign the date
          Object.assign(e.Time = data[1].trim());                            //assign time
          Object.assign(e.State = data[2].trim());   
          Object.assign(e.City = data[3].trim());   
          Object.assign(e.Address = data[4].trim()+" "+data[5].trim());
          dataFrame.push(e); 
        }
        catch(err){
          console.log('PROBLEM')
        }
      }
  }
  //console.log(dataFrame);
  key = "BX";	//for testing search function, need to get real input from client
  var temp = searchDataFrame(dataFrame, key);
  console.log(temp);
}

function searchDataFrame(dataFrame, key) {		//returns an array of callInfo that matches key
	var tempDF = [];
	for (var i = 1; i < dataFrame.length; ++i) {
		if (key == dataFrame[i].City) {
			tempDF.push(dataFrame[i]);
		}
	}
	return tempDF;
}

/* FUNCTION TO FIND UNIQUE CITIES IN DATAFRAME
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
  
  console.log(tempDF);
  require('fs').writeFile('./my.json', JSON.stringify(tempDF),
    function (err) {
      if (err) {
        console.error('Crap happens');
      }
    }
  );
  for (var x = 0; x < tempDF.length; x++) {
    console.log(tempDF[x], ":", times[x]);
  }
}*/


var http = require('http')
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
})

server.listen(port, function (error) {
  if (error) {
    console.log('Something went wrong', error)
  } else {
    console.log('Server is listening on port', port)
  }
});
