import { process } from './processor';

import { open, isOpen, readAll, update, write } from '../../IndexedDB';

function openDb() {
  return new Promise((resolve, reject) => {
    if (self.db && isOpen()) return resolve(self.db);
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
  .then(({ datasets, labels }) => Promise.all([
    write(datasets, 'processed-datasets'),
    update(labels, 'processed-labels'),
   ]))
  .then(() => postMessage(null))
  .catch((err) => console.log(err));
};