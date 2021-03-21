import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public readonly dateControl = new FormControl(new Date());

  public date = new Date();

  public ngOnInit(): void {
    setInterval(() => {
      console.log(this.date);
    }, 2000);
  }
}
