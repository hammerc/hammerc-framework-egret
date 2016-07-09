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
     * <code>BinaryHeaps</code> 类实现了二叉堆.
     * @author wizardc
     */
    export class BinaryHeaps<T> {
        private _data: T[];
        private _compare: (a: T, b: T) => number;

        /**
         * 创建一个 <code>BinaryHeaps</code> 对象.
         * @param compare 指定比较方法, 用来确定获取的对象值是堆中最大还是最小的值.
         * <p>使用 a 的数据减去 b 的数据, 取出的数据为堆中的最大值.</p>
         * <p>使用 b 的数据减去 a 的数据, 取出的数据为堆中的最小值.</p>
         */
        public constructor(compare: (a: T, b: T) => number) {
            this._data = [];
            this._compare = compare;
        }

        /**
         * 获取数据长度.
         */
        public get length(): number {
            return this._data.length;
        }

        /**
         * 获取数据数组.
         */
        public get data(): T[] {
            return this._data;
        }

        /**
         * 加入一个对象.
         * @param obj 要加入的对象.
         */
        public enqueue(obj: T): void {
            this._data.push(obj);
            var parentIndex: number = (this._data.length - 2) >> 1;
            var objIndex: number = this._data.length - 1;
            var temp: T = this._data[objIndex];
            while (objIndex > 0) {
                if (this._compare(temp, this._data[parentIndex]) > 0) {
                    this._data[objIndex] = this._data[parentIndex];
                    objIndex = parentIndex;
                    parentIndex = (parentIndex - 1) >> 1;
                } else {
                    break;
                }
            }
            this._data[objIndex] = temp;
        }

        /**
         * 修改一个对象.
         * @param oldObj 已经添加到堆中的对象.
         * @param newObj 要替换的新对象.
         * @return 修改是否成功.
         */
        public modify(oldObj: T, newObj: T): boolean {
            var objIndex: number = this._data.indexOf(oldObj);
            if (objIndex == -1) {
                return false;
            }
            this._data[objIndex] = newObj;
            var parentIndex: number = (objIndex - 1) >> 1;
            var temp: T = this._data[objIndex];
            while (objIndex > 0) {
                if (this._compare(temp, this._data[parentIndex]) > 0) {
                    this._data[objIndex] = this._data[parentIndex];
                    objIndex = parentIndex;
                    parentIndex = (parentIndex - 1) >> 1;
                } else {
                    break;
                }
            }
            this._data[objIndex] = temp;
            return true;
        }

        /**
         * 取出数据最大或最小的对象, 具体规则由 <code>compare</code> 方法指定.
         * @return 数据最大或最小的对象.
         */
        public dequeue(): T {
            if (this._data.length < 2) {
                return this._data.pop();
            }
            var result: T = this._data[0];
            this._data[0] = this._data.pop();
            var parentIndex: number = 0;
            var childIndex: number = 1;
            var temp: T = this._data[parentIndex];
            while (childIndex <= this._data.length - 1) {
                if (this._data[childIndex + 1] != null && this._compare(this._data[childIndex], this._data[childIndex + 1]) < 0) {
                    childIndex++;
                }
                if (this._compare(temp, this._data[childIndex]) < 0) {
                    this._data[parentIndex] = this._data[childIndex];
                    parentIndex = childIndex;
                    childIndex = (childIndex << 1) + 1;
                } else {
                    break;
                }
            }
            this._data[parentIndex] = temp;
            return result;
        }

        /**
         * 清空数据.
         */
        public clear(): void {
            this._data = [];
        }

        /**
         * 获取本对象的字符串描述.
         * @return 本对象的字符串描述.
         */
        public toString(): string {
            return this._data.toString();
        }
    }
}
