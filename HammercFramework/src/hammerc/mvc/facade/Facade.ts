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
     * Facade 类代理 MVC 中所有处理方法.
     * @author wizardc
     */
    export class Facade {
        private static _instance: Facade;

        /**
         * 获取本类的唯一实例.
         * @return 本类的唯一实例.
         */
        public static get instance(): Facade {
            return Facade._instance || (Facade._instance = new Facade());
        }

        /**
         * 记录控制者对象.
         */
        protected _controller: Controller;

        /**
         * 记录观察者管理对象.
         */
        protected _provider: Provider;

        /**
         * 记录代理管理对象.
         */
        protected _modelManager: ModelManager;

        /**
         * 记录中介管理对象.
         */
        protected _viewManager: ViewManager;

        /**
         * 本类为单例类不能实例化.
         */
        private constructor() {
            this._controller = Controller.instance;
            this._provider = Provider.instance;
            this._modelManager = ModelManager.instance;
            this._viewManager = ViewManager.instance;
        }

        /**
         * 发送一个消息.
         * @param notificationName 消息的名称.
         * @param args 附带的数据.
         */
        public dispatch(notificationName: string, ...args): void {
            this._controller.executeCommand(notificationName, ...args);
            this._provider.dispatch(notificationName, ...args);
        }

        /**
         * 注册一个命令类对象映射到对应的消息名称上.
         * @param notificationName 消息名称.
         * @param commandClass 要被映射到该消息名称的类.
         */
        public registerCommand(notificationName: string, commandClass: any): void {
            this._controller.registerCommand(notificationName, commandClass);
        }

        /**
         * 判断一个消息名称是否正在被侦听.
         * @param notificationName 消息名称.
         */
        public hasCommand(notificationName: string): boolean {
            return this._controller.hasCommand(notificationName);
        }

        /**
         * 移除一个消息名称的所有侦听.
         * @param notificationName 消息名称.
         */
        public removeCommand(notificationName: string): void {
            this._controller.removeCommand(notificationName);
        }

        /**
         * 添加监听消息.
         * @param notificationName 消息名称.
         * @param callback 消息处理回调.
         * @param thisObj this 对象.
         */
        public addListener(notificationName: string, callback: Function, thisObj: any): void {
            this._provider.addListener(notificationName, callback, thisObj);
        }

        /**
         * 移除监听消息.
         * @param notificationName 消息名称.
         * @param callback 消息处理回调.
         * @param thisObj this 对象.
         */
        public removeListener(notificationName: string, callback: Function, thisObj?: any): void {
            this._provider.removeListener(notificationName, callback, thisObj);
        }

        /**
         * 注册一个代理对象.
         * @param proxy 要被注册的代理对象.
         */
        public registerProxy(proxy: IProxy): void {
            this._modelManager.registerProxy(proxy);
        }

        /**
         * 判断一个代理对象是否被注册.
         * @param proxyName 代理对象名称.
         * @return 指定的代理对象被注册返回 (true), 否则返回 (false).
         */
        public hasProxy(proxyName: string): boolean {
            return this._modelManager.hasProxy(proxyName);
        }

        /**
         * 获取一个代理对象.
         * @param proxyName 代理对象名称.
         * @return 指定的代理对象.
         */
        public getProxy(proxyName: string): IProxy {
            return this._modelManager.getProxy(proxyName);
        }

        /**
         * 移除一个代理对象.
         * @param proxyName 代理对象名称.
         * @return 移除的代理对象.
         */
        public removeProxy(proxyName: string): IProxy {
            return this._modelManager.removeProxy(proxyName);
        }

        /**
         * 设置或获取上下文容器.
         * 一旦设置了该容器对象, 所有添加到该容器的视图对象如果存在中介类映射都会自动创建和销毁对应的中介类.
         */
        public set contextView(value: egret.DisplayObjectContainer) {
            this._viewManager.contextView = value;
        }
        public get contextView(): egret.DisplayObjectContainer {
            return this._viewManager.contextView;
        }

        /**
         * 映射视图类和中介类.
         * @param viewClass 视图类.
         * @param mediatorClass 中介类.
         */
        public registerMediator(viewClass: { new (): egret.DisplayObject }, mediatorClass: { new (): IMediator }): void {
            this._viewManager.registerMediator(viewClass, mediatorClass);
        }

        /**
         * 获取视图类是否已经存在映射关系.
         * @param viewClass 视图类.
         * @return 是否已经存在映射关系.
         */
        public hasMediator(viewClass: { new (): egret.DisplayObject }): boolean {
            return this._viewManager.hasMediator(viewClass);
        }

        /**
         * 获取视图对象对应的中介类.
         * @param viewObject 视图对象.
         * @return 视图对象对应的中介类.
         */
        public getMediator(viewObject: egret.DisplayObject): IMediator {
            return this._viewManager.getMediator(viewObject);
        }

        /**
         * 解除视图类和中介类的映射关系.
         * @param viewClass 视图类.
         * @param mediatorClass 中介类.
         */
        public removeMediator(viewClass: { new (): egret.DisplayObject }, mediatorClass: { new (): IMediator }): void {
            this._viewManager.removeMediator(viewClass, mediatorClass);
        }
    }
}
