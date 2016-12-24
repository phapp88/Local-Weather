$(document).ready(function() {
  // maps icon from api call to corresponding font awesome icon and margin top
  // and bottom for icon css
  var apiMapping = {
    'clear-day': ['day-sunny', '20px', '10px'],
    'clear-night': ['night-clear', '0', '-10px'],
    'rain': ['rain', '0', '30px'],
    'snow': ['snow', '0', '30px'],
    'sleet': ['sleet', '0', '40px'],
    'wind': ['strong-wind', '0', '0'],
    'fog': ['fog', '0', '30px'],
    'cloudy': ['cloudy', '0', '0'],
    'partly-cloudy-day': ['day-cloudy', '45px', '0'],
    'partly-cloudy-night': ['night-cloudy', '10px', '0'],
    'hail': ['hail', '0', '40px'],
    'thunderstorm': ['thunderstorm', '0', '40px'],
    'tornado': ['tornado', '0', '0']
  };
  var fahrenheit = 0.0;
  var celsius = 0.0;
  var feelsLikeF = 0.0;
  var feelsLikeC = 0.0;
  var fahrenheitBool = true;
  var icon = ""; 
  
  // MAIN
  if (checkChrome() && window.location.protocol !== 'https:') {
    $('#app').html("<h2>Weather App can't get location data. Click <a href='https://codepen.io/phapp88/pen/BzZrbj?editors=1111', target='_blank'>here</a>.</h2>");
  } else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      getWeather(lat, long);
    });
  }
  
  // check if browser is chrome
  function checkChrome() {
    var isChromium = window.chrome,
        winNav = window.navigator,
        vendorName = winNav.vendor,
        isOpera = winNav.userAgent.indexOf('OPR') > -1,
        isIEdge = winNav.userAgent.indexOf('Edge') > -1,
        isIOSChrome = winNav.userAgent.match('CriOS');
    if (isIOSChrome) {
      return true;
    } else if (isChromium !== null && isChromium !== undefined && vendorName === 'Google Inc.'  && isOpera == false && isIEdge == false) {
      return true;
    } else {
      return false;
    }
  };
   
  // get weather & city
  function getWeather(lat, long) {
    var urlWeather = 'https://api.darksky.net/forecast/6cd084abf7d7ebfb8afc9da97f5f2664/'+String(lat)+','+String(long);
    var urlLocation = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+String(lat)+','+String(long)+'&sensor=true';
    $.ajax({
      url: urlWeather,
      dataType: 'jsonp',
      success: function(result) {
        fahrenheit = result.currently.temperature;
        celsius = (fahrenheit - 32.0) * 5.0/9.0;
        feelsLikeF = result.currently.apparentTemperature;
        feelsLikeC = (feelsLikeF - 32.0) * 5.0/9.0;
        var windSpeed = result.currently.windSpeed;
        $('#temp').html(Math.round(fahrenheit) + '<sup>o</sup>');
        $('#feels').html('Feels Like: ' + Math.round(feelsLikeF) + '<sup>o</sup>');
        $('#wind').text('Wind: ' + Math.round(windSpeed) + ' mph');
        var icon = String(result.currently.icon);
        $('#weather-icon').addClass('wi wi-' + apiMapping[icon][0]);
        $('#weather-icon').css({
          'margin-top': apiMapping[icon][1],
          'margin-bottom': apiMapping[icon][2]
        });
      }
    });
    $.getJSON(urlLocation, function(json) {
      var city = json.results[0].address_components[3].long_name;
      var country = json.results[0].address_components[6].long_name;
      $('#city').text(city + ', ' + country);
    });
  };
  
  // handle F/C button
  $('.btn').on('click', function() {
    if (fahrenheitBool) {
      $(this).text('C');
      $('#temp').html(Math.round(celsius) + ' <sup>o</sup>');
      $('#feels').html('Feels Like: ' + Math.round(feelsLikeC) + '<sup>o</sup>');
    } else {
      $(this).text('F');
      $('#temp').html(Math.round(fahrenheit) + ' <sup>o</sup>');
      $('#feels').html('Feels Like: ' + Math.round(feelsLikeF) + '<sup>o</sup>');
    };
    fahrenheitBool = !fahrenheitBool; 
  });
  $('.btn').mouseup(function(){
    $(this).blur();
  });
});