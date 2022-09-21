import {
  breakpoint1280,
  css,
  elevation1Mixin,
  html,
  LitElement,
  spacer16,
  spacer64,
  unsafeCSS,
  spacer40,
  white,
  font24Mixin
} from 'ing-web';

export class IngHeader extends LitElement {
  static get styles() {
    return css`
      .header {
        position: fixed;
        top: 0;
        width: 100%;
        background-color: black;
        height: ${spacer64};
        min-height: ${spacer64};
        box-sizing: border-box;
        z-index: 1;
        ${elevation1Mixin()}
      }

      .header__content {
        max-width: ${unsafeCSS(breakpoint1280)}px;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 ${spacer16};
      }

      .ing-logo {
        display: inline-block;
        height: ${spacer40};
        width: auto;
      }

      .title {
        ${font24Mixin()};
        color: ${white};
        margin: 0 ${spacer16};
      }
    `;
  }

  render() {
    return html`
      <header class="header">
        <div class="header__content">
          <img class="ing-logo" src="../../assets/lionwhite.png" alt="ING logo">
          <div class="title">Carbon Reduce Dashboard</div>
        </div>
      </header>
    `;
  }
}
