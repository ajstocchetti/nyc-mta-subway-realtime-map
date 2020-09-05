const baseUrl = 'http://localhost:3000';

window.onload = async function() {
  const mymap = initializeMap();
  const trains = await lookupPositions();
  addTrainsToMap(mymap)(trains);
}

function lookupPositions() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${baseUrl}/trains`);
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          return resolve(response);
        } catch(err) {
          console.log('Error parsing XHR response');
          console.log(err);
          reject(err);
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
      const options = {};
      const icon = getIconForEntity(train);
      if (icon) options.icon = icon;

      const marker = L.marker([stop_lat, stop_lon], options).addTo(mymap);
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


const MtaTrainIcon = L.Icon.extend({
    options: {
        // iconSize:     [25, 25], // actual size of SVGs
        iconSize:     [15, 15],

        // shadowUrl: 'leaf-shadow.png',
        // shadowSize:   [50, 64],
        // iconAnchor:   [22, 94],
        // shadowAnchor: [4, 62],
        // popupAnchor:  [-3, -76]
    }
});
const iconUrl = line => `/logos/${line}.svg`;
const iconA = new MtaTrainIcon({iconUrl: iconUrl('A') });
const iconB = new MtaTrainIcon({iconUrl: iconUrl('B') });
const iconC = new MtaTrainIcon({iconUrl: iconUrl('C') });
const iconD = new MtaTrainIcon({iconUrl: iconUrl('D') });
const iconE = new MtaTrainIcon({iconUrl: iconUrl('E') });
const iconF = new MtaTrainIcon({iconUrl: iconUrl('F') });
const iconG = new MtaTrainIcon({iconUrl: iconUrl('G') });
const iconJ = new MtaTrainIcon({iconUrl: iconUrl('J') });
const iconL = new MtaTrainIcon({iconUrl: iconUrl('L') });
const iconM = new MtaTrainIcon({iconUrl: iconUrl('M') });
const iconN = new MtaTrainIcon({iconUrl: iconUrl('N') });
const iconQ = new MtaTrainIcon({iconUrl: iconUrl('Q') });
const iconR = new MtaTrainIcon({iconUrl: iconUrl('R') });
const iconW = new MtaTrainIcon({iconUrl: iconUrl('W') });
const iconZ = new MtaTrainIcon({iconUrl: iconUrl('Z') });
const icon1 = new MtaTrainIcon({iconUrl: iconUrl('1') });
const icon2 = new MtaTrainIcon({iconUrl: iconUrl('2') });
const icon3 = new MtaTrainIcon({iconUrl: iconUrl('3') });
const icon4 = new MtaTrainIcon({iconUrl: iconUrl('4') });
const icon5 = new MtaTrainIcon({iconUrl: iconUrl('5') });
const icon6 = new MtaTrainIcon({iconUrl: iconUrl('6') });
const icon7 = new MtaTrainIcon({iconUrl: iconUrl('7') });
const iconSI = new MtaTrainIcon({iconUrl: iconUrl('SI') });
const iconUnknown = new MtaTrainIcon({iconUrl: '/logos/unknown.png' });
function getIconForEntity(entity) {
  const routeId = entity.vehicle.trip.routeId;
  const m = {
    A: iconA,
    B: iconB,
    C: iconC,
    D: iconD,
    E: iconE,
    F: iconF,
    G: iconG,
    J: iconJ,
    L: iconL,
    M: iconM,
    N: iconN,
    Q: iconQ,
    R: iconR,
    W: iconW,
    Z: iconZ,
    1: icon1,
    2: icon2,
    3: icon3,
    4: icon4,
    5: icon5,
    6: icon6,
    7: icon7,
    SI: iconSI,
  };
  if (!m[routeId]) console.log('unknown route id:', routeId);
  return m[routeId] || iconUnknown;
}
