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
     * ModelManager 类管理程序中使用到的所有代理对象.
     * @author wizardc
     */
    export class ModelManager {
        private static _instance: ModelManager;

        /**
         * 获取本类的唯一实例.
         * @return 本类的唯一实例.
         */
        public static get instance(): ModelManager {
            return ModelManager._instance || (ModelManager._instance = new ModelManager());
        }

        private _proxyMap: { [k: string]: IProxy };

        /**
         * 本类为单例类不能实例化.
         */
        private constructor() {
            this._proxyMap = {};
        }

        /**
         * 注册一个代理对象.
         * @param proxy 要被注册的代理对象.
         */
        public registerProxy(proxy: IProxy): void {
            if (this.hasProxy(proxy.name)) {
                throw new Error("需要注册的代理名称已经存在！");
            }
            this._proxyMap[proxy.name] = proxy;
            proxy.onRegister();
        }

        /**
         * 判断一个代理对象是否被注册.
         * @param proxyName 代理对象名称.
         * @return 指定的代理对象被注册返回 (true), 否则返回 (false).
         */
        public hasProxy(proxyName: string): boolean {
            return this._proxyMap.hasOwnProperty(proxyName);
        }

        /**
         * 获取一个代理对象.
         * @param proxyName 代理对象名称.
         * @return 指定的代理对象.
         */
        public getProxy(proxyName: string): IProxy {
            return this._proxyMap[proxyName];
        }

        /**
         * 移除一个代理对象.
         * @param proxyName 代理对象名称.
         * @return 移除的代理对象.
         */
        public removeProxy(proxyName: string): IProxy {
            let proxy = this.getProxy(proxyName);
            if (proxy != null) {
                proxy.onRemove();
                delete this._proxyMap[proxyName];
            }
            return proxy;
        }
    }
}
