// =================================================================================================
//
//    Hammerc Framework
//    Copyright 2018 hammerc.org All Rights Reserved.
//
//    See LICENSE for full license information.
//
// =================================================================================================

namespace hammerc {
    /**
     * 定义可回收对象的类型.
     */
    export type Recyclable<T> = T & {recycle(): void};

    /**
     * 获取一个可回收的对象.
     * 任意对象都可以使用该方法变成可回收对象, 会得到一个新的 recycle 方法, 调用该方法会被放置到对象池中.
     * @param creator 可回收的对象类.
     * @returns 可回收的对象.
     */
    export function recyclable<T>(creator: Creator<T> & {__pool?: ObjectPool<T>}): Recyclable<T> {
        let pool: ObjectPool<T> = creator.__pool;
        if (!pool) {
            pool = new ObjectPool(creator);
            let prototype = creator.prototype;
            if (prototype.recycle == undefined) {
                prototype.recycle = function() {
                    pool.join(this);
                };
            }
            creator.__pool = pool;
        }
        return pool.take() as Recyclable<T>;
    }
}
