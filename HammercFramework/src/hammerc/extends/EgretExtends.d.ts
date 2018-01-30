// =================================================================================================
//
//    Hammerc Framework
//    Copyright 2016 hammerc.org All Rights Reserved.
//
//    See LICENSE for full license information.
//
// =================================================================================================

declare module RES {
    ////////////////////////////////
    // ----- 加载扩展 -----
    ////////////////////////////////
    /**
     * 异步加载资源的 Promise 方式
     * @param url 资源地址
     * @param type 资源类型
     * @returns 异步加载的 Promise 对象
     */
    function getResByUrlAsync(url: string, type?: string): Promise<any>;
}

declare module egret {
    ////////////////////////////////
    // ----- 拖拽扩展 -----
    ////////////////////////////////
    export interface DisplayObject {
        /**
         * 当前对象是否接受其它对象拖入
         */
        dropEnabled: boolean;
    }
}
