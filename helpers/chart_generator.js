import {Chart, registerables} from 'chart.js';
import * as helpers from 'chart.js/helpers';

Chart.register(...registerables);

const COLOR_HOME = 'rgb(255, 208, 152)';
const COLOR_OFFICE = 'rgb(255, 178, 136)';
const COLOR_TRAVEL = 'rgb(255, 168, 168)';

export function createPolarChart (ctx, maxVal, dataSet) {
  return new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: [
        'Office heating',
        'Office electricity',
        'Car travel',
        'Non-car travel',
        'Home electricity',
        'Home heating'
      ],
      datasets: [{
        data: dataSet,
        backgroundColor: [
          COLOR_OFFICE,
          COLOR_OFFICE,
          COLOR_TRAVEL,
          COLOR_TRAVEL,
          COLOR_HOME,
          COLOR_HOME
        ]
      }]
    },
    options: {
      borderWidth: 3,
      borderColor: '#404040',
      scales: {
        r: {
          suggestedMax: maxVal,
          ticks: {
            color: 'white',
            backdropColor: 'rgba(0, 0, 0, 0.55)',
            backdropPadding: 5,
            z: 1
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.3)',
            borderDash: [3]
          }
        }
      },
      plugins: {
        legend: false
      }
    }
  });
}

export function createPolarChartBaseline (ctx, maxVal, dataSet) {
  return new Chart(ctx, {
    type: 'polarArea',
    data: {
      datasets: [{
        data: dataSet,
      }]
    },
    options: {
      borderWidth: 3,
      borderColor: '#404040',
      scales: {
        r: {
          display: false,
          suggestedMax: maxVal,
        }
      },
      plugins: {
        legend: false,
        tooltip: false,
      },
      elements: {
        arc: {
          backgroundColor: function(context) {
            const mid = 'rgba(0, 0, 0, 0.5)';
            const start = 'rgba(0, 0, 0, 0)';
            const end = 'rgba(0, 0, 0, 1)';
            return _createRadialGradient(context, start, mid, end, maxVal);
          }.bind(this),
        }
      }
    }
  });
}

export function createLineChart (ctx, dataSets) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from(Array(7).keys()),
      datasets: [
        {
          label: 'Travel Consumption',
          data: dataSets[1],
          fill: {
            target: 'stack',
            above: helpers.color(COLOR_TRAVEL).alpha(0.35).rgbString(),   // Area will be red above the origin
            below: 'rgba(0, 0, 255, 0)'    // And blue below the origin
          },
          borderColor: COLOR_TRAVEL,
          tension: 0
        },
        {
          label: 'Home Consumption',
          data: dataSets[0],
          fill: {
            target: 'origin',
            above: helpers.color(COLOR_HOME).alpha(0.35).rgbString(),   // Area will be red above the origin
            below: 'rgba(0, 0, 255, 0)'    // And blue below the origin
          },
          borderColor: COLOR_HOME,
          tension: 0
        },
        {
          label: 'Office Consumption',
          data: dataSets[2],
          fill: {
            target: 'stack',
            above: helpers.color(COLOR_OFFICE).alpha(0.35).rgbString(),   // Area will be red above the origin
            below: 'rgba(0, 0, 255, 0)'    // And blue below the origin
          },
          borderColor: COLOR_OFFICE,
          tension: 0
        }
      ]
    },
    options: {
      scales: {
        y: {
          stacked: true
        }
      }
    }
  });
}

function _createRadialGradient(context, c1, c2, c3, maxVal) {
  const chartArea = context.chart.chartArea;
  if (!chartArea) {
    // This case happens on initial chart load
    return;
  }
  const centerX = (chartArea.left + chartArea.right) / 2;
  const centerY = (chartArea.top + chartArea.bottom) / 2;
  const r = context.element.$context.raw / (maxVal*1.8) * context.chart.chartArea.width;
  const ctx = context.chart.ctx;
  let gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
  gradient.addColorStop(0, c1);
  gradient.addColorStop(0.65, c2); // Adjust the mid color stop coefficient to change darkness
  gradient.addColorStop(1, c3);

  return gradient;
}