import {
  black80,
  css,
  elevation1Mixin,
  IngCard,
} from 'ing-web';

export class IngCardCustom extends IngCard {
  static get styles() {
    return [
      ...super.styles,
      css`
        .card {
          background-color: black;
        }
      `,
    ];
  }
}
