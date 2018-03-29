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
     * RESP 类定义了带有优先级的资源管理类, 作为 RES 的加载补充.
     * 底层加载仍然是基于 RES 建议所有的基于 URL 的加载都使用该类的方法.
     * @author wizardc
     */
    export namespace RESP {
        /**
         * 设置最大并发加载线程数量, 默认值是 2.
         * @param thread 要设置的并发加载数.
         */
        export function setMaxLoadingThread(thread: number): void {
            instance.setMaxLoadingThread(thread);
        }

        /**
         * 通过完整 URL 方式获取外部资源.
         * @param url 要加载文件的外部路径.
         * @param compFunc 回调函数. 示例: compFunc(data,url):void.
         * @param thisObject 回调函数的 this 引用.
         * @param type 文件类型 (可选). 请使用 ResourceItem 类中定义的静态常量. 若不设置将根据文件扩展名生成.
         * @param priority 加载优先级, 数值越大越优先进行加载.
         */
        export function getResByUrl(url: string, compFunc: Function, thisObject: any, type?: string, priority: number = 0): void {
            instance.getResByUrl(url, compFunc, thisObject, type, priority);
        }

        /**
         * 异步加载资源的 Promise 方式.
         * 注意: 如果当前的加载项的优先级比较低, 会等待到所有优先级高的对象都加载完毕才会继续向下执行, 如果已经加载好了则立即向下执行.
         * @param url 要加载文件的外部路径.
         * @param type 文件类型 (可选). 请使用 ResourceItem 类中定义的静态常量. 若不设置将根据文件扩展名生成.
         * @param priority 加载优先级, 数值越大越优先进行加载.
         * @returns 异步加载的 Promise 对象.
         */
        export function getResByUrlAsync(url: string, type?: string, priority: number = 0): Promise<any> {
            return instance.getResByUrlAsync(url, type, priority);
        }

        interface ResourceItem {
            url: string;
            compFunc: Function;
            thisObject: any;
            type: string;
        }

        class Resource {
            private _maxLoadingThread: number = 2;
            private _nowLoadingThread: number = 0;

            private _priorityList: number[];
            private _priorityMap: {[priority: number]: ResourceItem[]};

            public constructor() {
                this._priorityList = [];
                this._priorityMap = {};
            }

            public setMaxLoadingThread(thread: number): void {
                this._maxLoadingThread = Math.max(thread, 1);
            }

            public getResByUrl(url: string, compFunc: Function, thisObject: any, type?: string, priority: number = 0): void {
                if (!this._priorityMap[priority]) {
                    this._priorityList.push(priority);
                    this._priorityList.sort(this.sortFunc);
                    this._priorityMap[priority] = [];
                }
                let list = this._priorityMap[priority];
                list.push({url, compFunc, thisObject, type});
                this.loadNext();
            }

            private sortFunc(a: number, b: number): number {
                return b - a;
            }

            private loadNext(): void {
                if (this._nowLoadingThread >= this._maxLoadingThread) {
                    return;
                }
                this._nowLoadingThread++;
                let item: ResourceItem;
                for (let priority of this._priorityList) {
                    let list = this._priorityMap[priority];
                    if (list.length > 0) {
                        item = list.shift();
                    }
                }
                if (item) {
                    RES.getResByUrl(item.url, (data: any, url: string) => {
                        this._nowLoadingThread--;
                        if (item.compFunc) {
                            // RES.getResByUrl 中如果发现已经存在数据的话回调已经加过 egret.$callAsync 所以我们这里就不用加了直接回调即可
                            // egret.$callAsync(item.compFunc, item.thisObject, data, url);
                            item.compFunc.call(item.thisObject, data, url);
                        }
                        this.loadNext();
                    }, this, item.type);
                }
            }

            public getResByUrlAsync(url: string, type?: string, priority: number = 0): Promise<any> {
                return new Promise((resolve: (value?: any) => void, reject: (reason?: any) => void) => {
                    RESP.getResByUrl(url, (data, url) => {
                        resolve(data);
                    }, this, type, priority);
                });
            }
        }

        let instance = new Resource();
    }
}
