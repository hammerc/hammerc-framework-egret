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
     * AbstractMediator 类实现了中介的基类.
     * @author wizardc
     */
    export abstract class AbstractMediator extends Observer implements IMediator {
        /**
         * 关注消息注入信息.
         */
        protected __interestNotificationList: { [key: string]: Function[] };

        /**
         * 代理 MVC 中所有处理方法的外观对象.
         */
        protected _facade: Facade = Facade.instance;

        /**
         * 中介对象的名称.
         */
        protected _name: string;

        /**
         * 中介对象对应的具体显示对象.
         */
        protected _viewComponent: egret.DisplayObject;

        /**
         * AbstractMediator 类为抽象类, 不能被实例化.
         * @param name 中介对象的名称.
         * @param viewComponent 中介对象对应的具体显示对象.
         */
        public constructor(name: string, viewComponent?: egret.DisplayObject) {
            super();
            this._name = name;
            this._viewComponent = viewComponent;
        }

        /**
         * 获取中介对象的名称.
         */
        public get name(): string {
            return this._name;
        }

        /**
         * 设置或获取该中介对象对应的具体显示对象.
         */
        public set viewComponent(value: egret.DisplayObject) {
            this._viewComponent = value;
        }
        public get viewComponent(): egret.DisplayObject {
            return this._viewComponent;
        }

        /**
         * 当中介对象注册后会调用该方法.
         */
        public onRegister(): void {
            let interestNotificationList = this.__interestNotificationList;
            for (let notificationName in interestNotificationList) {
                let callbackList = interestNotificationList[notificationName];
                for (let k in callbackList) {
                    let callbak = callbackList[k];
                    this.addListener(notificationName, callbak, this);
                }
            }
        }

        /**
         * 当中介对象移除后会调用该方法.
         */
        public onRemove(): void {
            let interestNotificationList = this.__interestNotificationList;
            for (let notificationName in interestNotificationList) {
                let callbackList = interestNotificationList[notificationName];
                for (let k in callbackList) {
                    let callbak = callbackList[k];
                    this.removeListener(notificationName, callbak, this);
                }
            }
        }
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
