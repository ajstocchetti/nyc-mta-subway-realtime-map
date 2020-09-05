function lookupPositions() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/trains');
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          return resolve(response);
          // window.asdf = response;
        } catch(err) {
          console.log('Error parsing XHR response');
          console.log(err);
          reject(err);
          // console.log(xhr.responseText);
        }
      }
      else {
        console.log('ERROR');
        reject(xhr);
      }
    };
    xhr.send();
  });
}

function addTrainsToMap(mymap) {
  return function(trains) {
    trains.forEach((train) => {
      const {stop_lat, stop_lon} = train.stopData;
      var marker = L.marker([stop_lat, stop_lon]).addTo(mymap);
    });
  }
}


function initializeMap() {
  var mymap = L.map('mapid').setView([40.730610, -73.935242], 12);

  var Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  });
  Stadia_AlidadeSmooth.addTo(mymap);

  // L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    //   maxZoom: 18,
    //   id: 'mapbox/streets-v11',
    //   tileSize: 512,
    //   zoomOffset: -1,
    //   accessToken: 'your.mapbox.access.token'
    // }).addTo(mymap);
  return mymap;
}

window.onload = async function() {
  const mymap = initializeMap();
  const trains = await lookupPositions();
  addTrainsToMap(mymap)(trains);
}
