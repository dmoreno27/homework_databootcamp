var tableData = data;

var tbody = d3.select("tbody");
var tablearea = d3.select("#table-area");
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

var button = d3.select("#filter-btn");

button.on("click", function () {

  d3.event.preventDefault();
  var inputDateValue = d3.select("#datetime").property("value");
  var inputCityValue = d3.select("#city").property("value");
  var inputStateValue = d3.select("#state").property("value");
  var inputCountryValue = d3.select("#country").property("value");
  var inputShapeValue = d3.select("#shape").property("value");
  tbody.text("");

  if (inputDateValue != "") {
    var filteredDateData = tableData.filter(inputdate => inputdate.datetime === inputDateValue);

  } else {
    var filteredDateData = tableData;
  }

  if (inputCityValue != "") {
    var filteredCityData = filteredDateData.filter(inputcity => inputcity.city === inputCityValue);

  } else {
    var filteredCityData = filteredDateData;
  }

  if (inputStateValue != "") {
    var filteredStateData = filteredCityData.filter(inputstate => inputstate.state === inputStateValue);

  } else {
    var filteredStateData = filteredCityData;
  }

  if (inputCountryValue != "") {
    var filteredCountryData = filteredStateData.filter(inputcountry => inputcountry.country === inputCountryValue);

  } else {
    var filteredCountryData = filteredStateData;
  }

  if (inputShapeValue != "") {
    var filteredShapeData = filteredCountryData.filter(inputshape => inputshape.shape === inputShapeValue);

  } else {
    var filteredShapeData = filteredCountryData;
    console.log(filteredShapeData);
  }
  if (filteredShapeData.length == 0) {
    tablearea.text("No results. Try redefining your search results.");
    console.log("This is working");
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








  // if (inputCityValue != "") {
  //   var filteredCityData = filteredDateData.filter(inputcity => inputcity.city === inputCityValue);

  //   filteredCityData.forEach((filteredCityData) => {
  //     var row = tbody.append("tr");
  //     Object.entries(filteredCityData).forEach(([key, value]) => {
  //       var cell = row.append("td");
  //       cell.text(value);
  //     });
  //   });

  // } else {
  //   var filteredCityData = filteredDateData;
  //   filteredCityData.forEach((filteredCityData) => {
  //     var row = tbody.append("tr");
  //     Object.entries(filteredCityData).forEach(([key, value]) => {
  //       var cell = row.append("td");
  //       cell.text(value);
  //     });
  //   });
  //   }






});






