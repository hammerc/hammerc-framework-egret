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
     * 同一通道播放的音效重叠时的处理方式
     */
    export enum SoundOverlapType {
        /**
         * 不打断之前播放的音效, 新的音效不播放
         */
        none,
        /**
         * 之前播放的音效停止, 并播放新的音效
         */
        break
    }

    /**
     * 音乐音效管理类
     * 其中背景音乐同一时间只会播放一个, 音效同一时间可以播放多个
     */
    export class SoundManager {
        private static _instance: SoundManager;

        public static get instance(): SoundManager {
            return SoundManager._instance || (SoundManager._instance = new SoundManager());
        }

        private _loadMgr: SoundLoadMgr;

        private _musicEnabled: boolean = true;
        private _musicVolume: number = 1;

        private _soundEnabled: boolean = true;
        private _soundVolume: number = 1;

        private _musicSoundController: SoundController;
        private _musicUrl: string;

        //通道为 0 时的所有音效对象
        private _soundList: SoundController[];
        //每个通道对应的音效对象表
        private _channelMap: {[k: string]: SoundController};

        private constructor() {
            this._loadMgr = new SoundLoadMgr();
            this._soundList = [];
            this._channelMap = {};
        }

        /**
         * 背景音乐是否开启
         * 注意：背景音乐关闭后再开启可以继续播放, 即使在关闭期间更换了别的背景音乐开启时也应该播放更换后的音乐
         */
        public set musicEnabled(value: boolean) {
            if (this._musicEnabled != value) {
                this._musicEnabled = value;
                if (this._musicEnabled) {
                    this._musicUrl && this.playMusic(this._musicUrl);
                } else {
                    this.stopMusic();
                }
            }
        }
        public get musicEnabled(): boolean {
            return this._musicEnabled;
        }

        /**
         * 背景音乐音量
         */
        public set musicVolume(value: number) {
            if (this._musicVolume != value) {
                this._musicVolume = value;
                if (this._musicSoundController) {
                    this._musicSoundController.$updateVolume();
                }
            }
        }
        public get musicVolume(): number {
            return this._musicVolume;
        }

        /**
         * 音效是否开启
         */
        public set soundEnabled(value: boolean) {
            if (this._soundEnabled != value) {
                this._soundEnabled = value;
                if (!this._soundEnabled) {
                    this.stopAllSounds();
                }
            }
        }
        public get soundEnabled(): boolean {
            return this._soundEnabled;
        }

        /**
         * 音效音量
         */
        public set soundVolume(value: number) {
            if (this._soundVolume != value) {
                this._soundVolume = value;
                this.soundIterator(this.changeSoundVolume, this);
            }
        }
        public get soundVolume(): number {
            return this._soundVolume;
        }

        private changeSoundVolume(controller: SoundController): void {
            controller.$updateVolume();
        }

        /**
         * 存储音乐资源, 为预加载预留的接口
         * @param url 资源地址
         * @param sound 音乐对象
         */
        public storeResource(url: string, sound: egret.Sound): void {
            this._loadMgr.setSound(url, sound);
        }

        /**
         * 播放背景音乐, 如果之前已经有背景音乐在播放中则会停止
         * @param url 背景音乐地址
         */
        public playMusic(url: string): void {
            if (this._musicUrl != url) {
                this.stopMusic();
                this._musicUrl = url;
                if (this._musicEnabled) {
                    this._musicSoundController = new SoundController(true, this._musicUrl, 0, 0, 1);
                    this.setSound(this._musicSoundController, this._musicUrl);
                }
            }
        }

        private setSound(controller: SoundController, url: string): void {
            if (this._loadMgr.isLoaded(url)) {
                controller.$setSound(this._loadMgr.getSound(url));
            } else {
                this._loadMgr.addListener(url, controller);
                if (!this._loadMgr.isLoading(url)) {
                    this._loadMgr.load(url);
                }
            }
        }

        /**
         * 关闭当前播放的背景音乐
         */
        public stopMusic(): void {
            if (this._musicUrl && this._musicSoundController) {
                if (this._loadMgr.isLoading(this._musicUrl)) {
                    this._loadMgr.removeListener(this._musicUrl, this._musicSoundController);
                }
                this._musicUrl = null;
                this._musicSoundController.stop();
                this._musicSoundController = null;
            }
        }

        /**
         * 播放一个音效, 注意当音效关闭或不能覆盖已有音效时会返回空
         * @param url 音效
         * @param channel 通道, 0 表示无覆盖通道, 该通道内的音效可以同时播放多个, 大于 0 的通道则同一时刻只能播放一个音效
         * @param overlap 覆盖方式, 通道大于 0 时有效, none 表示不对已有的音效进行覆盖, break 表示立即停止旧音效播放当前音效
         * @param loop 循环播放的次数, 0 表示无限循环
         * @param volume 当前音效的音量
         * @returns 当前音效的声音控制对象
         */
        public playSound(url: string, channel: number = 0, overlap: SoundOverlapType = SoundOverlapType.none, loop: number = 1, volume: number = 1): SoundController {
            if (!this._soundEnabled) {
                return null;
            }
            let controller: SoundController;
            if (channel <= 0) {
                controller = new SoundController(false, url, channel, loop, volume);
                controller.addEventListener(egret.Event.SOUND_COMPLETE, this.soundCompleteHandler, this);
                this.setSound(controller, url);
                this._soundList.push(controller);
            } else {
                if (this._channelMap.hasOwnProperty(channel.toString())) {
                    let sc = this._channelMap[channel];
                    if (overlap == SoundOverlapType.none) {
                        return null;
                    }
                    sc.stop();
                }
                controller = new SoundController(false, url, channel, loop, volume);
                controller.addEventListener(egret.Event.SOUND_COMPLETE, this.soundCompleteHandler, this);
                this.setSound(controller, url);
                this._channelMap[channel] = controller;
            }
            return controller;
        }

        private soundCompleteHandler(event: egret.Event): void {
            let controller: SoundController = event.target;
            controller.removeEventListener(egret.Event.SOUND_COMPLETE, this.soundCompleteHandler, this);
            if (this._loadMgr.isLoading(controller.url)) {
                this._loadMgr.removeListener(controller.url, controller);
            }
            if (controller.channel == 0) {
                let index = this._soundList.indexOf(controller);
                if (index != -1) {
                    this._soundList.splice(index, 1);
                }
            } else {
                delete this._channelMap[controller.channel];
            }
        }

        private soundIterator(callback: (controller: SoundController) => void, thisObj: any): void {
            for (let i = 0, len = this._soundList.length; i < len; i++) {
                callback.call(thisObj, this._soundList[i]);
            }
            for (let key in this._channelMap) {
                let controller = this._channelMap[key];
                callback.call(thisObj, controller);
            }
        }

        /**
         * 停止指定音效的播放
         * @param controller 声音控制器对象
         * @param destroy 是否销毁声音对象
         */
        public stopSound(controller: SoundController, destroy: boolean = false): void {
            if (controller) {
                controller.stop();
                destroy && this._loadMgr.destroySound(controller.url);
            }
        }

        /**
         * 停止指定通道的音效
         * @param channel 通道
         */
        public stopSoundByChannel(channel: number) : void {
            if (channel == 0) {
                for (let i = 0, len = this._soundList.length; i < len; i++) {
                    let controller = this._soundList[i];
                    controller.removeEventListener(egret.Event.SOUND_COMPLETE, this.soundCompleteHandler, this);
                    controller.stop();
                    if (this._loadMgr.isLoading(controller.url)) {
                        this._loadMgr.removeListener(controller.url, controller);
                    }
                }
                this._soundList.length = 0;
            } else {
                let controller = this._channelMap[channel];
                if (controller) {
                    controller.stop();
                }
            }
        }

        /**
         * 停止所有音效的播放
         */
        public stopAllSounds(): void {
            this.stopSoundByChannel(0);
            for (let key in this._channelMap) {
                this.stopSoundByChannel(+key);
            }
        }

        /**
         * 销毁已经缓存的音乐资源
         * @param url 音乐地址
         */
        public destroyResource(url: string): void {
            this._loadMgr.destroySound(url);
        }
    }

    /**
     * 声音资源管理类, 基于系统 RES 对象管理, 如果要释放对应的资源请通过 RES 对象操作
     */
    class SoundLoadMgr {
        private _loadedMap: {[k: string]: egret.Sound};
        private _loadingMap: {[k: string]: boolean};
        private _listenerMap: {[k: string]: SoundController[]};

        public constructor() {
            this._loadedMap = {};
            this._loadingMap = {};
            this._listenerMap = {};
        }

        /**
         * 设置音乐资源
         */
        public setSound(url: string, sound: egret.Sound): void {
            this._loadedMap[url] = sound;
        }

        /**
         * 指定资源是否已经加载好了
         */
        public isLoaded(url: string): boolean {
            return this._loadedMap.hasOwnProperty(url);
        }

        /**
         * 获取指定音乐对象
         */
        public getSound(url: string): egret.Sound {
            return this._loadedMap[url];
        }

        /**
         * 销毁指定音乐对象
         */
        public destroySound(url): void {
            delete this._loadedMap[url];
        }

        /**
         * 指定资源是否正在加载中
         */
        public isLoading(url: string): boolean {
            return this._loadingMap.hasOwnProperty(url);
        }

        /**
         * 开始加载指定的音乐资源
         */
        public load(url: string): void {
            this._loadingMap[url] = true;
            RES.getResByUrl(url, this.loadCompleteHandler, this, RES.ResourceItem.TYPE_SOUND);
        }

        private loadCompleteHandler(data: any, url: string): void {
            delete this._loadingMap[url];
            if (data && data instanceof egret.Sound) {
                this._loadedMap[url] = data;
                if (this._listenerMap.hasOwnProperty(url)) {
                    let list = this._listenerMap[url];
                    for (let i = 0, len = list.length; i < len; i++) {
                        list[i].$setSound(data);
                    }
                    delete this._listenerMap[url];
                }
            } else {
                Logger.error("Sound load error: " + url);
            }
        }

        /**
         * 添加到等待加载完毕的监听列表中
         */
        public addListener(url: string, controller: SoundController): void {
            if (!this._listenerMap.hasOwnProperty(url)) {
                this._listenerMap[url] = [];
            }
            let list = this._listenerMap[url];
            if (list.indexOf(controller) == -1) {
                list.push(controller);
            }
        }

        /**
         * 从等待加载完毕的监听列表中移除
         */
        public removeListener(url: string, controller: SoundController): void {
            if (this._listenerMap.hasOwnProperty(url)) {
                let list = this._listenerMap[url];
                let index = list.indexOf(controller);
                if (index != -1) {
                    list.splice(index, 1);
                }
                if (list.length == 0) {
                    delete this._listenerMap[url];
                }
            }
        }
    }

    /**
     * 声音控制器
     */
    export class SoundController extends egret.EventDispatcher {
        private _soundChannel: egret.SoundChannel;

        private _lastTime: number;
        private _isMusic: boolean;
        private _url: string;
        private _channel: number;
        private _loop: number;
        private _volume: number;

        public constructor(isMusic: boolean, url: string, channel: number, loop: number, volume: number) {
            super();
            this._lastTime = egret.getTimer();
            this._isMusic = isMusic;
            this._url = url;
            this._channel = channel;
            this._loop = loop;
            this._volume = volume;
        }

        /**
         * 地址
         */
        public get url(): string {
            return this._url;
        }

        /**
         * 通道
         */
        public get channel(): number {
            return this._channel;
        }

        /**
         * 音量
         */
        public set volume(value: number) {
            if (this._volume != value) {
                this._volume = value;
                if (this._soundChannel) {
                    this.updateVolume();
                }
            }
        }
        public get volume(): number {
            return this._volume;
        }

        /**
         * 获取当前播放到的时间, 单位为秒
         */
        public get position(): number {
            if (this._soundChannel) {
                return this._soundChannel.position;
            }
            return 0;
        }

        /**
         * 设定 Sound 对象
         * @param 已经解码完毕的 Sound 声音对象
         */
        public $setSound(sound: egret.Sound): void {
            if (this._soundChannel) {
                throw new Error("SoundChannel has exist!");
            }

            if (this._loop <= 0) {
                this._soundChannel = sound.play(0, this._loop);
                this.updateVolume();
            } else {
                let current = (egret.getTimer() - this._lastTime) * 0.001;
                let total = sound.length * this._loop;
                if (current >= total) {
                    this.stop();
                } else {
                    total -= current;
                    this._soundChannel = sound.play(total % sound.length, Math.ceil(total / sound.length));
                    this._soundChannel.addEventListener(egret.Event.SOUND_COMPLETE, this.soundCompleteHandler, this);
                    this.updateVolume();
                }
            }
        }

        /**
         * 更新音量
         */
        public $updateVolume(): void {
            if (this._soundChannel) {
                this.updateVolume();
            }
        }

        private updateVolume(): void {
            this._soundChannel.volume = (this._isMusic ? SoundManager.instance.musicVolume : SoundManager.instance.soundVolume) * this._volume;
        }

        private soundCompleteHandler(event: egret.Event): void {
            this.stop();
        }

        /**
         * 立即停止当前音效
         */
        public stop(): void {
            if (this._soundChannel) {
                this._soundChannel.removeEventListener(egret.Event.SOUND_COMPLETE, this.soundCompleteHandler, this);
                this._soundChannel.stop();
                this._soundChannel = null;
            }
            this.dispatchEventWith(egret.Event.SOUND_COMPLETE);
        }
    }
}
