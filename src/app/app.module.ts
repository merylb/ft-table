// import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {LOCALE_ID} from '@angular/core';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClientModule,HttpClient} from '@angular/common/http';
import {MatIconRegistry }    from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {FtCdkTableComponent} from './ft-cdk-table/ft-cdk-table.component';
import {WebSocketService} from "./ws/web-socket.service";
import {MaterialModule} from './material-modules';
import { DateAdapter, MAT_DATE_FORMATS} from '@angular/material';

import {DateAdapterService, MY_DATE_FORMATS} from "./date-adapter.service";

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, '/dist/assets/i18n/', '.json');
}


@NgModule({
    declarations: [
        AppComponent,
        FtCdkTableComponent,
    ],
    imports: [
        // BrowserModule,
        MaterialModule,
        HttpClientModule,
        // HttpModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })

    ],
    providers: [WebSocketService,{ provide: LOCALE_ID, useValue: "fr" },{provide: DateAdapter, useClass: DateAdapterService}, {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer ) {
        matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('/dist/assets/mdi.svg'));

    }
}




