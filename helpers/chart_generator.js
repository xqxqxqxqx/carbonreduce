import {Chart, registerables} from 'chart.js';

Chart.register(...registerables);

export function createPieChart (ctx, dataSets) {
  return new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: [
        'Home Heating',
        'Home Electricity ',
        'Office Heating',
        'Office Electricity',
        'Public Transportation',
        'Car Transportation'
      ],
      datasets: [{
        label: 'Baseline',
        data: dataSets[0],
        backgroundColor: [
          'rgb(255, 99, 132, 0.5)',
          'rgb(75, 192, 192, 0.5)',
          'rgb(255, 205, 86, 0.5)',
          'rgb(201, 203, 207, 0.5)',
          'rgb(54, 162, 235, 0.5)',
          'rgb(88, 225, 101, 0.5)'
        ]
      }, {
          label: 'Custom',
          data: dataSets[1],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(75, 192, 192)',
            'rgb(255, 205, 86)',
            'rgb(201, 203, 207)',
            'rgb(54, 162, 235)',
            'rgb(88, 225, 101)'
          ]
        }
      ]
    },
    options: {}
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
