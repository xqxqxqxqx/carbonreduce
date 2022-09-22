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
  spacer8,
  IngAccordion,
  IngIcon,
  registerDefaultIconsets,
  IngButton,
  font16Mixin,
  font24BoldMixin,
  orange,
  spacer32
} from 'ing-web';

import { IngHeader } from '../../ing-example-nav-bar/src/IngHeader.js';
import { IngCardCustom } from "../../ing-card-custom/src/IngCardCustom";
import { IngSliderCustom } from "../../ing-slider-custom/src/IngSliderCustom";
import { IngTabPanelCustom } from "../../ing-tab-panel-custom/src/IngTabPanelCustom";
import { IngTabCustom } from "../../ing-tab-custom/src/IngTabCustom";
import { IngAccordionContentCustom } from "../../ing-accordion-content-custom/src/IngAccordionContentCustom";
import { IngAccordionInvokerButtonCustom } from "../../ing-accordion-invoker-button-custom/src/IngAccordionInvokerButtonCustom";
import {
  createPolarChart,
  createPolarChartBaseline,
  createAreaChart,
  createDoughnutChart
} from '../../../helpers/chart_generator.js';

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
      'ing-button': IngButton,
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
      areaChart: { type: Object },
      ctxPolarChart: { type: Object },
      ctxPolarChartBaseline: { type: Object },
      ctxAreaChart: { type: Object },
      areaChartBaseline: { type: Array },
      polarChart: { type: Object },
      polarChartDataMax: { type: Number },
      polarChartBaselineDataset: { type: Array },
      polarChartDataset: { type: Array },
      b20SliderValue: { type: Number },
      daysPerWeekSliderValue: { type: Number },
      goalCO2: { type: Number },
      achievedCO2: { type: Number },
      baselineTotalCO2: { type: Number },
      doughnutChart: { type: Object },
      ctxDoughnutChart: { type: Object },
    };
  }

  constructor() {
    super();
    registerDefaultIconsets();

    this.b20SliderValue = 40;
    this.goalCO2 = 150;
    this.achievedCO2 = 67;
    this.baselineTotalCO2 = 300;

    this.title = 'Carbon Configurator';
    this.polarChartBaselineDataset = [300, 100, 200, 450, 600, 850];

    this.polarChartMaxVal = Math.max(
      ...this._getPolarDataSet(),
      ...this.polarChartBaselineDataset
    );

    this.areaChartBaseline = [Array.from({length: 101}, () => Math.floor(Math.random() * 100)),
      Array.from({length: 101}, () => Math.floor(Math.random() * 100)),
      Array.from({length: 101}, () => Math.floor(Math.random() * 100))];
  }

  firstUpdated() {
    // Grab the canvases where the charts will be injected
    this.ctxAreaChart = this.renderRoot.querySelector( '#area-chart' ).getContext('2d');
    this.ctxPolarChart = this.renderRoot.querySelector( '#polar-chart' ).getContext('2d');
    this.ctxPolarChartBaseline = this.renderRoot.querySelector( '#polar-chart-baseline' ).getContext('2d');
    this.ctxDoughnutChart = this.renderRoot.querySelector( '#doughnut-chart' ).getContext('2d');

    // Initialise all charts with default baseline
    this.polarChart = createPolarChart(this.ctxPolarChart, this.polarChartMaxVal, this._getPolarDataSet());
    this.ctxPolarChartBaseline = createPolarChartBaseline(this.ctxPolarChartBaseline, this.polarChartMaxVal, this.polarChartBaselineDataset);
    this.areaChart = createAreaChart(this.ctxAreaChart, this.areaChartBaseline, this.goalCO2, this.b20SliderValue);
    this.doughnutChart = createDoughnutChart(this.ctxDoughnutChart, this.achievedCO2, this.goalCO2);
    // Below elements'position config caused themselves taken out of flow of DOM and flexbox
    // This is a workaround to configure their width in flex-box way
    setTimeout(function(){
      let elmSlider = this.shadowRoot.querySelector(".slider-card");
      elmSlider.style.width = window.getComputedStyle(elmSlider.parentElement).width;
      let elmBackground = this.shadowRoot.querySelector("#polar-background");
      elmBackground.style.width = window.getComputedStyle(elmBackground.parentElement).width;
    }.bind(this), 80);
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
    this.b20SliderValue = data['backToOffice'];
    // Destroy old charts
    this.polarChart.destroy();
    this.areaChart.destroy();
    // Redraw charts with updated inputs
    // TODO: Replace parameters with data from sliders
    this.polarChart = createPolarChart(this.ctxPolarChart, this.polarChartMaxVal, this._getPolarDataSet());

    this.areaChart = createAreaChart(this.ctxAreaChart, this._getAreaDataSet(), this.goalCO2, this.b20SliderValue);
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

    this.areaChart = createAreaChart(this.ctxAreaChart, this._getAreaDataSet(), this.goalCO2, this.b20SliderValue);
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

    this.areaChart = createAreaChart(this.ctxAreaChart, this._getAreaDataSet(), this.goalCO2, this.b20SliderValue);
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

    this.areaChart = createAreaChart(this.ctxAreaChart, this._getAreaDataSet(), this.goalCO2, this.b20SliderValue);
  }

  _getAreaDataSet() {
    // TODO: input should be taken from sliders
    return [
      calcHomeUsage(),
      calcTravelUsage(),
      calcOfficeUsage()
    ]
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
      <div class="page-container flexbox">
        <div class="column1">
          <img id="polar-background" src="../../assets/polarBackground.png" alt="Background">
          <div>
            <div class="polar-chart">
              <canvas id="polar-chart-baseline" width="300" height="300"></canvas>
              <canvas id="polar-chart" width="300" height="300"></canvas>
            </div>
          </div>
          <div>
            <ing-card>
              <div slot="heading" class="card-title">Back-to-office Impact Overview</div>
              <div slot="content">
                <canvas id="area-chart" width="400" height="100"></canvas>
              </div>
            </ing-card>
            <div class="flexbox achievement__container">
              <ing-card style="flex: 1;">
                <div slot="content" class="achievement__flexbox">
                  <img width="80" src="../../assets/sustainable.png" alt="Illustration" style="flex: 1;">
                  <p style="flex: 2;"> ING will achieve
                    ${this.baselineTotalCO2 >= this.achievedCO2 ? html`
                      <span class="card-highlight">${this.baselineTotalCO2 - this.achievedCO2}</span> ton CO2<br>less than the baseline
                    ` : html`
                      <span class="card-highlight">${this.achievedCO2 - this.baselineTotalCO2 }</span> ton CO2<br>more than the baseline
                    `}
                  </p>
                </div>
              </ing-card>
              <ing-card style="flex: 1;">
                <div slot="content" class="achievement__flexbox">
                  <div style="flex: 1;">
                    <div class="doughnut-label">${this.achievedCO2} / ${this.goalCO2}</div>
                    <canvas id="doughnut-chart" width="90" height="80"></canvas>
                  </div>
                  <p style="flex: 2;">ING will achieve<span class="card-highlight">${Math.round(this.achievedCO2/this.goalCO2 * 100)}%</span><br>of the CO2 emission target</p>
                </div>
              </ing-card>
            </div>
          </div>
        </div>
        <div class="column2">
          <ing-card class="slider-card">
            <div slot="content">
              <div class="slider-content">
                <ing-form  @submit="${ev => this._handleGeneralValueChange(ev)}"">
                  <form>
                    <ing-input-range
                      id="backToOffice"
                      name="backToOffice"
                      min="0"
                      max="100"
                      step="1"
                      .modelValue="${this.b20SliderValue}"
                      @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                      unit="%"
                      label="Employees Back to Office"
                    ></ing-input-range>
                    <ing-input-range
                      id="daysPerWeek"
                      name="daysPerWeek"
                      min="0"
                      max="5"
                      step="1"
                      .modelValue="${2}"
                      @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                      label="# Days per Week in Office"
                      unit="Days"
                    ></ing-input-range>
                    <ing-input-range
                      id="buildingsOpen"
                      name="buildingsOpen"
                      min="0"
                      max="20"
                      step="1"
                      .modelValue="${10}"
                      @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                      label="Buildings Open"
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
              <ing-button class="button__baseline">Set New Baseline</ing-button>
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
        margin: ${spacer8}  ${spacer24};
      }page-container

      .button__baseline {
        background-color: black;
        border-color: white;
        margin: 12px;
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

      #polar-background {
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
      }

      #polar-chart-baseline {
        position: absolute;
        pointer-events: none;
      }

      #doughnut-chart {
        pointer-events: none;
      }

      .doughnut-label {
        ${font16Mixin()};
        color: ${orange};
        position: absolute;
        top: 47%;
        text-align: center;
        width: 27%;
      }

      .card-title {
        ${font19Mixin()};
        color: ${white};
      }

      .card-highlight {
        ${font24BoldMixin()};
        color: ${orange};
        margin: ${spacer8};
      }

      .slider-card {
        position: fixed;
        right: ${spacer24};
      }

      .slider-content {
        height: calc(100vh - 211px);
        overflow-y: auto;
        padding-right: ${spacer24};
        margin-bottom: ${spacer24}
      }

      .flexbox {
        display: flex;
        gap: ${spacer12};
        justify-content: center;
      }

      .achievement__container {
        position: relative;
        top: -6px;
      }

      .achievement__flexbox {
        display: flex;
        gap: ${spacer32};
        justify-content: center;
        align-items: center;
        margin: ${spacer8} ${spacer24};
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
