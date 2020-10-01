import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js';
import { Graph } from './styles';
import { getChartJsGraphType, getChartJsScales, getChartJsDataType, showLegend } from './chartJSHelper';

export default ({ height, layoutState, graphType, data, dataType, x, y, dispatch }) => {
  const [chart, setChart] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const ctx = ref.current.getContext('2d');
    setChart(new Chart(ctx, {}));
  }, []);

  useEffect(() => {
    if (!chart) return;

    chart.destroy();
    const ctx = ref.current.getContext('2d');

    const type = getChartJsGraphType(graphType);
    const xType = getChartJsDataType(dataType[x], graphType);
    const scales = getChartJsScales(graphType, xType, x, y);
    const legend = showLegend(data, graphType);

    setChart(new Chart(ctx, {
      type: type,
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
    const legend = showLegend(data, graphType);

    if (chart) {
      chart.options.title = layoutState.title;
      chart.options.legend = Object.assign(layoutState.legend, legend);
      chart.update();
    }
  }, [layoutState]);

  return (
    <Graph height={height}>
      <canvas id='chart' ref={ref}></canvas>
    </Graph>
  )
}