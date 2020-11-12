$(document).ready(function () {
    getQuarterCompare();
});

function getQuarterCompare() {
	var url = "http://localhost:3000/quarterPopularity";
	$.get(url, function (data) {
		if (data) {
			var dialArray = data[0];
                	var uberArray = data[1];
                	var lyftArray = data[2];
			var dialPercent = data[3];
			var uberPercent = data[4];
			var lyftPercent = data[5];  	// [0, null, null, null]
			lyftPercent[0] = [0, 0, 0, 0,]; // first month of lyft data contains few values so it is omitted
			console.log("dialArray: ", dialArray);
                	console.log("uberArray: ", uberArray);
                	console.log("lyftArray: ", lyftArray);
			console.log("dialPercent: ", dialPercent);
			console.log("uberPercent: ", uberPercent);
			console.log("lyftPercent: ", lyftPercent);
			showPopUp("Success!");
			selectingMonth(dialArray,dialPercent, uberArray,uberPercent, lyftArray,lyftPercent);
		}
		else {
			showPopUp("Fatal Error With Quarter Comparison!"); //will never get here
		}
	});
}

function showPopUp(text) {
    $('.popup').clearQueue();
    $('.popup').stop();
    $("#myPopup").html(text);
    $('.popup').fadeIn(800).delay(4000).fadeOut(800);
}

function selectingMonth(dialArray,dialPercent, uberArray,uberPercent, lyftArray,lyftPercent){
	console.log(" I am being called ");

	$("#containerYearGraph").val("July");
	$("#containerYearGraph").val("August");
	$("#containerYearGraph").val("September");
	var buttonCall = " ";
	$("#containerYearGraph").click(function() {
		console.log("clicked a button:", buttonCall);
		
		if($('#containerYearGraph').val == "July"){
			buttonCall = "July";
			
			console.log("botton:", buttonCall);
			$('#containerYearGraph').val("August");
			$("#containerYearGraph").val("September");
		}
		if($('#containerYearGraph').val == "August"){
			buttonCall = "August";
			
			console.log("botton:", buttonCall);
			$('#containerYearGraph').val("July");
			$("#containerYearGraph").val("September");
		}
		if($('#containerYearGraph').val == "September"){
			buttonCall = "September";
			
			console.log("botton:", buttonCall);
			$('#containerYearGraph').val("July");
			$("#containerYearGraph").val("August");
		}
		
		comparison_over_yearChart(buttonCall,dialArray,dialPercent, uberArray,uberPercent, lyftArray,lyftPercent);
	});

}

function comparison_over_yearChart(buttonCall,dialArray,dialPercent, uberArray,uberPercent, lyftArray,lyftPercent){
	var weeks;
	var x_Axis;
	buttonCall = "July";
	if(buttonCall == "July"){
		weeks = ["7.1.2014- 7.8.2014","7.9.2014- 7.16.2014","7.16.2014- 7.23.2014","7.24.2014- 7.31.2014" ];
		x_Axis = [ dialArray[0], uberArray[0], lyftArray[0] ];

	}
	if(buttonCall  == "August"){
		weeks = ["8.1.2014- 8.8.2014","8.9.2014- 8.16.2014","8.16.2014- 8.23.2014","8.24.2014- 8.31.2014" ];
		x_Axis = [ dialArray[1], uberArray[1], lyftArray[1] ];
	}
	if(buttonCall == "September"){
		weeks = ["9.1.2014- 9.8.2014","9.9.2014- 9.16.2014","9.16.2014- 9.23.2014","9.24.2014- 9.30.2014" ];
		x_Axis = [ dialArray[2], uberArray[2], lyftArray[2] ];

	}
	



	$('#containerChart').remove();
	$('.containerYearHolder').html('<canvas id="containerYearChart"></canvas>');
	var ctx = document.getElementById('containerYearChart').getContext('2d');

	var bgColor = [
        'rgba(255, 99, 132, 0.2)',
		'rgba(54, 162, 235, 0.2)',
		'rgba(54, 163, 99, 0.2)'
    ];

    var bdColor = [
        'rgba(255, 99, 132, 1)',
		'rgba(54, 162, 235, 1)',
		'rgba(54, 163, 99, 0.2)'
    ];
	//const weeks = ["Week 1","Week 2", "Week 3", "Week 4"];

	var containerYearChart = new Chart(ctx, {
		type: 'line',
		data:{
			
			labels: weeks,
			datasets:[{

				label: 'Dial',
				data: x_Axis[0],
				backgroundColor: bgColor[0],
				borderColor: bdColor[0],
				borderWidth:1
				},
				{
				label: 'Uber',
				data: x_Axis[1],
				backgroundColor: bgColor[1],
				borderColor: bdColor[1],
				borderWidth:1
				},
				{
				label: 'Lyft',
				data: x_Axis[2],
				backgroundColor: bgColor[2],
				borderColor: bdColor[2],
				borderWidth:1
				}
			]
		},
		options: {
			reponsive: true,
			tooltips:{
				mode: 'label',
				intersect: false


			},
			hover:{
				mode: 'label',
				intersect: false 
			},
			legned:{
				display: true,
				position: 'bottom',
				onHover:  
			}

			

		}
	

	});

}