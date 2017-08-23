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
     * Injector 类记录全局注入规则, 在项目中可以通过此类向框架内部注入指定的类, 从而定制或者扩展部分模块的功能.
     * @author wizardc
     */
    export class Injector {
        /**
         * 储存类的映射规则.
         */
        private static _classMap: Object = new Object();

        /**
         * 储存实例的映射规则.
         */
        private static _valueMap: Object = new Object();

        /**
         * 以类定义为值进行映射注入, 只有第一次请求它的单例时才会被实例化.
         * @param whenAskedFor 传递类定义或类完全限定名作为需要映射的键.
         * @param instantiateClass 传递类作为需要映射的值, 它的构造函数必须为空. 若不为空, 请使用 Injector.mapValue() 方法直接注入实例.
         * @param named 可选参数, 在同一个类作为键需要映射多条规则时, 可以传入此参数区分不同的映射. 在调用 getInstance() 方法时要传入同样的参数.
         */
        public static mapClass(whenAskedFor: any, instantiateClass: any, named: string = ""): void {
            var requestName: string = Injector.getKey(whenAskedFor) + "#" + named;
            Injector._classMap[requestName] = instantiateClass;
        }

        /**
         * 获取完全限定类名.
         */
        private static getKey(hostComponentKey: any): string {
            if (typeof hostComponentKey == "string") {
                return hostComponentKey;
            }
            return egret.getQualifiedClassName(hostComponentKey);
        }

        /**
         * 以实例为值进行映射注入, 当请求单例时始终返回注入的这个实例.
         * @param whenAskedFor 传递类定义或类的完全限定名作为需要映射的键.
         * @param useValue 传递对象实例作为需要映射的值.
         * @param named 可选参数, 在同一个类作为键需要映射多条规则时, 可以传入此参数区分不同的映射. 在调用 getInstance() 方法时要传入同样的参数.
         */
        public static mapValue(whenAskedFor: any, useValue: any, named: string = ""): void {
            var requestName: string = Injector.getKey(whenAskedFor) + "#" + named;
            Injector._valueMap[requestName] = useValue;
        }

        /**
         * 检查指定的映射规则是否存在.
         * @param whenAskedFor 传递类定义或类的完全限定名作为需要映射的键.
         * @param named 可选参数, 在同一个类作为键需要映射多条规则时, 可以传入此参数区分不同的映射.
         */
        public static hasMapRule(whenAskedFor: any, named: string = ""): boolean {
            var requestName: string = Injector.getKey(whenAskedFor) + "#" + named;
            if (Injector._valueMap.hasOwnProperty(requestName) || Injector._classMap.hasOwnProperty(requestName)) {
                return true;
            }
            return false;
        }

        /**
         * 获取指定类映射的单例.
         * @param clazz 类定义或类的完全限定名.
         * @param named 可选参数, 若在调用 mapClass() 映射时设置了这个值, 则要传入同样的字符串才能获取对应的单例.
         */
        public static getInstance(clazz: any, named: string = ""): any {
            var requestName: string = Injector.getKey(clazz) + "#" + named;
            if (Injector._valueMap.hasOwnProperty(requestName)) {
                return Injector._valueMap[requestName];
            }
            var returnClass: any = Injector._classMap[requestName];
            if (returnClass != null) {
                var instance: any = new returnClass();
                Injector._valueMap[requestName] = instance;
                delete Injector._classMap[requestName];
                return instance;
            }
            throw new Error("请求的\"" + requestName + "\"规则未注入. 请先在项目初始化里配置指定的注入规则, 再调用对应单例.");
        }
    }
}
