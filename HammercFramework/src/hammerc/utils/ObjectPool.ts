// =================================================================================================
//
//	Hammerc Framework
//	Copyright 2016 hammerc.org All Rights Reserved.
//
//	See LICENSE for full license information.
//
// =================================================================================================

module hammerc {
    /**
     * <code>ObjectPool</code> 类定义了对象池对象.
     * @author wizardc
     */
    export class ObjectPool<T extends ICacheable> {
        private _creator: () => T;
        private _list: T[];

        /**
         * 创建一个 <code>ObjectPool</code> 对象.
         * @param creator 当对象池中没有对象时, 会调用该方法创建的对象进行返回.
         */
        public constructor(creator: () => T) {
            this._creator = creator;
            this._list = [];
        }

        /**
         * 获取对象池中的对象数量.
         */
        public get size(): number {
            return this._list.length;
        }

        /**
         * 将一个对象加入到对象池中.
         * @param obj 要加入的特效.
         */
        public join(obj: T): void {
            obj.recycle();
            this._list.push(obj);
        }

        /**
         * 获取对象池中的对象.
         * @returns 空闲的对象.
         */
        public take(): T {
            var obj: T;
            if (this._list.length == 0) {
                obj = this._creator.call(null);
            } else {
                obj = this._list.pop();
                obj.reuse();
            }
            return obj;
        }

        /**
         * 清除对象池中的所有对象.
         */
        public clear(): void {
            this._list.length = 0;
        }
    }

    /**
     * <code>ICacheable</code> 接口定义了可以通过对象池进行缓存的对象类型.
     * @author wizardc
     */
    export interface ICacheable {
        /**
         * 加入对象池时调用.
         */
        recycle(): void;
        
        /**
         * 从对象池中取出时调用.
         */
        reuse(): void;
    }
}
