import { process } from './processor';

import { open, isOpen, readAll, update, write } from '../../IndexedDB';

function openDb() {
  return new Promise((resolve, reject) => {
    if (self.db) {
      if (isOpen()) return resolve(self.db);
    }
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
  .then(() => readAll('raw'))
  .then((data) => process({ ...event.data, data }))
  // .then((results) => update(results, 'processed'))
  .then((results) => Promise.all([
    write(results.datasets, 'processed-datasets'),
    update(results.labels, 'processed-labels'),
   ]))
  .then(() => postMessage(null));
};