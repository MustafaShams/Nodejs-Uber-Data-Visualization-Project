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

