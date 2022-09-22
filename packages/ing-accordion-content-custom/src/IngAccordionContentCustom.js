import {
  css,
  IngAccordionContent,
} from 'ing-web';

export class IngAccordionContentCustom extends IngAccordionContent {
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
