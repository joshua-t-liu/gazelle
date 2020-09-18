import React, { useEffect, useState } from 'react';
import Graph from './Graph';
import Filters from './Filters';

const getModelSize = (model) => {
  return model.match(/.*([0-9]{2}gb).*/)[1];
}

export default () => {
  const [data, setData] = useState([]);
  const [phones, setPhones] = useState(new Map());
  const [carriers, setCarriers] = useState(new Map());
  const [models, setModels] = useState(new Map());

  useEffect(() => {
    fetch('/phones')
    .then((res) => res.json())
    .then((data) => {

      const phones = new Map();
      const carriers = new Map();
      const models = new Map();

      data.phones.forEach(({
        phone, carrier, model
      }, index) => {
        phones.set(phone, true);
        carriers.set(carrier, true);
        const size = getModelSize(model);
        data.phones[index].model = size;
        models.set(size, true);
      });

      setData(data.phones);
      setPhones(phones);
      setCarriers(carriers);
      setModels(models);

    });
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <Graph
        data={data}
        phones={phones}
        carriers={carriers}
        models={models} />
      <Filters
        phones={phones}
        setPhones={setPhones}
        carriers={carriers}
        setCarriers={setCarriers}
        models={models}
        setModels={setModels} />
    </div>
  );
};
