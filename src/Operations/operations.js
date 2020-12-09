const { remove } = require('jszip');
const callInfo = require('../dataFrameClass.js')
const keyClass = require('../keyClass.js')

function addVehicleData(uberTripFrame, fhvTripFrame, type, date, vehicle, trip) {
        var e = new callInfo();
        Object.assign(e.Date = date);
        Object.assign(e.ActiveVehicle = vehicle);
        Object.assign(e.Trips = trip);
        if(type == "uber"){
                uberTripFrame.unshift(e);
        }
        else if(type == "for-hire vehicle"){
                fhvTripFrame.unshift(e);
        }
        return true;
}

function removeVehicleData(uberTripFrame, fhvTripFrame, type, date, vehicle, trip ){
        if(type == "uber"){
                for(var i = 0; i < uberTripFrame.length; i++){
                        if(uberTripFrame[i].Date == date && uberTripFrame[i].ActiveVehicle == vehicle && uberTripFrame[i].Trips == trip){
                                uberTripFrame.splice(i, 1);
                        }
                }
        }
        else if(type == "for-hire vehicle"){
                for(var i = 0; i < fhvTripFrame.length; i++){
                        if(fhvTripFrame[i].Date == date && fhvTripFrame[i].ActiveVehicle == vehicle && fhvTripFrame[i].Trips == trip){
                                fhvTripFrame.splice(i, 1);
                        }
                }
        }
        return true;
}

function editVehicleData(uberTripFrame, fhvTripFrame, tempOld, tempNew, type){
        var oldData = tempOld.split(',');
        var newData = tempNew.split(',');
        addVehicleData(uberTripFrame, fhvTripFrame, type , newData[0], newData[1], newData[2]);
        removeVehicleData(uberTripFrame, fhvTripFrame, type , oldData[0], oldData[1], oldData[2]);
	return true;
}       

function addData(dataFrame, date, time, state, city, address, tempQuarter) {
        var e = new callInfo();
        if (date == "" || time == "" || state == "" || city == "" || address == "") {
                //console.log("Error not adding anymore");
                return false;
        }
        date = date.toLowerCase();
        time = time.toLowerCase();
        state = state.toLowerCase();
        city = city.toLowerCase();
        address = address.toLowerCase();

        Object.assign(e.Date = date);
        Object.assign(e.Time = time);
        Object.assign(e.State = state);
        Object.assign(e.City = city);
        Object.assign(e.Address = address);
        var index = address.indexOf(" ");
        Object.assign(e.House = address.substr(0, index));
        Object.assign(e.Street = address.substr(index + 1));
        Object.defineProperty(e, "houseNum", {
                enumerable: false
        });
        Object.defineProperty(e, "street", {
                enumerable: false
        });
        dataFrame.push(e);
        date = date.split('.');
        if (tempQuarter != "" && Number(date[0]) <= 9 && Number(date[0]) >= 7) {
                var tempMonth = Number(date[0]) - 7;
                var tempWeek = Number(date[1]);
                var tempIndex = 0;
                for (var i = 0; i < 4; ++i) {
                        tempWeek = tempWeek - 8;
                        if (tempWeek <= 0) {
                                tempIndex = i;
                                break;
                        }
                }
                //console.log("Old tempQuarter: ", tempQuarter[0][tempMonth][tempIndex]);
                tempQuarter[0][tempMonth][tempIndex] = tempQuarter[0][tempMonth][tempIndex] + 1;
                //console.log("New tempQuarter: ", tempQuarter[0][tempMonth][tempIndex]);
        } else {
                //tempQuarter not init
        }
        return true;
}

function addDataLatLon(uberFrame, lyftFrame, addData, tempQuarter, tempCompare) {

        var addition = addData.split(",");
        var e = new callInfo();
        Object.assign(e.Date = addition[0]);
        Object.assign(e.Time = addition[1]);
        Object.assign(e.Lat = addition[2]);
        Object.assign(e.Lon = addition[3]);

        if (addition[4] == "uber") {
                //console.log("Adding Uber", e);
                uberFrame.push(e);
                var tempDate = e.Date.split('.');
                if (tempQuarter != "" && Number(tempDate[0]) <= 9 && Number(tempDate[0]) >= 7) {
                        var tempMonth = Number(tempDate[0]) - 7;
                        var tempWeek = Number(tempDate[1]);
                        var tempIndex = 0;
                        for (var i = 0; i < 4; ++i) {
                                tempWeek = tempWeek - 8;
                                if (tempWeek <= 0) {
                                        tempIndex = i;
                                        break;
                                }
                        }
                        //console.log("Old tempQuarter: ", tempQuarter[1][tempMonth][tempIndex]);
                        tempQuarter[1][tempMonth][tempIndex] = Number(tempQuarter[1][tempMonth][tempIndex]) + 1;
                        //console.log("New tempQuarter: ", tempQuarter[1][tempMonth][tempIndex]);
                } else {
                        //tempQuarter not Init
                }
                if (tempCompare != "" && Number(tempDate[0]) <= 9 && Number(tempDate[0]) >= 7) { //identical to uber delete but its tempCompare[1] not [0]
                        var tempMonth = Number(tempDate[0]) - 7;
                        //console.log("OLD tempCompare: ", tempCompare[0][tempMonth]);
                        var getCompareNum = tempCompare[0][tempMonth].split(' ');
                        getCompareNum[1] = Number(getCompareNum[1]) + 1;
                        getCompareNum = getCompareNum.join().replace(',', " ");
                        tempCompare[0][tempMonth] = getCompareNum;
                        //console.log("New tempCompare: ", tempCompare[0][tempMonth]);
                } else {
                        //tempCompare not Init
                }

        } else {
                //console.log("Adding Lyft", e);
                lyftFrame.push(e);
                var tempDate = e.Date.split('.');
                if (tempQuarter != "" && Number(tempDate[0]) <= 9 && Number(tempDate[0]) >= 7) { //identical to uber delete but its tempCompare[1] not [0]
                        var tempMonth = Number(tempDate[0]) - 7;
                        var tempWeek = Number(tempDate[1]);
                        var tempIndex = 0;
                        for (var i = 0; i < 4; ++i) {
                                tempWeek = tempWeek - 8;
                                if (tempWeek <= 0) {
                                        tempIndex = i;
                                        break;
                                }
                        }
                        //console.log("Old tempQuarter: ", tempQuarter[2][tempMonth][tempIndex]);
                        tempQuarter[2][tempMonth][tempIndex] = Number(tempQuarter[2][tempMonth][tempIndex]) + 1;

                        //console.log("New tempQuarter: ", tempQuarter[2][tempMonth][tempIndex]);
                } else {
                       //tempQuarter not Init
                }
                if (tempCompare != "" && Number(tempDate[0]) <= 9 && Number(tempDate[0]) >= 7) {
                        var tempMonth = Number(tempDate[0]) - 7;
                        //console.log("Old tempCompare: ", tempCompare[1][tempMonth]);
                        var getCompareNum = tempCompare[1][tempMonth].split(' ');
                        getCompareNum[1] = Number(getCompareNum[1]) + 1;
                        getCompareNum = getCompareNum.join().replace(',', " ");
                        tempCompare[1][tempMonth] = getCompareNum;
                        //console.log("New tempCompare: ", tempCompare[1][tempMonth]);
                } else {
                        //tempCompare not Init
                }
        }
        return true;
}

function deleteData(dataFrame, date, time, state, city, address, tempQuarter) {
        for (var i = 0; i < dataFrame.length; ++i) {
                if (date == dataFrame[i].Date && time == dataFrame[i].Time && state == dataFrame[i].State && city == dataFrame[i].City && address == dataFrame[i].Address) {
                        dataFrame.splice(i, 1); //.splice(index, how many to delete)
                        var tempDate = date.split('.');
                        if (tempQuarter != "" && Number(tempDate[0]) <= 9 && Number(tempDate[0]) >= 7) {
                                var tempMonth = Number(tempDate[0]) - 7;
                                var tempWeek = Number(tempDate[1]);
                                var tempIndex = 0;
                                for (var i = 0; i < 4; ++i) {
                                        tempWeek = tempWeek - 8;
                                        if (tempWeek <= 0) {
                                                tempIndex = i;
                                                break;
                                        }
                                }
                                //console.log("Old tempQuarter: ", tempQuarter[0][tempMonth][tempIndex]);
                                tempQuarter[0][tempMonth][tempIndex] = tempQuarter[0][tempMonth][tempIndex] - 1;
                                //console.log("New tempQuarter: ", tempQuarter[0][tempMonth][tempIndex]);
                        } else {
                                //tempQuarter not Init
                        }
                        return true;
                }
        }
        return false;
}

function deleteDataLatLon(uberFrame, lyftFrame, del, tempQuarter, tempCompare) {
        var deleteData = del.split(",");
        if (deleteData[4] == "uber") { //uber
                for (var i = 0; i < uberFrame.length; ++i) {
                        if (deleteData[0] == uberFrame[i].Date && deleteData[1] == uberFrame[i].Time && deleteData[2] == uberFrame[i].Lat && deleteData[3] == uberFrame[i].Lon) {
                                uberFrame.splice(i, 1); //.splice(index, how many to delete)
                                var tempDate = deleteData[0].split('.');
                                if (tempQuarter != "" && Number(tempDate[0]) <= 9 && Number(tempDate[0]) >= 7) {
                                        var tempMonth = Number(tempDate[0]) - 7;
                                        var tempWeek = Number(tempDate[1]);
                                        var tempIndex = 0;
                                        for (var i = 0; i < 4; ++i) {
                                                tempWeek = tempWeek - 8; //day for week
                                                if (tempWeek <= 0) {
                                                        tempIndex = i;
                                                        break;
                                                }
                                        }
                                        //console.log("OLD tempQuarter: ", tempQuarter[1][tempMonth][tempIndex]);
                                        tempQuarter[1][tempMonth][tempIndex] = tempQuarter[1][tempMonth][tempIndex] - 1;
                                        //console.log("New tempQuarter: ", tempQuarter[1][tempMonth][tempIndex]);
                                } else {
                                        //tempQuarter not Init
                                }

                                if (tempCompare != "" && Number(tempDate[0]) <= 9 && Number(tempDate[0]) >= 7) {
                                        var tempMonth = Number(tempDate[0]) - 7;
                                        //console.log("OLD tempCompare: ", tempCompare[0][tempMonth]);
                                        var getCompareNum = tempCompare[0][tempMonth].split(' ');
                                        getCompareNum[1] = Number(getCompareNum[1]) - 1;
                                        getCompareNum = getCompareNum.join().replace(',', " ");
                                        tempCompare[0][tempMonth] = getCompareNum;
                                        //console.log("New tempCompare: ", tempCompare[0][tempMonth]);
                                } else {
                                        //tempCompare not Init
                                }
                                return true;
                        }
                }
        } else { //lyft
                for (var i = 0; i < lyftFrame.length; ++i) {
                        if (deleteData[0] == lyftFrame[i].Date && deleteData[1] == lyftFrame[i].Time && deleteData[2] == lyftFrame[i].Lat && deleteData[3] == lyftFrame[i].Lon) {
                                lyftFrame.splice(i, 1); //.splice(index, how many to delete)
                                var tempDate = deleteData[0].split('.');
                                if (tempQuarter != "" && Number(tempDate[0]) <= 9 && Number(tempDate[0]) >= 7) { //identical to uber delete but its tempCompare[1] not [0]
                                        var tempMonth = Number(tempDate[0]) - 7;
                                        var tempWeek = Number(tempDate[1]);
                                        var tempIndex = 0;
                                        for (var i = 0; i < 4; ++i) {
                                                tempWeek = tempWeek - 8;
                                                if (tempWeek <= 0) {
                                                        tempIndex = i;
                                                        break;
                                                }
                                        }
                                        //console.log("Old tempQuarter: ", tempQuarter[2][tempMonth][tempIndex]);
                                        tempQuarter[2][tempMonth][tempIndex] = tempQuarter[2][tempMonth][tempIndex] - 1;
                                        //console.log("New tempQuarter: ", tempQuarter[2][tempMonth][tempIndex]);
                                } else {
                                        //tempQuarter not Init
                                }
                                if (tempCompare != "" && Number(tempDate[0]) <= 9 && Number(tempDate[0]) >= 7) {
                                        var tempMonth = Number(tempDate[0]) - 7;
                                        //console.log("OLD tempCompare: ", tempCompare[1][tempMonth]);
                                        var getCompareNum = tempCompare[1][tempMonth].split(' ');
                                        getCompareNum[1] = Number(getCompareNum[1]) - 1;
                                        getCompareNum = getCompareNum.join().replace(',', " ");
                                        tempCompare[1][tempMonth] = getCompareNum;
                                        //console.log("New tempCompare: ", tempCompare[1][tempMonth]);
                                } else {
                                        //tempCompare not Init
                                }
                                return true;
                        }
                }
        }
        return false;
}

function editData(dataFrame, tempOld, tempNew, tempQuarter) {
        var editOld = tempOld.split(",");
        var editNew = tempNew.split(",");
        for (var i = 0; i < dataFrame.length; ++i) {
                if (editOld[0] == dataFrame[i].Date && editOld[1] == dataFrame[i].Time && editOld[2] == dataFrame[i].State && editOld[3] == dataFrame[i].City && editOld[4] == dataFrame[i].Address) {
                        var tempDate = dataFrame[i].Date.split('.');
                        var addDate = editNew[0].split('.');
                        dataFrame[i].Date = editNew[0].toLowerCase();
                        dataFrame[i].Time = editNew[1].toLowerCase();
                        dataFrame[i].State = editNew[2].toLowerCase();
                        dataFrame[i].City = editNew[3].toLowerCase();
                        dataFrame[i].Address = editNew[4].toLowerCase();
                        var index = editNew[4].indexOf(" ");
                        dataFrame[i].House = editNew[4].substr(0, index).toLowerCase();
                        dataFrame[i].Street = editNew[4].substr(index + 1).toLowerCase();
                        if (tempQuarter != "") {
                                if (Number(tempDate[0]) <= 9 && Number(tempDate[0]) >= 7) {
                        	/* -------------------------- Delete ----------------------------------*/
                                        var dtempMonth = Number(tempDate[0]) - 7;
                                        var dtempWeek = Number(tempDate[1]);
                                        var dtempIndex = 0;
                                        for (var i = 0; i < 4; ++i) {
                                                dtempWeek = dtempWeek - 8;
                                                if (dtempWeek <= 0) {
                                                        dtempIndex = i;
                                                        break;
                                                }
                                        }
                                        tempQuarter[0][dtempMonth][dtempIndex] = tempQuarter[0][dtempMonth][dtempIndex] - 1;
                                }
                                /* ----------------------------- Add ----------------------------------*/
                                if (Number(addDate[0]) <= 9 && Number(addDate[0]) >= 7) {
                                        var atempMonth = Number(addDate[0]) - 7;
                                        var atempWeek = Number(addDate[1]);
                                        var atempIndex = 0;
                                        for (var i = 0; i < 4; ++i) {
                                                atempWeek = atempWeek - 8;
                                                if (atempWeek <= 0) {
                                                        atempIndex = i;
                                                        break;
                                                }
                                        }
                                        tempQuarter[0][atempMonth][atempIndex] = tempQuarter[0][atempMonth][atempIndex] + 1;
                                }
                        }
                        return true;
                }
        }
        return false;
}

function editLatLonData(uberFrame, lyftFrame, tempOld, tempNew, tempQuarter, tempCompare) {
        var editOld = tempOld.split(",");
        var editNew = tempNew.split(",");
        if (editOld[4] == "uber") {
                for (var i = 0; i < uberFrame.length; ++i) {
                        if (editOld[0] == uberFrame[i].Date && editOld[1] == uberFrame[i].Time && editOld[2] == uberFrame[i].Lat && editOld[3] == uberFrame[i].Lon) {
                                var tempDate = editOld[0].split('.');
                                var addDate = editNew[0].split('.');
                                uberFrame[i].Date = editNew[0].toLowerCase();
                                uberFrame[i].Time = editNew[1].toLowerCase();
                                uberFrame[i].Lat = editNew[2].toLowerCase();
                                uberFrame[i].Lon = editNew[3].toLowerCase();
                                // -------------------------------- Delete -----------------------------------//
                                if (tempQuarter != "") {
                                        if (Number(tempDate[0]) <= 9 && Number(tempDate[0]) >= 7) {
                                                var dtempMonth = Number(tempDate[0]) - 7;
                                                var dtempWeek = Number(tempDate[1]);
                                                var dtempIndex = 0;
                                                for (var i = 0; i < 4; ++i) {
                                                        dtempWeek = dtempWeek - 8; //day for week
                                                        if (dtempWeek <= 0) {
                                                                dtempIndex = i;
                                                                break;
                                                        }
                                                }
                                                tempQuarter[1][dtempMonth][dtempIndex] = Number(tempQuarter[1][dtempMonth][dtempIndex]) - 1;
                                        }
                                        //----------------------------------- ADD -----------------------------------//
                                        if (Number(addDate[0]) <= 9 && Number(addDate[0]) >= 7) {
                                                var atempMonth = Number(addDate[0]) - 7;
                                                var atempWeek = Number(addDate[1]);
                                                var atempIndex = 0;
                                                for (var i = 0; i < 4; ++i) {
                                                        atempWeek = atempWeek - 8;
                                                        if (atempWeek <= 0) {
                                                                atempIndex = i;
                                                                break;
                                                        }
                                                }
                                                tempQuarter[1][atempMonth][atempIndex] = Number(tempQuarter[1][atempMonth][atempIndex]) + 1;
                                        }
                                } else {
                                       //tempQuarter not Init
                                }
                                var deleteDate = editOld[0].split('.');
                                var addDate = editNew[0].split('.');
                                if (tempCompare != "") {
                                        // -------------------------------- Delete -----------------------------------//
                                        if (Number(deleteDate[0]) <= 9 && Number(deleteDate[0]) >= 7) {
                                                var dtempMonth = Number(deleteDate[0]) - 7;
                                                var getCompareNum = tempCompare[0][dtempMonth].split(' ');
                                                getCompareNum[1] = Number(getCompareNum[1]) - 1;
                                                getCompareNum = getCompareNum.join().replace(',', " ");
                                                tempCompare[0][dtempMonth] = getCompareNum;
                                        }
                                        //----------------------------------- ADD -----------------------------------//
                                        if (Number(addDate[0]) <= 9 && Number(addDate[0]) >= 7) {
                                                var atempMonth = Number(addDate[0]) - 7;
                                                var getCompareNum = tempCompare[0][atempMonth].split(' ');
                                                getCompareNum[1] = Number(getCompareNum[1]) + 1;
                                                getCompareNum = getCompareNum.join().replace(',', " ");
                                                tempCompare[0][atempMonth] = getCompareNum;
                                        }
                                } else {
                                        //tempCompare not Init
                                }
                                return true;
                        }
                }
        } else {
                for (var i = 0; i < lyftFrame.length; ++i) {
                        if (editOld[0] == lyftFrame[i].Date && editOld[1] == lyftFrame[i].Time && editOld[2] == lyftFrame[i].Lat && editOld[3] == lyftFrame[i].Lon) {
                                lyftFrame[i].Date = editNew[0].toLowerCase();
                                lyftFrame[i].Time = editNew[1].toLowerCase();
                                lyftFrame[i].Lat = editNew[2].toLowerCase();
                                lyftFrame[i].Lon = editNew[3].toLowerCase();
                                var tempDate = editOld[0].split('.');
                                var addDate = editNew[0].split('.');
                                if (tempQuarter != "") {
                                        // -------------------------------- Delete -----------------------------------//
                                        if (Number(tempDate[0]) <= 9 && Number(tempDate[0]) >= 7) {
                                                var dtempMonth = Number(tempDate[0]) - 7;
                                                var dtempWeek = Number(tempDate[1]);
                                                var dtempIndex = 0;
                                                for (var i = 0; i < 4; ++i) {
                                                        dtempWeek = dtempWeek - 8; //day for week
                                                        if (dtempWeek <= 0) {
                                                                dtempIndex = i;
                                                                break;
                                                        }
                                                }
                                                tempQuarter[2][dtempMonth][dtempIndex] = Number(tempQuarter[2][dtempMonth][dtempIndex]) - 1;
                                        }
                                        //----------------------------------- ADD -----------------------------------//
                                        if (Number(addDate[0]) <= 9 && Number(addDate[0]) >= 7) {
                                                var atempMonth = Number(addDate[0]) - 7;
                                                var atempWeek = Number(addDate[1]);
                                                var atempIndex = 0;
                                                for (var i = 0; i < 4; ++i) {
                                                        atempWeek = atempWeek - 8;
                                                        if (atempWeek <= 0) {
                                                                atempIndex = i;
                                                                break;
                                                        }
                                                }
                                                tempQuarter[2][atempMonth][atempIndex] = Number(tempQuarter[2][atempMonth][atempIndex]) + 1;
                                        }
                                } else {
                                      //tempQuarter not Init
                                }
                                var deleteDate = editOld[0].split('.');
                                var addDate = editNew[0].split('.');
                                if (tempCompare != "") {
                                        // -------------------------------- Delete -----------------------------------//
                                        if (Number(tempDate[0]) <= 9 && Number(tempDate[0]) >= 7) {
                                                var dtempMonth = Number(deleteDate[0]) - 7;
                                                var getCompareNum = tempCompare[1][dtempMonth].split(' ');
                                                getCompareNum[1] = Number(getCompareNum[1]) - 1;
                                                getCompareNum = getCompareNum.join().replace(',', " ");
                                                tempCompare[1][dtempMonth] = getCompareNum;
                                        }
                                        //----------------------------------- ADD -----------------------------------//
                                        if (Number(addDate[0]) <= 9 && Number(addDate[0]) >= 7) {
                                                var atempMonth = Number(addDate[0]) - 7;
                                                var getCompareNum = tempCompare[1][atempMonth].split(' ');
                                                getCompareNum[1] = Number(getCompareNum[1]) + 1;
                                                getCompareNum = getCompareNum.join().replace(',', " ");
                                                tempCompare[1][atempMonth] = getCompareNum;
                                        }
                                } else {
                                        //tempCompare not Init
                                }
                                return true;
                        }
                }
        }

        return false;
}

module.exports = {
        addData,
        deleteData,
        editData,
        editLatLonData,
        deleteDataLatLon,
        addDataLatLon,
        addVehicleData,
        removeVehicleData,
        editVehicleData
};
