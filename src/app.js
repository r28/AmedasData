/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

var main = new UI.Card({
  title: 'AMeDAS Data',
  //icon: 'images/menu_icon.png',
  //subtitle: 'Hello World!',
  body: 'Getting Nearest & Latest AMeDAS Data!\nPress any button.'
});

main.show();
getCurrentAmedasLocation();

main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Get Your Latest Position',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
  getCurrentAmedasLocation();
});

main.on('click', 'select', function(e) {
  var wind = new UI.Window({
    fullscreen: true,
  });
  var textfield = new UI.Text({
    position: new Vector2(0, 65),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});

function getCurrentAmedasLocation() {
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position.coords.latitude, position.coords.longitude);
    var baseUrl = 'http://redmagic.cc/amedas/point/closest';
    var apiUrl = baseUrl + '?lat=' + position.coords.latitude + '&lng=' + position.coords.longitude;
    console.log(apiUrl);
    ajax(
      {
        url: apiUrl,
        method: 'get',
        type: 'json'
      },
      function(data, status, request) {
        var pointName = data.name;
        var prefName = data.pref.fuken_pref;
        console.log(pointName);
        console.log(prefName);
        var latestDataObj = getLatestAmedasData(data.pref_code, data.code);
        console.log(latestDataObj.datetime);
        console.log(latestDataObj.temperature);
        console.log(latestDataObj.precipitation);
        console.log(latestDataObj.wind_dir);
        console.log(latestDataObj.wind_speed);
        console.log(latestDataObj.sunshine);
      },
      function(error, status, request) {
        console.log('Faild fetching AMeDAS Point data: ' + error);
      }
    );
  });
}

function getLatestAmedasData(pref_code, ame_code) {
  var baseUrl = 'http://redmagic.cc/amedas/data/latest';
  var apiUrl = baseUrl + '?pref=' + pref_code + '&code=' + ame_code;
  console.log(apiUrl);
  ajax(
    {
      url: apiUrl,
      method: 'get',
      type: 'json'
    },
    function (data, status, request) {
      var dataObj = new Object();
      dataObj = {datetime:data.datetime, temperature:data.temperature, precipitation:data.precipitation, 
                     wind_dir:data.wind_direction, wind_speed:data.wind_speed, sunshine:data.sunshine};
      console.log(dataObj.datetime);
      return dataObj;
    },
    function (error, status, request) {
      console.log('Faild fetching AMeDAS Data: ' + error);
      return false;
    }
  );
}