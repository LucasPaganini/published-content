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
  // <div class="input-suggestions">
  const suggestionsListEl = document.createElement('div');
  suggestionsListEl.classList.add('input-suggestions');

  for (const suggestion of suggestions) {
    // <button class="input-suggestion">{{ suggestion }}</button>
    const suggestionEl = document.createElement('button');
    suggestionEl.classList.add('input-suggestion');
    suggestionEl.innerText = suggestion;

    // On click, set the input value to the suggestion
    suggestionEl.addEventListener('click', () => {
      inputEl.value = suggestion;
    });

    // Append to the suggestions list
    suggestionsListEl.appendChild(suggestionEl);
  }

  const positionSuggestionsList = () => {
    const inputElementCoordinates = inputEl.getBoundingClientRect();
    suggestionsListEl.style.left = inputElementCoordinates.left.toString() + 'px';
    suggestionsListEl.style.top = (inputElementCoordinates.top + inputElementCoordinates.height).toString() + 'px';
    suggestionsListEl.style.width = inputElementCoordinates.width + 'px'
  };

  document.documentElement.appendChild(suggestionsListEl);
  positionSuggestionsList();
  window.addEventListener('resize', positionSuggestionsList);
};