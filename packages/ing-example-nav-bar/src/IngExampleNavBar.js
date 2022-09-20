import {
  breakpoint1280,
  css,
  elevation1Mixin,
  html,
  ingLogo,
  LitElement,
  spacer16,
  spacer64,
  unsafeCSS,
  ingLogoBlack
} from 'ing-web';

export class IngExampleNavBar extends LitElement {
  static get styles() {
    return css`
      .header {
        background-color: black;
        height: ${spacer64};
        min-height: ${spacer64};
        box-sizing: border-box;
        ${elevation1Mixin()}
      }

      .header__content {
        max-width: ${unsafeCSS(breakpoint1280)}px;
        margin: 0 auto;
        padding: 0 ${spacer16};
      }

      .ing-logo {
        display: inline-block;
        height: ${spacer64};
        width: auto;
      }
    `;
  }

  render() {
    return html`
      <header class="header">
        <div class="header__content">
          <div class="ing-logo">${ingLogoBlack}</div>
        </div>
      </header>
    `;
  }
}
