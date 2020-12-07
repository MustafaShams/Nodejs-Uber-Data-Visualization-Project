$(document).ready(function () {

	searchTableCreate();
	
	$("#addEntry").click(function (data) {
		$("#date").val("");
		$("#activeVehicle").val("");
		$("#trips").val("");

		$(".entryText").fadeIn(500);
	})
	$('#closePop').click(function () {
		$('.entryText').hide();
	});
	

	$('#addData').on('click', function () {
		//console.log("clicked");
		addData();
	});
	

});
let type;

function searchTableCreate() {
	var sendField;
	$(".active_vehicles").click(function (evt) {
		sendField = evt.target.value;
		window.type = sendField;
		//console.log(window.type);
		if (sendField) {
			var url = "http://localhost:3000/searchActive?id=" + sendField;
			$.get(url, function (data) {
				//console.log(data);
				if (data.length == 0) {
					$("#addEntry").hide();
					showPopUp("No Data Found, Check Spelling.");
				} else {
					var newData = [];
					for(var i = 0; i < data.length; i++){
							const propertyNames = Object.values(data[i]);
							newData.push(propertyNames);
					}
					createTable();
					convertDataTable(newData);
					$("#addEntry").show();

				}
			});
		}
	});
}

let mainTable;
function convertDataTable(newData) {
	window.mainTable = $('#myTable').DataTable({
		"iDisplayLength": 100,
		"scrollY": "650px",
		"scrollCollapse": true,
		data: newData,
		fixedHeader: {
			header: true,
			footer: true
		},
		"rowCallback": function (row, data, index) {
			if (index % 2 == 0) {
				$(row).removeClass('myodd myeven');
				$(row).addClass('myodd');
			} else {
				$(row).removeClass('myodd myeven');
				$(row).addClass('myeven');
			}
		},
		"columnDefs": [{
				"targets": -2,
				"data": null,
				"defaultContent": "<button class=\"editbtn\" value=\"Edit\" onclick=\"editData(this);\">Edit</button>"
			},
			{
				"targets": -1,
				"data": null,
				"defaultContent": "<button class=\"delbtn\"  value=\"Delete\" onclick=\"deleteData(this);\">Delete</button>"
			}
		]
	});
	
}


function createTable() {
	var tableHolder = document.getElementById("tableHolder");
	tableHolder.innerHTML = "";
	var table = document.createElement("TABLE");
	tableHolder.appendChild(table);
	table.innerHTML = "";
	table.id = "myTable";
	var headerInfo = ["<b>Date</b>", "<b>Active Vehicles</b>", "<b>Number of Trips</b>", "<b>Edit</b>", "<b>Delete</b>"]
	var header = table.createTHead();
	var row = header.insertRow(0);
	for (var k = 0; k < headerInfo.length; k++) {
		var cell = row.insertCell(k);
		cell.innerHTML = headerInfo[k];
	}
}

var previousData = []
var editing = false;

function editData(row) { //get which row, then after row is changed get what changed and send to server
	var topParent = $(row).parents("tr");
	var children = topParent.children("td");
	if (row.innerHTML == "Edit") {
		if (editing == false) {
			previousData = [];
			previousData = extractRowData(row);
			row.innerHTML = "Save"
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
			//console.log("Error: Please only edit one entry at a time.")
		}
	} else if (row.innerHTML == "Save") {
		row.innerHTML = "Edit";
		for (var x = 0; x < children.length - 2; x++) {
			children[x].contentEditable = false;
		}
		var updatedData = extractRowData(row);
		//console.log("Old: ", previousData);
		//console.log("New: ", updatedData);
		var url = "http://localhost:3000/editActive?old=" + previousData + "&new=" + updatedData + "&type=" + window.type;
		//console.log("updating");
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
	////console.log("THIS IS TOP PARENT",topParent);
	////console.log("DATAINFO!!!!!!!!", dataInfo);
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
	var date = extractedDate.split('.');
	extractedDate = date[1].replace(/^0+/, '') + '.' + date[2].replace(/^0+/, '') + '.' + date[0].replace(/^0+/, '');
	var extractedVehicle = $("#activeVehicle").val();
	var extractedTrips = $("#trips").val();
	var url = "http://localhost:3000/addVehicle?date=" + extractedDate + "&activeVehicle=" + extractedVehicle + "&trips=" + extractedTrips + "&type=" + window.type;
	//console.log(url);
	$.get(url, function (data, tempArr) {

		if (data == true) {
			$(".entryText").fadeOut(300);
			var row = window.mainTable.row.add([
				extractedDate,
				extractedVehicle,
				extractedTrips,
			]).draw(false);

			showPopUp("Data Submitted!");

		} else {
			showPopUp("Please Fill Out All Fields");
		}
	});
}

function deleteData(row) {
	if (editing == false) {
		var tempData = extractRowData(row); //an array [date, time, state, city, address]
		//console.log("Deleting: ", tempData[0], tempData[1], tempData[2]);
		var url = "http://localhost:3000/deleteActive?date=" + tempData[0] + "&activeVehicle=" + tempData[1] + "&trips=" + tempData[2] + "&type=" + window.type;
		$.get(url, function (data) {
			var parent = document.getElementById('table');
			if (data == false) {
				showPopUp("Error: Couldn't find any matching data.")
			} else {
				showPopUp("Success! Ride was deleted.");
			}
		});
		window.mainTable.row( $(row).parents('tr') ).remove().draw();
	} else {
		showPopUp("Please save your edit first!")
	}
}