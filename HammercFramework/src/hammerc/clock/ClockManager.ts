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
     * IClockManager 接口定义了时钟管理器应有的属性及方法.
     * @author wizardc
     */
    export interface IClockManager {
        /**
         * 设置或获取当前时钟管理器是否暂停.
         */
        paused: boolean;

        /**
         * 设置或获取时钟运行的速率.
         */
        runningRate: number;

        /**
         * 获取当前的时间.
         */
        time: number;

        /**
         * 添加一个时钟对象.
         * @param client 时钟对象.
         */
        addClockClient(client: IClockClient): void;

        /**
         * 判断指定的时钟对象是否存在.
         * @param client 时钟对象.
         * @return 指定的时钟对象是否存在.
         */
        hasClockClient(client: IClockClient): boolean;

        /**
         * 移除一个时钟对象.
         * @param client 时钟对象.
         */
        removeClockClient(client: IClockClient): void;

        /**
         * 移除所有的时钟对象.
         */
        clear(): void;
    }

    /**
     * IClockClient 接口定义了时钟对象应有的属性及方法.
     * @author wizardc
     */
    export interface IClockClient {
        /**
         * 更新方法.
         * @param passedTime 据上次更新经过的时间, 单位豪秒.
         */
        update(passedTime: number): void;
    }

    /**
     * ClockManagerImpl 类实现了一个时钟管理器对象.
     * @author wizardc
     */
    export class ClockManagerImpl implements IClockManager {
        private _initialized: boolean = false;

        private _paused: boolean = false;
        private _runningRate: number = 1;

        private _lastTime: number = 0;

        private _clientList: IClockClient[];

        /**
         * 创建一个 ClockManagerImpl 对象.
         */
        public constructor() {
        }

        /**
         * 设置或获取当前时钟管理器是否暂停.
         */
        public set paused(value: boolean) {
            this._paused = value;
        }
        public get paused(): boolean {
            return this._paused;
        }

        /**
         * 设置或获取时钟运行的速率.
         */
        public set runningRate(value: number) {
            if (value < 0 || isNaN(value)) {
                value = 0;
            }
            this._runningRate = value;
        }
        public get runningRate(): number {
            return this._runningRate;
        }

        /**
         * 获取当前的时间.
         */
        public get time(): number {
            return this._lastTime;
        }

        /**
         * 添加一个时钟对象.
         * @param client 时钟对象.
         */
        public addClockClient(client: IClockClient): void {
            if (!this._initialized) {
                this.initialize();
                this._initialized = true;
            }
            if (client != null && this._clientList.indexOf(client) == -1) {
                this._clientList.push(client);
            }
        }

        /**
         * 初始化方法.
         */
        protected initialize(): void {
            this._lastTime = egret.getTimer();
            this._clientList = [];
            egret.startTick(this.update, this);
        }

        /**
         * 逻辑循环.
         * @param timeStamp 启动 Egret 框架开始经过的时间.
         * @returns 是否立即重绘屏幕.
         */
        protected update(timeStamp: number): boolean {
            if (this._paused) {
                return;
            }
            let passedTime = timeStamp - this._lastTime;
            this._lastTime = timeStamp;
            let length = this._clientList.length;
            if (length == 0) {
                return;
            }
            passedTime *= this._runningRate;
            let currentIndex = 0;
            for (var i = 0; i < length; i++) {
                let client = this._clientList[i];
                if (client != null) {
                    if (currentIndex != i) {
                        this._clientList[currentIndex] = client;
                        this._clientList[i] = null;
                    }
                    client.update(passedTime);
                    currentIndex++;
                }
            }
            if (currentIndex != i) {
                length = this._clientList.length;
                while (i < length) {
                    this._clientList[currentIndex++] = this._clientList[i++];
                }
                this._clientList.length = currentIndex;
            }
            return false;
        }

        /**
         * 判断指定的时钟对象是否存在.
         * @param client 时钟对象.
         * @return 指定的时钟对象是否存在.
         */
        public hasClockClient(client: IClockClient): boolean {
            return this._clientList.indexOf(client) != -1;
        }

        /**
         * 移除一个时钟对象.
         * @param client 时钟对象.
         */
        public removeClockClient(client: IClockClient): void {
            let index = this._clientList.indexOf(client);
            if (index != -1) {
                this._clientList[index] = null;
            }
        }

        /**
         * 移除所有的时钟对象.
         */
        public clear(): void {
            this._clientList.length = 0;
        }
    }
}
