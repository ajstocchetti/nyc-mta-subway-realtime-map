require('dotenv').config();
const axios = require('axios');
const ProtoBuf = require('protobufjs');
const gtfs = ProtoBuf.loadSync('./gtfs-proto/nyct-subway.proto').nested;
const {stops} = require('./static-data');

/*
  load station data
  load all feeds (or just G train for now)
  filter out trip updates - only want vehicle
  from vehicle.stopId, get the location of the subway stop
  plot on map

  add train colors
*/

const apiKey = process.env.MTA_API_KEY;
const feedUrls = [
  { lines: 'G', url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g' },
  { lines: 'ACE', url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace' },
  { lines: 'BDFM', url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm' },
  { lines: 'JZ', url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz' },
  { lines: 'NQRW', url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw' },
  { lines: 'L', url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l' },
  { lines: '123456', url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs' },
  { lines: '7', url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-7' },
  { lines: 'SIR', url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-si' },
];

module.exports = {
  getFeed,
  parseFeed,
  isVehicleEntity,
  enhanceEntity,
  getLinePositions,
  getAllFeeds,
}

async function getFeed(url) {
  const options = {
    method: 'GET',
    headers: { 'x-api-key': apiKey },
    responseType: 'arraybuffer', // IMPORTANT!
    url: url,
  };
  const resp = await axios(options);
  return resp.data;
}

function parseFeed(raw) {
  return gtfs.transit_realtime.FeedMessage.decode(raw);
}

function isVehicleEntity(FeedEntity) {
  return !!FeedEntity.vehicle;
}

function enhanceEntity(vehicleEntity) {
  // return a new object
  // (1) because its bad practice to mutate your input
  // (2) keys added to the input don't properly JSON.stringify
  return {
    ...vehicleEntity,
    stopData: stops.getById(vehicleEntity.vehicle.stopId),
  }
}

async function getLinePositions(feedData) {
  const feed = await getFeed(feedData.url);
  const jsonFeed = parseFeed(feed);
  return jsonFeed.entity.filter(isVehicleEntity)
    .map(enhanceEntity);
}

async function getAllFeeds() {
  const positionArrays = await Promise.all(feedUrls.map(getLinePositions));
  // merge arrays into 1 array
  return [].concat.apply([], positionArrays);
}
