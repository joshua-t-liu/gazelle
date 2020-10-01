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
      const objectStore = db.createObjectStore('data');
      objectStore.transaction.oncomplete = function(event) {
      }
    }
  })
}

function write(data, key = 'raw') {
  const transaction = db.transaction(['data'], 'readwrite');
  transaction.oncomplete = function(event) {
  }
  const objectStore = transaction.objectStore('data');
  objectStore.add(data, key);
}

function read(key = 'raw') {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['data']);
    const objectStore = transaction.objectStore('data');
    const req = objectStore.get(key);

    req.onerror = function(event) {
      reject(event.target.errorCode);
    }

    req.onsuccess = function(event) {
      resolve(event.target.result);
    }
  })
}

function update(data, key = 'raw') {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['data'], 'readwrite');
    const objectStore = transaction.objectStore('data');
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