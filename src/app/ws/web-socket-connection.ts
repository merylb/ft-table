import * as _ from 'lodash';
import {MessagePrototype} from './web-socket-message';
import {WsMessage} from './web-socket-message';
import {inject} from "@angular/core/testing";
import {Injectable} from "@angular/core";


@Injectable()
export class WsConnection {
    restartTimeOut = 2000;
    restartTimes = 0;
    restartMax = 15;
    port = _.eq(location.protocol, 'https:') ? location.port : "8001";
    address = _.template("${ p1 }://${ p2 }:${ p3 }/ws/")({
        "p1": _.eq(location.protocol, 'https:') ? 'wss' : 'ws',
        "p2": location.hostname,
        "p3": this.port
    });
    // conn = null;
    private conn: WebSocket;
    authDefer = null;
    dead = false;
    handleMessage = _.noop;
    delayedMessages = [];

    constructor(private options: object) {
        this.options = options;
    }


    connect() {
        this.conn = new WebSocket(this.address);

        this.conn.onopen = this.open;

        this.conn.onmessage = this.receiveMessage;

        this.conn.onclose = this.reconnect;
    }

    open() {
        // this.conn.send('{"id":"2j1anUVUqbVmz7wn.1509561315127","type":0,"topic":false,"error":false,"exclude":true,"send_to":[]}');

        if (this.restartTimes == 0) {
            this.options['subject'].next(true);
            this.options['log']("ws connection opened");
        } else {
            this.options['subject'].next(false);
            this.options['log']("ws reconnected");
        }
    }

    reconnect() {
        if (this.dead) return false;
        if (++this.restartTimes <= this.restartMax) {
            this.options['warn']("ws disconnected ... reconnecting");
            setTimeout(this.connect, this.restartTimeOut)
        } else {
            this.options['warn']("ws disconnected");
        }
    }

    receiveMessage(result = null) {
        var msg = JSON.parse(result.data);
        msg.body = this.getBody(msg.body);
        msg.type = parseInt(msg.type);

        msg.destroy();

        if (msg.type == 0) {
            this.authentication_rep(msg);
        } else {
            this.handleMessage(msg);
        }
    }

    getBody(body) {
        if (_.has(body, '__content__')) {
            if (body['__exception__'] && this.options['debug'])
                this.options['error'](body['__content__']);
            body = body['__content__'];
        }

        if (_.has(body, '__file__')) {
            body = {
                _content: body['__body__'],
                _name: body['__name__'],
                download: _.bind(this.downloadFile, body)
            }
        }

        return body;


    }

    downloadFile() {
        var message = this;
        // d = new Deferred();

        // _.defer(_f);
        // return d.promise;

        // _f(){
        //     download(message['__body__'], message['__name__'])
        //     // d.resolve(true);
        // }
    }

    authentication_rep(msg) {
        if (msg.error) {
            this.dead = true;
            // authDefer.reject("authentication failed");
            this.conn.close();
        } else {
            // authDefer.resolve(true);

            _.forEach(this.delayedMessages, this.sendMessage);
            this.delayedMessages = [];
        }
        msg.destroy();
    }

    getToken() {
        return localStorage.satellizer_token;
    }

    authentication() {
        var msg = new WsMessage(MessagePrototype.AUTHETICATION, false);
        msg.body = this.getToken();
        this.sendMessage(msg);
        // return authDefer.promise;
    }

    sendMessage(msg) {
        console.log('test-------------', msg);
        console.log('test--xx-----------', this.conn);
        if (this.conn.readyState === WebSocket.OPEN) {
            console.log('test--xx----cccc-------', this.conn);
            this.conn.send(JSON.stringify(msg));
        } else if (msg.type != 0) {
            this.delayedMessages.push(_.cloneDeep(msg));
        }
        msg.destroy();
    }
}