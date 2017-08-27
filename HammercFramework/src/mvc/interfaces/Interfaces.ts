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
     * INotifier 接口定义了消息发送对象应有的属性和方法.
     * @author wizardc
     */
    export interface INotifier {
        /**
         * 发送一个消息.
         * @param notificationName 消息的名称.
         * @param body 消息的数据.
         * @param type 消息的类型.
         */
        sendNotification(notificationName: string, body?: any, type?: string): void;
    }

    /**
     * IObserver 接口定义了观察者对象应有的属性和方法.
     * @author wizardc
     */
    export interface IObserver {
        /**
         * 当有消息到达时会执行该方法处理消息对象.
         * @param notification 对应的消息对象.
         */
        notificationHandler(notification: INotification): void;
    }

    /**
     * INotification 接口定义了连接 Model 层和 View 层通讯发送的消息体对象应有的属性和方法.
     * @author wizardc
     */
    export interface INotification {
        /**
         * 获取消息名称.
         */
        name: string;

        /**
         * 设置或获取消息的类型.
         */
        type: string;

        /**
         * 设置或获取消息的数据.
         */
        body: any;
    }

    /**
     * ICommand 接口定义了命令对象应有的属性和方法.
     * <p>命令对象的实例会在接收到指定的消息后被创建, 当 execute 方法执行完成后该对象会被抛弃.</p>
     * @author wizardc
     */
    export interface ICommand {
        /**
         * 执行具体命令的方法.
         * @param notification 对应的消息对象.
         */
        execute(notification: INotification): void;
    }

    /**
     * IProxy 接口定义代理类应有的属性和方法.
     * @author wizardc
     */
    export interface IProxy {
        /**
         * 获取代理对象的名称.
         */
        name: string;

        /**
         * 设置或获取代理对象持有的数据.
         */
        data: any;

        /**
         * 当代理对象注册后会调用该方法.
         */
        onRegister(): void;

        /**
         * 当代理对象移除后会调用该方法.
         */
        onRemove(): void;
    }

    /**
     * IMediator 接口定义了中介类应有的属性和方法.
     * @author wizardc
     */
    export interface IMediator extends IObserver {
        /**
         * 获取中介对象的名称.
         */
        name: string;

        /**
         * 设置或获取该中介对象对应的具体显示对象.
         */
        viewComponent: any;

        /**
         * 当中介对象注册后会调用该方法.
         */
        onRegister(): void;

        /**
         * 当中介对象移除后会调用该方法.
         */
        onRemove(): void;

        /**
         * 获取中介对象感兴趣的消息名称列表.
         * @return 中介对象感兴趣的消息名称列表.
         */
        interestNotificationList(): Array<string>;
    }
}
