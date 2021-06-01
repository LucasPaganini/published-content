import { AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { isArray, isDate, isEmpty, isNull, isUndefined } from 'lodash-es';
import { environment } from 'src/environments/environment';

export const dateExists = (
  year: number,
  month: number,
  day: number
): boolean => {
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

enum WeekDay {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

export const isWeekend = (date: Date): boolean => {
  const weekDay = date.getDay();
  switch (weekDay) {
    case WeekDay.Sunday:
    case WeekDay.Saturday:
      return true;
    default:
      return false;
  }
};

export const weekendValidator: ValidatorFn = (
  control: AbstractControl
): null | { weekend: true } => {
  const value = control.value;
  if (isDate(value) === false) return null;
  if (isWeekend(value)) return { weekend: true };
  return null;
};

export const isHoliday = async (date: Date): Promise<boolean> => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const currentYear = new Date().getFullYear();
  if (year < currentYear) {
    console.warn(
      `We're using a free API plan to see if the date is a holiday and in this free plan we can only check for dates in the current year`
    );
    return false;
  }

  await holidayQueue.push();

  const queryParams = new URLSearchParams({
    api_key: environment.abstractApiKey,
    country: 'US',
    year: year.toString(),
    month: month.toString(),
    day: day.toString(),
  });

  const url = `https://holidays.abstractapi.com/v1/?${queryParams.toString()}`;
  const rawRes = await fetch(url);
  const jsonRes = await rawRes.json();

  return (
    isArray(jsonRes) &&
    isEmpty(jsonRes) === false &&
    // They return multiple holidays and I only care if it's a national one
    jsonRes.some((holiday) => holiday.type === 'National')
  );
};

export const holidayValidator: AsyncValidatorFn = async (
  control: AbstractControl
): Promise<null | { holiday: true }> => {
  const value = control.value;
  if (isDate(value) === false) return null;
  if (await isHoliday(value)) return { holiday: true };
  return null;
};

/**
 * This is a workaround because the holiday API we're using only allows 1
 * request per second and will return an error if we don't respect that
 * limit.
 */
const holidayQueue = new (class IntervalQueue {
  private _taskList: Array<() => void> = [];

  constructor(private readonly _interval: number) {}

  public push(): Promise<void> {
    let resolve = () => undefined;
    const promise = new Promise<void>((_resolve) => {
      resolve = () => _resolve(undefined);
    });
    this._taskList.push(resolve);
    this._setInterval();
    return promise;
  }

  private _intervalID: ReturnType<typeof setInterval> | null = null;
  private _setInterval(): void {
    if (isNull(this._intervalID) === false) return;

    this._pop();
    this._intervalID = setInterval(() => {
      this._pop();
      if (isEmpty(this._taskList)) {
        clearInterval(this._intervalID);
        this._intervalID = null;
      }
    }, this._interval);
  }

  private _pop(): void {
    const resolve = this._taskList.pop();
    if (isUndefined(resolve)) return;
    resolve();
  }
})(1100);
