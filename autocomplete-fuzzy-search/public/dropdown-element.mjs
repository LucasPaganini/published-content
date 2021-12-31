const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = /* html */ `
<style>
:host {
  position: absolute;
  background: white;
  border-radius: 4px;
  box-shadow: 0px 10px 15px -3px rgb(0 0 0 / 10%);
  border: 0;
  overflow: hidden;
  box-sizing: border-box;
}

.option {
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border: 0;
  background: none;
  cursor: pointer;
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

  /**
   * @param {Array<string>} value
   */
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
    this.dispatchEvent(new Event('option-select', { bubbles: true, composed: true }));
  }
  /** @type {string | null} */
  #selected = null;
}

window.customElements.define('app-dropdown', AppDropdownElement);
