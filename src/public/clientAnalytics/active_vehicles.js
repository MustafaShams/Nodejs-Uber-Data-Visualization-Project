function activeVehicleArtifact(){
    var url = "http://localhost:3000/activeVehicle";
    $.get(url, function (data) {
        if (data == "ErrorCode1") {
            showPopUp("Error: Your Entry Was Not Found In Our Database!");
        } else {
            console.log(data);
            console.log(data[1].length, data[0].length);
            activeVehicleGraph(data[1], data[0]);
                }
        });
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
                position: 'bottom',
                labels: {
                    fontColor: "white",
                    fontSize: 20,
                },
            },
            title:{
                display: true,
                text: 'Number of Active Vehicles Uber vs For Hire Vehicle',
                fontSize: 20,
                fontColor: "white"
            },
            tooltips:{
                                mode: 'label',
                                intersect: false
                        },

        }


    });
    return activeVehicleChart;
}

function showPopUp(text) {
    $('.popup').clearQueue();
    $('.popup').stop();
    $("#myPopup").html(text);
    $('.popup').fadeIn(800).delay(4000).fadeOut(800);
}
