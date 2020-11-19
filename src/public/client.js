var edited = false;
var textBoxes = 0;


$(document).ready(function () {
    backupCheck();
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
});

function backupCheck() {
    var url = "http://localhost:3000/checkBackup";
    $.get(url, function (data) {
        if (data == true) {
            var modal = document.getElementById("myModal");
            modal.style.display = "block";
            var span = document.getElementsByClassName("close")[0];
            span.onclick = function () {
                var url = "http://localhost:3000/noBackup";
                $.get(url)
                modal.style.display = "none";
            }
            $("#backupNo").click(function () {
                var url = "http://localhost:3000/noBackup";
                $.get(url);
                modal.style.display = "none";
            });
            $("#backupYes").click(function () {
                var url = "http://localhost:3000/getBackup";
                $.get(url);
                modal.style.display = "none";
            });
        } else {
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
            var url = "http://localhost:3000/search?field=" + sendField + "&id=" + sendKey;
            $.get(url, function (data) {
                var parent = document.getElementById('table');
                parent.innerHTML = "";
                if (data.length == 0) {
                    $("#addEntry").hide();
                    showPopUp("No Data Found, Check Spelling.");
                } else {
                    //ProcessData(data);
                    parent.appendChild(buildHtmlTable(data.slice(0, 100)));
                    getUniqueValues();
                    // when search goes through, turn on addEntry button
                    $("#addEntry").show();
                }
            });
        } else {
            var parent = document.getElementById('table');
            parent.innerHTML = "";
            $("#addEntry").hide();
            showPopUp("Please Enter A Keyword!");

        }
        editing = false;
    });
}

function addData() {
    var extractedDate = $("#date").val().replace(/[-]+/g, '.')
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
            $(".entryText").fadeOut(300);
            var sendKey = $("#searchBar").val();
            var sendField = $("#data_selection").val();

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
            }
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
    /*
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
            
            var h1 = document.createElement("H3");
            var t = document.createTextNode("Add A New Entry:");
            h1.appendChild(t);
            textTable.appendChild(h1);
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
    });*/
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
    } else {
        showPopUp("Please save your edit first!")
    }
    // console.log("THE DELETED DATA CHECKING HOW ITS DISPLAY",tempData);
    //delete_Elemet(tempData);
    getUniqueValues()
    // console.log("WHAT IS PARENT",parent);
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
        getUniqueValues();
        //edit_Element(previousData, updatedData);
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

function search_Unique(check_Arr, value) {
    //console.log('search array');
    for (var i = 0; i < check_Arr.length; ++i) {
        //console.log('searching');
        if (check_Arr[i] == value) {

            return 0;
        }

    }
    return 1;
}

const unique_Arr = [
    [],
    [],
    [],
    [],
    []
];

function Unique(arr) {
    //const unique_Arr = [ [],[],[],[],[] ]; 
    //console.log(arr.length);
    console.log(unique_Arr)
    for (var i = 0; i < arr.length; ++i) {
        //console.log("in for loop ");
        const str_check = arr[i];
        //console.log(Object.keys(str_check));
        const var_length = Object.keys(str_check).length;
        // console.log("This is the length of KEYS :",var_length);
        // console.log("this is string check",str_check);
        for (const [key, value] of Object.entries(str_check)) {

            if (key == 'date') {
                if (search_Unique(unique_Arr[0], value) != 0) {
                    unique_Arr[0].push(value);
                }

            }
            if (key == 'time') {
                if (search_Unique(unique_Arr[1], value) != 0) {
                    unique_Arr[1].push(value);
                }
            }

            if (key == 'state') {
                if (search_Unique(unique_Arr[2], value) != 0) {
                    unique_Arr[2].push(value);
                }


            }
            if (key == 'city') {
                if (search_Unique(unique_Arr[3], value) != 0) {
                    unique_Arr[3].push(value);
                }

            }
            if (key == 'address') {
                if (search_Unique(unique_Arr[4], value) != 0) {
                    unique_Arr[4].push(value);
                }

            }

        }

    }
    //console.log('worked');
    Assigning_Display(unique_Arr);
}


function Assigning_Display(arr_Value) {
    //console.log(arr_Value);
    const x_Axis = ['Date', 'Time', 'State', 'City', 'Address'];
    //console.log(x_Axis);

    const y_Axis = [];
    for (var i = 0; i < arr_Value.length; ++i) {
        var count = 0;
        for (var j = 0; j < arr_Value[i].length; ++j) {
            //console.log(arr_Value[i]);
            ++count;
            if (j == arr_Value[i].length - 1) {
                y_Axis.push(count);
            }


        }
    }
    //console.log(y_Axis);

    createChart(x_Axis, y_Axis);
}

function getUniqueValues() {
    bigArray = [];
    for (var x = 1; x < 6; x++) {
        var arr = [];
        $("table td:nth-child(" + x + ")").each(function () {
            if ($.inArray($(this).text().toLowerCase(), arr) == -1)
                arr.push($(this).text());
        });
        bigArray.push(arr);
    }
    console.log(bigArray);
    const x_Axis = ['Date', 'Time', 'State', 'City', 'Address'];
    const y_Axis = [];
    for (var j = 0; j < bigArray.length; j++) {
        y_Axis[j] = bigArray[j].length;
    }
    createChart(x_Axis, y_Axis);
}



function createChart(x_Axis, y_Axis) {
    console.log(x_Axis);
    console.log(y_Axis);




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
                }
            }
        }

    });

}
//NEED TO FIX ISSUE WITH SINGLE ENTERY 
function delete_Elemet(deleted_Arr) {
    for (var i = 0; i < unique_Arr.length; ++i) {
        for (var j = 0; j < unique_Arr[i].length; ++j) {
            //console.log("CHECK THIS HERE",unique_Arr[i][j]);
            if (unique_Arr[i][j] == deleted_Arr[i]) {
                //console.log("IT IS A MATCH");
                if (unique_Arr[i].length == 1) {
                    //console.log("DID IT WORK");
                    break;
                } else {
                    unique_Arr[i].splice(j, 1);
                }
            }
        }
    }
    //console.log("cleaned array:", unique_Arr);
    Assigning_Display(unique_Arr);
}

function edit_Element(old_Arr, new_Arr) {
    var tmp_Val = 0;
    var lookup_Val = 0
    for (var i = 0; i < old_Arr.length; ++i) {
        if (old_Arr[i] != new_Arr[i]) {
            if (new_Arr[i] == " ") {
                tmp_Val = 0;
            } else {
                lookup_Val = old_Arr[i];
                tmp_Val = new_Arr[i];
            }
        }

    }
    console.log(tmp_Val);
    console.log('LOOK UP VAL', lookup_Val);
    console.log("unquie arr:", unique_Arr);
    for (var j = 0; j < unique_Arr.length; ++j) {
        for (var k = 0; k < unique_Arr[j].length; ++k) {
            console.log("old values", old_Arr[k]);
            if (unique_Arr[j][k] == lookup_Val && unique_Arr[j].length != 1 && tmp_Val != 0) {
                unique_Arr[j][k] = tmp_Val;
                console.log('assigned');

            }
            if (unique_Arr[j].length == 1 && unique_Arr[j][k] == lookup_Val) {
                console.log("HERE");
                unique_Arr[j].push(tmp_Val);

            }
            if (unique_Arr[j][k] == lookup_Val && unique_Arr[j].length != 1 && tmp_Val == 0) {

                // unique_Arr[j][k] = tmp_Val;
                console.log('SUDO DELETE');
                unique_Arr[j].splice(k, 1);

            }

        }
    }
    console.log(tmp_Val);
    Assigning_Display(unique_Arr);

}

function saveBackup() {
    console.log("SAVING");
    var url = "http://localhost:3000/exportData";
    $.get(url, function (data) {
        if (data == true) {
            showPopUp("Backup Completed!");
        } else {
            showPopUp("There was an error processing your backup. Please try again.");
        }
    });
}

function deleteBackup() {
    console.log("Deleting");
    var url = "http://localhost:3000/deleteBackup";
    $.get(url, function (data) {
        if (data) {
            showPopUp("Backup Data file deleted.");
        } else {
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

function populationSearch() {
    var searchTarget = $("#searchbar").val()
        var url = "http://localhost:3000/population?search=" + searchTarget;
        $.get(url, function (data) {
        console.log(data);
		var separatorIndex = data.indexOf("SEPARATOR");
		var citiesInState = data.slice(0, separatorIndex);
                var citiesCount = data.slice(separatorIndex + 1);
                data = sortAArray(citiesInState, citiesCount);
                console.log("Unique City Array: ", citiesInState);
		        console.log("Number of Calls from City Array: ", citiesCount);
                if (citiesInState != 0 && citiesCount != 0) {
                

                citiesInState = citiesInState.slice(0, 15);
                citiesCount = citiesCount.slice(0, 15);
                
                citiesChart(citiesInState,citiesCount);
			showPopUp("Success!");
                }
                else {
			showPopUp("Error: Your Entry Was Not Found In Our Database!");
                }
        });
        
}

function sortAArray(names, count){
    var list = [];
    for (var j = 0; j < names.length; j++) 
        list.push({'name': names[j], 'count': count[j]});

    //2) sort:
    list.sort(function(a, b) {
        return ((a.count > b.count) ? -1 : ((a.count == b.count) ? 0 : 1));
        //Sort could be modified to, for example, sort on the age 
        // if the name is the same.
    });

    //3) separate them back out:
    for (var k = 0; k < list.length; k++) {
        names[k] = list[k].name;
        count[k] = list[k].count;
    }
    return [names,count];
}

function daysArtifact() {
    var busyState = $("#state_search").val()
    var busyCity = $("#city_search").val()
    var busyAddress = $("#address_search").val()
    var busyStreet = $("#street_search").val()
    var url = "http://localhost:3000/busiest?state=" + busyState + "&city=" + busyCity + "&address=" + busyAddress + "&street=" + busyStreet;
    $.get(url, function (data) {
        if (data == "ErrorCode1") {
            showPopUp("Error: Your Entry Was Not Found In Our Database!");
        } else {
            console.log(data);
            //do graph here
            daysChart(data);
            showPopUp("Success");
            
		}
	});
}

function timesArtifact() {
    var url = "http://localhost:3000/timePopularity";
    $.get(url, function (data) {
        if (data == "ErrorCode1") {
            showPopUp("Error: Your Entry Was Not Found In Our Database!");
        } else {
            console.log(data);
            timeRange(data);
		}
	});
}

function activeVehicleArtifact(){
    var url = "http://localhost:3000/activeVehicle";
    $.get(url, function (data) {
        if (data == "ErrorCode1") {
            showPopUp("Error: Your Entry Was Not Found In Our Database!");
        } else {
            console.log(data[1].length, data[0].le);
            activeVehicleGraph(data[1], data[0]);
		}
	});
}


function compareArtifact() {
    $('#comparisonChart').remove();
    $('.comparisonHolder').html('<canvas id="comparisonChart"></canvas>');
    var startDate = $("#month1_selection").val()
    var endDate = $("#month2_selection").val()
    var url = "http://localhost:3000/compare?startDate=" + startDate + "&endDate=" + endDate;
    $("#switchGraph").hide();
    $(".loader").show();
    $.get(url, function (data) {
        $(".loader").hide()
        console.log("data length: ", data.length);
        if (data == "ErrorCode1") {
            showPopUp("Error: Incorrect month format! The ending month must be after the starting month!");
        } else if (data) {
            if (data.length == 0) { //theres nothing inside except separator
                showPopUp("Failed to Compare! Those Months Aren't In Our Data Set"); // cant happen with current setup
            } else {
                /*var separatorIndex = data.indexOf("SEPARATOR");
				var uberArray = data.slice(0, separatorIndex);
                var lyftArray = data.slice(separatorIndex + 1)*/
                
                var uberArray = data[0];
                var lyftArray = data[1];
                var dateUber = data[2];
                var dateLyft = data[3];
                console.log("uberArray: ", uberArray);
                console.log("lyftArray: ", lyftArray);

                var labelArr = Object.keys(dateUber);
                console.log(labelArr)
                var uberDateArr = []
                var lyftDateArr = []
                for (var key in dateUber) {
                    uberDateArr.push(dateUber[key]);
                    lyftDateArr.push(dateLyft[key]);
                }
                console.log("dateUber:", uberDateArr)
                console.log("dateLyft:", lyftDateArr)

                separatorObject(uberArray, lyftArray);
                $('#switchGraph').val("Date");
                $( "#switchGraph" ).unbind('click').click(function() {
                    console.log($('#switchGraph').val())
                    if($('#switchGraph').val()== 'Date'){
                        compareChart('line',labelArr, uberDateArr, lyftDateArr)
                        $('#switchGraph').val('Month')
                    }
                    else if($('#switchGraph').val()== 'Month'){
                        separatorObject(uberArray, lyftArray);
                        $('#switchGraph').val('Date')
                    }
                });
            
                showPopUp("Success!")
            }
        } else {
            showPopUp("Fatal Error: Comparing Went Wrong!") //testing purposes: will never reach here
        }
    });

}
function separatorObject(sArr, sArr2){
  const monthVal = [];

  for (var i = 0; i < sArr.length; ++i){
      var tmp = sArr[i].split(':');
      var sp = tmp.splice(0,1);
     
      monthVal.push(sp[0]);
      
  }
  console.log(monthVal);

  const uber_Arr = [];
  for (var i = 0; i < sArr.length; ++i){
    var tmp = sArr[i].split(':');
    var sp = tmp.splice(1,1);
    uber_Arr.push(sp[0]);
  }
  console.log(uber_Arr);

  const lyft_Arr = [];
  for (var i = 0; i < sArr2.length; ++i){
    var tmp = sArr2[i].split(':');
    var sp = tmp.splice(1,1);
    lyft_Arr.push(sp[0]);
  }
  console.log(lyft_Arr);

 compareChart("horizontalBar",monthVal, uber_Arr,lyft_Arr);
}

function compareChart(charType, y_Ax, uber_Arr, lyft_Arr) {
    console.log("Called Compare");
    $( "#switchGraph" ).show();
    var bgColor = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)'
    ];

    var bdColor = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)'
    ];

    $('#comparisonChart').remove();
    $('.comparisonHolder').html('<canvas id="comparisonChart"></canvas>');
    var ctx = document.getElementById('comparisonChart').getContext('2d');

    var comparisonChart = new Chart(ctx, {
        type: charType,
        data: {
            labels: y_Ax,

            datasets: [{
                    // label: 'Number of between Uber vs Lyft',

                    label: 'Uber',
                    data: uber_Arr,
                    backgroundColor: bgColor[0],
                    borderColor: bdColor[0],
                    borderWidth: 1
                },

                {
                    label: 'Lyft',
                    data: lyft_Arr,
                    backgroundColor: bgColor[1],
                    borderColor: bdColor[1],
                    borderWidth: 1
                },
            ]


        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: true,
                position: 'bottom',
                yAxis: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Number of Call'
                    }
                }]

            }

        }


    });
    return comparisonChart;
}

function activeVehicleGraph(uber_Arr, fhv_Arr) {
    var bgColor = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)'
    ];

    var bdColor = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)'
    ];

    $('#activeVehicleChart').remove();
    $('.activeVehicleHolder').html('<canvas id="activeVehicleChart"></canvas>');
    var ctx = document.getElementById('activeVehicleChart').getContext('2d');

    var activeVehicleChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Jan 2015 Week 1","Jan 2015 Week 2","Jan 2015 Week 3","Jan 2015 Week 4", "Feb 2015 Week 1","Feb 2015 Week 2","Feb 2015 Week 3","Feb 2015 Week 4"],
            datasets: [{
                    // label: 'Number of between Uber vs Lyft',

                    label: 'Uber',
                    data: uber_Arr,
                    backgroundColor: bgColor[0],
                    borderColor: bdColor[0],
                    borderWidth: 1
                },

                {
                    label: 'For Hire Vehicle',
                    data: fhv_Arr,
                    backgroundColor: bgColor[1],
                    borderColor: bdColor[1],
                    borderWidth: 1
                },
            ]


        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: true,
                position: 'bottom',
                yAxis: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Number of Call'
                    }
                }]

            },
            title:{
                display: true,
                text: 'Number of Active Vehicles Uber vs For Hire Vehicle',
                fontSize: 20,
            },
            tooltips:{
				mode: 'label',
				intersect: false
			},

        }


    });
    return activeVehicleChart;
}

//Line chart for busy days 
function daysChart(y_Axis){
    
    const  x_Axis = ["Sunday","Monday","Tuesday","Wednesday",
            "Thursday", "Friday", "Saturday"];
    

    var bgColor = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)'
    ];

    var bdColor = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)'
    ];

    $('#busyChart').remove();
    $('.busyHolder').html('<canvas id="busyChart"></canvas>');
    var ctx = document.getElementById('busyChart').getContext('2d');
    var busyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: x_Axis,
            datasets: [{
                label: "Days of Week",
                data: y_Axis,
                backgroundColor: bgColor[0],
                borderColor: bdColor[0],
                fill: false,
                lineTension: 0,
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 20,
                        fontColor: "black"
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontSize: 20,
                        fontColor: "black"
                    }
                }]
            },
            legend: {
                display: true,
                text: 'Busiest Days of Week Based on Calls',
                position: 'bottom',
                labels: {
                    fontColor: "#000000",
                    fontSize: 20,
                },
            }
        }

    });

}


function timeRange(y_Axis){
    
    const  x_Axis = ["12:00 AM - 05:59 AM","06:00 AM - 11:59 AM","12:00 PM - 05:59 PM","06:00 PM - 11:59 PM"];
    console.log("Called Time Range");
    console.log("X_axis",x_Axis);
    console.log("Y_axis",y_Axis);

    var bgColor = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)'
    ];

    var bdColor = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)'
    ];

    $('#timeGraph').remove();
    $('.timeHolder').html('<canvas id="timeGraph"></canvas>');
    var ctx = document.getElementById('timeGraph').getContext('2d');
    var busyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: x_Axis,
            datasets: [{
                label: "Days of Week",
                data: y_Axis,
                backgroundColor: bgColor[0],
                borderColor: bdColor[0],
                fill: false,
                lineTension: 0,
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 20,
                        fontColor: "black"
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontSize: 20,
                        fontColor: "black"
                    }
                }]
            },
            legend: {
                display: true,
                text: 'Busiest Days of Week Based on Calls',
                position: 'bottom',
                labels: {
                    fontColor: "#000000",
                    fontSize: 20,
                },
            },
            title:{
                display: true,
                text: 'What Time of Day is the Busiest',
                fontSize: 20,
            },
        }

    });

}

function citiesChart(x_Axis,y_Axis){
    console.log("Cities Chart");
    var bgColor = [
        'rgba(255, 99, 235, 0.2)'
        ];
    var bdColor = [
        'rgba(255, 99, 132, 1)'
           
        ];
    $('#populationChart').remove();
    $('.populationHolder').html('<canvas id="populationChart"></canvas>');
    var ctx = document.getElementById('populationChart').getContext('2d');
    var populationChart = new Chart(ctx,{
        type: 'line',
        
        data: {
            labels: x_Axis,
            datasets:[
                {
                    label: "Cities",
                    data: y_Axis,
                    backgroundColor: bgColor[0],
                    borderColor: bdColor[0],
                    //borderWidth: 1,
                    //barPercentage: 50,
                    fill: false,
                    pointRadius:20,
                    showLine: false,
                    pointHoverRadius: 30,  
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 14,
                        fontColor: "black"
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontSize: 17,
                        fontColor: "black"
                    }
                }]
            },
            responsive: true,
            title:{
                display: true,
                text: 'Number of calls per city',
                fontSize: 20,
            },
             legend: {
                 display: true,
             }
        }

    });

}
