import {
  css,
  IngTabPanel,
} from 'ing-web';

export class IngTabPanelCustom extends IngTabPanel {
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          background-color: black;
          color: white;
        }
      `,
    ];
  }
}
