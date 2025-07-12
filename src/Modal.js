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
    position: fixed;
    opacity: 0;
    pointer-events: none;
    z-index: 1000;
    background-color: white;
    margin: 0; /* Remove default margins */
  }

  /* Size variants */
  dialog.size-sm {
    max-width: 400px;
    width: 90%;
    max-height: 300px;
  }
  
  dialog.size-md {
    max-width: 600px;
    width: 90%;
    max-height: 500px;
  }
  
  dialog.size-lg {
    max-width: 900px;
    width: 95%;
    max-height: 700px;
  }
  
  dialog.size-full {
    width: calc(97vw - 40px) !important;
    height: calc(95vh - 40px) !important;
    max-width: calc(100vw - 40px) !important;
    max-height: calc(100vh - 40px) !important;
    top: 20px !important;
    left: 20px !important;
    right: 20px !important;
    bottom: 20px !important;
    transform: none !important;
    border-radius: 8px;
  }

  /* Position variants (only apply when NOT full size) */
  dialog:not(.size-full).pos-center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  dialog:not(.size-full).pos-tc {
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  dialog:not(.size-full).pos-bc {
    bottom: 20px;
    left: 50%;
    top: auto;
    transform: translateX(-50%);
  }
  
  dialog:not(.size-full).pos-lt {
    top: 20px;
    left: 20px;
    transform: none;
  }
  
  dialog:not(.size-full).pos-rt {
    top: 20px;
    right: 20px;
    left: auto;
    transform: none;
  }
  
  dialog:not(.size-full).pos-lb {
    bottom: 20px;
    left: 20px;
    top: auto;
    transform: none;
  }
  
  dialog:not(.size-full).pos-rb {
    bottom: 20px;
    right: 20px;
    top: auto;
    left: auto;
    transform: none;
  }

  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
    transition: background-color 0.3s ease-out;
  }

  /* Animation keyframes with position awareness */
  @keyframes zoomInCenter {
    from {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }

  @keyframes zoomInCenterX {
    from {
      transform: translateX(-50%) scale(0.8);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) scale(1);
      opacity: 1;
    }
  }

  @keyframes zoomInCorner {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes zoomInFull {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  /* Opening animations */
  dialog[open].pos-center:not(.size-full) {
    animation: zoomInCenter 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    opacity: 1;
    pointer-events: auto;
  }

  dialog[open].pos-tc:not(.size-full),
  dialog[open].pos-bc:not(.size-full) {
    animation: zoomInCenterX 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    opacity: 1;
    pointer-events: auto;
  }

  dialog[open]:not(.pos-center):not(.pos-tc):not(.pos-bc):not(.size-full) {
    animation: zoomInCorner 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    opacity: 1;
    pointer-events: auto;
  }

  dialog[open].size-full {
    animation: zoomInFull 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    opacity: 1;
    pointer-events: auto;
  }

  /* Closing animations */
  dialog.fading-out {
    pointer-events: none;
  }

  dialog.fading-out.pos-center:not(.size-full) {
    animation: fadeOutCenter 0.3s ease-out forwards;
  }

  dialog.fading-out.pos-tc:not(.size-full),
  dialog.fading-out.pos-bc:not(.size-full) {
    animation: fadeOutCenterX 0.3s ease-out forwards;
  }

  dialog.fading-out:not(.pos-center):not(.pos-tc):not(.pos-bc):not(.size-full) {
    animation: fadeOutCorner 0.3s ease-out forwards;
  }

  dialog.fading-out.size-full {
    animation: fadeOutFull 0.3s ease-out forwards;
  }

  @keyframes fadeOutCenter {
    from {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    to {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.9);
    }
  }

  @keyframes fadeOutCenterX {
    from {
      opacity: 1;
      transform: translateX(-50%) scale(1);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) scale(0.9);
    }
  }

  @keyframes fadeOutCorner {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.9);
    }
  }

  @keyframes fadeOutFull {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(1.05);
    }
  }

  dialog.fading-out::backdrop {
    background-color: rgba(0, 0, 0, 0);
  }

  dialog:not([open]) {
    display: none;
  }

  /* Content styling */
  dialog section {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  dialog header {
    font-weight: bold;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  dialog header:empty {
    display: none;
  }

  dialog footer {
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid #e5e5e5;
  }

  dialog footer:empty {
    display: none;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    dialog.size-lg {
      max-width: 95%;
      width: 95%;
    }
    
    dialog.size-md {
      max-width: 90%;
      width: 90%;
    }
    
    dialog.pos-lt,
    dialog.pos-rt,
    dialog.pos-lb,
    dialog.pos-rb,
    dialog.pos-tc,
    dialog.pos-bc {
      top: 10px;
      left: 10px;
      right: 10px;
      bottom: auto;
      transform: none;
    }
    
    dialog.pos-rt {
      left: 10px;
      right: 10px;
    }
    
    dialog.pos-lb,
    dialog.pos-rb,
    dialog.pos-bc {
      top: auto;
      bottom: 10px;
      left: 10px;
      right: 10px;
    }
  }
  </style>
  `.trim();

  sizes = ['sm', 'md', 'lg', 'full'];
  positions = ['lt', 'rt', 'lb', 'rb', 'center', 'tc', 'bc'];
  closings = ['button', 'escape', 'all', 'none'];

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  render() {
    this.#setAttributes();

    const shouldShowClose = this.close === 'all' || this.close === 'button';
    this.html = `
    <dialog class="size-${this.size} pos-${this.position}">
      <section>
        <header><span>${this.getAttribute('header') || ''}</span><button id="close" class="${
      shouldShowClose ? '' : 'hidden'
    }">×</button></header>
          <slot></slot>
        <footer><slot name="footer"></slot></footer>
      </section>
    </dialog><button class="${
      this.button ? '' : 'hidden'
    }"><slot name="button">Open</slot></button>`.trim();

    this.shadow.innerHTML = `${this.css}${this.html}`;

    this._slot = this.shadow.querySelectorAll('slot');
    this._modal = this.shadow.querySelector('dialog');
    this._btn = this.shadow.querySelector('button');
    this._btnClose = this.shadow.querySelector('#close');

    this.cleanupFn = this.#setListeners();
    this.fetchContent();
  }

  #setAttributes() {
    this.size = this.getAttribute('size');
    this.position = this.getAttribute('position');
    this.src = this.getAttribute('src');
    this.template = this.getAttribute('template');
    this.button = this.hasAttribute('button');
    this.close = this.getAttribute('close');

    if (!this.sizes.includes(this.size)) {
      console.warn(`${this.tagName} el "size" no es valor valido (${this.sizes.join(',')})`);
      this.size = 'sm';
    }

    if (!this.positions.includes(this.position)) {
      console.warn(`${this.tagName} "position" no es valor valido (${this.positions.join(',')})`);
      this.position = 'center';
    }

    if (!this.closings.includes(this.close)) {
      console.warn(`${this.tagName} "close" no es valor valido (${this.closings.join(',')})`);
      this.close = 'all';
    }
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    if (this.cleanupFn) {
      this.cleanupFn();
    }
  }

  static get observedAttributes() {
    return ['src', 'position', 'size', 'template', 'header', 'button', 'close'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'header') {
      this.shadow.querySelector('header>span').textContent = newValue;
      return;
    }

    if (name === 'src') {
      this.src = newValue;
      this.fetchContent();
      return;
    }

    if (oldValue !== newValue && this.shadow) {
      this.render();
    }
  }

  #setListeners() {
    const openHandler = this.openModal.bind(this);
    this._btn.addEventListener('click', openHandler);

    if (this.close === 'button' || this.close === 'all') {
      const btnCloseHandler = this.closeModal.bind(this);
      this._btnClose.addEventListener('click', btnCloseHandler);
    }

    if (this.close === 'escape' || this.close === 'all') {
      const closeHandler = (e) => {
        const bounds = this._modal.getBoundingClientRect();
        if (
          e.clientX < bounds.left ||
          e.clientX > bounds.right ||
          e.clientY < bounds.top ||
          e.clientY > bounds.bottom
        ) {
          e.preventDefault();
          this.closeModal();
        }
      };
      this._modal.addEventListener('click', closeHandler);

      const keyHandler = (e) => {
        if (e.key === 'Escape' && this._modal.open) {
          e.preventDefault();
          this.closeModal();
        }
      };
      document.addEventListener('keydown', keyHandler);
    }

    return () => {
      this._btn.removeEventListener('click', openHandler);

      if (this.close === 'escape' || this.close === 'all') {
        this._modal.removeEventListener('click', closeHandler);
        document.removeEventListener('keydown', keyHandler);
      }
      if (this.close === 'button' || this.close === 'all') {
        this._btnClose.removeEventListener('click', btnCloseHandler);
      }
    };
  }

  openModal() {
    this.#adjustPositionForIframe();
    this._modal.showModal();
  }

  #adjustPositionForIframe() {
    if (window.self === window.top) {
      return; // Not in an iframe, do nothing
    }

    try {
      const parent = window.parent;
      const pScrollY = parent.scrollY;
      const pScrollX = parent.scrollX;
      const pHeight = parent.innerHeight;
      const pWidth = parent.innerWidth;

      this._modal.style.position = 'absolute';

      let newTop, newLeft;
      const offset = 20; // The default offset from the CSS

      switch (this.position) {
        case 'tc':
          newTop = pScrollY + offset;
          newLeft = pScrollX + pWidth / 2;
          break;
        case 'bc':
          newTop = pScrollY + pHeight - this._modal.offsetHeight - offset;
          newLeft = pScrollX + pWidth / 2;
          break;
        case 'lt':
          newTop = pScrollY + offset;
          newLeft = pScrollX + offset;
          break;
        case 'rt':
          newTop = pScrollY + offset;
          newLeft = pScrollX + pWidth - this._modal.offsetWidth - offset;
          break;
        case 'lb':
          newTop = pScrollY + pHeight - this._modal.offsetHeight - offset;
          newLeft = pScrollX + offset;
          break;
        case 'rb':
          newTop = pScrollY + pHeight - this._modal.offsetHeight - offset;
          newLeft = pScrollX + pWidth - this._modal.offsetWidth - offset;
          break;
        case 'center':
        default:
          newTop = pScrollY + pHeight / 2;
          newLeft = pScrollX + pWidth / 2;
          break;
      }

      this._modal.style.top = `${newTop}px`;
      this._modal.style.left = `${newLeft}px`;
    } catch (e) {
      // This error occurs due to the Same-Origin Policy.
      console.warn(
        `${this.tagName} cannot access cross-origin parent window. Modal positioning will be relative to the iframe.`,
        e
      );
    }
  }

  closeModal() {
    if (!this._modal.open) return;
    this._modal.classList.add('fading-out');

    this._modal.style.position = '';
    this._modal.style.top = '';
    this._modal.style.left = '';

    setTimeout(() => {
      this._modal.classList.remove('fading-out');
      this._modal.close();
    }, 300);
  }

  fetchContent() {
    if (!this.src) return;

    fetch(this.src)
      .then((response) => response.text())
      .then((data) => {
        this.innerHTML = data;
      })
      .catch((err) => {
        console.error('simple-modal: fetch failed', err);
        this.innerHTML = `<p>Error al cargar el contenido del modal</p><p>${err.message}</p>`;
      });
  }
}

window.customElements.define('simple-modal', Modal);
