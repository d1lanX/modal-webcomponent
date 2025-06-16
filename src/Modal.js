class Modal extends HTMLElement {
  css = `
  <style>
  .hidden {
    display: none;
  }
  dialog {
    border: none;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    max-width: 500px;
    width: 90%;
    position: fixed; /* Ensures it's positioned relative to the viewport */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* Centering */
    opacity: 0; /* Initially hidden */
    pointer-events: none; /* Disable interaction when hidden */
    z-index: 1000; /* Ensure it's on top */
    background-color: white;
  }
  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0); /* Start fully transparent */
    transition: background-color 0.3s ease-out; /* Transition for fading in/out */
  }
  @keyframes zoomIn {
    from {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }
  dialog[open] {
    animation: zoomIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; /* Elastic bounce */
    opacity: 1; /* Override initial opacity for animation */
    pointer-events: auto; /* Enable interaction */
  }
    dialog.fading-out {
    animation: fadeOut 0.3s ease-out forwards;
    pointer-events: none; /* Disable interaction immediately */
}

  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1); /* Maintain current scale */
    }
    to {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.9); /* Slightly shrink as it fades */
    }
  }

  dialog.fading-out::backdrop {
    background-color: rgba(0, 0, 0, 0);
  }

  dialog:not([open]) {
    display: none;
  }
  </style>
  `.trim();
  sizes = ['sm', 'md', 'lg', 'full'];
  positions = ['lt', 'rt', 'lb', 'lr', 'center'];
  attributes = ['src', 'position', 'size', 'template', 'title', 'button'];

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  render() {
    this.setAttributes();

    this.html = `
    <dialog>
      <section>
        <header>${this.getAttribute('title') || ''}</header>
          <slot></slot>
        <footer><slot name="footer"></slot></footer>
      </section>
    </dialog><button class="${
      this.button ? '' : 'hidden'
    }"><slot name="button">Abrir</slot></button>`.trim();

    this.shadow.innerHTML = `${this.css}${this.html}`;

    this._slot = this.shadow.querySelectorAll('slot');
    this._modal = this.shadow.querySelector('dialog');
    this._btn = this.shadow.querySelector('button>slot[name="button"]');

    this.cleanupFn = this.setListeners();

    console.log(this._slot);
  }

  setAttributes() {
    this.size = this.getAttribute('size') ?? 'sm';
    this.position = this.getAttribute('position') ?? 'center';
    this.src = this.getAttribute('src');
    this.template = this.getAttribute('template');
    this.button = this.hasAttribute('button');

    if (this.sizes.includes(this.size)) {
      console.warn(`${this.tagName} el "size" no es valor valido (${this.sizes.join(',')})`);
    }

    if (this.positions.includes(this.position)) {
      console.warn(`${this.tagName} "position" no es valor valido (${this.positions.join(',')})`);
    }
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.cleanupFn();
  }

  static get observedAttributes() {
    return this.attributes;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
  }

  setListeners() {
    const openModal = this._btn.addEventListener('click', this.openModal.bind(this));
    return () => {
      this._btn.removeEventListener(openModal);
    };
  }

  openModal() {
    this._modal.showModal();
  }

  closeModal() {
    this._modal.classList.add('fading-out');
    this._modal.close();
    setTimeout(() => {
      const style = window.getComputedStyle(this._modal);
      const animationDuration = parseFloat(style.getPropertyValue('animation-duration')) * 1000; // Convert to ms
      this._modal.classList.remove('fading-out');
    }, 3000);
  }

  fetchContent() {}
}

window.customElements.define('custom-modal', Modal);
