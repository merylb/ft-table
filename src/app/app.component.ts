import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {WebSocketService} from "./ws/web-socket.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'app';
    filter = null;
    actions = null;

    constructor(private translate: TranslateService, private wsService: WebSocketService) {
        translate.setDefaultLang('fr');
    }

    ngOnInit() {
        this.filter = {is_deleted: false};
        this.actions = {
            single: [
                {
                    icon: 'pencil',
                    label: 'edition',
                    resource: 'stock',//vm.stockTable['actionsResource'],
                    action: 'update',
                    behavior: 'disable',
                    method: this.goToEdition
                },
                {
                    icon: 'printer',
                    label: 'print',
                    resource: 'stock',//vm.stockTable['actionsResource'],
                    action: 'print',
                    behavior: 'disable',
                    method: this.printObject
                }

            ],
            multiple: [{
                icon: 'archive',
                label: 'patient_archive',
                resource: 'patient',
                action: 'get',
                behavior: 'remove',
                method: this.archive
            },
                {
                    icon: 'delete',
                    label: 'patient_delete',
                    resource: 'patient',
                    action: 'delete',
                    behavior: 'remove',
                    method: this.remove
                }]
        };
    }


    goToEdition() {

    }

    printObject() {

    }

    archive() {

    }

    remove() {

    }

}
