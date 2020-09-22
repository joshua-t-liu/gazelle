import React, { useEffect } from 'react';

const getModelSize = (model) => {
  return model.match(/(.*[^0-9]\b)([0-9]+gb).*/)[2];
}

export default (cb) => {
  useEffect(() => {
    fetch('/phones')
    .then((res) => res.json())
    .then((table) => {
      const data = table.phones;
      data.forEach((row) => {
        row.price1 = Number(row.price1);
        row.price2 = Number(row.price2);
        row.model = getModelSize(row.model);
        row.datetime = new Date(row.datetime);
      })
      const dataType = {
        id: 'number',
        price1: 'number',
        price2: 'number',
        datetime: 'date',
      }
      cb({ data, dataType, x: 'price1', y: 'price2', selectedGroup: new Set(['carrier']) });
    });
  }, []);
};
