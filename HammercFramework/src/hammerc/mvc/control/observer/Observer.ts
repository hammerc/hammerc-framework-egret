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
     * Observer 类实现了一个简单的观察者.
     * @author wizardc
     */
    export abstract class Observer extends Notifier implements IObserver {
        /**
         * Observer 类为抽象类, 不能被实例化.
         */
        public constructor() {
            super();
        }

        /**
         * 添加监听消息.
         * @param notificationName 消息名称.
         * @param callback 消息处理回调.
         * @param thisObj this 对象.
         */
        public addListener(notificationName: string, callback: Function, thisObj?: any): void {
            Provider.instance.addListener(notificationName, callback, thisObj);
        }

        /**
         * 移除监听消息.
         * @param notificationName 消息名称.
         * @param callback 消息处理回调.
         * @param thisObj this 对象.
         */
        public removeListener(notificationName: string, callback: Function, thisObj?: any): void {
            Provider.instance.removeListener(notificationName, callback, thisObj);
        }
    }
}
