$(document).ready(function () {
    getQuarterCompare();
});

function getQuarterCompare() {
	$(".loader").show();
	var url = "http://localhost:3000/quarterPopularity";
	$.get(url, function (data) {
		if (data) {
			var dialPercent = data[3];
			var uberPercent = data[4];
			var lyftPercent = data[5];  	// [0, null, null, null]
			lyftPercent[0] = [0, 0, 0, 0,]; // first month of lyft data contains few values so it is omitted
			var dialArray = [].concat.apply([], data[0]);
			var uberArray = [].concat.apply([], data[1]);
			var lyftArray = [].concat.apply([], data[2]);
			dialPercent = [].concat.apply([], data[3]);
			uberPercent = [].concat.apply([], data[4]);
			lyftPercent = [].concat.apply([], data[5]);
			selectingMonth(["July","August","September"], dialArray,dialPercent, uberArray,uberPercent, lyftArray,lyftPercent)
			showPopUp("Success!");
			$(".loader").hide();
			$('input[type="checkbox"]').click(function(){
				var checkedArray = []
				$('.chk:checkbox:checked').each(function () {
					checkedArray.push(this.value);
				 });
				 
				 selectingMonth(checkedArray, dialArray,dialPercent, uberArray,uberPercent, lyftArray,lyftPercent)
			});
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

function selectingMonth(months, dialArray,dialPercent, uberArray,uberPercent, lyftArray,lyftPercent){
	//console.log(" I am being called ");
	var firstMonth = months[0] 
	var lastMonth = months[months.length - 1];
	//console.log(firstMonth, lastMonth);
	var begin = 0;
	var end = 0;
	switch(firstMonth){
		case "July":
			begin = 0;
			break;
		case "August":
			begin = 4;
			break;
		case "September":
			begin = 8;
			break;
	}
	switch(lastMonth){
		case "July":
			end = 4;
			break;
		case "August":
			end = 8;
			break;
		case "September":
			end = 12;
			break;
	}
	var x_Axis = ["7.1.2014- 7.8.2014","7.9.2014- 7.16.2014","7.16.2014- 7.23.2014","7.24.2014- 7.31.2014",
								"8.1.2014- 8.8.2014","8.9.2014- 8.16.2014","8.16.2014- 8.23.2014","8.24.2014- 8.31.2014",
								"9.1.2014- 9.8.2014","9.9.2014- 9.16.2014","9.16.2014- 9.23.2014","9.24.2014- 9.30.2014" ];
		
	comparison_over_yearChart(x_Axis.slice(begin,end),dialArray.slice(begin,end),dialPercent.slice(begin,end), uberArray.slice(begin,end),uberPercent.slice(begin,end), lyftArray.slice(begin,end),lyftPercent.slice(begin,end));

}

function comparison_over_yearChart(x_Axis,dialArray,dialPercent, uberArray,uberPercent, lyftArray,lyftPercent){
	//console.log("Creating chart")
	var weeks;
	



	$('#containerYearChart').remove();
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

	var containerYearChart = new Chart(ctx, {
		type: 'line',
		data:{
			
			labels: x_Axis,
			datasets:[{

				label: 'Dial',
				data: dialArray,
				backgroundColor: bgColor[0],
				borderColor: bdColor[0],
				borderWidth:1
				},
				{
				label: 'Uber',
				data: uberArray,
				backgroundColor: bgColor[1],
				borderColor: bdColor[1],
				borderWidth:1
				},
				{
				label: 'Lyft',
				data: lyftArray,
				backgroundColor: bgColor[2],
				borderColor: bdColor[2],
				borderWidth:1
				}
			]
		},
		options: {
			reponsive: true,
			maintainAspectRatio: false,
			scales: {
				xAxes: [{
						gridLines: {
								color: "rgba(255,255,255,.2)"
						},
						ticks: {
								fontSize: 20,
								fontColor: "white"
						}
				}],
				yAxes: [{
						gridLines: {
								color: "rgba(255,255,255,.2)"
						},
						ticks: {
								fontSize: 20,
								fontColor: "white"
						}
				}]
		},
			tooltips:{
				mode: 'label',
				intersect: false


			},
			tooltips: {
				callbacks: {
					title: function(tooltipItem, data) {
						return data['labels'][tooltipItem[0]['index']];
					},
					label: function(tooltipItem, data) {
						////console.log(tooltipItem['index']);
						////console.log(data['datasets'][0].data[tooltipItem['index']]);
						var outputString = [];
						data['datasets'].forEach(function(element){
							outputString.push(element.label + ": " + element.data[tooltipItem['index']]);
						});
						return outputString;
					},
					afterLabel: function(tooltipItem, data) {
						var percentString = [];
						percentString = getPercentageString(tooltipItem['index'], dialPercent, uberPercent, lyftPercent);
						return percentString;
					}
				},
				titleFontSize: 16,
				bodyFontSize: 14,
				displayColors: false
			},
			hover:{
				mode: 'label',
				intersect: false 
			},
			legend:{
				display: true,
				position: 'bottom',
				labels: {
					fontColor: "#FFFFFF",
					fontSize: 20,
			},
			},
			title:{
				display: true,
				text: 'Popularity of Different Kinds of Vehicles Over Time',
				fontSize: 20,
				fontColor: "white"
		},

		}
	

	});

}

function getPercentageString(index, dialPercent, uberPercent, lyftPercent){
	var percentString = [];
	var dialString = "Dial: "
	var uberString = "Uber: "
	var lyftString = "Lyft: "
	if(dialPercent[index] > 0){
		dialString += dialPercent[index].toFixed(2) + '% Increase'; 
	}
	else if(dialPercent[index] < 0){
		dialString += Math.abs(dialPercent[index].toFixed(2)) + '% Decrease'; 
	}
	else if(dialPercent[index] == 0){
		dialString += "No % Change"; 
	}
	
	if(uberPercent[index] > 0){
		uberString += uberPercent[index].toFixed(2) + '% Increase'; 
	}
	else if(uberPercent[index] < 0){
		uberString += Math.abs(uberPercent[index].toFixed(2)) + '% Decrease'; 
	}
	else if(uberPercent[index] == 0){
		uberString += "No % Change"; 
	}

	if(lyftPercent[index] > 0){
		lyftString += lyftPercent[index].toFixed(2) + '% Increase'; 
	}
	else if(lyftPercent[index] < 0){
		lyftString += Math.abs(lyftPercent[index].toFixed(2)) + '% Decrease'; 
	}
	else if(lyftPercent[index] == 0){
		lyftString += "No % Change"; 
	}
	percentString.push(dialString);
	percentString.push(uberString);
	percentString.push(lyftString);
	return percentString;

}