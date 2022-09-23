import {
  css,
  IngInputRange,
  orange,
} from 'ing-web';

export class IngSliderCustom extends IngInputRange {
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          color: white;
          text-align: start;
        }

        :host .input-group__container {
          background-color: black;
        }

        :host .form-field__group-two > div:first-child {
          color: ${orange};
        }

        .form-field__label ::slotted(*) {
          color: white;
        }
      `,
    ];
  }
}
