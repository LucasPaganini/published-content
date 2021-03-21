import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  /** For usage with reactive forms module */
  public readonly dateControl = new FormControl(new Date());

  /** For usage with forms module */
  public date = new Date();
}
