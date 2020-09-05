require('dotenv').config();
const axios = require('axios');
const ProtoBuf = require('protobufjs');
const {stops} = require('./static-data');

const gtfs = ProtoBuf.loadSync('./gtfs-proto/nyct-subway.proto').nested;
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
  return !!FeedEntity.vehicle && FeedEntity.vehicle.stopId;
}

function hasStopData(vehicleEntity) {
  return Boolean(vehicleEntity.stopData);
}

function enhanceEntity(vehicleEntity) {
  // return a new object
  // (1) because its bad practice to mutate your input
  // (2) keys added to the input don't properly JSON.stringify
  const stopId = vehicleEntity.vehicle.stopId;
  if (!stopId) {
    console.log('No stop id for vehicle');
    console.log(vehicleEntity);
  }
  const stopData = stops.getById(vehicleEntity.vehicle.stopId);
  if (stopId && !stopData) {
    console.log(`No stop data found for stop with id ${stopId}`);
  }
  return {
    ...vehicleEntity,
    stopData,
  }
}

async function getLinePositions(feedData) {
  const feed = await getFeed(feedData.url);
  const jsonFeed = parseFeed(feed);
  return jsonFeed.entity
    .filter(isVehicleEntity)
    .map(enhanceEntity)
    .filter(hasStopData);
}

async function getAllFeeds() {
  const positionArrays = await Promise.all(feedUrls.map(getLinePositions));
  // merge arrays into 1 array
  return [].concat.apply([], positionArrays);
}
