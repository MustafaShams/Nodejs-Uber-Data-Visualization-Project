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
            //console.log(data);
            //do graph here
            daysChart(data);
            showPopUp("Success");

                }
        });
}

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
                pointRadius: 15,
            }]
        },
        options: {
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
            legend: {
			display: true,
                text: 'Busiest Days of Week Based on Calls',
                position: 'bottom',
                labels: {
                    fontColor: "#FFFFFF",
                    fontSize: 20,
                },
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
