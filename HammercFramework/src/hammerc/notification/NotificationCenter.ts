// =================================================================================================
//
//    Hammerc Framework
//    Copyright 2016 hammerc.org All Rights Reserved.
//
//    See LICENSE for full license information.
//
// =================================================================================================

module hammerc {
    /**
     * <code>NotificationCenter</code> 类实现了消息通知功能.
     * @author wizardc
     */
    export class NotificationCenter<T> {
        private _map: Dictionary<T, MessageInfo[]>;

        /**
         * 创建一个 <code>NotificationCenter</code> 对象.
         */
        public constructor() {
            this._map = new Dictionary<T, MessageInfo[]>();
        }

        /**
         * 注册消息.
         * @param messageType 消息类型.
         * @param messageHandler 消息处理函数.
         * @param thisObj this 指向对象.
         */
        public regiestMessage(messageType: T, messageHandler: Function, thisObj?: any): void {
            if (!this._map.has(messageType)) {
                this._map.add(messageType, []);
            }
            var list: MessageInfo[] = this._map.get(messageType);
            for (var i = 0, len = list.length; i < len; i++) {
                if (list[i].messageHandler == messageHandler && list[i].thisObj == thisObj) {
                    return;
                }
            }
            list.push(MessageInfo.fromPool(messageHandler, thisObj));
        }

        /**
         * 发送消息.
         * @param messageType 消息类型.
         * @param args 附带参数.
         */
        public sendMessage(messageType: T, ...args): void {
            if (this._map.has(messageType)) {
                var list: MessageInfo[] = this._map.get(messageType);
                for (var i = 0, len = list.length; i < len; i++) {
                    var info: MessageInfo = list[i];
                    info.messageHandler.apply(info.thisObj, [messageType].concat(args));
                }
            }
        }

        /**
         * 注销消息.
         * @param messageType 消息类型.
         * @param messageHandler 消息处理函数.
         * @param thisObj this 指向对象.
         */
        public unregiestMessage(messageType: T, messageHandler: Function, thisObj?: any): void {
            if (this._map.has(messageType)) {
                var list: MessageInfo[] = this._map.get(messageType);
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i].messageHandler == messageHandler && list[i].thisObj == thisObj) {
                        break;
                    }
                }
                if (i != len) {
                    var info: MessageInfo = list.splice(i, 1)[0];
                    MessageInfo.toPool(info);
                }
            }
        }

        /**
         * 移除指定类型的所有消息监听.
         * @param messageType 消息类型.
         */
        public removeMessage(messageType: T): void {
            if (this._map.has(messageType)) {
                var list: MessageInfo[] = this._map.get(messageType);
                for (var i = 0, len = list.length; i < len; i++) {
                    MessageInfo.toPool(list[i]);
                }
                this._map.remove(messageType);
            }
        }

        /**
         * 清除所有消息监听.
         */
        public clear(): void {
            this._map.forEach((item, key, dictionary) => {
                for (var i = 0, len = item.length; i < len; i++) {
                    MessageInfo.toPool(item[i]);
                }
            }, this);
            this._map.clear();
        }
    }

    /**
     * <code>MessageInfo</code> 类实现了消息信息对象.
     * @author wizardc
     */
    export class MessageInfo {
        private static _pool: MessageInfo[] = [];

        /**
         * 从对象池中取出一个消息对象.
         * @param messageHandler 消息处理函数.
         * @param thisObj this 指向对象.
         * @return 消息对象.
         */
        public static fromPool(messageHandler: Function, thisObj: any): MessageInfo {
            if (MessageInfo._pool.length > 0) {
                return MessageInfo._pool.pop().reset(messageHandler, thisObj);
            } else {
                return new MessageInfo(messageHandler, thisObj);
            }
        }

        /**
         * 回收一个消息对象.
         * @param message 消息对象.
         */
        public static toPool(message: MessageInfo): void {
            message.clear();
            MessageInfo._pool[MessageInfo._pool.length] = message;
        }

        /**
         * 消息处理函数.
         */
        public messageHandler: Function;

        /**
         * this 指向对象.
         */
        public thisObj: any;

        /**
         * 创建一个 <code>MessageInfo</code> 对象.
         * @param messageHandler 消息处理函数.
         * @param thisObj this 指向对象.
         */
        public constructor(messageHandler: Function, thisObj: any) {
            this.messageHandler = messageHandler;
            this.thisObj = thisObj;
        }

        /**
         * 重置消息的数据.
         * @param messageHandler 消息处理函数.
         * @param thisObj this 指向对象.
         * @returns 消息对象.
         */
        public reset(messageHandler: Function, thisObj: any): MessageInfo {
            this.messageHandler = messageHandler;
            this.thisObj = thisObj;
            return this;
        }

        /**
         * 清除消息的数据.
         */
        public clear(): void {
            this.messageHandler = null;
            this.thisObj = null;
        }
    }
}
