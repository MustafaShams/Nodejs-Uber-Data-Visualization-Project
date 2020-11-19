$(document).ready(function() {

	searchTableCreate();
	$("#addEntry").click(function (data) {
			$(".entryText").fadeIn(500);
	})
	$('#closePop').click(function() {
		$('.entryText').hide();
});

});
function searchTableCreate() {
	var sendField;
	$("#submit").click(function () {
		console.log("cicked")
			sendField = $("#data_selection").val();
			console.log(sendField);
			if (sendField) {
					var url = "http://localhost:3000/searchActive?id=" + sendField;
					$.get(url, function (data) {
							console.log(data);
							var parent = document.getElementById('table');
							parent.innerHTML = "";
							if (data.length == 0) {
									$("#addEntry").hide();
									showPopUp("No Data Found, Check Spelling.");
							} else {
									//ProcessData(data);
									parent.appendChild(buildHtmlTable(data.slice(0, 300)));
									// when search goes through, turn on addEntry button
									$("#addEntry").show();
							}
					});
			} else {
					$("#addEntry").hide();
					showPopUp("Please Enter A Keyword!");
			}
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
    //Unique(arr);



    return table;
}

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
            var url = "http://localhost:3000/editActive?old=" + previousData;
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

function extractRowData(row) {
	var topParent = $(row).parents("tr");
	var children = topParent.children("td");
	var dataInfo = []
	for (var x = 0; x < children.length - 2; x++) {
			dataInfo[x] = children[x].textContent

	}
	//console.log("THIS IS TOP PARENT",topParent);
	//console.log("DATAINFO!!!!!!!!", dataInfo);
	return dataInfo;
}

function showPopUp(text) {
	$('.popup').clearQueue();
	$('.popup').stop();
	$("#myPopup").html(text);
	$('.popup').fadeIn(800).delay(4000).fadeOut(800);
}


function addData() {
	var extractedDate = $("#date").val().replace(/[-]+/g, '.')
	var extractedVehicle = $("#activeVehicle").val();
	var extractedTrips = $("#trips").val();
	var type = $("#data_selection").val();
	var url = "http://localhost:3000/addVehicle?date=" + extractedDate + "&activeVehicle=" + extractedVehicle + "&trips=" + extractedTrips + "&type=" + type;
	console.log(url);
	var tempArr = [];
	tempArr.push(extractedDate);
	tempArr.push(extractedVehicle);
	tempArr.push(extractedTrips);
	$.get(url, function (data, tempArr) {
		
			if (data == true) {
					$(".entryText").fadeOut(300);
					var sendKey = $("#searchBar").val();
					var sendField = $("#data_selection").val();
				/*
					function buildMiniTable() {
							var table = document.getElementById('table').childNodes[0];
							var tr = _tr_.cloneNode(false);
							var tempArr = [];
	extractedDate = extractedDate.replace(/\b0/g, '').split('.');
	extractedDate = extractedDate[1] + "." + extractedDate[2] + "." + extractedDate[0];
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
					switch (sendField) {
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
					}*/
					showPopUp("Data Submitted!");

			} else {
					showPopUp("Please Fill Out All Fields");
			}
	});
}