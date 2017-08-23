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
     * AbstractProxy 类实现了代理的基类.
     * @author wizardc
     */
    export abstract class AbstractProxy extends Notifier implements IProxy {
        /**
         * 代理 MVC 中所有处理方法的外观对象.
         */
        protected _facade: Facade = Facade.instance;

        /**
         * 代理对象的名称.
         */
        protected _name: string;

        /**
         * 代理对象持有的数据.
         */
        protected _data: any;

        /**
         * AbstractProxy 类为抽象类, 不能被实例化.
         * @param name 代理对象的名称.
         * @param data 代理对象持有的数据.
         */
        public constructor(name: string, data?: any) {
            super();
            this._name = name;
            this._data = data;
        }

        /**
         * 获取代理对象的名称.
         */
        public get name(): string {
            return this._name;
        }

        /**
         * 设置或获取代理对象持有的数据.
         */
        public set data(value: any) {
            this._data = value;
        }
        public get data(): any {
            return this._data;
        }

        /**
         * 当代理对象注册后会调用该方法.
         */
        public onRegister(): void {
        }

        /**
         * 当代理对象移除后会调用该方法.
         */
        public onRemove(): void {
        }
    }
}
