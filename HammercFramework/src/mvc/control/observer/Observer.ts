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
         * 当有消息到达时会执行该方法处理消息对象.
         * @param notification 对应的消息对象.
         */
        public notificationHandler(notification: INotification): void {
        }
    }
}
