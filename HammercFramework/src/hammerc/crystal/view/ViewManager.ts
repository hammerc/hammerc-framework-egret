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

        private _mediatorMap: Dictionary<any, IMediator>;

        /**
         * 本类为单例类不能实例化.
         */
        private constructor() {
            this._mediatorMap = new Dictionary<any, IMediator>();
        }

        /**
         * 注册一个中介对象.
         * @param mediator 要被注册的中介对象.
         */
        public registerMediator(mediator: IMediator): void {
            if (this.hasMediator(mediator.viewComponent)) {
                throw new Error("需要注册的中介名称已经存在！");
            }
            var list: string[] = mediator.interestNotificationList();
            if (list != null && list.length != 0) {
                for (var key in list) {
                    var notificationName: string = list[key];
                    Provider.getInstance().registerObserver(notificationName, mediator);
                }
            }
            this._mediatorMap.add(mediator.viewComponent, mediator);
            mediator.onRegister();
        }

        /**
         * 判断一个中介对象是否被创建.
         * @param viewComponent 对应的视图对象.
         * @return 指定的中介对象被创建返回 (<code>true</code>), 否则返回 (<code>false</code>).
         */
        public hasMediator(viewComponent: any): boolean {
            return this._mediatorMap.has(viewComponent);
        }

        /**
         * 获取一个中介对象.
         * @param viewComponent 对应的视图对象.
         * @return 指定的中介对象.
         */
        public getMediator(viewComponent: any): IMediator {
            return this._mediatorMap.get(viewComponent);
        }

        /**
         * 移除一个中介对象.
         * @param viewComponent 对应的视图对象.
         * @return 移除的中介对象.
         */
        public removeMediator(viewComponent: any): IMediator {
            var mediator: IMediator = this.getMediator(viewComponent);
            if (mediator != null) {
                var list: string[] = mediator.interestNotificationList();
                if (list != null && list.length != 0) {
                    for (var key in list) {
                        var notificationName: string = list[key];
                        Provider.getInstance().removeObserver(notificationName, mediator);
                    }
                }
                mediator.onRemove();
                this._mediatorMap.remove(viewComponent);
            }
            return mediator;
        }
    }
}
