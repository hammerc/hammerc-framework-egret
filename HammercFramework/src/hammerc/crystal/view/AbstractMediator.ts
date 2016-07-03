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
     * <code>AbstractMediator</code> 类实现了中介的基类.
     * @author wizardc
     */
    export class AbstractMediator extends Observer implements IMediator {
        /**
         * 代理 MVC 中所有处理方法的外观对象.
         */
        protected _facade: Facade = Facade.getInstance();
        
        /**
         * 中介对象的名称.
         */
        protected _name: string;
        
        /**
         * 中介对象对应的具体显示对象.
         */
        protected _viewComponent: any;
        
        /**
         * <code>AbstractMediator</code> 类为抽象类, 不能被实例化.
         * @param name 中介对象的名称.
         * @param viewComponent 中介对象对应的具体显示对象.
         */
        public constructor(name: string, viewComponent?: any) {
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
        public set viewComponent(value: any) {
            this._viewComponent = value;
        }
        public get viewComponent(): any {
            return this._viewComponent;
        }
        
        /**
         * 当中介对象注册后会调用该方法.
         */
        public onRegister(): void {
        }
        
        /**
         * 当中介对象移除后会调用该方法.
         */
        public onRemove(): void {
        }
        
        /**
         * 获取中介对象感兴趣的消息名称列表.
         * @return 中介对象感兴趣的消息名称列表.
         */
        public interestNotificationList(): Array<string> {
            return null;
        }
    }
}
