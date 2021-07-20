import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  HostListener,
  OnInit,
} from '@angular/core';
import { debounce, throttle } from 'lodash-es';
import { getItems, isAtTheBottom, Item } from './helpers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public items: Array<Item> = [];
  public isGettingMoreItems = false;
  public hasMore = true;

  private _pointer: number = 0;

  private async _getMoreItems(): Promise<void> {
    console.log('getMoreItems() called');
    if (this.isGettingMoreItems || this.hasMore === false) {
      return;
    }
    this.isGettingMoreItems = true;
    this._cd.markForCheck();

    try {
      const { items, hasMore, pointer } = await getItems(
        ITEMS_STEP,
        this._pointer
      );

      this.items = this.items.concat(items);
      this.hasMore = hasMore;
      this._pointer = pointer;
    } finally {
      this.isGettingMoreItems = false;
      this._cd.markForCheck();
    }
  }

  // *NOTE: Implementation using scroll events below
  // @HostListener('window:scroll')
  // public onWindowScroll = debounce(() => {
  //   console.log('scroll');

  //   const reachedBottom = isAtTheBottom(100);
  //   if (reachedBottom) {
  //     this._getMoreItems();
  //   }
  // }, 100);

  constructor(private readonly _cd: ChangeDetectorRef) {}

  public async ngOnInit(): Promise<void> {
    await this._getMoreItems();

    // !WARNING: This isn't the Angular way of doing things but this was not
    // an Angular tutorial so I intentionally wanted to grab the element
    const bottomEl = document.querySelector('#bottom-element')!;
    const intersectionObserver = new IntersectionObserver((entries) => {
      const isIntersecting = entries[0]?.isIntersecting ?? false;
      if (isIntersecting) this._getMoreItems();
    });
    intersectionObserver.observe(bottomEl);
  }
}

/** Amount of items to load every time we request more items */
const ITEMS_STEP = 6;
