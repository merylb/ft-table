import {Injectable} from '@angular/core';
// import {Http} from "@angular/http";
import {WebSocketService} from '../ws/web-socket.service';
import {Subject, Observable} from "rxjs";
import * as _ from 'lodash';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class FtCdkTableService {

    constructor(private http: HttpClient, private wsService: WebSocketService) {
    }

    getConfig() {
        return this.http.get("api/table-config/1/");

    }

    getColumns() {
        return [
            {
                "name": "number",
                "label": "invoice_number",
                "type": "text",
                "order_by": "number",
                "is_orderable": true,
                "is_searchable": true,
                "is_editable": false,
                "is_required": true,
                "is_global_searchable": true,
                "is_ref": false,
                "show_in": [
                    {
                        "name": "default",
                        "allow": true
                    }
                ],
                "order_in": [
                    {
                        "name": "default",
                        "value": 0
                    }
                ]
            },
            {
                "name": "doc_date",
                "label": "invoice_date",
                "type": "date",
                "order_by": "doc_date",
                "is_orderable": true,
                "is_searchable": true,
                "is_editable": false,
                "is_required": true,
                "is_global_searchable": true,
                "is_ref": false,
                "show_in": [
                    {
                        "name": "default",
                        "allow": true
                    }
                ],
                "order_in": [
                    {
                        "name": "default",
                        "value": 1
                    }
                ]
            },
            {
                "name": "beneficiary_name",
                "label": "invoice_beneficiary",
                "type": "text",
                "order_by": "beneficiary_name",
                "is_orderable": true,
                "is_searchable": true,
                "is_editable": false,
                "is_required": true,
                "is_global_searchable": false,
                "is_ref": false,
                "show_in": [
                    {
                        "name": "default",
                        "allow": true
                    }
                ],
                "order_in": [
                    {
                        "name": "default",
                        "value": 2
                    }
                ]
            },
            {
                "name": "taxed_amount",
                "label": "taxed_amount",
                "type": "number",
                "order_by": "taxed_amount",
                "is_orderable": true,
                "is_searchable": true,
                "is_editable": false,
                "is_required": false,
                "is_global_searchable": false,
                "is_ref": false,
                "show_in": [
                    {
                        "name": "default",
                        "allow": true
                    }
                ],
                "order_in": [
                    {
                        "name": "default",
                        "value": 3
                    }
                ],
                "rounded": true
            }
        ]
    }

    getData(filter: Object, dataSource: string) :any {
        if (!_.isNil(dataSource)) return;
        // return this.http.post("api/table-config/", filter);

        else return this.http.post("api/table-config/", filter);
    }
}
