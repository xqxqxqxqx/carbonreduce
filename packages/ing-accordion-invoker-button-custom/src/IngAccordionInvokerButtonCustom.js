import {
  css,
  IngAccordionInvokerButton,
} from 'ing-web';

export class IngAccordionInvokerButtonCustom extends IngAccordionInvokerButton {
  static get styles() {
    return [
      ...super.styles,
      css`
        :host([text][grey]) {
          color: white;
        }
      `,
    ];
  }
}
