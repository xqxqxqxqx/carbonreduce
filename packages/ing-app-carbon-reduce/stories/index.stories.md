# IngAppCarbonReduce

A component for...

## Features

- a
- b
- ...

## How to use

### Installation

```bash
yarn add ing-app-carbon-reduce
```

```js
import { html, LitElement, ScopedElementsMixin } from 'ing-web';
import { IngAppCarbonReduce } from 'ing-app-carbon-reduce';

class MyApp extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return {
      'ing-app-carbon-reduce': IngAppCarbonReduce,
    };
  }

  render() {
    return html`
      <ing-app-carbon-reduce></ing-app-carbon-reduce>
    `;
  }
}
```

```js script
import { html, withWebComponentsKnobs, withKnobs } from '@open-wc/demoing-storybook';
import '../__element-definitions/ing-app-carbon-reduce.js';

export default {
  title: 'IngAppCarbonReduce',
  component: 'ing-app-carbon-reduce',
  decorators: [withKnobs, withWebComponentsKnobs],
  options: { selectedPanel: "storybookjs/knobs/panel" },
};
```

```js preview-story
export const Simple = () => html`
  <ing-app-carbon-reduce></ing-app-carbon-reduce>
`;
```

## Variations

### Custom Title

```js preview-story
export const CustomTitle = () => html`
  <ing-app-carbon-reduce title="Hello World"></ing-app-carbon-reduce>
`;
```
