import { Injectable } from '@angular/core';
import {NativeDateAdapter} from '@angular/material';
import * as moment from 'moment';
export const MY_DATE_FORMATS = {
    parse: {
        dateInput: {month: 'short', year: 'short', day: 'short'}
    },
    display: {
        dateInput: 'input',
        monthYearLabel: {month: 'numeric', year: 'numeric', day: 'numeric'},
        dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
        monthYearA11yLabel: {year: 'numeric', month: 'long'},

    }
};

@Injectable()
export class DateAdapterService extends NativeDateAdapter {

    format(date: Date, displayFormat: Object): string {
        if (displayFormat == "input") {
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
        } else {
            return  moment(date).format('MMM. YYYY');
        }
    }

    private _to2digit(n: number) {
        return ('00' + n).slice(-2);
    }


}