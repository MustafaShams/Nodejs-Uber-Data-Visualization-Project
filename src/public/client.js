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
      timepicker.on('change', function(evt) {
        
        var value = (evt.hour || '00') + ':' + (evt.minute || '00');
        evt.element.value = value;
      
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
            console.log("button", sendKey);
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
        getUniqueValues()
	}
	else {
	    showPopUp("Please Fill Out All Fields");
	}
    });
}

var _textTable_ = document.createElement('textTable');

function addEntry() {
    $("#addEntry").click(function(data) {
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
    }
    else{
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

function search_Unique(check_Arr,value){
    //console.log('search array');
    for(var i = 0; i < check_Arr.length; ++i){
        //console.log('searching');
        if(check_Arr[i] == value){
            
            return 0;
        }
      
    }
    return 1;

}
const unique_Arr = [ [],[],[],[],[] ]; 
function Unique(arr){
   //const unique_Arr = [ [],[],[],[],[] ]; 
    //console.log(arr.length);
    console.log(unique_Arr)
    for(var i = 0; i < arr.length; ++i){
        //console.log("in for loop ");
        const str_check = arr[i];
        //console.log(Object.keys(str_check));
        const var_length = Object.keys(str_check).length;
       // console.log("This is the length of KEYS :",var_length);
       // console.log("this is string check",str_check);
        for(const[key,value] of Object.entries(str_check) ){
           
           if(key == 'date'){
               if(search_Unique(unique_Arr[0],value ) != 0){
                 unique_Arr[0].push(value);   
               }

           }
           if(key == 'time'){
               if(search_Unique(unique_Arr[1],value ) != 0){
                unique_Arr[1].push(value);   
               }
           }

           if(key == 'state'){
               if(search_Unique(unique_Arr[2],value ) != 0){
                unique_Arr[2].push(value);   
               }
           
               
           }
           if(key == 'city'){
               if(search_Unique(unique_Arr[3],value ) != 0){
                unique_Arr[3].push(value);    
               }
               
           }
           if(key == 'address'){
               if(search_Unique(unique_Arr[4],value ) != 0){
                unique_Arr[4].push(value);
               }
               
           }

        }
   
    }
   //console.log('worked');
    Assigning_Display(unique_Arr);
}


function Assigning_Display(arr_Value){
    //console.log(arr_Value);
    const x_Axis = ['Date','Time','State','City','Address'];
    //console.log(x_Axis);

    const y_Axis = [];
    for(var i = 0; i < arr_Value.length; ++i ){
       var count = 0;
        for(var j = 0; j < arr_Value[i].length; ++j){
            //console.log(arr_Value[i]);
            ++count;
            if(j == arr_Value[i].length-1){
                y_Axis.push(count);
            }
           

        }
    }
    //console.log(y_Axis);

    createChart(x_Axis, y_Axis);
}

function getUniqueValues(){
    bigArray = [];
    for(var x = 1; x < 6; x++){
        var arr = [];
        $("table td:nth-child("+x+")").each(function() {
            if ($.inArray($(this).text().toLowerCase(), arr) == -1)
            arr.push($(this).text());
        });
        bigArray.push(arr);
    }
    console.log(bigArray);
    const x_Axis = ['Date','Time','State','City','Address'];
    const y_Axis = [];
    for(var j = 0; j < bigArray.length; j++){
        y_Axis[j] = bigArray[j].length;
    }
    createChart(x_Axis, y_Axis);
}



function createChart(x_Axis, y_Axis){
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
           labels : ['Columns'],
           datasets: [
               {
                label:x_Axis[0],
                data: [y_Axis[0]],
                backgroundColor: bgColor[0],
                borderColor: bdColor[0],
                borderWidth: 1
               },
               {
                label:x_Axis[1],
                data: [y_Axis[1]],
                backgroundColor: bgColor[1],
                borderColor: bdColor[1],
                borderWidth: 1
               },
               {
                label:x_Axis[2],
                data: [y_Axis[2]],
                backgroundColor: bgColor[2],
                borderColor: bdColor[2],
                borderWidth: 1
               },
               {
                label:x_Axis[3],
                data: [y_Axis[3]],
                backgroundColor: bgColor[3],
                borderColor: bdColor[3],
                borderWidth: 1
               },
               {
                label:x_Axis[4],
                data: [y_Axis[4]],
                backgroundColor: bgColor[4],
                borderColor: bdColor[4],
                borderWidth: 1
               }],
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
function delete_Elemet(deleted_Arr){
    for(var i = 0; i < unique_Arr.length; ++i){
        for(var j = 0; j < unique_Arr[i].length;++j){
           //console.log("CHECK THIS HERE",unique_Arr[i][j]);
           if(unique_Arr[i][j] == deleted_Arr[i]){
                //console.log("IT IS A MATCH");
                if(unique_Arr[i].length == 1){
                    //console.log("DID IT WORK");
                    break;
                }
                else{
                    unique_Arr[i].splice(j,1);
                }                
           }
        }
    }
  //console.log("cleaned array:", unique_Arr);
    Assigning_Display(unique_Arr);
}
function edit_Element(old_Arr,   new_Arr){
    var tmp_Val = 0;
    var lookup_Val = 0
    for(var i = 0; i < old_Arr.length; ++i){
        if(old_Arr[i] != new_Arr[i]){
            if(new_Arr[i] == " "){
                tmp_Val = 0;
            }
            else{
            lookup_Val = old_Arr[i];
            tmp_Val = new_Arr[i];
            }
        }
        
    }
    console.log(tmp_Val);
    console.log('LOOK UP VAL',lookup_Val);
    console.log("unquie arr:", unique_Arr);
    for(var j = 0; j < unique_Arr.length; ++j){
        for(var k = 0; k < unique_Arr[j].length; ++k){
            console.log("old values",old_Arr[k]);
            if( unique_Arr[j][k] == lookup_Val && unique_Arr[j].length != 1  && tmp_Val  != 0){
                unique_Arr[j][k] = tmp_Val;
                console.log('assigned');

            }
            if(unique_Arr[j].length == 1 && unique_Arr[j][k] == lookup_Val){
                console.log("HERE");
                unique_Arr[j].push(tmp_Val);

            }
            if(unique_Arr[j][k] == lookup_Val && unique_Arr[j].length != 1 && tmp_Val == 0 ) {

                // unique_Arr[j][k] = tmp_Val;
                console.log('SUDO DELETE');
                unique_Arr[j].splice(k,1);

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

function populationSearch() {
    // implement population artifact search
}

function daysArtifact() {
    // implement days popularity artifact
}

function compareArtifact() {
    // implement platform compparison artifact
}