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
     * Notifier 实现了一个最简单的消息发送对象.
     * @author wizardc
     */
    export class Notifier implements INotifier {
        /**
         * 代理类注入信息.
         */
        protected __injectProxyMap: { [key: string]: string[] };

        /**
         * 创建一个 Notifier 对象.
         */
        public constructor() {
            let injectProxyMap: { [key: string]: string[] } = this.__injectProxyMap;
            for (let proxyName in injectProxyMap) {
                let propertyKeys = injectProxyMap[proxyName];
                for (let i = 0, len = propertyKeys.length; i < len; i++) {
                    let propertyKey = propertyKeys[i];
                    this[propertyKey] = ModelManager.instance.getProxy(proxyName);
                }
            }
        }

        /**
         * 发送一个消息.
         * @param notificationName 消息的名称.
         * @param args 附带的数据.
         */
        public dispatch(notificationName: string, ...args): void {
            Controller.instance.executeCommand(notificationName, ...args);
            Provider.instance.dispatch(notificationName, ...args);
        }
    }
}
