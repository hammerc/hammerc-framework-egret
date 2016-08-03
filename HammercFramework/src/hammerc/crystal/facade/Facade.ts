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
     * <code>Facade</code> 类代理 MVC 中所有处理方法.
     * @author wizardc
     */
    export class Facade {
        private static _instance: Facade;

        /**
         * 获取本类的唯一实例.
         * @return 本类的唯一实例.
         */
        public static getInstance(): Facade {
            if (Facade._instance == null) {
                Facade._instance = new Facade();
            }
            return Facade._instance;
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
        public constructor() {
            if (Facade._instance != null) {
                throw new Error("单例类不能进行实例化！");
            }
            this._controller = Controller.getInstance();
            this._provider = Provider.getInstance();
            this._modelManager = ModelManager.getInstance();
            this._viewManager = ViewManager.getInstance();
        }

        /**
         * 发送一个消息.
         * @param notificationName 消息的名称.
         * @param body 消息的数据.
         * @param type 消息的类型.
         */
        public sendNotification(notificationName: string, body?: any, type?: string): void {
            var notification: INotification = Notification.fromPool(notificationName, type, body);
            this._controller.executeCommand(notification);
            this._provider.notifyObservers(notification);
            Notification.toPool(notification);
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
         * 注册一个观察者对象映射到对应的消息名称上.
         * @param notificationName 消息名称.
         * @param observer 要被映射到该消息名称的对象.
         */
        public registerObserver(notificationName: string, observer: IObserver): void {
            this._provider.registerObserver(notificationName, observer);
        }

        /**
         * 移除一个观察者对象的侦听.
         * @param notificationName 消息名称.
         * @param observer 要被移除的观察者对象.
         */
        public removeObserver(notificationName: string, observer: IObserver): void {
            this._provider.removeObserver(notificationName, observer);
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
         * @return 指定的代理对象被注册返回 (<code>true</code>), 否则返回 (<code>false</code>).
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
         * 注册一个中介对象.
         * @param mediator 要被注册的中介对象.
         */
        public registerMediator(mediator: IMediator): void {
            this._viewManager.registerMediator(mediator);
        }

        /**
         * 判断一个中介对象是否被注册.
         * @param mediatorName 中介对象名称.
         * @return 指定的中介对象被注册返回 (<code>true</code>), 否则返回 (<code>false</code>).
         */
        public hasMediator(mediatorName: string): boolean {
            return this._viewManager.hasMediator(mediatorName);
        }

        /**
         * 获取一个中介对象.
         * @param mediatorName 中介对象名称.
         * @return 指定的中介对象.
         */
        public getMediator(mediatorName: string): IMediator {
            return this._viewManager.getMediator(mediatorName);
        }

        /**
         * 移除一个中介对象.
         * @param mediatorName 中介对象名称.
         * @return 移除的中介对象.
         */
        public removeMediator(mediatorName: string): IMediator {
            return this._viewManager.removeMediator(mediatorName);
        }
    }
}
