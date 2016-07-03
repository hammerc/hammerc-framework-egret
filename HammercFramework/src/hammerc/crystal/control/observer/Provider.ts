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
     * <code>Provider</code> 类提供观察者模式的实现, 它是一个单例类, 为模块或视图广播命令视图对象接收并处理命令提供支持.
     * @author wizardc
     */
    export class Provider {
        private static _instance: Provider;
        
        /**
         * 获取本类的唯一实例.
         * @return 本类的唯一实例.
         */
        public static getInstance(): Provider {
            if (Provider._instance == null) {
                Provider._instance = new Provider();
            }
            return Provider._instance;
        }
        
        private _observerMap: Object;
        
        /**
         * 本类为单例类不能实例化.
         */
        public constructor() {
            if (Provider._instance != null) {
                throw new Error("单例类不能进行实例化！");
            }
            this._observerMap = new Object();
        }
        
        /**
         * 注册一个观察者对象映射到对应的消息名称上.
         * @param notificationName 消息名称.
         * @param observer 要被映射到该消息名称的对象.
         */
        public registerObserver(notificationName: string, observer: IObserver): void {
            if (notificationName != null && notificationName != "" && observer != null) {
                if (!this._observerMap.hasOwnProperty(notificationName)) {
                    this._observerMap[notificationName] = [];
                }
                var list: IObserver[] = this._observerMap[notificationName];
                if (list.indexOf(observer) == -1) {
                    list.push(observer);
                }
            }
        }
        
        /**
         * 移除一个观察者对象的侦听.
         * @param notificationName 消息名称.
         * @param observer 要被移除的观察者对象.
         */
        public removeObserver(notificationName: string, observer: IObserver): void {
            if (notificationName != null && notificationName != "") {
                var list: IObserver[] = this._observerMap[notificationName];
                if (list != null) {
                    for (var i: number = 0, len: number = list.length; i < len; i++) {
                        if (list[i] == observer) {
                            list.splice(i, 1);
                            break;
                        }
                    }
                    if (list.length == 0) {
                        delete this._observerMap[notificationName];
                    }
                }
            }
        }
        
        /**
         * 通知一个消息.
         * @param notification 需要通知的消息对象.
         */
        public notifyObservers(notification: INotification): void {
            if (this._observerMap.hasOwnProperty(notification.name)) {
                var list: IObserver[] = this._observerMap[notification.name];
                for (var key in list) {
                    var observer: IObserver = list[key];
                    observer.notificationHandler(notification);
                }
            }
        }
    }
}
