// =================================================================================================
//
//    Hammerc Framework
//    Copyright 2016 hammerc.org All Rights Reserved.
//
//    See LICENSE for full license information.
//
// =================================================================================================

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
