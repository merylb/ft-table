import * as _ from 'lodash';

export enum MessagePrototype {AUTHETICATION = 0, CALL = 1, REP_CALL = 2, SUB = 3, UNSUB = 4, PUB = 5}
//
export class WsMessage {

    id = this.generateId();
    type = null;
    topic = null;
    body = {};
    error = false;
    exclude = true;
    send_to = [];

    constructor(type, topic) {
        this.type = type;
        this.topic = topic;
    }

    destroy() {
        this.id = null
        this.type = null;
        this.topic = null;
        this.body = null;
        this.error = null;
        this.exclude = null;
        this.send_to = null;
    }

    generateId(lenght = null, sep = null) {
        if (_.isNil(lenght)) lenght = 16;
        if (_.isNil(sep)) sep = ".";
        var keyChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            keyLen = lenght,
            key = "",
            l = keyChars.length;

        while (keyLen--) {
            key += keyChars.charAt(Math.floor(Math.random() * l));
        }
        return key + sep + (new Date()).getTime();
    }


}