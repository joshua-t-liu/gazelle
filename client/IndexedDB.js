import STORES from './stores';

let db;

function open(indices = []) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('chartsy', 1);

    addEventHandler(
      req,
      (event) => {
        db = event.target.result;
        db.onversionchange = function() {
          console.log('closed db')
          db.close();
        }
        resolve(db);
      },
      (event) => reject(event.target.errorCode),
      'open'
    )

    req.onupgradeneeded  = function(event) {
      const db = event.target.result;

      STORES.forEach((store) => {
        switch (store) {
          case 'raw':
          case 'processed-datasets':
            const objectStore = db.createObjectStore(store, { autoIncrement : true });
            if (store === 'raw') {
              indices.forEach((index) => objectStore.createIndex(index, index, { unique: false }));
            }
            break;
          default:
            db.createObjectStore(store);
            break;
        }
      });
    }
  })
}

function deleteDb() {
  return new Promise((resolve, reject) => {
    const req = window.indexedDB.deleteDatabase('chartsy');

    addEventHandler(
      req,
      () => resolve(),
      (event) => reject(event.target.errorCode),
      'delete'
    );

    req.onblocked = function(event) {
      console.log('blocked');
      resolve();
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
  return (
    clear(storeName)
    .then(() => new Promise((resolve, reject) => {
      const store = getStore({
        type: 'write',
        name: storeName,
        mode: 'readwrite',
        onerror: (event) => reject(event.target.errorCode),
        oncomplete: () => resolve(),
      });
      data.forEach((dataPt) => store.add(dataPt));
    }))
    .catch((err) => console.log(err))
  );
}

function read(storeName = 'raw', key) {
  return new Promise((resolve, reject) => {
    if (!key) key = storeName;
    const store = getStore({ type: 'read', name: storeName });

    addEventHandler(
      store.get(key),
      (event) => resolve(event.target.result),
      (event) => reject(event.target.errorCode));
  })
}

function update(data, storeName = 'raw', key) {
  if (!key) key = storeName;

  return new Promise((resolve, reject) => {
    const store = getStore({
      type: 'update',
      name: storeName,
      mode: 'readwrite',
      oncomplete: () => resolve(data),
      onerror: (event) => reject(event.target.errorCode)
    });

    store.put(data, key);
  })
}

function clear(storeName) {
  return new Promise((resolve, reject) => {
    const store = getStore({
      type: 'clear',
      name: storeName,
      mode: 'readwrite',
      oncomplete: () => resolve(),
      onerror: (event) =>  reject(event.target.errorCode),
    });
    store.clear();
  })
}

function updateMultiple(data, storeName) {
  return (
    clear(storeName)
    .then(() => new Promise((resolve, reject) => {
      const store = getStore({
        type: 'update-multiple',
        name: storeName,
        mode: 'readwrite',
        oncomplete: () => resolve(data),
        onerror: (event) =>  reject(event.target.errorCode),
      });

      data.forEach((val, key) => store.put(val, key));
    }))
    .catch((err) => console.log(err))
  );
}

function readAll(storeName) {
  return new Promise((resolve, reject) => {
    const store = getStore({ type: 'read-all', name: storeName });

    addEventHandler(
      store.getAll(),
      (event) => resolve(event.target.result),
      (event) => reject(event.target.errorCode));
  })
}

function isOpen() {
  try {
    const txn = db.transaction(['raw']);
    txn.abort();
    return true;
  } catch (err) {
    return false;
  }
}

function getByIndex(storeName, indexName, value) {
  return new Promise((resolve, reject) => {
    if (storeName === undefined || indexName === undefined || value === undefined) reject('getByIndex missing paramters');

    const store = getStore({ type: 'index', name: storeName })
    const index = store.index(indexName);
    const req = index.getAll(value);

    addEventHandler(
      req,
      (event) => resolve(req.result),
      (event) => reject(event.target.errorCode));
  });
}

function getStore({ type, name, mode = 'readonly', oncomplete, onerror }) {
  const txn = db.transaction([name], mode);
  const store = txn.objectStore(name);

  txn.oncomplete = function(event) {
    if (oncomplete) oncomplete(event);
  }

  txn.onerror = function(event) {
    if (onerror) onerror(event);
  }

  // console.log(type);
  return store;
}

function addEventHandler(req, resolveCb, rejectCb, type) {
  req.onsuccess = function(event) {
    if (resolveCb) resolveCb(event);
  }

  req.onerror = function(event) {
    if (rejectCb) rejectCb(event);
  }

  // if (type) console.log(type);
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