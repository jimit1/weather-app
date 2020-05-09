$(document).ready(function () {
  var textInput = "";
  try {
    var storeData = JSON.parse(window.localStorage.getItem("storeData"));
  } catch {
    error;
  }
  var apiKey = "4111e023973fe890e04bc759096a45fd";
  var icon = "";

  if (storeData !== null) {
    for (var i = 0; i < storeData.length; i++) {
      $("#listItem").prepend(
        `<li class="list-group-item oldSearch" data-id="${storeData.indexOf(
          storeData[i]
        )}">${storeData[i]}</li>`
      );
    }
  }

  function runWeather(cityName) {
    $.ajax({
      type: "GET",
      dataType: "json",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`,
    }).then(function (res) {
      checkWeather(res.name, res.coord.lat, res.coord.lon);
    });
  }

  function timeConverter(UNIX) {
    var a = new Date(UNIX * 1000);
    var time = [{}];
    var amPm = "am";
    time.year = a.getFullYear();
    time.month = a.getMonth();
    time.day = a.getDate();
    time.date = time.month + "/" + time.day + "/" + time.year;
    time.hour = a.getHours();
    if (time.hour > 12) {
      time.hour = time.hour - 12;
      amPm = "pm";
    }
    time.min = a.getMinutes();
    if (time.min.toString().length === 1) {
      time.min = "0" + time.min;
    }
    time.sec = a.getSeconds();
    time.clock = time.hour + ":" + time.min + " " + amPm;
    return time;
  }

  function checkWeather(cityName, lat, lon) {
    $.ajax({
      type: "GET",
      dataType: "json",
      url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`,
    }).then(function (res) {
      render(cityName, res);
    });
  }
  function render(cityName, res) {
    console.log(res);
    icon = res.current.weather[0].icon;
    $(".right-panel").html("");
    $(".right-panel").prepend(
      `<div class="card" style="max-width: 49rem;">
            <div class="card-body">
            <div class="inline-flex">
              <h5 class="card-title">${cityName} (${
        timeConverter(res.current.dt).date
      })</h5><img style="float:left" src="http://openweathermap.org/img/wn/${icon}@2x.png"/></div>
              <div class="card-text">Temperature: ${(
                (res.current.temp - 273.15) * 1.8 +
                32
              ).toFixed(2)} °F</div>
              <div class="card-text">Humidity: ${res.current.humidity} %</div>
              <div class="card-text">Wind Speed: ${
                res.current.wind_speed
              } MPH</div>
              <div class="card-text">UV Index: ${res.current.uvi}</div>
            </div>
          </div><h3 class="pt-3">5-Day Forecast:</h3><div class="row" id="forecast"></div>`
    );
    for (var i = 1; i < 6; i++) {
      icon = res.daily[i].weather[0].icon;
      $("#forecast").append(`
      <div class="card ml-3 mb-3" style="max-width: 9rem;">
        <div class="card-body bg-dark text-light">
          <h5 class="card-title">${timeConverter(res.daily[i].dt).date}</h5>
          <div class="card-text"><img src="http://openweathermap.org/img/wn/${icon}@2x.png"/></div>
          <div class="card-text">${(
            (res.daily[i].temp.day - 273.15) * 1.8 +
            32
          ).toFixed(2)} °F</div>
          <div class="card-text">Humidity:${res.daily[i].humidity}%</div>
        
      </div>
    </div>`);
    }
  }

  $("#submitBtn").on("click", function (e) {
    e.preventDefault();
    textInput = $("#textInput").val();
    if (!storeData) {
      storeData = [];
    }
    storeData.push(textInput);
    console.log(storeData);
    window.localStorage.setItem("storeData", JSON.stringify(storeData));
    if (storeData !== null) {
      $("#listItem").prepend(
        `<li class="list-group-item oldSearch" data-id="${storeData.indexOf(
          storeData[storeData.length - 1]
        )}">${storeData[storeData.length - 1]}</li>`
      );
    }
    $("#textInput").val("");
    runWeather(textInput);
  });

  $("#reset").on("click", function () {
    window.localStorage.removeItem("storeData");
    storeData = null;
    window.location.href = "index.html";
  });

  $(document).on("click", ".oldSearch", function () {
    var getDataId = $(this).attr("data-id");
    var oldSearch = storeData[getDataId];
    runWeather(oldSearch);
  });
});
