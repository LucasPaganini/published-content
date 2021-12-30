import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@6.5.3/dist/fuse.esm.js';

const FUSE_OPTIONS = {
  isCaseSensitive: false,
  includeScore: true,
  shouldSort: true,
};

/**
 * Uses a fuzzy search algorithm ([with Fuse.js](https://fusejs.io/)) to filter
 * a list based on a search pattern.
 *
 * This function is curried.
 *
 * @param {Array<string>} list
 * @returns {(pattern: string) => Array<{
 *   item: string,
 *   refIndex: number,
 *   score: number,
 * }>}
 */
export const fuzzySearch = list => {
  const fuse = new Fuse(list, FUSE_OPTIONS);
  return pattern => fuse.search(pattern);
};
