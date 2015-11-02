/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');

var window = new UI.Window({ fullscreen: true, scrollable: true });

var pointText = new UI.Text({
  position: new Vector2(0, 0),
  size: new Vector2(144, 30),
  textAlign: 'center',
  font: 'gothic-24-bold',
  text: 'Loading...',
  color: 'black',
  backgroundColor: 'white'
});

var dtText = new UI.Text({
  position: new Vector2(0, 35),
  size: new Vector2(144, 20),
  textAlign: 'center',
  font: 'gothic-18',
  text: '',
});

var tempText = new UI.Text({
  position: new Vector2(0, 60),
  size: new Vector2(144, 20),
  textAlign: 'left',
  font: 'gothic-18',
  text: ''
});

var rainText = new UI.Text({
  position: new Vector2(0, 85),
  size: new Vector2(144, 20),
  textAlign: 'left',
  font: 'gothic-18',
  text: ''
});

var windDirText = new UI.Text({
  position: new Vector2(0, 110),
  size: new Vector2(144, 20),
  textAlign: 'left',
  font: 'gothic-18',
  text: ''
});

var windSpeedText = new UI.Text({
  position: new Vector2(0, 135),
  size: new Vector2(144, 20),
  textAlign: 'left',
  font: 'gothic-18',
  text: ''
});


var sunText = new UI.Text({
  position: new Vector2(0, 160),
  size: new Vector2(144, 20),
  textAlign: 'left',
  font: 'gothic-18',
  text: ''
});

window.add(pointText);
window.add(dtText);
window.add(tempText);
window.add(rainText);
window.add(windDirText);
window.add(windSpeedText);
window.add(sunText);
window.show();

navigator.geolocation.getCurrentPosition(function(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  var baseUrl = 'http://redmagic.cc/amedas/data/point-data';
  var apiUrl = baseUrl + '?lat=' + lat + '&lng=' + lng;

  var req = new XMLHttpRequest();
  req.onload = function () {
    var response = JSON.parse(req.responseText);
    console.log('[amedas] Name:' + response.point.name);
    pointText.text(response.point.name);
    dtText.text(response.datetime);
    tempText.text('気温:' + response.temperature + ' C');
    rainText.text('降水:' + response.precipitation + ' mm');
    windDirText.text('風向:' + response.wind_direction + 'の風');
    windSpeedText.text('風速:' + response.wind_speed + ' m/s');
    sunText.text('日照: ' + response.sunshine + ' hour');
  };
  req.open('GET', apiUrl, true);
  console.log(apiUrl);
  req.send();
});
