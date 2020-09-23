import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js';

const GRAPH_TYPES = {
  'line': 'line',
  'scatter': 'scatter',
  'area': 'line',
  'pie': 'pie',
  'bar': 'bar',
  'doughnut': 'doughnut',
};

export default ({ layoutState, graphType, data, dataType, x, y, dispatch }) => {
  const [chart, setChart] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const ctx = ref.current.getContext('2d');
    setChart(new Chart(ctx, {}));
  }, []);

  useEffect(() => {
    if (!chart) return;

    let type;
    switch (dataType[x]) {
      case 'date':
        type = 'time';
        break;
      case 'number':
        type = (graphType === 'bar' || graphType === 'pie' || graphType === 'doughnut') ? 'category' : 'linear';
        break;
      default:
        type = 'category';
    }

    // if (layoutState.logX)

    chart.destroy();
    const ctx = ref.current.getContext('2d');

    let scales;
    if (graphType !== 'pie' && graphType !== 'doughnut') {
      scales = {
        xAxes: [{
          type: type,
          display: true,
          scaleLabel: {
            display: true,
            labelString: x,
            fontSize: 24,
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: y,
            fontSize: 24,
          }
        }]
      };
    }

    const legend = {
      display: (data && data.datasets &&
        (data.datasets.length > 1 || graphType === 'pie' || graphType === 'doughnut')) ? true : false,
    };

    setChart(new Chart(ctx, {
      type: GRAPH_TYPES[graphType],
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales,
        layout: {
          // padding: 24,
        },
        title: layoutState.title,
        legend: Object.assign(layoutState.legend, legend),
      }
    }));
  }, [data])

  useEffect(() => {
    const legend = {
      display: (data && data.datasets &&
        (data.datasets.length > 1 || graphType === 'pie' || graphType === 'doughnut')) ? true : false,
    };

    if (chart) {
      chart.options.title = layoutState.title;
      chart.options.legend = Object.assign(layoutState.legend, legend);
      chart.update();
    }
  }, [layoutState]);

  return (
    <div style={{ position: 'relative', height: '80vh', width: 'calc(100% - 2em)', flexShrink: 0, padding: '1em' }}>
      <canvas id='chart' ref={ref}></canvas>
    </div>
  )
}