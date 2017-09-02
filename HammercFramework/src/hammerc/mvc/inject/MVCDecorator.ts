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
     * 注入代理对象的实例到制定的属性中.
     * @param proxyName 代理对象名称.
     */
    export function InjectProxy(proxyName: string) {
        return function (target: any, propertyKey: string) {
            if (!target.__injectProxyMap) {
                target.__injectProxyMap = {};
            }
            let map: { [key: string]: string[] } = target.__injectProxyMap;
            if (!map[proxyName]) {
                map[proxyName] = [];
            }
            let list = map[proxyName];
            if (list.indexOf(propertyKey) == -1) {
                list.push(propertyKey);
            }
        };
    }

    /**
     * 注入消息监听到指定的方法上.
     * @param notificationName 消息名称.
     */
    export function InterestNotification(notificationName: string) {
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            if (!target.__interestNotificationList) {
                target.__interestNotificationList = {};
            }
            let map: { [key: string]: Function[] } = target.__interestNotificationList;
            if (!map[notificationName]) {
                map[notificationName] = [];
            }
            let list = map[notificationName];
            let func = descriptor.value;
            if (list.indexOf(func) == -1) {
                list.push(func);
            }
        };
    }
}
