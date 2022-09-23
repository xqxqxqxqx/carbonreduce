import {Chart, registerables} from 'chart.js';
import * as helpers from 'chart.js/helpers';
import {orange} from 'ing-web';

Chart.register(...registerables);

const COLOR_HOME = 'rgb(255, 166, 161)';
const COLOR_OFFICE = 'rgb(255, 149, 112)';
const COLOR_TRAVEL = 'rgb(249, 212, 192)';
const WHITE = 'rgb(255, 255, 255)';

export function createPolarChart (ctx, maxVal, dataSet) {
  return new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: [
        'Office gas',
        'Office electricity',
        'Car travel',
        'Non-car travel',
        'Home electricity',
        'Home gas'
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

export function createAreaChart (ctx, dataSets, goal, b20) {
  return new Chart(ctx, {
    data: {
      labels: Array.from(Array(100).keys()),
      datasets: [
        {
          type: 'line',
          label: 'CO2 Goal',
          data: Array(100).fill(goal),
          yAxisID: "ygoal",
          fill: false,
          borderColor: orange,
          borderWidth: 2,
          borderDash: [2],
          borderJoinStyle: 'round',
          tension: 0
        },
        {
          type: 'line',
          label: 'B2O %',
          axis: 'y',
          data: Array(300).fill(b20),
          yAxisID: "yb2o",
          fill: false,
          indexAxis: 'y',
          borderColor: WHITE,
          borderWidth: 2,
          borderDash: [2],
          tension: 0
        },
        {
          type: 'line',
          label: 'Travel Consumption',
          data: dataSets[1],
          yAxisID: "ystack",
          fill: {
            target: 'stack',
            above: helpers.color(COLOR_TRAVEL).alpha(0.35).rgbString(),
            below: helpers.color(COLOR_TRAVEL).alpha(0.35).rgbString(),
          },
          borderColor: COLOR_TRAVEL,
          tension: 0.3
        },
        {
          type: 'line',
          label: 'Home Consumption',
          data: dataSets[0],
          yAxisID: "ystack",
          fill: {
            target: 'stack',
            above: helpers.color(COLOR_HOME).alpha(0.35).rgbString(),
            below: helpers.color(COLOR_HOME).alpha(0.35).rgbString()
          },
          borderColor: COLOR_HOME,
          tension: 0.3
        },
        {
          type: 'line',
          label: 'Office Consumption',
          data: dataSets[2],
          yAxisID: "ystack",
          fill: {
            target: 'stack',
            above: helpers.color(COLOR_OFFICE).alpha(0.35).rgbString(),
            below: helpers.color(COLOR_OFFICE).alpha(0.35).rgbString(),
          },
          borderColor: COLOR_OFFICE,
          tension: 0.3
        }
      ]
    },
    options: {
      elements: {
        point:{
          radius: 0
        }
      },
      scales: {
        x: {
          type: "linear",
          stacked: true,
          display: true,
          min: 0,
          beginAtZero: true,
          title: {
            display: true,
            text: 'Employees back to office (%)',
            color: helpers.color(WHITE).alpha(0.35).rgbString(),
          }
        },
        ystack: {
          type: "linear",
          stacked: true,
          display: true,
          position: "left",
          min: 0,
          suggestedMax: 300,
          title: {
            display: true,
            text: 'CO2 emission (kt)',
            color: helpers.color(WHITE).alpha(0.35).rgbString(),
          }
        },
        ygoal: {
          type: "linear",
          display: false,
          stacked: false,
          min: 0,
          suggestedMax: 300
        },
        yb2o: {
          type: "linear",
          display: false,
          stacked: false,
          beginAtZero: true,
          min: 0,
          suggestedMin: 0,
          suggestedMax: 100
        }
      }
    }
  });
}

export function createDoughnutChart (ctx, achieved, goal) {
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [achieved, achieved <= goal ? goal - achieved : 0],
        backgroundColor: [
          orange,
          'rgba(255, 255, 255, 0.1)'
        ]
      }]
    },
    options: {
      borderWidth: 0,
      cutout: '80%'
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
