# ing-app-carbon-reduce

This webcomponent follows ING standards.

## Installation

```bash
npm i ing-app-carbon-reduce
```

## Usage

```html
<script type="module">
  import { ScopedElementsMixin, LitElement, IngAppCarbonReduce } from 'ing-web'

  class MyExampleApp extends ScopedElementsMixin(LitElement) {
    static get scopedElements() {
      return {
      'ing-app-carbon-reduce' : IngAppCarbonReduce,
      };
    }
  }
  customElements.define('my-example-app', MyExampleApp);
</script>

<my-example-app></my-example-app>
```

## Testing using karma (if applied by author)

```bash
yarn test
```

## Testing using karma via browserstack (if applied by author)

```bash
yarn test:bs
```

## Demoing using storybook (if applied by author)

```bash
yarn storybook
```

## Linting (if applied by author)

```bash
yarn lint
```
