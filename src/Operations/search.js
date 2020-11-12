const analytics = require('../Analytics/analytics.js');
const callInfo = require('../dataFrameClass.js') //call the class File and store in callInfo
const keyClass = require('../keyClass.js')

function searchDataFrame(dataFrame, key, field) { //returns an array of callInfo that matches key
  var tempDF = [];
  let keycls = new keyClass(field, key.toLowerCase());
  tempDF = keycls.keySearch(dataFrame);

  return tempDF;
}

module.exports = { searchDataFrame }//, searchPopulatedCities, searchDaysOfWeek };
