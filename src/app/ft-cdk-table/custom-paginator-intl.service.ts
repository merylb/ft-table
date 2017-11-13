import { Injectable } from '@angular/core';
import {MatPaginatorIntl} from '@angular/material'
import {TranslateService} from '@ngx-translate/core';
@Injectable()
export class CustomPaginatorIntlService extends MatPaginatorIntl {
    rangeSeparator='';

    constructor(translate: TranslateService) {
        super();
        translate.get('items-per-page').subscribe((res: string) => {
            this.itemsPerPageLabel = res;
        });
        translate.get('next-page').subscribe((res: string) => {
            this.nextPageLabel = res;
        });
        translate.get('previous-page').subscribe((res: string) => {
            this.previousPageLabel = res;
        });
        translate.get('of').subscribe((res: string) => {
            this.rangeSeparator = res;
        });

    }

    getRangeLabel = function (page, pageSize, length) {
        if (length === 0 || pageSize === 0) {
            return `0  ${this.rangeSeparator} `  + length;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        // If the start index exceeds the list length, do not try and fix the end index to the end.
        const endIndex = startIndex < length ?
            Math.min(startIndex + pageSize, length) :
            startIndex + pageSize;
        return startIndex + 1 + ' - ' + endIndex + ` ${this.rangeSeparator} ` + length;
    };
}