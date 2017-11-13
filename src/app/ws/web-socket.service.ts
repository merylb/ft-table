import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import * as _ from 'lodash';

import {WebSocketHandler} from './web-socket-handler';
import {WsConnection} from './web-socket-connection';


@Injectable()
export class WebSocketService {
    to_debug = true;
    exposeIt = false;
    wsHandler = null;
    connection = null;

    options = {
        log: this.log,
        warn: this.warn,
        error: this.error,
        subject: new BehaviorSubject<boolean>(false)
    }

    constructor() {

    }

    log(msg) {
        if (this.to_debug) console.info(msg);
    }

    warn(msg) {
        if (this.to_debug) console.warn(msg);
    }

    error(msg) {
        if (this.to_debug) console.error(msg);
    }

    debug(_to_debug = null) {
        this.to_debug = _.isUndefined(_to_debug) ? true : _to_debug;
    }

    expose() {
        this.exposeIt = true;
    }

    connect() {
        this.options['debug'] = this.to_debug;
        this.options['exposeIt'] = this.exposeIt;

        this.connection = new WsConnection(this.options);
        this.wsHandler = new WebSocketHandler(this.connection, this.options);
    }

    run() {
        this.wsHandler.run();
    }

    call(topic, body) {
        this.wsHandler.call(topic, body);
    }

}
