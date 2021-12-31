import { BROWSERS_LIST, BROWSER_INPUT_ELEMENT_ID, BROWSER_SUGGESTIONS_ELEMENT_ID } from './data.mjs';
import { AppDropdownElement } from './dropdown-element.mjs';
import { fuzzySearch } from './fuzzy-search.mjs';

const fuzzySearchBrowsersList = fuzzySearch(BROWSERS_LIST, ['shortName', 'longName', 'type']);

/** @type {HTMLInputElement} */
const browserInputElement = document.getElementById(BROWSER_INPUT_ELEMENT_ID);

// Filter the browsers list when the browser input changes
browserInputElement.addEventListener('input', () => {
  const searchKeyword = browserInputElement.value;
  const filteredList = fuzzySearchBrowsersList(searchKeyword)
  const cleanFilteredList = filteredList.map(el => el.item.longName);
  console.log(filteredList);
  renderInputSuggestions(browserInputElement, cleanFilteredList);
});

/**
 * Renders a dropdown list of suggestions for an input element.
 *
 * @param {HTMLInputElement} inputEl
 * @param {Array<string>} suggestions
 * @returns {void}
 */
const renderInputSuggestions = (inputEl, suggestions) => {
  /**
   * <app-dropdown
   *   [id]="BROWSER_SUGGESTIONS_ELEMENT_ID"
   *   [options]="suggestions"
   *   [connectedTo]="inputEl">
   */

  /** @type {AppDropdownElement} */
  const existingEl = document.getElementById(BROWSER_SUGGESTIONS_ELEMENT_ID);
  if (existingEl) {
    existingEl.options = suggestions;
    existingEl.connectedTo = inputEl;
    return;
  }

  /** @type {AppDropdownElement} */
  const createdEl = document.createElement('app-dropdown');
  createdEl.id = BROWSER_SUGGESTIONS_ELEMENT_ID;
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
