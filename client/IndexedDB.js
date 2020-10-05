let db;

const STORES = ['raw', 'processed', 'datasets', 'labels'];

function open(indices = []) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('chartsy', 1);

    req.onerror = function() {
      reject(event.target.errorCode);
    }

    req.onsuccess = function(event) {
      db = event.target.result;

      db.onversionchange = function() {
        db.close();
      }

      resolve(db);
    }

    req.onupgradeneeded  = function(event) {
      const db = event.target.result;
      STORES.forEach((store) => {

        if (store === 'raw') {
          const objectStore = db.createObjectStore(store, { autoIncrement : true });
          indices.forEach((index) => objectStore.createIndex(index, index, { unique: false }));
        } else {
          db.createObjectStore(store);
        }
      });
    }
  })
}

function deleteDb() {
  return new Promise((resolve, reject) => {
    const req = window.indexedDB.deleteDatabase('chartsy');

    req.onerror = function() {
      reject(event.target.errorCode);
    }

    req.onsuccess = function(event) {
      resolve();
    };

    req.onblocked = function(event) {
      reject();
    };
  })
}

function create(indices) {
  return new Promise((resolve, reject) => {
    deleteDb()
    .then(() => open(indices))
    .then(() => resolve( ))
    .catch(() => reject())
  })
}

function write(data, storeName = 'raw') {
  return new Promise((resolve, reject) => {
    const txn = db.transaction([storeName], 'readwrite');

    txn.onerror = function(event) {
      reject(event.target.errorCode);
    }

    txn.oncomplete = function(event) {
      resolve();
    }
    const objectStore = txn.objectStore(storeName);
    data.forEach((dataPt) => objectStore.add(dataPt));
  })
}

function read(storeName = 'raw', key) {
  if (!key) key = storeName;

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

function update(data, storeName = 'raw', key) {
  if (!key) key = storeName;

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

function clear(storeName) {
  return new Promise((resolve, reject) => {
    const txn = db.transaction([storeName], 'readwrite');
    const store = txn.objectStore(storeName);

    const req = store.clear();

    req.onsuccess = function() {
      resolve();
    }

    req.onerror = function() {
      reject();
    }
  })
}

function updateMultiple(data, storeName) {
  return (
    clear(storeName)
    .then(() => new Promise((resolve, reject) => {
      const txn = db.transaction([storeName], 'readwrite');
      const objectStore = txn.objectStore(storeName);

      data.forEach((val, key) => {
        const req = objectStore.put(val, key);
      })

      txn.onerror = function(event) {
        reject(event.target.errorCode);
      }

      txn.oncomplete = function() {
        console.log('updated all')
        resolve(data);
      }
    }))
    .catch((err) => console.log(err))
  );
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

function isOpen() {
  try {
    const txn = db.transaction(['data']);
    txn.abort();
    return true;
  } catch (err) {
    return false;
  }
}

function getByIndex(storeName, indexName, value) {
  return new Promise((resolve, reject) => {
    if (storeName === undefined || indexName === undefined || value === undefined) reject('getByIndex missing paramters');

    const txn = db.transaction([storeName], 'readonly');
    const store = txn.objectStore(storeName);

    const index = store.index(indexName);

    const req = index.getAll(value);

    req.onsuccess = function() {
      resolve(req.result);
    }

    req.onerror = function(event) {
      reject(event.target.errorCode);
    }
  });
}

export {
  create,
  open,
  read,
  readAll,
  write,
  update,
  updateMultiple,
  isOpen,
  getByIndex,
};