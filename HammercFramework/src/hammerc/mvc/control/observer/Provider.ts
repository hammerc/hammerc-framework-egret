// =================================================================================================
//
//    Hammerc Framework
//    Copyright 2016 hammerc.org All Rights Reserved.
//
//    See LICENSE for full license information.
//
// =================================================================================================

namespace hammerc {
    /**
     * Provider 类提供观察者模式的实现, 它是一个单例类, 为模块或视图广播命令视图对象接收并处理命令提供支持.
     * @author wizardc
     */
    export class Provider {
        private static _instance: Provider;

        /**
         * 获取本类的唯一实例.
         * @return 本类的唯一实例.
         */
        public static get instance(): Provider {
            return Provider._instance || (Provider._instance = new Provider());
        }

        private _callbackMap: { [k: string]: CallbackInfo[] };

        /**
         * 本类为单例类不能实例化.
         */
        private constructor() {
            this._callbackMap = {};
        }

        /**
         * 添加监听消息.
         * @param notificationName 消息名称.
         * @param callback 消息处理回调.
         * @param thisObj this 对象.
         */
        public addListener(notificationName: string, callback: Function, thisObj: any): void {
            if (!this._callbackMap.hasOwnProperty(notificationName)) {
                this._callbackMap[notificationName] = [];
            }
            let list = this._callbackMap[notificationName];
            for (let i = 0, len = list.length; i < len; i++) {
                let info = list[i];
                if (info.callback == callback && info.thisObj == thisObj) {
                    return;
                }
            }
            list[list.length] = CallbackInfo.fromPool(callback, thisObj);
        }

        /**
         * 移除监听消息.
         * @param notificationName 消息名称.
         * @param callback 消息处理回调.
         * @param thisObj this 对象.
         */
        public removeListener(notificationName: string, callback: Function, thisObj?: any): void {
            if (this._callbackMap.hasOwnProperty(notificationName)) {
                let list = this._callbackMap[notificationName];
                for (let i = 0, len = list.length; i < len; i++) {
                    let info = list[i];
                    if (info.callback == callback && info.thisObj == thisObj) {
                        CallbackInfo.toPool(info);
                        list[i] = null;
                        break;
                    }
                }
            }
        }

        /**
         * 发送一个消息.
         * @param notificationName 消息的名称.
         * @param args 附带的数据.
         */
        public dispatch(notificationName: string, ...args): void {
            if (this._callbackMap.hasOwnProperty(notificationName)) {
                let list = this._callbackMap[notificationName];
                let length = list.length;
                if (length == 0) {
                    return;
                }
                let currentIndex = 0;
                for (var i = 0; i < length; i++) {
                    let info = list[i];
                    if (info != null) {
                        if (currentIndex != i) {
                            list[currentIndex] = info;
                            list[i] = null;
                        }
                        info.callback.apply(info.thisObj, [notificationName].concat(args));
                        currentIndex++;
                    }
                }
                if (currentIndex != i) {
                    length = list.length;
                    while (i < length) {
                        list[currentIndex++] = list[i++];
                    }
                    list.length = currentIndex;
                }
            }
        }
    }

    class CallbackInfo {
        private static _pool: CallbackInfo[] = [];

        public static fromPool(callback: Function, thisObj: any): CallbackInfo {
            if (this._pool.length > 0) {
                return this._pool.pop().reset(callback, thisObj);
            } else {
                return new CallbackInfo(callback, thisObj);
            }
        }

        public static toPool(info: CallbackInfo): void {
            info.clear();
            this._pool[this._pool.length] = info;
        }

        public callback: Function;

        public thisObj: any;

        public constructor(callback: Function, thisObj: any) {
            this.callback = callback;
            this.thisObj = thisObj;
        }

        public reset(callback: Function, thisObj: any): CallbackInfo {
            this.callback = callback;
            this.thisObj = thisObj;
            return this;
        }

        public clear(): void {
            this.callback = null;
            this.thisObj = null;
        }
    }
}
