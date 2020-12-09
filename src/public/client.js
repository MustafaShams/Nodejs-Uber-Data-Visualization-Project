var edited = false;
var textBoxes = 0;

$(document).ready(function () {
    searchTableCreate();
    addEntry();

    var timepicker = new TimePicker('time', {
        lang: 'en',
        theme: 'dark'
    });
    timepicker.on('change', function (evt) {
        var value = (evt.hour || '00') + ':' + (evt.minute || '00');
        evt.element.value = value;
    });
    $('#closePop').click(function() {
        $('.entryText').hide();
    });
    $('#addData').on('click', function () {
		addData();
	});
});

function searchTableCreate() {
    var sendKey;
    var sendField;
    
    $("#submit").click(function () {
        
        sendKey = $("#searchBar").val();
        sendField = $("#data_selection").val();
        if (sendKey) {
            var url = "http://localhost:3000/search?field=" + sendField + "&id=" + sendKey;
            $.get(url, function (data) {
                if (data.length == 0) {
                    $('#myTable_wrapper').hide();
                    $("#addEntry").show();
                    showPopUp("No Data Found, Check Spelling.");
                } else {
                    var newData = [];
                    for(var i = 0; i < data.length; i++){
                        const propertyNames = Object.values(data[i]);
                        newData.push(propertyNames);
                    }
                    createTable();
                    convertDataTable(newData.slice(0, 50000));
                    getUniqueValues();
                    $("#addEntry").show();
                    $('#myTable').dataTable();
                    $('#myTable').show();
                }
            });
        } else {
            $("#addEntry").hide();
            showPopUp("Please Enter A Keyword!");
        }
        editing = false;
    });
}

let mainTable;
function convertDataTable(myData) {
	window.mainTable = $('#myTable').DataTable({
        data: myData,
        "iDisplayLength": 100,
        "scrollY": "650px",
		"scrollCollapse": true,
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
	var headerInfo = ["<b>Date</b>", "<b>Time</b>", "<b>State</b>", "<b>City</b>", "<b>Address</b>", "<b>Edit</b>", "<b>Delete</b>"]
	var header = table.createTHead();
	var row = header.insertRow(0);
	for (var k = 0; k < headerInfo.length; k++) {
		var cell = row.insertCell(k);
		cell.innerHTML = headerInfo[k];
	}
}

function addData() {
    var extractedDate = $("#date").val().replace(/[-]+/g, '.')
	var date = extractedDate.split('.');
	extractedDate = date[1].replace(/^0+/, '') + '.' + date[2].replace(/^0+/, '') + '.' + date[0].replace(/^0+/, '');
	var extractedTime = $("#time").val();
    var extractedState = $("#state").val();
    var extractedCity = $("#city").val();
    var extractedAddress = $("#address").val();
    var url = "http://localhost:3000/add?date=" + extractedDate + "&time=" + extractedTime + "&state=" + extractedState + "&city=" + extractedCity + "&address=" + extractedAddress;
    var tempArr = [];
    tempArr.push(extractedDate);
    tempArr.push(extractedTime);
    tempArr.push(extractedState);
    tempArr.push(extractedCity);
    tempArr.push(extractedAddress);
    $.get(url, function (data, tempArr) {
        if (data == true) {
            $(".entryText").fadeOut(300);
            var sendKey = $("#searchBar").val();
            var sendField = $("#data_selection").val();
            window.mainTable.row.add([
				extractedDate,
				extractedTime,
                extractedState,
                extractedCity,
                extractedAddress
			]).draw(false);
            showPopUp("Data Submitted!");
            getUniqueValues()
        } else {
            showPopUp("Please Fill Out All Fields");
        }
    });
}

var _textTable_ = document.createElement('textTable');

function addEntry() {
    $("#addEntry").click(function (data) {
        $(".entryText").fadeIn(500);
    })
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
        //console.log("Deleting: ", tempData[0], tempData[1], tempData[2], tempData[3], tempData[4]);
        var url = "http://localhost:3000/delete?date=" + tempData[0] + "&time=" + tempData[1] + "&state=" + tempData[2] + "&city=" + tempData[3] + "&address=" + tempData[4];
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
    getUniqueValues()
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
            var url = "http://localhost:3000/edit?old=" + previousData;
            $.get(url, function (data) {
                var parent = document.getElementById('table');
                if (data == false) {
                    showPopUp("Error: Please only edit one entry at a time.");
                }
            });
        }
    } else if (row.innerHTML == "Save") {
        row.innerHTML = "Edit";
        for (var x = 0; x < children.length - 2; x++) {
            children[x].contentEditable = false;
        }
        var updatedData = extractRowData(row);
        //console.log("Old: ", previousData);
        //console.log("New: ", updatedData);
        getUniqueValues();
        var url = "http://localhost:3000/edit?old=" + previousData + "&new=" + updatedData;
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

function getUniqueValues() {
    const x_Axis = ['Date', 'Time', 'State', 'City', 'Address'];
    const y_Axis = [];

    for(var i = 0; i < 5; i++){
        y_Axis[i] = window.mainTable.column( i ).data().unique().length;
    }
    createChart(x_Axis, y_Axis);
}

function createChart(x_Axis, y_Axis) {
    var bgColor = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ];
    var bdColor = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ];
    $('#myChart').remove();
    $('.graphHolder').html('<canvas id="myChart"></canvas>')
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Number of unique values for:'],
            datasets: [{
                    label: x_Axis[0],
                    data: [y_Axis[0]],
                    backgroundColor: bgColor[0],
                    borderColor: bdColor[0],
                    borderWidth: 1
                },
                {
                    label: x_Axis[1],
                    data: [y_Axis[1]],
                    backgroundColor: bgColor[1],
                    borderColor: bdColor[1],
                    borderWidth: 1
                },
                {
                    label: x_Axis[2],
                    data: [y_Axis[2]],
                    backgroundColor: bgColor[2],
                    borderColor: bdColor[2],
                    borderWidth: 1
                },
                {
                    label: x_Axis[3],
                    data: [y_Axis[3]],
                    backgroundColor: bgColor[3],
                    borderColor: bdColor[3],
                    borderWidth: 1
                },
                {
                    label: x_Axis[4],
                    data: [y_Axis[4]],
                    backgroundColor: bgColor[4],
                    borderColor: bdColor[4],
                    borderWidth: 1
                }
            ],
        },
        options: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: "#ffffff",
                    fontSize: 20
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 20,
                        fontColor: "white"
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontSize: 20,
                        fontColor: "white"
                    }
                }]
            },
            tooltips: {
                titleFontSize: 20,
                bodyFontSize: 20
              }
        }
    });
}

function showPopUp(text) {
    $('.popup').clearQueue();
    $('.popup').stop();
    $("#myPopup").html(text);
    $('.popup').fadeIn(800).delay(4000).fadeOut(800);
}
