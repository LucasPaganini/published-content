# Advanced Angular #1 - Control Value Accessor

This folder contains the code examples shown in the "Advanced Angular #1 - Control Value Accessor" article (TODO) and video (TODO).

## Content Intro

Angular allows us to control form inputs using the `FormsModule` or the `ReactiveFormsModule`. With them, you can bind a `FormControl` to your input and control its value.

```html
<input type="text" [(ngModel)]="name" />
<input type="text" [formControl]="nameControl" />
```

But what if you create your own custom component? Like a datepicker, a star rating or a regex input. Can you bind a `FormControl` to it?

```html
<app-datepicker [(ngModel)]="date"></app-datepicker>
<app-datepicker [formControl]="dateControl"></app-datepicker>

<app-stars [(ngModel)]="stars"></app-stars>
<app-stars [formControl]="starsControl"></app-stars>

<app-regex [(ngModel)]="regex"></app-regex>
<app-regex [formControl]="regexControl"></app-regex>
```

## Running the Project

1. Install [NodeJS](https://nodejs.org/en/) >=10
2. Install project dependencies `npm run clean-install` (try `npm install` if that doesn't work)
3. Start the development server `npm start`
4. Visit [http://localhost:4200](http://localhost:4200)
