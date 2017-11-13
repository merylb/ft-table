import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import {MatSort, MatPaginator } from '@angular/material';
import * as _ from 'lodash';
// import {SynchronousTranslateService} from "../translate/translate.service";
import {FtCdkTableService} from "./ft-cdk-table.service";
import {CustomPaginatorIntlService} from "./custom-paginator-intl.service";
import {MatPaginatorIntl} from '@angular/material'
import {SelectionModel} from '@angular/cdk/collections';


const namespace = 'test';
@Component({
    selector: 'app-ft-cdk-table',
    providers: [FtCdkTableService, {
        provide: MatPaginatorIntl,
        useClass: CustomPaginatorIntlService
    }],
    templateUrl: './ft-cdk-table.component.html',
    styleUrls: ['./ft-cdk-table.component.scss']
})
export class FtCdkTableComponent implements OnInit {
    @Input() packaging: string;
    @Input() model: string;
    @Input() configKey: string;
    @Input() serializer: string;
    @Input() dataSource: string;

    @Input() selectable: string;
    @Input() actions: string;
    @Input() mnQuery: string;

    dataFilter = {};
    columns = [];
    filterColumns = [];
    FilterNonUsedColumns = [];
    exampleDatabase = null;
    exampleColumns = null;
    tableSource: TableDataSource | null;
    tableConfig: Object;
    filters = ['and', 'or'];

    selectedItems = [];

    selection = new SelectionModel<Object>(true, []);

    constructor(private ftCdkTableService: FtCdkTableService) {
        this.ftCdkTableService.getConfig().subscribe(res => {
            this.tableConfig = res;
        });
    }

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngOnInit() {
        this.dataFilter = {
            model: this.model,
            packaging: this.packaging,
            configKey: this.configKey,
            serializer: this.serializer
        };
        this.columns = this.ftCdkTableService.getColumns();
        if (!_.isEmpty(this.actions)) this.columns.push({
            "name": "action_column",
            "show_in": [{"name": "default", "allow": true}]
        });
        if (this.selectable) this.columns.unshift({
            "name": "select_column",
            "show_in": [{"name": "default", "allow": true}]
        })

        this.exampleDatabase = new ExampleDatabase(this.ftCdkTableService, _.assignIn(this.dataFilter, {query: []}), this.dataSource);
        this.tableSource = new TableDataSource(this.exampleDatabase, this.sort, this.paginator, this.columns);
        this.filterColumns = _.chain(this.columns).filter(function (o) {
            return o.is_required && !_.includes(['action_column', 'select_column'], o.name);
        }).map(function (item) {
            return {'filter': 'and', 'column': item};
        }).value();
    }

    filterNonUsedColumns() {
        return _.differenceBy(_.chain(this.columns).filter(function (o) {
            return !_.includes(['action_column', 'select_column'], o.name)
        }).value(), _.chain(this.filterColumns) .map('column').value(), 'name');
    }

    hideColumn(col) {
        let ns_show = _.find(col['show_in'], {name: namespace})
        if (_.isNil(ns_show)) col.show_in.push({name: namespace, allow: false})
        else  _.update(col['show_in'][_.findIndex(col['show_in'], {name: namespace})], 'allow', function (n) {
            return !n;
        });
    }

    isShown(col) {
        let ns_show = _.find(col['show_in'], {name: namespace})
        let res = !_.isNil(ns_show) ? ns_show['allow'] : _.find(col['show_in'], {name: 'default'})['allow'];
        return res;
    }

    displayedColumns() {
        return _.chain(this.columns).filter(function (o) {
            let ns_show = _.find(o['show_in'], {name: namespace})
            return !_.isNil(ns_show) ? ns_show['allow'] : _.find(o['show_in'], {name: 'default'})['allow'];
        }).map('name').value();

    }

    getCostumeData() {
        this.exampleDatabase = new ExampleDatabase(this.ftCdkTableService, _.assignIn(this.dataFilter, {query: {multi_search: this.getFilter(this.filterColumns)}}), this.dataSource);
        this.tableSource = new TableDataSource(this.exampleDatabase, this.sort, this.paginator, this.columns);
    }

    addFilterColumn(col) {
        this.filterColumns.push({column: col, filter: 'and'});
    }

    getFilterColumns(colName) {
        return _.chain(this.filterColumns).map(function (o) {
            return o.column['name']
        }).includes(colName.name).value();
        // return true;
    }

    getFilter(filter) {
        return _.chain(filter).filter(function (o) {
            return !_.isUndefined(o.value) && !_.isEmpty(_.words(o.value));
        }).map(function (item) {
            return {'filter': item.filter, 'column': item.column.name, 'value': item.value};
        }).value();
    }

    isAllSelected(): boolean {
        if (!this.tableSource) {
            return false;
        }
        if (this.selection.isEmpty()) {
            return false;
        }
        else {
            let start_index=this.paginator.pageIndex * this.paginator.pageSize
            let end_index=this.paginator.pageSize
            if (start_index==  end_index)  {
                return this.exampleDatabase.data.slice(start_index, end_index+1 ).filter(row => _.includes(this.selection.selected, row)).length == this.exampleDatabase.data.slice(start_index, end_index+1).length;
            }
            else {
                return this.exampleDatabase.data.slice(start_index, end_index ).filter(row => _.includes(this.selection.selected, row)).length == this.exampleDatabase.data.slice(start_index, end_index).length;
            }
        }
    }

    masterToggle() {
        if (!this.tableSource) {
            return;
        }
        let start_index=this.paginator.pageIndex * this.paginator.pageSize
        let end_index=this.paginator.pageSize

        if (this.isAllSelected()) {
            if (start_index==  end_index)    this.exampleDatabase.data.slice(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize+1).forEach(row =>  this.selection.deselect(row))
            else  this.exampleDatabase.data.slice(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize).forEach(row =>   this.selection.deselect(row))
        } else {
            if (start_index ==  end_index)   {
                this.exampleDatabase.data.slice(start_index, end_index+1).forEach(r => this.selection.select(r));
            }
            else {
                this.exampleDatabase.data.slice(start_index, end_index).forEach(row => this.selection.select(row));
            }
        }
    }

    updateSelection(){
        this.selectedItems=this.selection.selected;
    }
}

export interface TableData {
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
    /** Stream that emits whenever the data has been modified. */
    dataChange: BehaviorSubject<any> = new BehaviorSubject<any>([]);

    get data(): any {
        return this.dataChange.value;
    }

    constructor(private ftCdkTableService: FtCdkTableService, private filter: Object, private  dataSource: string) {
        // Fill up the database with 100 users.
        ftCdkTableService.getData(this.filter, this.dataSource).subscribe(res => {
            res = _.chain(res).map(function (item) {
                item['action_column'] = '';
                item['select_column'] = false
                return item;
            }).value();
            this.dataChange.next(res);
        });
    }


}
/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class TableDataSource extends DataSource<any> {
    constructor(private _exampleDatabase: ExampleDatabase, private _sort: MatSort, private _paginator: MatPaginator, private _columns: Array<Object>) {
        super();
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<TableData[]> {
        const displayDataChanges = [
            this._exampleDatabase.dataChange,
            // this._exampleColumns.columnChange,
            this._sort.sortChange,
            this._paginator.page,
            this._columns,
        ];

        return Observable.merge(...displayDataChanges).map(() => {
            const data = this.getSortedData();

            const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
            return data.splice(startIndex, this._paginator.pageSize);
        });
    }

    disconnect() {
    }

    getSortedData(): TableData[] {
        const data = this._exampleDatabase.data.slice();
        if (!this._sort.active || this._sort.direction == '') {
            return data;
        }
        return data.sort((a, b) => {
            let propertyA: number|string = '';
            let propertyB: number|string = '';

            let item: Object = _.find(this._columns, {name: this._sort.active});
            if (!_.isNil(item)) [propertyA, propertyB] = [a[item['name']], b[item['name']]];

            let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
        });
    }
}
