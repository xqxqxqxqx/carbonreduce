import {
  css,
  IngTab,
} from 'ing-web';

export class IngTabCustom extends IngTab {
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          color: white;
        }

        :host([selected]) {
          background-color: black;
          color: white;
        }
      `,
    ];
  }
}
