import {
  cardComponentStyle,
  css,
  html,
  linkComponentStyle,
  LitElement,
  ScopedElementsMixin,
  spacer64,
} from 'ing-web';
import { IngExampleNavBar } from '../../ing-example-nav-bar/src/IngExampleNavBar.js';

export class IngAppCarbonReduce extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return {
      'ing-example-nav-bar': IngExampleNavBar,
    };
  }

  static get properties() {
    return {
      title: { type: String },
    };
  }

  constructor() {
    super();
    this.title = 'Hello, Carbon Reducers!';
  }

  render() {
    return html`
      <ing-example-nav-bar></ing-example-nav-bar>
      <div class="page-container">
        <div class="card intro">
          <div class="card__content">
            <h2>${this.title}</h2>
            <p>
              Let's win this!
            </p>
          </div>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      ${linkComponentStyle}
      ${cardComponentStyle}

      .page-container {
        text-align: center;
        margin-top: ${spacer64};
      }

      .intro {
        display: inline-block;
        margin: 0 auto;
      }
    `;
  }
}
