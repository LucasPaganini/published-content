import { AppDropdownElement } from './dropdown-element.mjs';
import { fuzzySearch } from './fuzzy-search.mjs';

const BROWSERS_LIST = ['Edge', 'Firefox', 'Chrome', 'Opera', 'Safari'];
const fuzzySearchBrowsersList = fuzzySearch(BROWSERS_LIST);

/** @type {HTMLInputElement} */
const BROWSER_INPUT_ELEMENT = document.querySelector('#browser-input');

// Filter the browsers list when the browser input changes
BROWSER_INPUT_ELEMENT.addEventListener('input', () => {
  const searchKeyword = BROWSER_INPUT_ELEMENT.value;
  const filteredList = fuzzySearchBrowsersList(searchKeyword).map(el => el.item);
  console.log(filteredList);
  renderInputSuggestions(BROWSER_INPUT_ELEMENT, filteredList);
});

/**
 * Renders a dropdown list of suggestions for an input element.
 *
 * @param {HTMLInputElement} inputEl
 * @param {Array<string>} suggestions
 * @returns {void}
 */
const renderInputSuggestions = (inputEl, suggestions) => {
  // <app-dropdown id="browser-suggestions" [options]="suggestions" [connectedTo]="inputEl">

  /** @type {AppDropdownElement} */
  const existingEl = document.querySelector('#browser-suggestions');
  if (existingEl) {
    existingEl.options = suggestions;
    existingEl.connectedTo = inputEl;
    return;
  }

  /** @type {AppDropdownElement} */
  const createdEl = document.createElement('app-dropdown');
  createdEl.id = 'browser-suggestions';
  createdEl.options = suggestions;
  createdEl.connectedTo = inputEl;

  // On click, set the input value to the suggestion
  createdEl.addEventListener('option-select', () => {
    console.log('option-select', createdEl.selected);
    inputEl.value = createdEl.selected;
    createdEl.remove();
  });

  document.documentElement.appendChild(createdEl);
};
