var edited = false;
var textBoxes = 0;
backupCheck();

$(document).ready(function () {
    searchTableCreate();
    addEntry();
});

function backupCheck() {
    var url = "http://localhost:3000/checkBackup";
    $.get(url, function (data) {
        if (data == true) {
            var modal = document.getElementById("myModal");
            modal.style.display = "block";
            var span = document.getElementsByClassName("close")[0];
            span.onclick = function () {
                console.log("Called3");
                var url = "http://localhost:3000/noBackup";
                $.get(url)
                modal.style.display = "none";
            }
            $("#backupNo").click(function () {
                console.log("Called2");
                console.log("No");
                var url = "http://localhost:3000/noBackup";
                $.get(url);
                modal.style.display = "none";
            });
            $("#backupYes").click(function () {
                var url = "http://localhost:3000/getBackup";
                $.get(url);
                console.log("YES");
                modal.style.display = "none";
            });
        } else {
            console.log("Called1");
            var url = "http://localhost:3000/noBackup";
            $.get(url);
        }
    });

}

function searchTableCreate() {
    var sendKey;
    var sendField;
    $("#submit").click(function () {
        sendKey = $("#searchBar").val();
        sendField = $("#data_selection").val();
        console.log(sendField);
        if (sendKey) {
            console.log("button", sendKey);
            var url = "http://localhost:3000/search?field=" + sendField + "&id=" + sendKey;
            $.get(url, function (data) {
                var parent = document.getElementById('table');
                parent.innerHTML = "";
                if (data.length == 0) {
                    showPopUp("No Data Found, Check Spelling.");
                } else {
                    //ProcessData(data);
                    parent.appendChild(buildHtmlTable(data.slice(0, 100)));

                    // when search goes through, turn on addEntry button
                    var addEntry = document.getElementById('addEntry');
                    addEntry.style.display = 'block';
                }
            });
        } else {
            var parent = document.getElementById('table');
            parent.innerHTML = "";
            showPopUp("Please Enter A Keyword!");
            /*
            
            var _table_ = document.createElement('table');
            _table_.innerHTML = "Please Enter A Keyword!"
            parent.appendChild(_table_)*/
        }
        editing = false;
        console.log('output');
    });
}

function addData() {
    var extractedDate = $("#date").val();
    var extractedTime = $("#time").val();
    var extractedState = $("#state").val();
    var extractedCity = $("#city").val();
    var extractedAddress = $("#address").val();
    var url = "http://localhost:3000/add?date=" + extractedDate + "&time=" + extractedTime + "&state=" + extractedState + "&city=" + extractedCity + "&address=" + extractedAddress;
	console.log(url);
	var tempArr = [];
	tempArr.push(extractedDate);
	tempArr.push(extractedTime);
	tempArr.push(extractedState);
	tempArr.push(extractedCity);
	tempArr.push(extractedAddress);
    $.get(url, function (data, tempArr) {
	if (data == true) {
		var sendKey = $("#searchBar").val();
		var sendField = $("#data_selection").val();
		function buildMiniTable() {
			var table = document.getElementById('table').childNodes[0];
			var tr = _tr_.cloneNode(false);
			var tempArr = [];
			tempArr.push(extractedDate);
		        tempArr.push(extractedTime);
		        tempArr.push(extractedState.charAt(0).toUpperCase() + extractedState.slice(1).toLowerCase());
		        tempArr.push(extractedCity.charAt(0).toUpperCase() + extractedCity.slice(1).toLowerCase());
		        tempArr.push(extractedAddress);
			for (var j = 0, maxj = tempArr.length; j < maxj; ++j) {
				var td = _td_.cloneNode(false);
				td.appendChild(document.createTextNode(tempArr[j] || ''));
				tr.appendChild(td);
			}
			tr = addEdit(tr);
			tr = addDel(tr);
			table.appendChild(tr);
		}
		switch(sendField) {
			case "Date":
				if (sendKey.toLowerCase() == extractedDate.toLowerCase()) {
					buildMiniTable();
				}
				break;
			case "Time":
                                if (sendKey.toLowerCase() == extractedTime.toLowerCase()) {
	                                buildMiniTable();
                                }
                                break;
			case "State":
                                if (sendKey.toLowerCase() == extractedState.toLowerCase()) {
                                        buildMiniTable();
                                }
                                break;
			case "City":
				if (sendKey.toLowerCase() == extractedCity.toLowerCase()) {
					buildMiniTable();
				}
				break;
			case "Address":
				if (sendKey.toLowerCase() == extractedAddress.toLowerCase()) {
					buildMiniTable();
				}
				break;
		}
	    showPopUp("Data Submitted!");
	}
	else {
	    showPopUp("Please Fill Out All Fields");
	}
    });
}

var _textTable_ = document.createElement('textTable');

function addEntry() {
    $("#addEntry").click(function(data) {
        var sendKey;
        var sendField;
        sendKey = $("#searchBar").val();
        sendField = $("#data_selection").val();

        var parent = document.getElementById('textTable');
        parent.innerHTML = "";

        // so I'm basically re-querying the data just to get how many columns. If we store th data in the future, I can change this
        var url = "http://localhost:3000/search?field=" + sendField + "&id=" + sendKey;
        $.get(url, function (data) {
            var textTable = _textTable_.cloneNode(false);
		
		
            // add text boxes
            for(var key in data[0]) {
                var inputBox = document.createElement('input');
                inputBox.type = "text";
		inputBox.id = key.toString(); //lower cases: date time state city address
		inputBox.placeholder = key.charAt(0).toUpperCase() + key.slice(1);
                textTable.appendChild(inputBox);
            }
		
	    

            //add save button
            var submitAdd = document.createElement('input');
            submitAdd.type = "button";
            submitAdd.className = "submitAdd";
            submitAdd.onclick = function() {
                addData();
            }
            submitAdd.value = "Save";

            textTable.appendChild(submitAdd);
        
            parent.appendChild(textTable);
        });
    });
}

var _table_ = document.createElement('table'),
    _tr_ = document.createElement('tr'),
    _th_ = document.createElement('th'),
    _td_ = document.createElement('td');

// Builds the HTML Table out of myList json data from Ivy restful service.
function buildHtmlTable(arr) {
    //textBoxes = arr[0].length;
    var table = _table_.cloneNode(false),
        columns = addAllColumnHeaders(arr, table);
        textBoxes = columns.length;
    for (var i = 0, maxi = arr.length; i < maxi; ++i) {
        var tr = _tr_.cloneNode(false);
        for (var j = 0, maxj = columns.length; j < maxj; ++j) {
            var td = _td_.cloneNode(false);
            cellValue = arr[i][columns[j]];
            td.appendChild(document.createTextNode(arr[i][columns[j]] || ''));
            tr.appendChild(td);
        }

        tr = addEdit(tr);
        tr = addDel(tr);

        table.appendChild(tr);
    }
    console.log("table done");



    return table;
}

function extractRowData(row) {
    var topParent = $(row).parents("tr");
    var children = topParent.children("td");
    var dataInfo = []
    for (var x = 0; x < children.length - 2; x++) {
        dataInfo[x] = children[x].textContent
    }
    return dataInfo;
}

function deleteData(row) {
    if (editing == false) {
        var tempData = extractRowData(row); //an array [date, time, state, city, address]
        console.log("Deleting: ", tempData[0], tempData[1], tempData[2], tempData[3], tempData[4]);
        var url = "http://localhost:3000/delete?date=" + tempData[0] + "&time=" + tempData[1] + "&state=" + tempData[2] + "&city=" + tempData[3] + "&address=" + tempData[4];
        $.get(url, function (data) {
            var parent = document.getElementById('table');
            if (data == false) {
                showPopUp("Error: Couldn't find any matching data.")
            } else {
                showPopUp("Success! Ride was deleted.");
            }
        });
        $(row).parents("tr").remove();
    }
    else{
        showPopUp("Please save your edit first!")
    }
}

var previousData = []
var editing = false;

function editData(row) { //get which row, then after row is changed get what changed and send to server
    var topParent = $(row).parents("tr");
    var children = topParent.children("td");
    if (row.value == "Edit") {
        if (editing == false) {
            previousData = [];
            previousData = extractRowData(row);
            row.value = "Save"
            for (var x = 0; x < children.length - 2; x++) {
                children[x].contentEditable = true;
            }
            editing = true;
        } else {
            var url = "http://localhost:3000/edit?old=" + previousData;
            $.get(url, function (data) {
                var parent = document.getElementById('table');
                if (data == false) {
                    showPopUp("Error: Please only edit one entry at a time.");
                }
            });
            console.log("Error: Please only edit one entry at a time.")
        }
    } else if (row.value == "Save") {
        row.value = "Edit";
        for (var x = 0; x < children.length - 2; x++) {
            children[x].contentEditable = false;
        }
        var updatedData = extractRowData(row);
        console.log("Old: ", previousData);
        console.log("New: ", updatedData);
        console.log(url);
        //if (previousData.toString() != updatedData.toString()) { //check on server side instead
        var url = "http://localhost:3000/edit?old=" + previousData + "&new=" + updatedData;
        console.log("updating");
        $.get(url, function (data) {
            var parent = document.getElementById('table');
            if (data == false) {
                showPopUp("Error: Your new entry looks the same as before!");
            } else if (data == true) {
                showPopUp("Success! Ride was edited.");

            }
        });
        editing = false;
    }
}


// NOTE: these functionalities are separated so I can add a popup item to edit. May or may not be the way it will be implemented
// Add edit buttons to each row of table
function addEdit(tr) {
    var td = _td_.cloneNode(false);
    var btn = document.createElement('input');
    btn.type = "button";
    btn.className = "editbtn";
    btn.onclick = function () {
        editData(this);
    };
    btn.value = "Edit";
    td.appendChild(btn);
    tr.appendChild(td);

    return tr;
}

// Add delete buttons to each row of table
function addDel(tr) {
    var td = _td_.cloneNode(false);
    var btn = document.createElement('input');
    btn.type = "button";
    btn.className = "delbtn";
    btn.onclick = function () {
        deleteData(this);
    };
    btn.value = "Delete";
    td.appendChild(btn);
    tr.appendChild(td);

    return tr;
}

// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records
function addAllColumnHeaders(arr, table) {
    var columnSet = [],
        tr = _tr_.cloneNode(false);
    for (var i = 0, l = arr.length; i < l; i++) {
        for (var key in arr[i]) {
            if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1) {
                columnSet.push(key);
                var th = _th_.cloneNode(false);
                th.appendChild(document.createTextNode(key));
                tr.appendChild(th);
            }
        }
    }
    var editth = _th_.cloneNode(false);
    editth.appendChild(document.createTextNode("Edit"));
    tr.appendChild(editth);

    var delth = _th_.cloneNode(false);
    delth.appendChild(document.createTextNode("Delete"));
    tr.appendChild(delth);

    table.appendChild(tr);
    return columnSet;
}


const x_Axis = [];
const y_Axis = [];

function ProcessData(Text) {
    console.log("passed");
    const size = Text.length;
    console.log("size:", size);
    //console.log(Text);
    //console.log(Text[0].city);
    if (Search(x_Axis, Text) != 1) {
        x_Axis.push(Text[0].city);
        y_Axis.push(size);
    } else {
        console.log("input already in array");
    }
    console.log(x_Axis);
    console.log(y_Axis);
    createChart();
}

function Search(Arr, Text) {
    console.log(Text[0]);
    for (var i = 0; i < Text.length; ++i) {
        for (var j = 0; j < Arr.length; ++j) {
            console.log("Searching for City from Data:", Text[i].city)
            console.log("Searching for city in arr:", Arr[j])
            if (Text[i] == Arr[j].city) {
                return 1;
            } else {
                return 0;
            }
        }

    }
    return 0;
}
//  function Random_Color(value){
//     value = Math.floor(Math.random() * 255) + 1);

//     return value;
//  }

function createChart() {
    console.log("printing");
    //await ProcessData();
    console.log("waited");
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: x_Axis,
            datasets: [{
                label: 'Call of Cities',
                data: y_Axis,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },

    });
    //myChart.render();
}


function saveBackup() {
    console.log("SAVING");
    var url = "http://localhost:3000/exportData";
    $.get(url, function (data) {
        if(data == true){
            showPopUp("Backup Completed!");
        }
        else{
            showPopUp("There was an error processing your backup. Please try again.");
        }
    });
}

function deleteBackup() {
    console.log("Deleting");
    var url = "http://localhost:3000/deleteBackup";
    $.get(url, function (data) {
        if(data){
            showPopUp("Backup Data file deleted.");
        }
        else{
            showPopUp("No Backup to delete.");
        }
    });
}


function showPopUp(text) {
    $('.popup').clearQueue();
    $('.popup').stop();
    $("#myPopup").html(text);
    $('.popup').fadeIn(800).delay(4000).fadeOut(800);
}

