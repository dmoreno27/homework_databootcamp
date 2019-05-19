var tableData = data;

var tbody = d3.select("tbody");
var tablearea = d3.select("#ufo-table");
var searchresults = d3.select("#searchresults");

function allData() {
  data.forEach((data) => {
    var row = tbody.append("tr");
    Object.entries(data).forEach(([key, value]) => {
      var cell = row.append("td");
      cell.text(value);
    });
  });
}

allData();

// First Part of Homework */
// var button = d3.select("#filter-btn");

// button.on("click", function() {
  
//   d3.event.preventDefault();
//   var inputElement = d3.select("#datetime");
//   var inputValue = inputElement.property("value");
//   var filteredData = tableData.filter(inputdate => inputdate.datetime === inputValue);
//   tbody.text("");
  
//   if (inputValue != "") {
//   filteredData.forEach((filteredData) => {
//     var row = tbody.append("tr");
//     Object.entries(filteredData).forEach(([key, value]) => {
//       var cell = row.append("td");
//       cell.text(value);
//     });
//   });

// } else {
//   allData();
//   };

// });
// Second Part of Homework */





var button = d3.select("#filter-btn");

button.on("click", function () {

  d3.event.preventDefault();
  var inputDateValue = d3.select("#datetime").property("value").toUpperCase();
  var inputCityValue = d3.select("#city").property("value").toUpperCase();
  var inputStateValue = d3.select("#state").property("value").toUpperCase();
  var inputCountryValue = d3.select("#country").property("value").toUpperCase();
  var inputShapeValue = d3.select("#shape").property("value").toUpperCase();
  tbody.text("");
  searchresults.text("");


  if (inputDateValue != "") {
    var filteredDateData = tableData.filter(inputdate => inputdate.datetime.toUpperCase().includes(inputDateValue));

  } else {
    var filteredDateData = tableData;
  }

  if (inputCityValue != "") {
    var filteredCityData = filteredDateData.filter(inputcity => inputcity.city.toUpperCase().includes(inputCityValue));

  } else {
    var filteredCityData = filteredDateData;
  }

  if (inputStateValue != "") {
    var filteredStateData = filteredCityData.filter(inputstate => inputstate.state.toUpperCase().includes(inputStateValue));

  } else {
    var filteredStateData = filteredCityData;
  }

  if (inputCountryValue != "") {
    var filteredCountryData = filteredStateData.filter(inputcountry => inputcountry.country.toUpperCase().includes(inputCountryValue));

  } else {
    var filteredCountryData = filteredStateData;
  }

  if (inputShapeValue != "") {
    var filteredShapeData = filteredCountryData.filter(inputshape => inputshape.shape.toUpperCase().includes(inputShapeValue));

  } else {
    var filteredShapeData = filteredCountryData;
  }
  
  if (inputDateValue == "" && inputCityValue == "" && inputStateValue == ""&& inputCountryValue == ""&& inputShapeValue == "") {
    allData();

  }
  
  else if (filteredShapeData.length == 0) {
    searchresults.text("No results. Try redefining your search results.");
}

else {

  filteredShapeData.forEach((filteredShapeData) => {
    var row = tbody.append("tr");
    Object.entries(filteredShapeData).forEach(([key, value]) => {
      
      var cell = row.append("td");
      cell.text(value);
    });
  });
}



});






