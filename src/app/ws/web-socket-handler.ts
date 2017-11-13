import {WsMessage} from './web-socket-message';
import {MessagePrototype} from './web-socket-message';
import {WsConnection} from './web-socket-connection';
//
import * as _ from 'lodash';
import 'rxjs/add/operator/toPromise';

export class WebSocketHandler {
    _calls = [];
    _notifications = [];
    _subs = {};
    initiated = false;
    // runDefer = $q.defer();
    checkingCallsTimeout = 1000;
    checkingCallsMaximum = 5;

    constructor(private connection: WsConnection, private options: object) {

    }

    run() {
        // this.options.subject.subscribe({next: authentication});
        // this.authentication().subscribe(res=> this.options['subject'].next(res));
        this.authentication()

        this.connection.handleMessage = this.handle;

        // return runDefer.promise;
    }

    handle(msg) {
        switch (msg.type) {
            case 2:
                this.callRep(msg);
                break;
            case 5:
                this.pubRep(msg);
                break;
            case 6:
                this.notified(msg);
                break;
        }
    }

    authentication() {
        this.connection.authentication();
        //     .then(authenticated, reject);
        //
        // authenticated(result)
        // {
        //     if (initiated) reSub();
        //     initiated = result;
        //     runDefer.resolve(result);
        // }
        //
        // function reject(error) {
        //     runDefer.reject(error);
        // }
    }

    // authentication(): Promise<boolean> {
    //     return this.connection.authentication()
    //         .toPromise()
    //         .then(response => {
    //                 if (this.initiated) reSub();
    //                 this.initiated = response;
    //
    //                response.json().data})
    //         .catch(this.handleError);
    // }
    //
    // private handleResponse(response: any): Promise<boolean> {
    //
    //     if (this.initiated) reSub();
    //     this.initiated = response;
    //
    //     return Promise.resolve(response.json().data);
    // }
    //
    // private handleError(error: any): Promise<any> {
    //     console.error('An error occurred', error); // for demo purposes only
    //     return Promise.reject(error.message || error);
    // }


    call(topic, body) {
        var msg = this.getWsMessage(MessagePrototype.CALL, topic);
        msg.body = _.isUndefined(body) ? {} : body;
        // var deferred = $q.defer();
        // this._calls[msg.id] = deferred;

        //callCheckSending(msg, deferred);
        this.connection.sendMessage(msg);

        // return deferred.promise;
    }

    callRep(msg) {
        if (_.has(this._calls, msg.id)) {
            if (msg.error) this._calls[msg.id].reject(msg.body);
            else this._calls[msg.id].resolve(msg.body);

            _.unset(this._calls, msg.id);
        }
        msg.destroy();
    }

    pubRep(msg) {
        _.forEach(this._subs[msg.topic], function (subject) {
            subject.next(msg.body, msg.error);
        });

        msg.destroy();
    }

    notified(msg) {
        if (_.has(this._notifications, msg.id)) {
            if (msg.error) this._notifications[msg.id].reject(false);
            else this._notifications[msg.id].resolve(true);

            _.unset(this._notifications, msg.id);
        }
        msg.destroy();
    }

    getWsMessage(type, topic) {
        return new WsMessage(type, topic);
    }


}