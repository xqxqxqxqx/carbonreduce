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
  spacer24,
  white,
  font19Mixin,
  spacer64,
  IngAccordion,
  IngIcon,
  registerDefaultIconsets
} from 'ing-web';

import { IngHeader } from '../../ing-example-nav-bar/src/IngHeader.js';
import { IngCardCustom } from "../../ing-card-custom/src/IngCardCustom";
import { IngSliderCustom } from "../../ing-slider-custom/src/IngSliderCustom";
import { IngTabPanelCustom } from "../../ing-tab-panel-custom/src/IngTabPanelCustom";
import { IngTabCustom } from "../../ing-tab-custom/src/IngTabCustom";
import { IngAccordionContentCustom } from "../../ing-accordion-content-custom/src/IngAccordionContentCustom";
import { IngAccordionInvokerButtonCustom } from "../../ing-accordion-invoker-button-custom/src/IngAccordionInvokerButtonCustom";
import { createPolarChart, createPolarChartBaseline, createLineChart } from '../../../helpers/chart_generator.js';

import {
  calcCarUsage,
  calcHomeElectricityUsage,
  calcHomeHeatingUsage,
  calcHomeUsage, calcOfficeElectricityUsage,
  calcOfficeHeatingUsage, calcOfficeUsage, calcPublicTransportUsage, calcTravelUsage
} from "../../../helpers/formulas";

Chart.register(...registerables);
import { Chart, registerables } from 'chart.js';


export class IngAppCarbonReduce extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return {
      'ing-example-nav-bar': IngHeader,
      'ing-card': IngCardCustom,
      'ing-input-range': IngSliderCustom,
      'ing-tabs': IngTabs,
      'ing-tab': IngTabCustom,
      'ing-icon': IngIcon,
      'ing-tab-panel': IngTabPanelCustom,
      'ing-form': IngForm,
      'ing-accordion': IngAccordion,
      'ing-accordion-content': IngAccordionContentCustom,
      'ing-accordion-invoker-button': IngAccordionInvokerButtonCustom,
    };
  }

  static get properties() {
    return {
      title: { type: String },
      lineChart: { type: Object },
      ctxPolarChart: { type: Object },
      ctxPolarChartBaseline: { type: Object },
      ctxLineChart: { type: Object },
      lineChartBaseline: { type: Array },
      polarChart: { type: Object },
      polarChartDataMax: { type: Number },
      polarChartBaselineDataset: { type: Object }
    };
  }

  constructor() {
    super();
    registerDefaultIconsets();

    this.title = 'Carbon Configurator';
    this.polarChartBaselineDataset = [300, 100, 200, 450, 600, 850];

    this.polarChartMaxVal = Math.max(
      ...this._getPolarDataSet(),
      ...this.polarChartBaselineDataset
    );

    this.lineChartBaseline = [Array.from({length: 100}, () => Math.floor(Math.random() * 100)),
      Array.from({length: 100}, () => Math.floor(Math.random() * 100)),
      Array.from({length: 100}, () => Math.floor(Math.random() * 100))];
  }

  firstUpdated() {
    // Grab the canvases where the charts will be injected
    this.ctxLineChart = this.renderRoot.querySelector( '#line-chart' ).getContext('2d');
    this.ctxPolarChart = this.renderRoot.querySelector( '#polar-chart' ).getContext('2d');
    this.ctxPolarChartBaseline = this.renderRoot.querySelector( '#polar-chart-baseline' ).getContext('2d');

    // Initialise all charts with default baseline
    this.polarChart = createPolarChart(this.ctxPolarChart, this.polarChartMaxVal, this._getPolarDataSet());
    this.ctxPolarChartBaseline = createPolarChartBaseline(this.ctxPolarChartBaseline, this.polarChartMaxVal, this.polarChartBaselineDataset);
    this.lineChart = createLineChart(this.ctxLineChart, this.lineChartBaseline);

    // Sliders' position is set as fixed causing the element taken out of flow of DOM and flexbox
    // This is a workaround to configure its width in flex-box way
    setTimeout(function(){
      let elm = this.shadowRoot.querySelector(".slider-card");
      elm.style.width = window.getComputedStyle(elm.parentElement).width;
    }.bind(this), 0);
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
    this.lineChart.destroy();
    // Redraw charts with updated inputs
    // TODO: Replace parameters with data from sliders
    this.polarChart = createPolarChart(this.ctxPolarChart, this.polarChartMaxVal, this._getPolarDataSet());

    this.lineChart = createLineChart(this.ctxLineChart, [calcHomeUsage(), calcTravelUsage(), calcOfficeUsage()]);
  }

  // Update charts when one of the Home sliders has changed
  _handleHomeValueChange(ev) {
    console.log(ev.currentTarget.modelValue)
    // Get data from form
    const data = ev.currentTarget.modelValue;
    // Destroy old charts
    this.polarChart.destroy();
    this.lineChart.destroy();
    // Redraw charts with updated inputs
    // TODO: Replace parameters with data from sliders
    this.polarChart = createPolarChart(this.ctxPolarChart, this.polarChartMaxVal, this._getPolarDataSet());

    this.lineChart = createLineChart(this.ctxLineChart, [calcHomeUsage(), calcTravelUsage(), calcOfficeUsage()]);
  }

  // Update charts when one of the Office sliders has changed
  _handleOfficeValueChange(ev) {
    console.log(ev.currentTarget.modelValue);
    // Get data from form
    const data = ev.currentTarget.modelValue;
    // Destroy old charts
    this.polarChart.destroy();
    this.lineChart.destroy();
    // Redraw charts with updated inputs
    // TODO: Replace parameters with data from sliders
    this.polarChart = createPolarChart(this.ctxPolarChart, this.polarChartMaxVal, this._getPolarDataSet());

    this.lineChart = createLineChart(this.ctxLineChart, [calcHomeUsage(), calcTravelUsage(), calcOfficeUsage()]);
  }

  // Update charts when one of the Travel sliders has changed
  _handleTravelValueChange(ev) {
    console.log(ev.currentTarget.modelValue);
    // Get data from form
    const data = ev.currentTarget.modelValue;
    // Destroy old charts
    this.polarChart.destroy();
    this.lineChart.destroy();
    // Redraw charts with updated inputs
    this.polarChart = createPolarChart(this.ctxPolarChart, this.polarChartMaxVal, this._getPolarDataSet());

    this.lineChart = createLineChart(this.ctxLineChart, [calcHomeUsage(), calcTravelUsage(), calcOfficeUsage()]);
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
          <div>
            <div class="polar-chart">
              <canvas id="polar-chart-baseline" width="300" height="300"></canvas>
              <canvas id="polar-chart" width="300" height="300"></canvas>
            </div>
          </div>
          <div>
            <ing-card class="ing_card">
              <div slot="heading" class="card-title">Back-to-office Impact Overview</div>
              <div slot="content">
                <canvas id="line-chart" width="400" height="100"></canvas>
              </div>
            </ing-card>
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
          <ing-card class="ing_card slider-card">
            <div slot="content" class="slider-content">
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
              <ing-accordion>
                <h3 slot="invoker">
                  <ing-accordion-invoker-button>Home</ing-accordion-invoker-button>
                </h3>
                <ing-accordion-content slot="content">
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
                        unit="square meters"
                      ></ing-input-range>
                      <ing-input-range
                        name="insulation"
                        min="0"
                        max="100"
                        step="1"
                        .modelValue="${10}"
                        @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                        label="House Insulation"
                        unit="R-value"
                      ></ing-input-range>
                      <ing-input-range
                        name="insideTemp"
                        min="0"
                        max="30"
                        step="1"
                        .modelValue="${20}"
                        @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                        label="Home Inside Temperature"
                        unit="Degrees Celsius"
                      ></ing-input-range>
                      <ing-input-range
                        name="renewableEnergy"
                        min="0"
                        max="50000"
                        step="100"
                        .modelValue="${20000}"
                        @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                        label="Renewable Energy Generation Capacity"
                        unit="kWh"
                      ></ing-input-range>
                    </form>
                  </ing-form>
                </ing-accordion-content>
                <h3 slot="invoker">
                  <ing-accordion-invoker-button>Office</ing-accordion-invoker-button>
                </h3>
                <ing-accordion-content slot="content">
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
                        unit="square meters"
                      ></ing-input-range>
                      <ing-input-range
                        name="insulation"
                        min="0"
                        max="100"
                        step="1"
                        .modelValue="${10}"
                        @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                        label="Building Insulation"
                        unit="R-value"
                      ></ing-input-range>
                      <ing-input-range
                        name="insideTemp"
                        min="0"
                        max="30"
                        step="1"
                        .modelValue="${20}"
                        @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                        label="Building Inside Temperature"
                        unit="Degrees Celsius"
                      ></ing-input-range>
                      <ing-input-range
                        name="renewableEnergy"
                        min="0"
                        max="50000"
                        step="100"
                        .modelValue="${20000}"
                        @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                        label="Renewable Energy Generation Capacity"
                        unit="kWh"
                      ></ing-input-range>
                    </form>
                  </ing-form>
                </ing-accordion-content>
                <h3 slot="invoker">
                  <ing-accordion-invoker-button>Travel</ing-accordion-invoker-button>
                </h3>
                <ing-accordion-content slot="content">
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
                        unit="km/week"
                      ></ing-input-range>
                    </form>
                  </ing-form>
                </ing-accordion-content>
              </ing-accordion>
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
        position: relative;
        top: ${spacer64};
        text-align: center;
        margin: ${spacer12}  ${spacer24};
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

      .polar-chart {
        width: 67%;
        margin: auto;
      }

      #polar-chart-baseline {
        position: absolute;
        pointer-events: none;
      }

      .card-title {
        ${font19Mixin()};
        color: ${white};
      }

      .slider-card {
        position: fixed;
        right: ${spacer24};
      }

      .slider-content {
        height: calc(100vh - 142px);
        overflow-y: auto;
        padding-right: 24px;
      }

      /* Start of Custom scrollbar */
      ::-webkit-scrollbar {
        width: 10px;
      }
      ::-webkit-scrollbar-track {
        background: #f1f1f1;
      }
      ::-webkit-scrollbar-thumb {
        background: #888;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
      /* End of Custom scrollbar */
    `;
  }
}
