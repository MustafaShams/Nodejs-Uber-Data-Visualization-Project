const callInfo = require('./dataFrameClass.js') //call the class File and store in callInfo


//READ CSV FILE
const fs = require('fs');

fs.readFile('inputFile/other-Highclass_B01717.csv', 'utf8', function (err, data) {
  if (err) {
    console.error(err)
    return
  }
  processData(data)
  
});

var dataFrame = [];
var key;
async function processData(allText) {
  allText = allText.replace(/['"]+/g, '')                        //remove all " from input
  var allTextLines = allText.split(/\r\n|\n/);                   //Split the input based on new lines
  var headers = allTextLines[0].split(',');                      //Split the first line and get the headers based on comma
  for (var i = 1; i < allTextLines.length; i++) {                //travarse all lines
    var data = allTextLines[i].split(',');                       //split each line based on comma
    if (data.length >= headers.length) {                         //make sure to check if data exists
      var e = new callInfo();                                    //create a new callInfo object
      var res = data[1].split(" ");                              //split the date and timew
      Object.assign(e.Date = data[0]);                           //assign the date
      Object.assign(e.Time = res[0]);                            //assign time
      Object.assign(e.AMPM = res[1]);                            //assign am or pm
      if(data.length == 3){                                      // Some data has city with a comma vs no comma so we have 2 different cases 3 or 4 //get the city name and address split
        var n = data[2].split(" ");
        var CityName = n[n.length-1]
        var lastIndex = data[2].lastIndexOf(" ");
        var firstAddress = data[2].substring(0, lastIndex);
        CityName = CityName.trim();
        firstAddress = firstAddress.trim();
        Object.assign(e.Address = firstAddress);
        Object.assign(e.City = CityName); 
      }
      if(data.length == 4){
        data[2] = data[2].trim();
        data[3] = data[3].trim();
        Object.assign(e.Address = data[2]);
        Object.assign(e.City = data[3]);
      }
     
      dataFrame.push(e); //Push the object callInfo into the data frame
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
