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
  spacer32,
  font12Mixin
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
  calcHomeGasUsage,
  calcHomeUsage, calcOfficeElectricityUsage,
  calcOfficeGasUsage, calcOfficeUsage, calcNonCarUsage, calcTravelUsage
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
      polarChartBaseline: { type: Object },
      polarChartDataMax: { type: Number },
      polarChartBaselineDataset: { type: Array },
      polarChartDataset: { type: Array },
      daysPerWeekSliderValue: { type: Number },
      goalCO2: { type: Number },
      achievedCO2: { type: Number },
      baselineTotalCO2: { type: Number },
      doughnutChart: { type: Object },
      ctxDoughnutChart: { type: Object },
      inputsGeneralSliders: { type: Object },
      inputsHomeSliders: { type: Object },
      inputsOfficeSliders: { type: Object },
      inputsTravelSliders: { type: Object },
      inputsGeneralSlidersBaseline: { type: Object },
      inputsHomeSlidersBaseline: { type: Object },
      inputsOfficeSlidersBaseline: { type: Object },
      inputsTravelSlidersBaseline: { type: Object },
    };
  }

  constructor() {
    super();
    registerDefaultIconsets();

    // Baseline slider input values
    this.inputsGeneralSlidersBaseline = {
      "backToOffice": 50,
      "daysPerWeek": 2
    };
    this.inputsHomeSlidersBaseline = {
      "gasUsage": 15.6,
      "electricityUsage": 37.2
    };
    this.inputsOfficeSlidersBaseline = {
      "gasUsage": 5.33,
      "electricityUsage": 5.87
    };
    this.inputsTravelSlidersBaseline = {
      "kilometersPerDay": 30,
      "carUserPerc": 35
    };

    // Set initial input values
    this.inputsGeneralSliders = this.inputsGeneralSlidersBaseline;
    this.inputsHomeSliders = this.inputsHomeSlidersBaseline;
    this.inputsOfficeSliders = this.inputsOfficeSlidersBaseline;
    this.inputsTravelSliders = this.inputsTravelSlidersBaseline;

    this.goalCO2 = 26.25;
    this.achievedCO2 = 67;
    this.baselineTotalCO2 = 300;

    this.title = 'Carbon Configurator';
    this.polarChartBaselineDataset = this._getPolarDataSet();
    this.baselineTotalCO2 = Math.round(this.polarChartBaselineDataset.reduce((partialSum, a) => partialSum + a, 0));

    this.polarChartMaxVal = Math.max(
      ...this._getPolarDataSet(),
      ...this.polarChartBaselineDataset
    );

    this.areaChartBaseline = this._getAreaDataSet();
    console.log(this.areaChartBaseline)
  }

  firstUpdated() {
    // Grab the canvases where the charts will be injected
    this.ctxAreaChart = this.renderRoot.querySelector( '#area-chart' ).getContext('2d');
    this.ctxPolarChart = this.renderRoot.querySelector( '#polar-chart' ).getContext('2d');
    this.ctxPolarChartBaseline = this.renderRoot.querySelector( '#polar-chart-baseline' ).getContext('2d');
    this.ctxDoughnutChart = this.renderRoot.querySelector( '#doughnut-chart' ).getContext('2d');

    // Initialise all charts with default baseline
    this.polarChart = createPolarChart(this.ctxPolarChart, this.polarChartMaxVal, this._getPolarDataSet());
    this.polarChartBaseline = createPolarChartBaseline(this.ctxPolarChartBaseline, this.polarChartMaxVal, this.polarChartBaselineDataset);
    this.areaChart = createAreaChart(this.ctxAreaChart, this.areaChartBaseline, this.goalCO2, this.inputsGeneralSliders["backToOffice"]);
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
    this.inputsGeneralSliders = ev.currentTarget.modelValue;
    // Destroy old charts
    this.polarChart.destroy();
    this.polarChartBaseline.destroy();
    this.areaChart.destroy();
    // Redraw charts with updated inputs
    // TODO: Replace parameters with data from sliders
    this.polarChartMaxVal = Math.max(
      ...this._getPolarDataSet(),
      ...this.polarChartBaselineDataset
    );
    this.polarChart = createPolarChart(this.ctxPolarChart, this.polarChartMaxVal, this._getPolarDataSet());
    this.polarChartBaseline = createPolarChartBaseline(this.ctxPolarChartBaseline, this.polarChartMaxVal, this.polarChartBaselineDataset);

    this.areaChart = createAreaChart(this.ctxAreaChart, this._getAreaDataSet(), this.goalCO2, this.inputsGeneralSliders['backToOffice']);
  }

  // Update charts when one of the Home sliders has changed
  _handleHomeValueChange(ev) {
    console.log(ev.currentTarget.modelValue)
    // Get data from form
    this.inputsHomeSliders = ev.currentTarget.modelValue;
    // Destroy old charts
    this.polarChart.destroy();
    this.polarChartBaseline.destroy();
    this.areaChart.destroy();
    // Redraw charts with updated inputs
    // TODO: Replace parameters with data from sliders
    this.polarChartMaxVal = Math.max(
      ...this._getPolarDataSet(),
      ...this.polarChartBaselineDataset
    );
    this.polarChart = createPolarChart(this.ctxPolarChart, this.polarChartMaxVal, this._getPolarDataSet());
    this.polarChartBaseline = createPolarChartBaseline(this.ctxPolarChartBaseline, this.polarChartMaxVal, this.polarChartBaselineDataset);

    this.areaChart = createAreaChart(this.ctxAreaChart, this._getAreaDataSet(), this.goalCO2, this.inputsGeneralSliders['backToOffice']);
  }

  // Update charts when one of the Office sliders has changed
  _handleOfficeValueChange(ev) {
    console.log(ev.currentTarget.modelValue);
    // Get data from form
    this.inputsOfficeSliders = ev.currentTarget.modelValue;
    // Destroy old charts
    this.polarChart.destroy();
    this.polarChartBaseline.destroy();
    this.areaChart.destroy();
    // Redraw charts with updated inputs
    // TODO: Replace parameters with data from sliders
    this.polarChartMaxVal = Math.max(
      ...this._getPolarDataSet(),
      ...this.polarChartBaselineDataset
    );
    this.polarChart = createPolarChart(this.ctxPolarChart, this.polarChartMaxVal, this._getPolarDataSet());
    this.polarChartBaseline = createPolarChartBaseline(this.ctxPolarChartBaseline, this.polarChartMaxVal, this.polarChartBaselineDataset);

    this.areaChart = createAreaChart(this.ctxAreaChart, this._getAreaDataSet(), this.goalCO2, this.inputsGeneralSliders['backToOffice']);
  }

  // Update charts when one of the Travel sliders has changed
  _handleTravelValueChange(ev) {
    console.log(ev.currentTarget.modelValue);
    // Get data from form
    this.inputsTravelSliders = ev.currentTarget.modelValue;
    // Destroy old charts
    this.polarChart.destroy();
    this.polarChartBaseline.destroy();
    this.areaChart.destroy();
    // Redraw charts with updated inputs
    this.polarChartMaxVal = Math.max(
      ...this._getPolarDataSet(),
      ...this.polarChartBaselineDataset
    );
    this.polarChart = createPolarChart(this.ctxPolarChart, this.polarChartMaxVal, this._getPolarDataSet());
    this.polarChartBaseline = createPolarChartBaseline(this.ctxPolarChartBaseline, this.polarChartMaxVal, this.polarChartBaselineDataset);

    this.areaChart = createAreaChart(this.ctxAreaChart, this._getAreaDataSet(), this.goalCO2, this.inputsGeneralSliders['backToOffice']);
  }

  _getAreaDataSet() {
    const homeChart = Array.from({length: 100}, (e, i) => calcHomeUsage(this.inputsHomeSliders, {"backToOffice": i+1, "daysPerWeek": this.inputsGeneralSliders["daysPerWeek"]}));
    const officeChart = Array.from({length: 100}, (e, i) => calcOfficeUsage(this.inputsOfficeSliders, {"backToOffice": i+1, "daysPerWeek": this.inputsGeneralSliders["daysPerWeek"]}));
    const travelChart = Array.from({length: 100}, (e, i) => calcTravelUsage(this.inputsTravelSliders, {"backToOffice": i+1, "daysPerWeek": this.inputsGeneralSliders["daysPerWeek"]}));
    return [homeChart, travelChart, officeChart];
  }

  _getPolarDataSet() {
    // TODO: input should be taken from sliders
    let polarDataSet = [
      calcOfficeGasUsage(this.inputsOfficeSliders, this.inputsGeneralSliders),
      calcOfficeElectricityUsage(this.inputsOfficeSliders, this.inputsGeneralSliders),
      calcCarUsage(this.inputsTravelSliders, this.inputsGeneralSliders),
      calcNonCarUsage(this.inputsTravelSliders, this.inputsGeneralSliders),
      calcHomeGasUsage(this.inputsHomeSliders, this.inputsGeneralSliders),
      calcHomeElectricityUsage(this.inputsHomeSliders, this.inputsGeneralSliders)
    ];
    this.achievedCO2 = Math.round(polarDataSet.reduce((partialSum, a) => partialSum + a, 0));
    return polarDataSet;
  }

  _handleSetNewBaseline(ev) {
    // Set initial input values
    this.inputsGeneralSlidersBaseline = this.inputsGeneralSliders;
    this.inputsHomeSlidersBaseline = this.inputsHomeSliders;
    this.inputsOfficeSlidersBaseline = this.inputsOfficeSliders;
    this.inputsTravelSlidersBaseline = this.inputsTravelSliders;
    this.polarChartBaselineDataset = this._getPolarDataSet();
    this.baselineTotalCO2 = Math.round(this.polarChartBaselineDataset.reduce((partialSum, a) => partialSum + a, 0));

    this.polarChart.destroy();
    this.polarChartBaseline.destroy();

    this.polarChart = createPolarChart(this.ctxPolarChart, this.polarChartMaxVal, this._getPolarDataSet());
    this.polarChartBaseline = createPolarChartBaseline(this.ctxPolarChartBaseline, this.polarChartMaxVal, this.polarChartBaselineDataset);
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
          <div style="margin-top: ${spacer12};">
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
                  <p style="flex: 2;"> ING will emit
                    ${this.baselineTotalCO2 >= this.achievedCO2 ? html`
                      <span class="card-highlight">${this.baselineTotalCO2 - this.achievedCO2}</span> kiloton CO2<br>less than the baseline
                    ` : html`
                      <span class="card-highlight">${this.achievedCO2 - this.baselineTotalCO2 }</span> kiloton CO2<br>more than the baseline
                    `}
                  </p>
                </div>
              </ing-card>
              <ing-card style="flex: 1;">
                <div slot="content" class="achievement__flexbox">
                  <div style="flex: 1;">
                    <div class="doughnut-label">Goal ${this.goalCO2} kt <br> Emitted ${this.achievedCO2} kt</div>
                    <canvas id="doughnut-chart" width="90" height="80"></canvas>
                  </div>
                  ${this.achievedCO2 <= this.goalCO2 ? html`
                    <p style="flex: 2;">ING will <span class="card-highlight">fully</span><br> achieve the CO2 emission target of 2025</p>
                  ` : html`
                    <p style="flex: 2;">ING will achieve<span class="card-highlight">${Math.round(this.goalCO2/this.achievedCO2 * 100)}%</span><br>CO2 emission target of 2025</p>
                  `}
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
                      .modelValue="${this.inputsGeneralSliders["backToOffice"]}"
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
                      .modelValue="${this.inputsGeneralSliders["daysPerWeek"]}"
                      @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                      label="Number Days per Week in Office"
                      unit="Days"
                    ></ing-input-range>
                  </form>
                </ing-form>
                <ing-accordion>
                  <h3 slot="invoker">
                    <ing-accordion-invoker-button>Home Consumption</ing-accordion-invoker-button>
                  </h3>
                  <ing-accordion-content slot="content">
                    <ing-form @submit="${ev => this._handleHomeValueChange(ev)}">
                      <form>
                        <ing-input-range
                          name="gasUsage"
                          min="0"
                          max="60"
                          step="1"
                          .modelValue="${this.inputsHomeSliders["gasUsage"]}"
                          @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                          label="Gas Consumption"
                          unit="cubic meters"
                        ></ing-input-range>
                        <ing-input-range
                          name="electricityUsage"
                          min="0"
                          max="150"
                          step="1"
                          .modelValue="${this.inputsHomeSliders["electricityUsage"]}"
                          @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                          label="Electricity Consumption"
                          unit="kWh"
                        ></ing-input-range>
                      </form>
                    </ing-form>
                  </ing-accordion-content>
                  <h3 slot="invoker">
                    <ing-accordion-invoker-button>Office Consumption</ing-accordion-invoker-button>
                  </h3>
                  <ing-accordion-content slot="content">
                    <ing-form @submit="${ev => this._handleOfficeValueChange(ev)}">
                      <form>
                        <ing-input-range
                          name="gasUsage"
                          min="0"
                          max="25"
                          step="1"
                          .modelValue="${this.inputsOfficeSliders["gasUsage"]}"
                          @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                          label="Gas Consumption"
                          unit="cubic meters"
                        ></ing-input-range>
                        <ing-input-range
                          name="electricityUsage"
                          min="0"
                          max="30"
                          step="1"
                          .modelValue="${this.inputsOfficeSliders["electricityUsage"]}"
                          @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                          label="Electricity Consumption"
                          unit="kWh"
                        ></ing-input-range>
                      </form>
                    </ing-form>
                  </ing-accordion-content>
                  <h3 slot="invoker">
                    <ing-accordion-invoker-button>Business Travel/Commute</ing-accordion-invoker-button>
                  </h3>
                  <ing-accordion-content slot="content">
                    <ing-form @submit="${ev => this._handleTravelValueChange(ev)}">
                      <form>
                        <ing-input-range
                          name="kilometersPerDay"
                          min="0"
                          max="150"
                          step="1"
                          .modelValue="${this.inputsTravelSliders["kilometersPerDay"]}"
                          @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                          label="Travel Distance"
                          unit="km/day"
                        ></ing-input-range>
                        <ing-input-range
                          name="carUserPerc"
                          min="0"
                          max="100"
                          step="3"
                          .modelValue="${this.inputsTravelSliders["carUserPerc"]}"
                          @model-value-changed="${ev => this._handleSliderValueChange(ev)}"
                          label="Car User Percentage"
                          unit="%"
                        ></ing-input-range>
                      </form>
                    </ing-form>
                  </ing-accordion-content>
                </ing-accordion>
              </div>
              <ing-button @click="${ev => this._handleSetNewBaseline(ev)}" class="button__baseline">Set New Baseline</ing-button>
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
        ${font12Mixin()};
        color: ${orange};
        position: absolute;
        top: 44%;
        text-align: center;
        width: 25%;
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

      .slider-card .form-control {
        border: none !important;;
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
