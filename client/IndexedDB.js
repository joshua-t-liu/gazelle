let db;

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
      const data = db.createObjectStore('data');
      const dataSets = db.createObjectStore('datasets');
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
    const req = objectStore.get(key);
    req.onsuccess = function(event) {

      const updReq = objectStore.put(data, key);
      updReq.onerror = function(event) {
        reject(event.target.errorCode)
      }

      updReq.onsuccess = function() {
        resolve(true);
      }
    }
  })
}

export {
  open,
  read,
  write,
  update,
};