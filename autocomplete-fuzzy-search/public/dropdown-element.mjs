const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = /* html */ `
<style>
:host {
  display: flex;
  flex-direction: column;
  position: absolute;
  background: white;
  border-radius: 4px;
  box-shadow: 0px 10px 15px -3px rgb(0 0 0 / 20%);
  border: 0;
  overflow: hidden;
  box-sizing: border-box;
}

.option {
  width: 100%;
  text-align: left;
  padding: var(--app-dropdown-option-padding, 8px 12px);
  border: 0;
  background: none;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
}

.option:hover,
.option:focus {
  background: #ddd;
}
</style>
`;

export class AppDropdownElement extends HTMLElement {
  /** @type {ShadowRoot} */
  #shadowRoot;

  constructor() {
    super();

    this.#shadowRoot = this.attachShadow({ mode: 'open' });
    this.#shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
  }

  #resizeListener = () => this.#updatePosition();

  connectedCallback() {
    this.#resizeListener();
    window.addEventListener('resize', this.#resizeListener);
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.#resizeListener);
  }

  // public options: Array<string>
  set options(value) {
    this.#options = value;

    // Set selected to null if it's not included in the new options
    if (this.options.includes(this.#selected) === false) {
      this.selected = null;
    }

    // Clean old options
    for (const el of this.#shadowRoot.querySelectorAll('.option')) el.remove();

    for (const option of value) {
      // <button class="option">{{ option }}</button>
      const optionEl = document.createElement('button');
      optionEl.classList.add('option');
      optionEl.innerText = option;

      // On option click, select it
      optionEl.addEventListener('click', () => {
        this.selected = option;
      });

      // Append to the dropdown list
      this.#shadowRoot.appendChild(optionEl);
    }
  }
  get options() {
    return this.#options.concat([]);
  }
  /** @type {Array<string>} */
  #options = [];

  // public selected: null | string
  get selected() {
    return this.#selected;
  }
  set selected(value) {
    this.#selected = value;
    if (this.#selected !== null) {
      this.dispatchEvent(new Event('option-select', { bubbles: true, composed: true }));
    }
  }
  /** @type {string | null} */
  #selected = null;

  // public connectedTo: Node | null
  set connectedTo(value) {
    this.#connectedTo = value;
    this.#updatePosition();
  }
  get connectedTo() {
    return this.#connectedTo;
  }
  /** @type {Node | null} */
  #connectedTo = null;

  #updatePosition() {
    console.log('#updatePosition');
    if (this.connectedTo instanceof Node === false) {
      this.style.display = 'none';
    }

    this.style.display = 'flex';

    const connectedElementCoordinates = this.connectedTo.getBoundingClientRect();
    this.style.left = connectedElementCoordinates.left.toString() + 'px';
    this.style.top = (connectedElementCoordinates.top + connectedElementCoordinates.height).toString() + 'px';
    this.style.width = connectedElementCoordinates.width + 'px';
  }
}

window.customElements.define('app-dropdown', AppDropdownElement);
