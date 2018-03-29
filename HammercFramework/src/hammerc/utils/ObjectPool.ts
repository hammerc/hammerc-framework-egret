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
     * 定义创建对象池中对象的类型.
     */
    export type Creator<T> = {new(): T};

    /**
     * ObjectPool 类定义了对象池对象.
     * @author wizardc
     */
    export class ObjectPool<T> {
        private _creator: Creator<T>;
        private _maxCount: number;
        private _list: T[];

        /**
         * 创建一个 ObjectPool 对象.
         * @param creator 当对象池中没有对象时, 会创建该对象进行返回.
         * @param maxCount 对象池最大可以容纳的对象数量.
         */
        public constructor(creator: Creator<T>, maxCount: number = 100) {
            this._creator = creator;
            this._maxCount = maxCount;
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
            if (typeof (<any> obj).onRecycle === "function") {
                (<any> obj).onRecycle();
            }
            if (this._list.length < this._maxCount) {
                this._list.push(obj);
            }
        }

        /**
         * 获取对象池中的对象.
         * @returns 空闲的对象.
         */
        public take(): T {
            let obj: T;
            if (this._list.length == 0) {
                obj = new (<any> this._creator)();
            } else {
                obj = this._list.pop();
                if (typeof (<any> obj).onReuse === "function") {
                    (<any> obj).onReuse();
                }
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
     * ICacheable 接口定义了可以通过对象池进行缓存的对象类型.
     * @author wizardc
     */
    export interface ICacheable {
        /**
         * 加入对象池时调用.
         */
        onRecycle(): void;

        /**
         * 从对象池中取出时调用.
         */
        onReuse(): void;
    }
}
