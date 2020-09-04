require('dotenv').config();
const axios = require('axios');
// const gtfs = require('./gtfs-realtime.js');
const ProtoBuf = require('protobufjs');
const gtfs = ProtoBuf.loadSync('./gtfs-proto/nyct-subway.proto').nested;


/*
  load station data
  load all feeds (or just G train for now)
  filter out trip updates - only want vehicle
  from vehicle.stopId, get the location of the subway stop
  plot on map

  add train colors
*/

const apiKey = process.env.MTA_API_KEY;

const G =    'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g';
const ACE =  'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace';
const BDFM = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm';
const JZ =   'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz';
const NQRW = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw';
const L =    'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l';
const oneSix = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs';
const seven = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-7'

module.exports = {
  getFeed,
  parseFeed,
  getAndParse,
}

async function getFeed() {
  const options = {
    method: 'GET',
    headers: { 'x-api-key': apiKey },
    responseType: 'arraybuffer', // IMPORTANT!
    url: ACE,
  };
  const resp = await axios(options);
  return resp.data;
}

function parseFeed(raw) {
  return gtfs.transit_realtime.FeedMessage.decode(raw);
}

async function getAndParse() {
  const raw = await getFeed();
  return parseFeed(raw);
}


(async () => {
  try {
    const feed = await getAndParse();
    console.log(require('util').inspect(feed, { depth: null }));
  } catch(err) {
    console.log(err);
  }
})();
