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
     * <code>Notifier</code> 实现了一个最简单的消息发送对象.
     * @author wizardc
     */
    export class Notifier implements INotifier {
        /**
         * 发送一个消息.
         * @param notificationName 消息的名称.
         * @param body 消息的数据.
         * @param type 消息的类型.
         */
        public sendNotification(notificationName: string, body?: any, type?: string): void {
            var notification: INotification = Notification.fromPool(notificationName, type, body);
            Controller.getInstance().executeCommand(notification);
            Provider.getInstance().notifyObservers(notification);
            Notification.toPool(notification);
        }
    }
}
