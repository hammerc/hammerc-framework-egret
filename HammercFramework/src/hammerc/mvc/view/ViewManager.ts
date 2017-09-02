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
     * ViewManager 类管理程序中使用到的所有中介对象.
     * @author wizardc
     */
    export class ViewManager {
        private static _instance: ViewManager;

        /**
         * 获取本类的唯一实例.
         * @return 本类的唯一实例.
         */
        public static get instance(): ViewManager {
            return ViewManager._instance || (ViewManager._instance = new ViewManager());
        }

        private _classMap: { [k: string]: { new (): IMediator } };
        private _viewMap: hammerc.Dictionary<egret.DisplayObject, IMediator>;
        private _contextView: egret.DisplayObjectContainer;

        /**
         * 本类为单例类不能实例化.
         */
        private constructor() {
            this._classMap = {};
            this._viewMap = new hammerc.Dictionary<egret.DisplayObject, IMediator>();
        }

        /**
         * 设置或获取上下文容器.
         * 一旦设置了该容器对象, 所有添加到该容器的视图对象如果存在中介类映射都会自动创建和销毁对应的中介类.
         */
        public set contextView(value: egret.DisplayObjectContainer) {
            if (this._contextView == value) {
                return;
            }
            if (this._contextView != null) {
                this.removeListeners();
            }
            this._contextView = value;
            if (this._contextView != null) {
                this.addListeners();
            }
        }
        public get contextView(): egret.DisplayObjectContainer {
            return this._contextView;
        }

        private addListeners(): void {
            this._contextView.addEventListener(egret.Event.ADDED, this.viewAddedHandler, this, true);
            this._contextView.addEventListener(egret.Event.REMOVED, this.viewRemovedHandler, this, true);
        }

        private removeListeners(): void {
            this._contextView.removeEventListener(egret.Event.ADDED, this.viewAddedHandler, this, true);
            this._contextView.removeEventListener(egret.Event.REMOVED, this.viewRemovedHandler, this, true);
        }

        private viewAddedHandler(event: egret.Event): void {
            let viewObject = event.target;
            let key = egret.getQualifiedClassName(viewObject);
            if (this._classMap.hasOwnProperty(key)) {
                this.createMediator(viewObject);
            }
        }

        private createMediator(viewObject: egret.DisplayObject): void {
            if (viewObject == null) {
                throw new Error("参数不能为空！");
            }
            if (this._viewMap.has(viewObject)) {
                throw new Error("对应的中介类已经创建，不能重复创建！");
            }
            let key = egret.getQualifiedClassName(viewObject);
            if (!this._classMap.hasOwnProperty(key)) {
                throw new Error("没有映射关系！");
            }
            let mediatorClass = this._classMap[key];
            let mediator: hammerc.IMediator = new mediatorClass();
            mediator.viewComponent = viewObject;
            mediator.onRegister();
            this._viewMap.add(viewObject, mediator);
        }

        private viewRemovedHandler(event: egret.Event): void {
            let viewObject = event.target;
            if (this._viewMap.has(viewObject)) {
                this.destroyMediator(viewObject);
            }
        }

        private destroyMediator(viewObject: egret.DisplayObject): void {
            if (viewObject == null) {
                throw new Error("参数不能为空！");
            }
            if (!this._viewMap.has(viewObject)) {
                return;
            }
            let mediator = this._viewMap.get(viewObject);
            mediator.onRemove();
            this._viewMap.remove(viewObject);
        }

        /**
         * 映射视图类和中介类.
         * @param viewClass 视图类.
         * @param mediatorClass 中介类.
         */
        public registerMediator(viewClass: { new (): egret.DisplayObject }, mediatorClass: { new (): IMediator }): void {
            if (viewClass == null || mediatorClass == null) {
                throw new Error("参数不能为空！");
            }
            let key = egret.getQualifiedClassName(viewClass);
            if (this._classMap.hasOwnProperty(key)) {
                throw new Error("映射已经存在，不能重复添加映射关系！");
            }
            this._classMap[key] = mediatorClass;
        }

        /**
         * 获取视图类是否已经存在映射关系.
         * @param viewClass 视图类.
         * @return 是否已经存在映射关系.
         */
        public hasMediator(viewClass: { new (): egret.DisplayObject }): boolean {
            let key = egret.getQualifiedClassName(viewClass);
            return this._classMap.hasOwnProperty(key);
        }

        /**
         * 获取视图对象对应的中介类.
         * @param viewObject 视图对象.
         * @return 视图对象对应的中介类.
         */
        public getMediator(viewObject: egret.DisplayObject): IMediator {
            return this._viewMap.get(viewObject);
        }

        /**
         * 解除视图类和中介类的映射关系.
         * @param viewClass 视图类.
         * @param mediatorClass 中介类.
         */
        public removeMediator(viewClass: { new (): egret.DisplayObject }, mediatorClass: { new (): IMediator }): void {
            if (viewClass == null || mediatorClass == null) {
                throw new Error("参数不能为空！");
            }
            let key = egret.getQualifiedClassName(viewClass);
            delete this._classMap[key];
        }
    }
}
