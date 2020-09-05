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
      if (!train.stopData) {
        console.log('no stop data');
        console.log(train);
        return;
      }
      const {stop_lat, stop_lon} = train.stopData;
      const options = {};
      const icon = getIconForEntity(train);
      if (icon) options.icon = icon;

      const marker = L.marker([stop_lat, stop_lon], options).addTo(mymap);
    });
  }
}


function initializeMap() {
  const mymap = L.map('mapid').setView([40.730610, -73.935242], 11);

  // OpenMap Free Tiles: http://leaflet-extras.github.io/leaflet-providers/preview/index.html
  const Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  });
  Stadia_AlidadeSmooth.addTo(mymap);

  // L.tileLayer('/universe.jpg', {
  //   attribution: 'The Universe: https://astronomy.com',
  //   tms: true
  // }).addTo(mymap);


  return mymap;
}


const MtaTrainIcon = L.Icon.extend({
  options: {
    iconSize: [15, 15],
  }
});
const iconUrl = line => `/subway-bullets/${line}.svg`;
const iconA = new MtaTrainIcon({iconUrl: iconUrl('a') });
const iconB = new MtaTrainIcon({iconUrl: iconUrl('b') });
const iconC = new MtaTrainIcon({iconUrl: iconUrl('c') });
const iconD = new MtaTrainIcon({iconUrl: iconUrl('d') });
const iconE = new MtaTrainIcon({iconUrl: iconUrl('e') });
const iconF = new MtaTrainIcon({iconUrl: iconUrl('f') });
const iconG = new MtaTrainIcon({iconUrl: iconUrl('g') });
const iconJ = new MtaTrainIcon({iconUrl: iconUrl('j') });
const iconL = new MtaTrainIcon({iconUrl: iconUrl('l') });
const iconM = new MtaTrainIcon({iconUrl: iconUrl('m') });
const iconN = new MtaTrainIcon({iconUrl: iconUrl('n') });
const iconQ = new MtaTrainIcon({iconUrl: iconUrl('q') });
const iconR = new MtaTrainIcon({iconUrl: iconUrl('r') });
const iconW = new MtaTrainIcon({iconUrl: iconUrl('w') });
const iconZ = new MtaTrainIcon({iconUrl: iconUrl('z') });
const icon1 = new MtaTrainIcon({iconUrl: iconUrl('1') });
const icon2 = new MtaTrainIcon({iconUrl: iconUrl('2') });
const icon3 = new MtaTrainIcon({iconUrl: iconUrl('3') });
const icon4 = new MtaTrainIcon({iconUrl: iconUrl('4') });
const icon5 = new MtaTrainIcon({iconUrl: iconUrl('5') });
const icon6 = new MtaTrainIcon({iconUrl: iconUrl('6') });
const icon7 = new MtaTrainIcon({iconUrl: iconUrl('7') });
const iconSI = new MtaTrainIcon({iconUrl: iconUrl('sir') });
const iconShuttle = new MtaTrainIcon({iconUrl: iconUrl('s') });
const iconH = new MtaTrainIcon({iconUrl: iconUrl('h') });
const iconUnknown = new MtaTrainIcon({iconUrl: '/unknown-line.png' });
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
    FS: iconShuttle,
    H: iconH,
  };
  if (!m[routeId]) console.log('unknown route id:', routeId);
  return m[routeId] || iconUnknown;
}
