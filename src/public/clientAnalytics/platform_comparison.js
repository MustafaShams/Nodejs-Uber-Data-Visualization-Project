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
        if (data == "ErrorCode1") {
            showPopUp("Error: Incorrect month format! The ending month must be after the starting month!");
        } else if (data) {
            if (data.length == 0) { //theres nothing inside except separator
                showPopUp("Failed to Compare! Those Months Aren't In Our Data Set"); // cant happen with current setup
            } else {
                var uberArray = data[0];
                var lyftArray = data[1];
                var dateUber = data[2];
                var dateLyft = data[3];
                var labelArr = Object.keys(dateUber);
                var uberDateArr = []
                var lyftDateArr = []
                for (var key in dateUber) {
                    uberDateArr.push(dateUber[key]);
                    lyftDateArr.push(dateLyft[key]);
                }

                separatorObject(uberArray, lyftArray);
                $('#switchGraph').val("Date");
                $( "#switchGraph" ).unbind('click').click(function() {
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

  const uber_Arr = [];
  for (var i = 0; i < sArr.length; ++i){
    var tmp = sArr[i].split(':');
    var sp = tmp.splice(1,1);
    uber_Arr.push(sp[0]);
  }

  const lyft_Arr = [];
  for (var i = 0; i < sArr2.length; ++i){
    var tmp = sArr2[i].split(':');
    var sp = tmp.splice(1,1);
    lyft_Arr.push(sp[0]);
  }

 compareChart("horizontalBar",monthVal, uber_Arr,lyft_Arr);
}

function compareChart(charType, y_Ax, uber_Arr, lyft_Arr) {
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
    return comparisonChart;
}

function showPopUp(text) {
	    $('.popup').clearQueue();
	    $('.popup').stop();
	    $("#myPopup").html(text);
	    $('.popup').fadeIn(800).delay(4000).fadeOut(800);
}
