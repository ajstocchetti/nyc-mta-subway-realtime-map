const baseUrl = 'http://localhost:3000';

window.onload = async function() {
  const mymap = initializeMap();
  getAndSetTrain(mymap);

  const sliderOpts = {
    id: 'refresh-interval-slider',
    orientation: 'horizontal',
    position: 'topleft', //'topright',
    min: 5, // seconds
    max: 60 * 5, // 5 mins
    value: 30, // default value
    title: 'Interval',
    logo: 'R',
    size: '220px',
  };
  newSlider = L.control.slider(setTrainRefresh(mymap), sliderOpts).addTo(mymap);
}

function setTrainRefresh(mymap) {
  return function(seconds) {
    if (window.__trainRefreshInterval) {
      clearInterval(window.__trainRefreshInterval);
    }
    window.__trainRefreshInterval = setInterval(getAndSetTrain, seconds * 1000, mymap);
  }
}

async function getAndSetTrain(mymap) {
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

async function pause(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

function addTrainsToMap(mymap) {
  return async function(trains) {
    if (window.__trainsLayer) {
      mymap.removeLayer(window.__trainsLayer);
      delete window.__trainsLayer;
    }

    window.__trainsLayer = L.layerGroup();
    window.__trainsLayer.addTo(mymap);
    trains.forEach((train) => addTrainToLayer(train));
  }
}

function addTrainToLayer(train) {
  if (!train.stopData) {
    console.log('no stop data');
    console.log(train);
    return;
  }
  const {stop_lat, stop_lon} = train.stopData;
  const options = {
    riseOnHover: true,
    icon: getIconForEntity(train),
  };
  const marker = L.marker([stop_lat, stop_lon], options);
  marker.addTo(window.__trainsLayer);
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

const ZooIcon = L.Icon.extend({
  options: {
    iconSize: [25, 25],
  }
});
const getZooIcon = animal => new ZooIcon({ iconUrl: `/zoo-icons/${animal}.svg`});
const icon_beaver = getZooIcon('beaver');
const icon_bison = getZooIcon('bison');
const icon_chameleon = getZooIcon('chameleon');
const icon_cheetah = getZooIcon('cheetah');
const icon_chimpanzee = getZooIcon('chimpanzee');
const icon_dolphin = getZooIcon('dolphin');
const icon_elephant = getZooIcon('elephant');
const icon_ferret = getZooIcon('ferret');
const icon_flamingos = getZooIcon('flamingos');
const icon_giraffe = getZooIcon('giraffe');
const icon_gorilla = getZooIcon('gorilla');
const icon_hedgehog = getZooIcon('hedgehog');
const icon_hippopotamus = getZooIcon('hippopotamus');
const icon_hyena = getZooIcon('hyena');
const icon_kangaroo = getZooIcon('kangaroo');
const icon_kiwi = getZooIcon('kiwi');
const icon_koala = getZooIcon('koala');
const icon_llama = getZooIcon('llama');
const icon_meerkat = getZooIcon('meerkat');
const icon_ostrich = getZooIcon('ostrich');
const icon_parrot = getZooIcon('parrot');
const icon_penguin = getZooIcon('penguin');
const icon_platypus = getZooIcon('platypus');
const icon_porcupine = getZooIcon('porcupine');
const icon_raccoon = getZooIcon('raccoon');
const icon_sloth = getZooIcon('sloth');
const icon_snake = getZooIcon('snake');
const icon_boar = getZooIcon('wild-boar');

// const icon_antelope = getZooIcon('antelope');
// const icon_baboon = getZooIcon('baboon');
// const icon_bear = getZooIcon('bear');
// const icon_butterfly = getZooIcon('butterfly');
// const icon_deer = getZooIcon('deer');
// const icon_horse = getZooIcon('horse');
// const icon_lion = getZooIcon('lion');
// const icon_rabbit = getZooIcon('rabbit');
// const icon_sealion = getZooIcon('sea-lion');
// const icon_squirrel = getZooIcon('squirrel');
// const icon_turtle = getZooIcon('turtle');
// const icon_walrus = getZooIcon('walrus');
// const icon_wombat = getZooIcon('wombat');


const iconUnknown = new MtaTrainIcon({iconUrl: '/unknown-line.png' });
function getIconForEntity(entity) {
  const routeId = entity.vehicle.trip.routeId;
  const m = {
    A: [ iconA, icon_beaver ],
    B: [ iconB, icon_gorilla ],
    C: [ iconC, icon_chameleon ],
    D: [ iconD, icon_hippopotamus ],
    E: [ iconE, icon_platypus ],
    F: [ iconF, icon_parrot ],
    G: [ iconG, icon_flamingos ],
    J: [ iconJ, icon_porcupine ],
    L: [ iconL, icon_bison ],
    M: [ iconM, icon_hedgehog ],
    N: [ iconN, icon_sloth ],
    Q: [ iconQ, icon_elephant ],
    R: [ iconR, icon_ostrich ],
    W: [ iconW, icon_meerkat ],
    Z: [ iconZ, icon_hyena ],
    1: [ icon1, icon_kiwi ],
    2: [ icon2, icon_ferret ],
    3: [ icon3, icon_chimpanzee ],
    4: [ icon4, icon_dolphin ],
    5: [ icon5, icon_penguin ],
    6: [ icon6, icon_giraffe ],
    7: [ icon7, icon_cheetah ],
    SI: [ iconSI, icon_llama ],
    FS: [ iconShuttle, icon_koala ],
    GS: [ iconShuttle, icon_raccoon ],
    H: [ iconH, icon_kangaroo ],
  };
  const iconList = m[routeId];
  if (!iconList) {
    console.log('unknown route id:', routeId);
    return iconUnknown;
  }
  else return iconList[0];
}
