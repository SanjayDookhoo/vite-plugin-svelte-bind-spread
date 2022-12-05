[![NodeJs][nodejs-image]][nodejs-url]
[![Maintained Status][maintained-image]][maintained-url]
[![Ask Me Anything][ask-image]][ask-url]
[![Issues Count][issues-image]][issues-url]
[![Size][size-image]][size-url]

[nodejs-image]: https://img.shields.io/badge/Node.js-43853D
[nodejs-url]: https://nodejs.org/
[maintained-image]: https://img.shields.io/badge/Maintained%3F-yes-green.svg
[maintained-url]: https://github.com/SanjayDookhoo/nodejs-better-console
[ask-image]: https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg
[ask-url]: mailto:sanjaydookhoo@msn.com?subject=nodejs-better-console
[issues-image]: https://img.shields.io/github/issues/SanjayDookhoo/nodejs-better-console.svg
[issues-url]: https://github.com/SanjayDookhoo/nodejs-better-console/issues
[size-image]: https://img.shields.io/bundlephobia/min/nodejs-better-console
[size-url]: https://www.npmjs.com/package/nodejs-better-console

# Description

A vite plugin for svelte that by default, if a object is spread into a component, it will bind each property in the object as props.

See: https://svelte.dev/tutorial/component-bindings

# Usage

npm i vite-plugin-svelte-bind-spread

# Basic

```javascript
// vite.config.js
import bindSpread from 'vite-plugin-svelte-bind-spread';

export default defineConfig({
  plugins: [bindSpread(), svelte()], // Note: bindSpread() must be the first plugin
});
```

# Effects

```html
<!-- App Component -->
<script>
  import Test from './Test.svelte';

  let testName = 'svelte',
    version = 3,
    speed = 'blazing',
    website = 'https://svelte.dev';

  const props = {
    name: testName,
    version,
    speed,
    website,
  };
</script>

<div>{version}</div>

<Test {...props} />
<!-- The above will be replaced with the code below, allowing the Test component to use the exported variable for value setting also -->
<!-- <Test bind:name={testName} bind:version bind:speed bind:website /> -->
```

```html
<!-- Test Component Example -->
<script>
  export let name,
		version,
		speed,
		website;
</script>

<button on:click={() => version = version + 1}>
  button {version}
</button>

```
