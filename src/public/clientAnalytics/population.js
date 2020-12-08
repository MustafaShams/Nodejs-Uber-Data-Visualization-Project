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
                var separatorIndex = data.indexOf("SEPARATOR");
                var citiesInState = data.slice(0, separatorIndex);
                var citiesCount = data.slice(separatorIndex + 1);
                data = sortAArray(citiesInState, citiesCount);
                //console.log("Unique City Array: ", citiesInState);
                //console.log("Number of Calls from City Array: ", citiesCount);
                if (citiesInState != 0 && citiesCount != 0) {


                citiesInState = citiesInState.slice(0, 35);
                citiesCount = citiesCount.slice(0, 35);

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

function citiesChart(x_Axis,y_Axis){
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
                    label: "Calls",
                    data: y_Axis,
                    backgroundColor: bgColor[0],
                    borderColor: bdColor[0],
                    fill: false,
                    pointRadius:15,
                    showLine: false,
                    pointHoverRadius: 15,
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    gridLines: {
                        color: "rgba(255,255,255,.2)"
                    },
                    ticks: {
                        fontSize: 18,
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
            responsive: true,
            title:{
		display: true,
                text: 'Number of calls per city',
                fontSize: 20,
                fontColor: "white"
            },
             legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: "white",
                }
             },
             tooltips: {
                titleFontSize: 25,
                bodyFontSize: 25
              }
        }

    });

}
