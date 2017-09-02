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
         * @param args 附带的数据.
         */
        dispatch(notificationName: string, ...args): void;
    }

    /**
     * IObserver 接口定义了观察者对象应有的属性和方法.
     * @author wizardc
     */
    export interface IObserver {
        /**
         * 添加监听消息.
         * @param notificationName 消息名称.
         * @param callback 消息处理回调.
         * @param thisObj this 对象.
         */
        addListener(notificationName: string, callback: Function, thisObj?: any): void;

        /**
         * 移除监听消息.
         * @param notificationName 消息名称.
         * @param callback 消息处理回调.
         * @param thisObj this 对象.
         */
        removeListener(notificationName: string, callback: Function, thisObj?: any): void;
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
        execute(notificationName: string, ...args): void;
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
        viewComponent: egret.DisplayObject;

        /**
         * 当中介对象注册后会调用该方法.
         */
        onRegister(): void;

        /**
         * 当中介对象移除后会调用该方法.
         */
        onRemove(): void;
    }
}
