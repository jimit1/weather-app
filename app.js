$(document).ready(function () {
  var textInput = "";
  try {
    var storeData = JSON.parse(window.localStorage.getItem("storeData"));
  } catch {
    error;
  }
  var apiKey = "4111e023973fe890e04bc759096a45fd";

  if (storeData !== null) {
    for (var i = 0; i < storeData.length; i++) {
      $("#listItem").prepend(
        `<li class="list-group-item oldSearch" data-id="${storeData.indexOf(
          storeData[i]
        )}">${storeData[i]}</li>`
      );
    }
    var lastIndex = storeData.length - 1;
    runWeather(storeData[lastIndex]);
  }

  function runWeather(cityName) {
    $.ajax({
      type: "GET",
      dataType: "json",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`,
    }).then(function (res) {
      checkWeather(res.name, res.coord.lat, res.coord.lon);
      return res.name;
    });
  }

  function timeConverter(UNIX) {
    var a = new Date(UNIX * 1000);
    var date = a.getMonth() + "/" + a.getDate() + "/" + a.getFullYear();
    return date;
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
    var uvI = parseInt(res.current.uvi);
    $(".right-panel").html("");
    $(".right-panel").prepend(
      `<div class="card" style="max-width: 49rem;">
            <div class="card-body">
            <div class="inline-flex">
              <h5 class="card-title">${cityName} (${timeConverter(
        res.current.dt
      )})</h5><img style="float:left" src="http://openweathermap.org/img/wn/${
        res.current.weather[0].icon
      }@2x.png"/></div>
              <div class="card-text">Temperature: ${(
                (res.current.temp - 273.15) * 1.8 +
                32
              ).toFixed(2)} °F</div>
              <div class="card-text">Humidity: ${res.current.humidity} %</div>
              <div class="card-text">Wind Speed: ${
                res.current.wind_speed
              } MPH</div>
              <div class="card uvI">UV Index: ${uvI}</div>
            </div>
          </div><h3 class="pt-3">5-Day Forecast:</h3><div class="row" id="forecast"></div>`
    );
    checkuvI(uvI);
    for (var i = 1; i < 6; i++) {
      $("#forecast").append(`
      <div class="card ml-3 mb-3" style="max-width: 9rem;">
        <div class="card-body bg-dark text-light">
          <h5 class="card-title">${timeConverter(res.daily[i].dt)}</h5>
          <div class="card-text"><img src="http://openweathermap.org/img/wn/${
            res.daily[i].weather[0].icon
          }@2x.png"/></div>
          <div class="card-text">T: ${(
            (res.daily[i].temp.day - 273.15) * 1.8 +
            32
          ).toFixed(2)} °F</div>
          <div class="card-text">Humidity:${res.daily[i].humidity}%</div>
        
      </div>
    </div>`);
    }
  }

  function checkuvI(uvI) {
    if (uvI > 3 && uvI < 5) {
      $(".uvI").attr("style", "background-color: yellow");
    }
    if (uvI < 7) {
      $(".uvI").attr("style", "background-color: orange");
    }
    if (uvI <= 10) {
      $(".uvI").attr("style", "background-color: red");
    }
    if (uvI > 10) {
      $(".uvI").attr("style", "background-color: violet");
    }
  }

  $("#submitBtn").on("click", function (e) {
    e.preventDefault();
    textInput = $("#textInput").val();
    $("#textInput").val("");
    if (!storeData) {
      storeData = [];
    }
    storeData.push(textInput);
    window.localStorage.setItem("storeData", JSON.stringify(storeData));
    if (storeData !== null) {
      $("#listItem").prepend(
        `<li class="list-group-item oldSearch" data-id="${storeData.indexOf(
          storeData[storeData.length - 1]
        )}">${storeData[storeData.length - 1]}</li>`
      );
    }
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
