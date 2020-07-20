const beanstalk_url =
  "http://dollarapp-env.eba-ynjfpvtw.us-east-1.elasticbeanstalk.com/";

document.addEventListener("DOMContentLoaded", function (event) {
  var dollarRate, euroRate, poundRate;
  fetch(beanstalk_url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      dollarRate = document.getElementById("dollarRate");
      euroRate = document.getElementById("euroRate");
      poundRate = document.getElementById("poundRate");
      dollarRate.innerHTML = data.dollarRate;
      euroRate.innerHTML = data.euroRate;
      poundRate.innerHTML = data.poundRate;
    });
});
