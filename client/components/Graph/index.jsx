import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js';
import { Graph } from './styles';
import { createChart, getChartJsGraphType, getChartJsScales, getChartJsDataType, showLegend, groupChanged, copyData } from './chartJsHelper';

export default ({ height, layoutState, graphType, data, dataType, x, y, processed, dispatch }) => {
  const [chart, setChart] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const ctx = ref.current.getContext('2d');
    setChart(new Chart(ctx, {}));
  }, []);

  useEffect(() => {
    if (!chart) return;

    let reset = false;
    if (processed) {
      reset = groupChanged(
        chart.data && chart.data.datasets.map(({ label }) => label),
        data && data.datasets.map(({ label }) => label));
      reset = reset || groupChanged(
        chart.data && chart.data.labels,
        data && data.labels);
      reset = reset || (chart.config.type !== getChartJsGraphType(graphType) && processed);
    }
    reset = reset || !data || (data && !data.datasets.length);

    if (reset) {
      chart.destroy();
      const ctx = ref.current.getContext('2d');
      const xType = getChartJsDataType(dataType[x], graphType);
      const legend = showLegend(data, graphType);

      setChart(
        createChart(
          ctx,
          getChartJsGraphType(graphType),
          copyData(data),
          getChartJsScales(graphType, xType, x, y),
          layoutState.title,
          Object.assign(layoutState.legend, legend)
          ));

    } else if (data && processed) {
      chart.data = copyData(data);
      chart.update(0);
    }

  }, [data, processed])

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