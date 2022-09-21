import {Chart, registerables} from 'chart.js';

Chart.register(...registerables);

export function createPolarChart (ctx, dataSet) {
  return new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: [
        'Office heating',
        'Home heating',
        'Car travel',
        'Non-car travel',
        'Office electricity',
        'Home electricity'
      ],
      datasets: [{
        data: dataSet,
        backgroundColor: [
          'rgb(255, 178, 136)',
          'rgb(255, 178, 136)',
          'rgb(255, 168, 168)',
          'rgb(255, 168, 168)',
          'rgb(255, 208, 152)',
          'rgb(255, 208, 152)'
        ]
      }]
    },
    options: {
      borderWidth: 3,
      borderColor: '#404040',
      scales: {
        r: {
          suggestedMax: 12, // TODO: remove hard-code
          ticks: {
            color: 'white',
            backdropColor: 'rgba(0, 0, 0, 0.55)',
            backdropPadding: 5,
            z: 1
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.5)'
          }
        }
      },
      plugins: {
        legend: false
      }
    }
  });
}

export function createAreaChart (ctx, dataSets) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from(Array(7).keys()),
      datasets: [
        {
          label: 'Home Consumption',
          data: dataSets[0],
          fill: {
            target: 'origin',
            above: 'rgba(75,192,192,0.5)',   // Area will be red above the origin
            below: 'rgba(0,0,255,0)'    // And blue below the origin
          },
          borderColor: 'rgb(75, 192, 192)',
          tension: 0
        },
        {
          label: 'Travel Consumption',
          data: dataSets[1],
          fill: {
            target: 'stack',
            above: 'rgba(186,108,108,0.5)',   // Area will be red above the origin
            below: 'rgba(0,0,255,0)'    // And blue below the origin
          },
          borderColor: 'rgb(186,108,108)',
          tension: 0
        },
        {
          label: 'Office Consumption',
          data: dataSets[2],
          fill: {
            target: 'stack',
            above: 'rgba(112,223,55,0.5)',   // Area will be red above the origin
            below: 'rgba(0,0,255,0)'    // And blue below the origin
          },
          borderColor: 'rgb(112, 223, 55)',
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
