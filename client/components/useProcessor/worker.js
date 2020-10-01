import { processData } from './ChartJsDataset.js';

import { open, read, update } from '../IndexedDB';

function openDb() {
  return new Promise((resolve, reject) => {
    if (self.db) return resolve(self.db);
    open()
    .then((db) => {
      self.db = db;
      resolve(db);
    })
    .catch((err) => err);
  });
}

onmessage = function(event) {
  openDb()
  .then(() => read())
  .then((data) => processData({ ...event.data, data }))
  .then((results) => update(results, 'output'))
  .then(() => postMessage(null));
};