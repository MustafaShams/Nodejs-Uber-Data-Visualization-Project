const e = require("express");

var PopulatedCitiesNY = [];
var PopulatedCitiesNJ = [];
var BusyDaysOfWeek = {};
var TimeOfDay = [];
var ActiveVechicleType = [];

function getPopulationDesign(state){
	if(state == 'ny'){
		if(PopulatedCitiesNY.length > 0){
			return PopulatedCitiesNY;
		}
		else{
			return 0;
		}
	}
	else if(state == 'nj'){
		if(PopulatedCitiesNJ.length > 0){
			return PopulatedCitiesNJ;
		}
		else{
			return 0;
		}
	}
}
function setPopulationDesign(state, data){
	if(state == 'ny'){
		PopulatedCitiesNY = data;
	}
	else if(state == 'nj'){
		PopulatedCitiesNJ = data;
	}
}
function popInc(state, city){
  if(PopulatedCitiesNY.length > 0){
    if(state == "ny"){
			//console.log("increasing ny population")
      index = PopulatedCitiesNY.indexOf(city)
      PopulatedCitiesNY[337 + index] += 1
    }
  }
  if(PopulatedCitiesNJ.length > 0){
    if(state == "nj"){
      index = PopulatedCitiesNJ.indexOf(city)
      PopulatedCitiesNJ[340 + index] += 1
    }
  }
}
function popIncDel(state, city){
	if(PopulatedCitiesNY.length > 0){
    if(state == "ny"){
      index = PopulatedCitiesNY.indexOf(city)
      PopulatedCitiesNY[337 + index] -= 1
    }
  }
  if(PopulatedCitiesNJ.length > 0){
    if(state == "nj"){
      index = PopulatedCitiesNJ.indexOf(city)
      PopulatedCitiesNJ[340 + index] -= 1
    }
  }
}



function setBusyDesign(key, data){
	BusyDaysOfWeek[key] = data;
}
function getBusyDesign(key){
  if(BusyDaysOfWeek.length == 0){
		return 0;
	}
	else{
		return BusyDaysOfWeek[key];
	}
}
function busyInc(date, state, city, address){
  var currDate = new Date(date);
  var index = currDate.getDay()
  if(state in BusyDaysOfWeek){
    BusyDaysOfWeek[state][index] = BusyDaysOfWeek[state][index] +  1;
  }
  if(city in BusyDaysOfWeek){
    BusyDaysOfWeek[city][index] = BusyDaysOfWeek[city][index] +  1;
  }
  if(address in BusyDaysOfWeek){
    BusyDaysOfWeek[address][index] = BusyDaysOfWeek[address][index] +  1;
  }
}
function busyIncDel(date, state, city, address){
  var currDate = new Date(date);
  var index = currDate.getDay()
  if(state in BusyDaysOfWeek){
    BusyDaysOfWeek[state][index] = BusyDaysOfWeek[state][index] -  1;
  }
  if(city in BusyDaysOfWeek){
    BusyDaysOfWeek[city][index] = BusyDaysOfWeek[city][index] -  1;
  }
  if(address in BusyDaysOfWeek){
    BusyDaysOfWeek[address][index] = BusyDaysOfWeek[address][index] -  1;
  }
}

function setTimeOfDayDesign(data){
	TimeOfDay = data;
}
function getTimeOfDayDesign(){
	return TimeOfDay;
}
function timeOfDayInc(time){
  if(TimeOfDay.length > 0){
    var hour = time.split(':')[0];
    if(hour < 6){
      TimeOfDay[0] += 1
    }
    else if(hour < 12){
      TimeOfDay[1] += 1
    }
    else if(hour < 18){
      TimeOfDay[2] += 1
    }
    else if(hour < 24){
      TimeOfDay[3] += 1
    }
  }

}
function timeOfDayDel(time){
  if(TimeOfDay.length > 0){
    var hour = time.split(':')[0];
    if(hour < 6){
      TimeOfDay[0] -= 1
    }
    else if(hour < 12){
      TimeOfDay[1] -= 1
    }
    else if(hour < 18){
      TimeOfDay[2] -= 1
    }
    else if(hour < 24){
      TimeOfDay[3] -= 1
    }
  }

}


function addFHV(date, time, state, city, address){
	popInc(state, city);
	busyInc(date, state, city, address);
  timeOfDayInc(time);
}
function deleteFHV(date, time, state, city, address){
	popIncDel(state, city);
	busyIncDel(date, state, city, address);
  timeOfDayDel(time);
}
function updateFHV(oldData, newData){
 oldData = oldData.split(',')
 newData = newData.split(',')
 deleteFHV(oldData[0],oldData[1], oldData[2], oldData[3], oldData[4])
 addFHV(newData[0],newData[1], newData[2], newData[3], newData[4])
}

function getActiveDesign(){
 return ActiveVechicleType;
}
function setActiveDesign(data){
	ActiveVechicleType = data;
}
function AVinc(type, tempDate, tempVehicle){
  if(ActiveVechicleType.length > 0){
    var index;
    if(type == "uber"){
      index = 1;
    }
    else{
      index = 0;
    }
    var date = new Date(tempDate);
    if (date.getMonth() == 0) {
			if (date.getDate() < 8) {
				ActiveVechicleType[index][0] =  +ActiveVechicleType[index][0] + +tempVehicle;
			}
			else if (date.getDate() < 15) {
				ActiveVechicleType[index][1] =  +ActiveVechicleType[index][1] + +tempVehicle;
			}
			else if (date.getDate() < 22) {
				ActiveVechicleType[index][2] =  +ActiveVechicleType[index][2] + +tempVehicle;
			}
			else if (date.getDate() < 31) {
				ActiveVechicleType[index][3] =  +ActiveVechicleType[index][3] + +tempVehicle;
			}
		}
		//checks month of feb
		else if (date.getMonth() == 1) {
			if (date.getDate() < 8) {
				ActiveVechicleType[index][4] =  +ActiveVechicleType[index][4] + +tempVehicle;
			}
			else if (date.getDate() < 15) {
				ActiveVechicleType[index][5] =  +ActiveVechicleType[index][5] + +tempVehicle;
			}
			else if (date.getDate() < 22) {
				ActiveVechicleType[index][6] =  +ActiveVechicleType[index][6] + +tempVehicle;
			}
			else if (date.getDate() < 31) {
				ActiveVechicleType[index][7] =  +ActiveVechicleType[index][7] + +tempVehicle;
			}
		}
  }
}

function AVincDel(type, tempDate, tempVehicle){
  if(ActiveVechicleType.length > 0){
    var index;
    if(type == "uber"){
      index = 1;
    }
    else{
      index = 0;
    }
    var date = new Date(tempDate);
    if (date.getMonth() == 0) {
			if (date.getDate() < 8) {
				ActiveVechicleType[index][0] =  +ActiveVechicleType[index][0] - +tempVehicle;
			}
			else if (date.getDate() < 15) {
				ActiveVechicleType[index][1] =  +ActiveVechicleType[index][1] - +tempVehicle;
			}
			else if (date.getDate() < 22) {
				ActiveVechicleType[index][2] =  +ActiveVechicleType[index][2] - +tempVehicle;
			}
			else if (date.getDate() < 31) {
				ActiveVechicleType[index][3] =  +ActiveVechicleType[index][3] - +tempVehicle;
			}
		}
		//checks month of feb
		else if (date.getMonth() == 1) {
			if (date.getDate() < 8) {
				ActiveVechicleType[index][4] =  +ActiveVechicleType[index][4] - +tempVehicle;
			}
			else if (date.getDate() < 15) {
				ActiveVechicleType[index][5] =  +ActiveVechicleType[index][5] - +tempVehicle;
			}
			else if (date.getDate() < 22) {
				ActiveVechicleType[index][6] =  +ActiveVechicleType[index][6] - +tempVehicle;
			}
			else if (date.getDate() < 31) {
				ActiveVechicleType[index][7] =  +ActiveVechicleType[index][7] - +tempVehicle;
			}
		}
  }
}

function addAV(type, tempDate, tempVehicle){
	AVinc(type, tempDate, tempVehicle);
}

function delAV(type, tempDate, tempVehicle){
	AVincDel(type, tempDate, tempVehicle);
}

function updateAV(tempOld, tempNew, type){
	oldData = tempOld.split(',');
	newData = tempNew.split(',');
	AVinc(type, newData[0],  newData[1]);
	AVincDel(type,  oldData[0],  oldData[1]);
}

module.exports = 
{
	addFHV,
	deleteFHV,
	updateFHV, 
	addAV,
	delAV,
	updateAV,
	setBusyDesign,
	getBusyDesign,
  setTimeOfDayDesign,
	getTimeOfDayDesign,
	getPopulationDesign,
	setPopulationDesign,
	getActiveDesign,
	setActiveDesign, 
};
