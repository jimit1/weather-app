$(document).ready(function () {
  var textInput = "";
  // try {
  //   var storeData = JSON.parse(window.localStorage.getItem("storeData"));
  // } catch {
  //   error;
  // }
  var apiKey = "4111e023973fe890e04bc759096a45fd";
  // if (storeData !== null) {
  //   for (var i = 0; i < storeData.length; i++) {
  //     $("#movieList").append(`<li class="oldSearch">${storeData[i]}</li>`);
  //   }
  // }

  // $(document).on("click", ".oldSearch", function () {
  //   var newSearch = $(this).html();
  //   runImbd();
  // });

  // $("#reset").on("click", function () {
  //   window.localStorage.removeItem("storeData");
  //   storeData = null;
  //   window.location.href = "index.html";
  // });

  $("#submitBtn").on("click", function (e) {
    e.preventDefault();

    textInput = $("#textInput").val();
    // if (!storeData) {
    //   storeData = [];
    // }
    // storeData.push(textInput);
    // console.log(storeData);
    // window.localStorage.setItem("storeData", JSON.stringify(storeData));
    // if (storeData !== null) {
    //   var lastItem = storeData.length - 1;
    //   $("#movieList").append(
    //     `<li class="oldSearch">${storeData[storeData.length - 1]}</li>`
    //   );
    // }
    $(".container").html("");
    $("#textInput").val("");
    console.log(textInput);
    runImbd(textInput);
  });

  // function renderInfo(str1, str2, str3, str4) {
  //   $("#title").text(str1);
  //   $("#actors").text(str2);
  //   $("#rated").text(str3);
  //   $("#year").text(str4);
  // }

  function runImbd(str1) {
    $.ajax({
      type: "GET",
      dataType: "json",
      url: `https://api.openweathermap.org/data/2.5/weather?zip=${str1}&appid=${apiKey}`,
    }).then(function (res) {
      console.log(res);
      var cityName = res.name;
      var tempinK = res.main.temp;
      var tempinC = tempinK - 273.15;
      var tempinCel = tempinC.toFixed(2);
      var tempinF = (tempinC * 9) / 5 + 32;
      var tempinFar = tempinF.toFixed(2);
      var humidity = res.main.humidity;
      var kindOfDay = res.weather[0].main;
      $(".container").prepend(`<div>City Name: ${cityName}</div>`);
      $(".container").prepend(`<div>Temperature: ${tempinCel} °C</div>`);
      $(".container").prepend(`<div>Temperature: ${tempinFar} °F</div>`);
      $(".container").prepend(`<div>Humidity: ${humidity}</div>`);
      $(".container").prepend(`<div>What kind of day: ${kindOfDay}</div>`);

      // if (parseInt(res.Year) < 2000) {
      //   $("#classic").text("This is a classic movie");
      // } else {
      //   $("#classic").text("This is a modern movie");
      // }

      // renderInfo(res.Title, res.Actors, res.Rated, res.Year);
    });
  }
});
