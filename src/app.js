/**
 * Show AMeDAS Data
 *   Your Nearest Location
 *   with r28 Amedas API
 */

var UI = require('ui');
var Vector2 = require('vector2');
var Settings = require('settings');
var ajax = require('ajax');
var initialized = false;
var options = {};

var window = new UI.Window({ fullscreen: true, scrollable: true });

var errorText = new UI.Text({
  position: new Vector2(0, 0),
  size: new Vector2(30, 28),
  textAlign: 'left',
  font: 'gothic-24-bold',
  text: '',
  color: 'red',
  backgroundColor: 'white'
});

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
  position: new Vector2(0, 30),
  size: new Vector2(144, 20),
  textAlign: 'center',
  font: 'gothic-18',
  text: '',
});

var tempText = new UI.Text({
  position: new Vector2(0, 50),
  size: new Vector2(144, 20),
  textAlign: 'left',
  font: 'gothic-18',
  text: ''
});

var rainText = new UI.Text({
  position: new Vector2(0, 70),
  size: new Vector2(144, 20),
  textAlign: 'left',
  font: 'gothic-18',
  text: ''
});

var windDirText = new UI.Text({
  position: new Vector2(0, 90),
  size: new Vector2(144, 20),
  textAlign: 'left',
  font: 'gothic-18',
  text: ''
});

var windSpeedText = new UI.Text({
  position: new Vector2(0, 110),
  size: new Vector2(144, 20),
  textAlign: 'left',
  font: 'gothic-18',
  text: ''
});


var sunText = new UI.Text({
  position: new Vector2(0, 130),
  size: new Vector2(144, 20),
  textAlign: 'left',
  font: 'gothic-18',
  text: ''
});

var uiTextArr = {
  error: errorText,
  point: pointText,
  dt:    dtText,
  temp:  tempText,
  rain:  rainText,
  windDir:   windDirText,
  windSpeed: windSpeedText,
  sun:   sunText,
};
windowAdd(window, uiTextArr);
window.show();

function windowAdd(windowObj, objArr) {
  console.log('windowAdd');
  for (var key in objArr) {
    windowObj.add(objArr[key]);
  }
}

getCurrentAmedas(uiTextArr);

/* Up Click => Reload */
window.on('click', 'up', function(e) {
  console.log('[CLICK] Up');
  windowAdd(window, uiTextArr);
  window.show();
  getCurrentAmedas(uiTextArr);
});

function getCurrentAmedas(objArr) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    var baseUrl = 'http://redmagic.cc/amedas/data/point-data';
    var apiUrl = baseUrl + '?lat=' + lat + '&lng=' + lng;
    
    ajax(
      {
        url: apiUrl,
        type: 'json',
      },
      function (data) {
        console.log('[amedas] Name:' + data.point.name);

        saveDatas(data);

        var datas = {
          point: data.point.name,
          dt: data.datetime,
          temp: data.temperature,
          rain: data.precipitation,
          windDir: data.wind_direction,
          windSpeed: data.wind_speed,
          sun: data.sunshine,
        };
        displayDatas(objArr, datas, false);
      },
      function (error) {
        console.log('[ERROR] HttpRequest Error');
        if (Settings.data('point')) {
          var datasSaved = {
            point: Settings.data('point'),
            dt: Settings.data('dt'),
            temp: Settings.data('temp'),
            rain: Settings.data('rain'),
            windDir: Settings.data('windDir'),
            windSpeed: Settings.data('windSpeed'),
            sun: Settings.data('sun'),
          };
          objArr.error.text('×');
          displayDatas(objArr, datasSaved, true);
        } else {
          objArr.point.text('Error!');
        }
      }
    );
  });
}

function displayDatas(objArr, datas, isError) {
  objArr.point.text(datas.point);
  objArr.point.color('black');
  if (isError === true) {
    objArr.error.text('×');
  } else {
    objArr.error.text('');
  }
  objArr.dt.text(datas.dt);
  objArr.temp.text('気温 : ' + datas.temp + ' C');
  objArr.rain.text('降水 : ' + datas.rain + ' mm');
  objArr.windDir.text('風向 : ' + datas.windDir + 'の風');
  objArr.windSpeed.text('風速 : ' + datas.windSpeed + ' m/s');
  objArr.sun.text('日照 : ' + datas.sun + ' min');
}

function saveDatas(datas) {
  Settings.data('point', datas.point.name); 
  Settings.data('dt', datas.datetime); 
  Settings.data('temp', datas.temperature); 
  Settings.data('rain', datas.precipitation); 
  Settings.data('windDir', datas.wind_direction); 
  Settings.data('windSpeed', datas.wind_speed); 
  Settings.data('sun', datas.sunshine);
  console.log(Settings.data('rain'));
}


Pebble.addEventListener("ready", function() {
  console.log("ready called!");
  initialized = true;
});

Pebble.addEventListener("showConfiguration", function() {
  console.log("showing configuration");
  Pebble.openURL('http://redmagic.cc/amedas/point/list?'+encodeURIComponent(JSON.stringify(options)));
});

Pebble.addEventListener("webviewclosed", function(e) {
  console.log("configuration closed");
  // webview closed
  //Using primitive JSON validity and non-empty check
  if (e.response.charAt(0) == "{" && e.response.slice(-1) == "}" && e.response.length > 5) {
    options = JSON.parse(decodeURIComponent(e.response));
    console.log("Options = " + JSON.stringify(options));
  } else {
    console.log("Cancelled");
  }
});