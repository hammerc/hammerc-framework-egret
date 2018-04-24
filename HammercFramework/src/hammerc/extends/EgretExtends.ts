// =================================================================================================
//
//    Hammerc Framework
//    Copyright 2016 hammerc.org All Rights Reserved.
//
//    See LICENSE for full license information.
//
// =================================================================================================

////////////////////////////////
// ----- 加载扩展 -----
////////////////////////////////
declare module RES {
    /**
     * 异步加载资源的 Promise 方式
     * @param url 资源地址
     * @param type 资源类型
     * @returns 异步加载的 Promise 对象
     */
    function getResByUrlAsync(url: string, type?: string): Promise<any>;
}

RES.getResByUrlAsync = function(url, type) {
    return new Promise((resolve, reject) => {
        RES.getResByUrl(url, (data, url) => {
            resolve(data);
        }, this, type);
    });
};

////////////////////////////////
// ----- 拖拽扩展 -----
////////////////////////////////
declare module egret {
    export interface DisplayObject {
        /**
         * 当前对象是否接受其它对象拖入
         */
        dropEnabled: boolean;
    }
}

const p = egret.DisplayObject.prototype;
Object.defineProperty(p, "dropEnabled", {
    configurable: true,
    enumerable: true,
    set: function (value) {
        this.$dropEnabled = !!value;
        (<any> hammerc.DragManager.instance).dropRegister(this, this.$dropEnabled);
    },
    get: function () {
        return this.$dropEnabled === void 0 ? false : this.$dropEnabled;
    }
});
