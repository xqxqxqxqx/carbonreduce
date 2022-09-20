import {
  css,
  IngInputRange,
} from 'ing-web';

export class IngSliderCustom extends IngInputRange {
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          color: white;
        }

        :host .input-group__container {
          background-color: black;
        }

        .form-field__label ::slotted(*) {
          color: white;
        }
      `,
    ];
  }
}
