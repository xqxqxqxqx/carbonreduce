import {
  cardComponentStyle,
  css,
  html,
  linkComponentStyle,
  LitElement,
  ScopedElementsMixin,
  spacer64,
  spacer12,
  black80
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
      myChart: { type: Object }
    };
  }

  constructor() {
    super();
    this.title = 'Hello, Carbon Reducers!';
  }

  firstUpdated() {
    const ctx = this.renderRoot.querySelector( '#myChart' ).getContext('2d');

    const data = {
      labels: [
        'Red',
        'Green',
        'Yellow',
        'Grey',
        'Blue'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [11, 16, 7, 3, 14],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(75, 192, 192)',
          'rgb(255, 205, 86)',
          'rgb(201, 203, 207)',
          'rgb(54, 162, 235)'
        ]
      }]
    };

    this.myChart = new Chart(ctx, {
      type: 'polarArea',
      data: data,
      options: {}
    });
  }

  render() {
    return html`
      <ing-example-nav-bar></ing-example-nav-bar>
      <div class="page-container">
        <div class="column1">
          <div>
            <ing-card class="ing_card" style="background-color: black">
              <h2 slot="heading">${this.title}</h2>
              <div slot="content">
                <canvas id="myChart" width="400" height="400"></canvas>
              </div>
            </ing-card>
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
        background-color: ${black80};
      }

      .page-container {
        text-align: center;
        margin: ${spacer64};
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
    `;
  }
}
