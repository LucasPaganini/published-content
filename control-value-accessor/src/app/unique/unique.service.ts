import { Injectable } from '@angular/core';

/**
 * Service responsible for consistently generating strings given the same call
 * order. This is specially relevant when working with server side rendered
 * applications that expect element IDs to be the same when bootstraping from
 * either environments.
 */
@Injectable({
  providedIn: 'root',
})
export class UniqueService {
  private readonly _idsByPrefix: { [prefix: string]: number | undefined } = {};

  /**
   * Generate a unique ID with an optional prefix.
   *
   * @param prefix Optional prefix for ID
   * @returns Generated ID
   */
  public id(prefix = ''): string {
    const n = (this._idsByPrefix[prefix] ?? 0) + 1;
    this._idsByPrefix[prefix] = n;
    return prefix + n.toString();
  }
}
