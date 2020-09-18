const { Pool } = require('pg');

const pool = new Pool({
  // host: 'localhost',
  user: 'gazelle',
  password:  'gazelle',
  database: 'iphones',
  max: 5,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 2000,
});


const getPhoneData = (res) => {
  pool
    .query('SELECT * FROM iphones.phones')
    .then((results) => res.send({ phones: results.rows }))
    .catch((err) => {
      res.send(err);
      console.error(err);
    });
};

//iphone-11-pro-max,at-t,iphone-11-pro-max-64gb-at-t,497056-gpid,140,99
const addPhoneData = (val) => {
  const text = 'INSERT INTO iphones.phones (phone, carrier, model, gpid, price1, price2) VALUES $1;';
  const values = [val.map((row) => `(${row})`).join(',')];
  pool
    .query(text.replace('$1', values))
    .then((res) => console.log('complete'))
    .catch((err) => console.error(err));
};

module.exports = { addPhoneData, getPhoneData };