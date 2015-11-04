/**
 * Show AMeDAS Data
 *   Your Nearest Location
 *   with r28 Amedas API
 */

var UI = require('ui');
var Vector2 = require('vector2');
var Settings = require('settings');

var window = new UI.Window({ fullscreen: true, scrollable: true });

var errorText = new UI.Text({
  position: new Vector2(0, 0),
  size: new Vector2(30, 30),
  textAlign: 'left',
  font: 'gothic-24-bold',
  text: '',
  color: 'black',
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
  position: new Vector2(0, 55),
  size: new Vector2(144, 20),
  textAlign: 'left',
  font: 'gothic-18',
  text: ''
});

var rainText = new UI.Text({
  position: new Vector2(0, 75),
  size: new Vector2(144, 20),
  textAlign: 'left',
  font: 'gothic-18',
  text: ''
});

var windDirText = new UI.Text({
  position: new Vector2(0, 95),
  size: new Vector2(144, 20),
  textAlign: 'left',
  font: 'gothic-18',
  text: ''
});

var windSpeedText = new UI.Text({
  position: new Vector2(0, 115),
  size: new Vector2(144, 20),
  textAlign: 'left',
  font: 'gothic-18',
  text: ''
});


var sunText = new UI.Text({
  position: new Vector2(0, 135),
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

/* SELECT Click => Reload */
window.on('click', 'select', function(e) {
  console.log('[CLICK] Select');
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

    var req = new XMLHttpRequest();
    req.onload = function (e) {
      if (req.readyState == 4 && req.status == 200) {
        var response = JSON.parse(req.responseText);
        console.log('[amedas] Name:' + response.point.name);
      
        saveDatas(response);
        
        var datas = {
          point: response.point.name,
          dt: response.datetime,
          temp: response.temperature,
          rain: response.precipitation,
          windDir: response.wind_direction,
          windSpeed: response.wind_speed,
          sun: response.sunshine,
        };
        displayDatas(objArr, datas, false);
        
      } else {
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
          displayDatas(objArr, datasSaved, true);
        } else {
          objArr.point.text('Error!');
          objArr.error.text('×');
        }
      }
    };
    req.open('GET', apiUrl, true);
    console.log(apiUrl);
    req.send();
  });
}

function displayDatas(objArr, datas, isError) {
  objArr.point.text(datas.point);
  if (isError === true) {
    objArr.error.text('×');
  } else {
    objArr.error.text('');
  }
  objArr.dt.text(datas.dt);
  objArr.temp.text('気温:' + datas.temp + ' C');
  objArr.rain.text('降水:' + datas.rain + ' mm');
  objArr.windDir.text('風向:' + datas.windDir + 'の風');
  objArr.windSpeed.text('風速:' + datas.windSpeed + ' m/s');
  objArr.sun.text('日照: ' + datas.sun + ' hour');
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
