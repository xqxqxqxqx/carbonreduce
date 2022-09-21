import {
  cardComponentStyle,
  css,
  html,
  linkComponentStyle,
  LitElement,
  ScopedElementsMixin,
  spacer12,
  IngTabs,
  IngForm,
  black80,
  spacer32
} from 'ing-web';

import { IngExampleNavBar } from '../../ing-example-nav-bar/src/IngExampleNavBar.js';
import { IngCardCustom } from "../../ing-card-custom/src/IngCardCustom";
import { IngSliderCustom } from "../../ing-slider-custom/src/IngSliderCustom";
import { IngTabPanelCustom } from "../../ing-tab-panel-custom/src/IngTabPanelCustom";
import { IngTabCustom } from "../../ing-tab-custom/src/IngTabCustom";
import { createPolarChart, createAreaChart } from '../../../helpers/chart_generator.js';

import { Chart, registerables } from 'chart.js';
import {
  calcCarUsage,
  calcHomeElectricityUsage,
  calcHomeHeatingUsage,
  calcHomeUsage, calcOfficeElectricityUsage,
  calcOfficeHeatingUsage, calcOfficeUsage, calcPublicTransportUsage, calcTravelUsage
} from "../../../helpers/formulas";
Chart.register(...registerables);

export class IngAppCarbonReduce extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return {
      'ing-example-nav-bar': IngExampleNavBar,
      'ing-card': IngCardCustom,
      'ing-input-range': IngSliderCustom,
      'ing-tabs': IngTabs,
      'ing-tab': IngTabCustom,
      'ing-tab-panel': IngTabPanelCustom,
      'ing-form': IngForm,
    };
  }

  static get properties() {
    return {
      title: { type: String },
      areaChart: { type: Object },
      ctxPieChart: { type: Object },
      ctxLineChart: { type: Object },
      baselineAreaChart: { type: Array },
      polarChart: { type: Object },
      polarChartDataMax: { type: Number }
    };
  }

  constructor() {
    super();
    this.title = 'Carbon Configurator';

    this.baselineAreaChart = [Array.from({length: 100}, () => Math.floor(Math.random() * 100)),
      Array.from({length: 100}, () => Math.floor(Math.random() * 100)),
      Array.from({length: 100}, () => Math.floor(Math.random() * 100))];
  }

  firstUpdated() {
    // Grab the canvases where the charts will be injected
    this.ctxLineChart = this.renderRoot.querySelector( '#myLineChart' ).getContext('2d');
    this.ctxPolarChart = this.renderRoot.querySelector( '#polar-chart' ).getContext('2d');
    const ctx2 = this.renderRoot.querySelector( '#polar-chart-baseline' ).getContext('2d');

    // Initialise all charts with default baseline
    this.polarChart = createPolarChart(this.ctxPolarChart, this.polarChartMaxVal, [20, 16, 7, 2, 14, 4]);
    this.areaChart = createAreaChart(this.ctxLineChart, this.baselineAreaChart);

    const dataPolarChartBaseline = {
      datasets: [{
        data: [1700, 400, 200, 1300, 2000, 400]
      }]
    };

    this.polarChartMaxVal = Math.max(
      ...this._getPolarDataSet(),
      ...dataPolarChartBaseline.datasets[0].data
    );

    this.polarChartBaseline = new Chart(ctx2, {
      type: 'polarArea',
      data: dataPolarChartBaseline,
      options: {
        borderWidth: 3,
        borderColor: '#404040',
        scales: {
          r: {
            display: false,
            suggestedMax: this.polarChartMaxVal,
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
              return this._createRadialGradient(context, start, mid, end);
            }.bind(this),
          }
        }
      }
    });
  }

  _createRadialGradient(context, c1, c2, c3) {
    const chartArea = context.chart.chartArea;
    if (!chartArea) {
      // This case happens on initial chart load
      return;
    }
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    const r = context.element.$context.raw / (this.polarChartMaxVal*1.8) * context.chart.chartArea.width; // TODO: coefficent should be dynamic
    const ctx = context.chart.ctx;
    let gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
    gradient.addColorStop(0, c1);
    gradient.addColorStop(0.65, c2); // Adjust the mid color stop coefficient to change darkness
    gradient.addColorStop(1, c3);

    return gradient;
  }


  // Submit form programmatically when slider changes so that we can read values from form object modelValue
  _handleSliderValueChange(ev) {
    const ingForm = ev.target.parentElement.parentElement; // get ing-form element
    ingForm.submit();
  }

  // Update charts when one of the General sliders has changed
  _handleGeneralValueChange(ev) {
    // Get data from form
    const data = ev.currentTarget.modelValue;
    // Destroy old charts
    this.polarChart.destroy();
    this.areaChart.destroy();
    // Redraw charts with updated inputs
    // TODO: Replace parameters with data from sliders
    this.polarChart = createPolarChart(this.ctxPolarChart, this.polarChartMaxVal, this._getPolarDataSet());

    this.areaChart = createAreaChart(this.ctxLineChart, [calcHomeUsage(), calcTravelUsage(), calcOfficeUsage()]);
  }

  // Update charts when one of the Home sliders has changed
  _handleHomeValueChange(ev) {
    console.log(ev.currentTarget.modelValue)
    // Get data from form
    const data = ev.currentTarget.modelValue;
    // Destroy old charts
    this.polarChart.destroy();
    this.areaChart.destroy();
    // Redraw charts with updated inputs
    // TODO: Replace parameters with data from sliders
    this.polarChart = createPolarChart(this.ctxPolarChart, this.polarChartMaxVal, this._getPolarDataSet());

    this.areaChart = createAreaChart(this.ctxLineChart, [calcHomeUsage(), calcTravelUsage(), calcOfficeUsage()]);
  }

  // Update charts when one of the Office sliders has changed
  _handleOfficeValueChange(ev) {
    console.log(ev.currentTarget.modelValue);
    // Get data from form
    const data = ev.currentTarget.modelValue;
    // Destroy old charts
    this.polarChart.destroy();
    this.areaChart.destroy();
    // Redraw charts with updated inputs
    // TODO: Replace parameters with data from sliders
    this.polarChart = createPolarChart(this.ctxPolarChart, this.polarChartMaxVal, this._getPolarDataSet());

    this.areaChart = createAreaChart(this.ctxLineChart, [calcHomeUsage(), calcTravelUsage(), calcOfficeUsage()]);
  }

  // Update charts when one of the Travel sliders has changed
  _handleTravelValueChange(ev) {
    console.log(ev.currentTarget.modelValue);
    // Get data from form
    const data = ev.currentTarget.modelValue;
    // Destroy old charts
    this.polarChart.destroy();
    this.areaChart.destroy();
    // Redraw charts with updated inputs
    this.polarChart = createPolarChart(this.ctxPolarChart, this.polarChartMaxVal, this._getPolarDataSet());

    this.areaChart = createAreaChart(this.ctxLineChart, [calcHomeUsage(), calcTravelUsage(), calcOfficeUsage()]);
  }

  _getPolarDataSet() {
    // TODO: input should be taken from sliders
    return [
      calcHomeHeatingUsage(1,2),
      calcHomeElectricityUsage(1,2),
      calcOfficeHeatingUsage(1,2),
      calcOfficeElectricityUsage(1,2),
      calcCarUsage(1,2),
      calcPublicTransportUsage(1,2)
    ]
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
              <ing-form  @submit="${ev => this._handleGeneralValueChange(ev)}"">
                <form>
                  <ing-input-range
                    id="backToOffice"
                    name="backToOffice"
                    min="0"
                    max="100"
                    step="1"
                    .modelValue="${30}"
                    @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                    unit="%"
                    label="Back to Office"
                    help-text="Percentage of employees going back to office"
                  ></ing-input-range>
                  <ing-input-range
                    id="daysPerWeek"
                    name="daysPerWeek"
                    min="0"
                    max="5"
                    step="1"
                    .modelValue="${2}"
                    @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                    label="# Days per Week"
                    unit="Days"
                    help-text="Number of days per week in the office"
                  ></ing-input-range>
                </form>
              </ing-form>
              <ing-tabs .selectedIndex=${0}>
                <ing-tab slot="tab">Home</ing-tab>
                <ing-tab-panel slot="panel">
                  <ing-form @submit="${ev => this._handleHomeValueChange(ev)}">
                    <form>
                      <ing-input-range
                        name="floorSize"
                        min="0"
                        max="500"
                        step="10"
                        .modelValue="${100}"
                        @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                        label="Floor Size"
                        help-text="Square meters"
                      ></ing-input-range>
                      <ing-input-range
                        name="insulation"
                        min="0"
                        max="100"
                        step="1"
                        .modelValue="${10}"
                        @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                        label="House Insulation"
                        help-text="R-value"
                      ></ing-input-range>
                      <ing-input-range
                        name="insideTemp"
                        min="0"
                        max="30"
                        step="1"
                        .modelValue="${20}"
                        @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                        label="Home Inside Temperature"
                        help-text="Degrees Celsius"
                      ></ing-input-range>
                      <ing-input-range
                        name="renewableEnergy"
                        min="0"
                        max="50000"
                        step="100"
                        .modelValue="${20000}"
                        @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                        label="Renewable Energy Generation Capacity"
                        help-text="kWh"
                      ></ing-input-range>
                    </form>
                  </ing-form>
                </ing-tab-panel>
                <ing-tab slot="tab">Office</ing-tab>
                <ing-tab-panel slot="panel">
                  <ing-form @submit="${ev => this._handleOfficeValueChange(ev)}">
                    <form>
                      <ing-input-range
                        name="floorSize"
                        min="0"
                        max="50000"
                        step="500"
                        .modelValue="${10000}"
                        @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                        label="Floor Size"
                        help-text="Square meters"
                      ></ing-input-range>
                      <ing-input-range
                        name="insulation"
                        min="0"
                        max="100"
                        step="1"
                        .modelValue="${10}"
                        @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                        label="Building Insulation"
                        help-text="R-value"
                      ></ing-input-range>
                      <ing-input-range
                        name="insideTemp"
                        min="0"
                        max="30"
                        step="1"
                        .modelValue="${20}"
                        @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                        label="Building Inside Temperature"
                        help-text="Degrees Celsius"
                      ></ing-input-range>
                      <ing-input-range
                        name="renewableEnergy"
                        min="0"
                        max="50000"
                        step="100"
                        .modelValue="${20000}"
                        @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                        label="Renewable Energy Generation Capacity"
                        help-text="kWh"
                      ></ing-input-range>
                    </form>
                  </ing-form>
                </ing-tab-panel>
                <ing-tab slot="tab">Travel</ing-tab>
                <ing-tab-panel slot="panel">
                  <ing-form @submit="${ev => this._handleTravelValueChange(ev)}">
                    <form>
                      <ing-input-range
                        name="kilometersPerWeek"
                        min="0"
                        max="500"
                        step="10"
                        .modelValue="${30}"
                        @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                        label="Car"
                        help-text="kilometers/week"
                      ></ing-input-range>
                    </form>
                  </ing-form>
                </ing-tab-panel>
              </ing-tabs>
            </div>
          </ing-card>
          <ing-card class="ing_card">
            <h2 slot="heading">${this.title}</h2>
            <div slot="content">
              <canvas id="myLineChart" width="400" height="400"></canvas>
            </div>
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
