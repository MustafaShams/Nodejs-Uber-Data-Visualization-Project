function timesArtifact() {
    var url = "http://localhost:3000/timePopularity";
    $.get(url, function (data) {
        if (data == "ErrorCode1") {
            showPopUp("Error: Your Entry Was Not Found In Our Database!");
        } else {
            timeRange(data);
                }
        });
}

function timeRange(y_Axis){

    const  x_Axis = ["12:00 AM - 5:59 AM","6:00 AM - 11:59 AM","12:00 PM - 5:59 PM","6:00 PM - 11:59 PM"];

    var bgColor = [
        'rgba(255, 255, 255, 0.3)',
        'rgba(255, 255, 255, 0.3)'
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
                label: "Calls",
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
            legend: {
                display: true,
                text: 'Busiest Days of Week Based on Calls',
                position: 'bottom',
                labels: {
                    fontColor: "white",
                    fontSize: 20,
                },
            },
            title:{
		display: true,
                text: 'What Time of Day is the Busiest',
                fontSize: 20,
                fontColor: "white"
            },
            tooltips: {
                titleFontSize: 25,
                bodyFontSize: 25
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

