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
     * <code>ViewManager</code> 类管理程序中使用到的所有中介对象.
     * @author wizardc
     */
    export class ViewManager {
        private static _instance: ViewManager;

        /**
         * 获取本类的唯一实例.
         * @return 本类的唯一实例.
         */
        public static getInstance(): ViewManager {
            if (ViewManager._instance == null) {
                ViewManager._instance = new ViewManager();
            }
            return ViewManager._instance;
        }

        private _mediatorMap: Object;

        /**
         * 本类为单例类不能实例化.
         */
        public constructor() {
            if (ViewManager._instance != null) {
                throw new Error("单例类不能进行实例化！");
            }
            this._mediatorMap = new Object();
        }

        /**
         * 注册一个中介对象.
         * @param mediator 要被注册的中介对象.
         */
        public registerMediator(mediator: IMediator): void {
            if (this.hasMediator(mediator.name)) {
                throw new Error("需要注册的中介名称已经存在！");
            }
            var list: string[] = mediator.interestNotificationList();
            if (list != null && list.length != 0) {
                for (var key in list) {
                    var notificationName: string = list[key];
                    Provider.getInstance().registerObserver(notificationName, mediator);
                }
            }
            this._mediatorMap[mediator.name] = mediator;
            mediator.onRegister();
        }

        /**
         * 判断一个中介对象是否被注册.
         * @param mediatorName 中介对象名称.
         * @return 指定的中介对象被注册返回 (<code>true</code>), 否则返回 (<code>false</code>).
         */
        public hasMediator(mediatorName: string): boolean {
            return this._mediatorMap.hasOwnProperty(mediatorName);
        }

        /**
         * 获取一个中介对象.
         * @param mediatorName 中介对象名称.
         * @return 指定的中介对象.
         */
        public getMediator(mediatorName: string): IMediator {
            return this._mediatorMap[mediatorName];
        }

        /**
         * 移除一个中介对象.
         * @param mediatorName 中介对象名称.
         * @return 移除的中介对象.
         */
        public removeMediator(mediatorName: string): IMediator {
            var mediator: IMediator = this.getMediator(mediatorName);
            if (mediator != null) {
                var list: string[] = mediator.interestNotificationList();
                if (list != null && list.length != 0) {
                    for (var key in list) {
                        var notificationName: string = list[key];
                        Provider.getInstance().removeObserver(notificationName, mediator);
                    }
                }
                mediator.onRemove();
                delete this._mediatorMap[mediatorName];
            }
            return mediator;
        }
    }
}
