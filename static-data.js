const fs = require('fs');

class GtfsStatic {
  constructor(filePath) {
    const filedata = fs.readFileSync(filePath, 'utf-8');
    const lines = filedata.trim().split('\n').map(line => line.trim().split(',')); // an array of arrays
    const headers = lines[0];
    this.headers = headers;

    const gtfsData = {};
    for (let x = 1; x < lines.length; x++) {
      const line = lines[x];
      gtfsData[line[0]] = this._lineToJson(line);
    }
    this.gtfsData = gtfsData;
  }

  _lineToJson(line) {
    const pojo = {};
    this.headers.forEach((h, index) => {
      pojo[h] = line[index];
    });
    return pojo;
  }

  getById(id) {
    return this.gtfsData[id];
  }
}

const stops = new GtfsStatic('./mta-subway-static/stops.txt');

module.exports = {
  stops,
};
