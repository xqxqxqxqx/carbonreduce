import {
  cardComponentStyle,
  css,
  html,
  linkComponentStyle,
  LitElement,
  ScopedElementsMixin,
  spacer12,
  black80,
  spacer32
} from 'ing-web';

import { IngExampleNavBar } from '../../ing-example-nav-bar/src/IngExampleNavBar.js';
import { IngCardCustom } from "../../ing-card-custom/src/IngCardCustom";
import { IngSliderCustom } from "../../ing-slider-custom/src/IngSliderCustom";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export class IngAppCarbonReduce extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return {
      'ing-example-nav-bar': IngExampleNavBar,
      'ing-card': IngCardCustom,
      'ing-input-range': IngSliderCustom,
    };
  }

  static get properties() {
    return {
      title: { type: String },
      polarChart: { type: Object },
    };
  }

  constructor() {
    super();
    this.title = 'Hello, Carbon Reducers!';
  }

  firstUpdated() {
    const ctx = this.renderRoot.querySelector( '#polar-chart' ).getContext('2d');
    const ctx2 = this.renderRoot.querySelector( '#polar-chart-baseline' ).getContext('2d');

    const dataPolarChart = {
      labels: [
        'Office heating',
        'Home heating',
        'Car travel',
        'Non-car travel',
        'Office electricity',
        'Home electricity'
      ],
      datasets: [{
        data: [20, 16, 7, 2, 14, 4],
        backgroundColor: [
          'rgb(255, 178, 136)',
          'rgb(255, 178, 136)',
          'rgb(255, 168, 168)',
          'rgb(255, 168, 168)',
          'rgb(255, 208, 152)',
          'rgb(255, 208, 152)'
        ]
      }]
    };

    const dataPolarChartBaseline = {
      datasets: [{
        data: [17, 4, 2, 13, 3, 4]
      }]
    };

    const polarChartDataMax = Math.max(
      ...dataPolarChart.datasets[0].data,
      ...dataPolarChartBaseline.datasets[0].data
    );

    this.polarChart = new Chart(ctx, {
      type: 'polarArea',
      data: dataPolarChart,
      options: {
        borderWidth: 3,
        borderColor: '#404040',
        scales: {
          r: {
            suggestedMax: polarChartDataMax,
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

    this.polarChartBaseline = new Chart(ctx2, {
      type: 'polarArea',
      data: dataPolarChartBaseline,
      options: {
        borderWidth: 3,
        borderColor: '#404040',
        scales: {
          r: {
            display: false,
            suggestedMax: polarChartDataMax,
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
              return this.createRadialGradient3(context, start, mid, end);
            }.bind(this),
          }
        }
      }
    });
  }

  createRadialGradient3(context, c1, c2, c3) {
    const chartArea = context.chart.chartArea;
    if (!chartArea) {
      // This case happens on initial chart load
      return;
    }
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    const r = context.element.$context.raw / 32 * context.chart.chartArea.width; // TODO: coefficent should be dynamic
    const ctx = context.chart.ctx;
    let gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
    gradient.addColorStop(0, c1);
    gradient.addColorStop(0.65, c2); // Adjust the mid color stop coefficient to change darkness
    gradient.addColorStop(1, c3);
  
    return gradient;
  }

  render() {
    return html`
      <ing-example-nav-bar></ing-example-nav-bar>
      <div class="page-container">
        <div class="column1">
          <div class="polar-area-container">
            <div>
              <canvas id="polar-chart-baseline" width="300" height="300"></canvas>
              <canvas id="polar-chart" width="300" height="300"></canvas>
            </div>
          </div>
          <div>
            <ing-card class="ing_card">
              <h2 slot="heading">${this.title}</h2>
              <p slot="content"> Let's win this! </p>
            </ing-card>
            <ing-card class="ing_card">
              <h2 slot="heading">${this.title}</h2>
              <p slot="content"> Let's win this! </p>
            </ing-card>
          </div>
        </div>
        <div class="column2">
          <ing-card class="ing_card">
            <h2 slot="heading">${this.title}</h2>
            <div slot="content">
              <ing-input-range
                min="0"
                max="100"
                .modelValue="${50}"
                unit="%"
                label="Percentage"
              ></ing-input-range>
              <ing-input-range
                min="200"
                max="500"
                step="50"
                .modelValue="${300}"
                label="Input range"
                help-text="This slider uses increments of 50"
              ></ing-input-range>
              <ing-input-range
                disabled
                min="200"
                max="500"
                .modelValue="${300}"
                label="Input range"
              ></ing-input-range>
            </div>
          </ing-card>
          <ing-card class="ing_card">
            <h2 slot="heading">${this.title}</h2>
            <p slot="content"> Let's win this! </p>
          </ing-card>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      ${linkComponentStyle}
      ${cardComponentStyle}
      :host {
        background-color: white;
      }

      .page-container {
        text-align: center;
        margin: ${spacer32};
        display: flex;
        gap: ${spacer12}
      }

      .ing_card {
        background-color: ${black80};
      }

      .column1 {
        display: inline-block;
        flex: 2;
      }

      .column2 {
        display: inline-block;
        flex: 1;
      }

      h2, p {
        color: white;
      }

      .chart {
        width: 800px;
        height: 800px;
      }

      .polar-area-container {
        margin: ${spacer32};
      }

      #polar-chart-baseline {
        position: absolute;
        pointer-events: none;
      }
    `;
  }
}
