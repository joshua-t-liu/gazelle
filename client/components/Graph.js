import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js';

export default ({ data, phones, carriers, models }) => {
  const [chart, setChart] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const ctx = ref.current.getContext('2d');
    setChart(new Chart(ctx, {}));
  }, []);

  useEffect(() => {
    if (!chart) return;

    let noPrice = [];
    let yesPrice = [];
    data.filter(({ phone, carrier, model, price1, price2 }) => {
      return phones.get(phone) && carriers.get(carrier) && models.get(model);
    }).forEach(({ price1, price2 }) => {
      noPrice.push(parseInt(price1));
      yesPrice.push(parseInt(price2));
    });

    chart.destroy();
    const ctx = ref.current.getContext('2d');
    setChart(new Chart(ctx, {
      type: 'line',
      data: {
        labels: noPrice,
        datasets: [
          {
            data: noPrice,
          },
          {
            data: yesPrice,
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    }));
  }, [data, phones, carriers, models])


  return (
    <div style={{ position: 'relative', height: '60vh', width: '60vw' }}>
      <canvas id='chart' ref={ref}></canvas>
    </div>
  )
}