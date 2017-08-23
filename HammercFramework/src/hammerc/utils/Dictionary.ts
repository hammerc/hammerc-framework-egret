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
     * Dictionary 类提供泛型哈希表的支持.
     * <p>如果 key 使用继承 egret.HashObject 的对象, 则使用 hashCode 作为其键值, 否则使用 toString() 的返回作为键值.</p>
     * @author wizardc
     */
    export class Dictionary<TKey, TValue> {
        private _map: Object;
        private _keyMap: Object;
        private _size: number;

        /**
         * 创建一个 Dictionary 对象.
         * @param map 初始化时的键值对对象.
         */
        public constructor(map?: Object) {
            this._map = map || {};
            this._keyMap = {};
            this._size = 0;
        }

        /**
         * 获取当前保存的键值对数量.
         */
        public get size(): number {
            return this._size;
        }

        private getKey(key: TKey): string {
            if ((<any>(key)) instanceof egret.HashObject) {
                return (<egret.HashObject>(<any>(key))).hashCode.toString();
            }
            return key.toString();
        }

        /**
         * 添加数据.
         * @param key 键.
         * @param value 值.
         */
        public add(key: TKey, value: TValue): void {
            var k: string = this.getKey(key);
            if (!this._map.hasOwnProperty(k)) {
                ++this._size;
            }
            this._map[k] = value;
            this._keyMap[k] = key;
        }

        /**
         * 判断是否存在数据.
         * @param key 键.
         * @returns 是否存在.
         */
        public has(key: TKey): boolean {
            var k: string = this.getKey(key);
            return this._map.hasOwnProperty(k);
        }

        /**
         * 获取数据.
         * @param key 键.
         * @returns 值.
         */
        public get(key: TKey): TValue {
            var k: string = this.getKey(key);
            return this._map[k];
        }

        /**
         * 遍历当前哈希表
         * @param callbackfn 每项的回调.
         * @param thisArg 回调指向的 this 对象.
         */
        public forEach(callbackfn: (item: TValue, key: TKey, dictionary: Dictionary<TKey, TValue>) => void, thisArg?: any): void {
            for (var key in this._map) {
                if (this._map.hasOwnProperty(key)) {
                    callbackfn.call(thisArg, this._map[key], this._keyMap[key], this);
                }
            }
        }

        /**
         * 移除数据.
         * @param key 键.
         * @returns 如果存在移除的数据返回 true, 否则返回 false.
         */
        public remove(key: TKey): boolean {
            var k: string = this.getKey(key);
            if (!this._map.hasOwnProperty(k)) {
                return false;
            }
            delete this._map[k];
            delete this._keyMap[k];
            --this._size;
            return true;
        }

        /**
         * 清除哈希表.
         */
        public clear(): void {
            this._map = {};
            this._keyMap = {};
            this._size = 0;
        }

        /**
         * 获取本对象的字符串表示形式.
         * @returns 本对象的字符串表示形式.
         */
        public toString(): string {
            var result: string[] = [];
            for (var key in this._map) {
                if (this._map.hasOwnProperty(key)) {
                    result.push(`{key:${this._keyMap[key]}, value:${this._map[key]}}`);
                }
            }
            return "{" + result.join(", ") + "}";
        }

        /**
         * 获取实际进行哈希存储的对象.
         * @returns 实际进行哈希存储的对象.
         */
        public valueOf(): Object {
            return this._map;
        }
    }
}
