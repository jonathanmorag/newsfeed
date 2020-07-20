const url =
  "https://kqueq164e0.execute-api.us-east-1.amazonaws.com/default/getWeather";

document.addEventListener("DOMContentLoaded", function (event) {
  var temperature;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      temperature = data.main.temp;
      var tempFromView = document.getElementById("temperature");
      tempFromView.innerHTML = temperature + "°c";
    });
});
