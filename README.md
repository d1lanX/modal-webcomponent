# simple modal webcomponent

### features

simple, lightweight and configurable

> usage

include the script

```html
<script defer src="./src/Modal.js"></script>
```

and then simply use the tag

```html
<simple-modal src="" position="" size="" template="" header="" close="" button></simple-modal>
```

```js
const modal = document.querySelector('simple-modal');
modal.openModal(); // opens up the modal
modal.closeModal(); // closes the modal
```

### supported attributes:

`src` - if you pass an url the modal will make a request an load the response inside the modal

`position`:

- lt **(left top)**
- rt **(right top)**
- lb **(left bottom)**
- rb **(right bottom)**
- center **(centered (default))**
- tc **(top centered)**
- bc **(bottom centered)**

`size`:

- sm **(small (default))**
- md **(medium)**
- lg **(big)**
- full **(full screen)**

`header` - the title for the modal

`close`:

- button **(the modal will only close by clicking the close button)**
- escape **(only by pressing the `esc` key)**
- all **(by pressing outside the modal, the esc key, or the close button)**
- none **(the modal will only close programatically)**
