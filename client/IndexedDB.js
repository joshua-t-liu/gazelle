let db;

const STORES = ['data', 'datasets', 'labels'];

function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('chartsy', 1);

    req.onerror = function() {
      reject(event.target.errorCode);
    }

    req.onsuccess = function(event) {
      db = event.target.result;
      resolve(db);
    }

    req.onupgradeneeded  = function(event) {
      const db = event.target.result;
      STORES.forEach((store) => db.createObjectStore(store));
    }
  })
}

// function deleteDb() {
//   return new Promise((resolve, reject) => {
//     const req = window.indexedDB.deleteDatabase('chartsy');

//     req.onerror = function() {
//       reject(event.target.errorCode);
//     }

//     req.onsuccess = function(event) {
//       resolve();
//     };

//     req.onblocked = function(event) {
//       resolve();
//     };
//   })
// }

// function create() {
//   return new Promise((resolve, reject) => {
//     deleteDb()
//     .then(() => open())
//     .then(() => resolve( ))
//     .catch(() => reject())
//   })
// }

function write(data, key = 'raw') {
  const transaction = db.transaction(['data'], 'readwrite');
  transaction.oncomplete = function(event) {
  }
  const objectStore = transaction.objectStore('data');
  objectStore.add(data, key);
}

function read(storeName = 'data', key = 'raw') {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName]);
    const objectStore = transaction.objectStore(storeName);
    const req = objectStore.get(key);

    req.onerror = function(event) {
      reject(event.target.errorCode);
    }

    req.onsuccess = function(event) {
      resolve(event.target.result);
    }
  })
}

function update(data, storeName = 'data', key = 'raw') {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);

    const req = objectStore.put(data, key);
    req.onerror = function(event) {
      reject(event.target.errorCode);
    }

    req.onsuccess = function() {
      resolve(data);
    }
  })
}

function updateMultiple(data, storeName) {
  return new Promise((resolve, reject) => {
    const txn = db.transaction([storeName], 'readwrite');
    const objectStore = txn.objectStore(storeName);

    data.forEach((val, key) => {
      const req = objectStore.put(val, key);
    })

    txn.onerror = function(event) {
      reject(event.target.errorCode);
    }

    txn.oncomplete = function() {
      resolve(data);
    }
  })
}

function readAll(storeName) {
  return new Promise((resolve, reject) => {
    const txn = db.transaction([storeName]);
    const store = txn.objectStore(storeName);

    const req = store.getAll();
    req.onerror = function (event) {
      reject(event.target.errorCode);
    }

    req.onsuccess = function(event) {
      resolve(event.target.result);
    }
  })
}

export {
  open,
  read,
  readAll,
  write,
  update,
  updateMultiple,
};