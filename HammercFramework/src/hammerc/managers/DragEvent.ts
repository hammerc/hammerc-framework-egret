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
     * DragEvent 是拖拽事件类.
     */
    export class DragEvent extends egret.Event {
        /**
         * 拖拽对象进入接受安放的拖拽区域时, 由接受对象播放.
         */
        public static DRAG_ENTER:string = "dragEnter";

        /**
         * 拖拽对象在接受安放的拖拽区域中移动时, 由接受对象播放.
         */
        public static DRAG_MOVE:string = "dragMove";

        /**
         * 拖拽对象在离开接受安放的拖拽区域时, 由接受对象播放.
         */
        public static DRAG_EXIT:string = "dragExit";

        /**
         * 拖拽对象在接受安放的拖拽区域放下时, 由接受对象播放.
         */
        public static DRAG_DROP:string = "dragDrop";

        /**
         * 拖拽对象开始拖拽时, 由拖拽对象播放.
         */
        public static DRAG_START:string = "dragStart";

        /**
         * 拖拽对象在无效的区域放下时, 由拖拽对象播放.
         */
        public static DRAG_OVER:string = "dragOver";

        /**
         * 派发拖拽事件.
         * @param target 抛出事件的对象.
         * @param eventType 事件类型.
         * @param dragData 拖拽数据.
         * @returns 如果成功调度了事件, 则值为 true. 值 false 表示失败或对事件调用了 preventDefault().
         */
        public static dispatchDragEvent(target: egret.IEventDispatcher, eventType: string, dragData?: any): boolean {
            if (!target.hasEventListener(eventType)) {
                return true;
            }
            let event = egret.Event.create(DragEvent, eventType);
            event._dragData = dragData;
            let result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        }

        private _dragData: any;

        /**
         * 创建一个 DragEvent 对象.
         * @param type 类型.
         * @param dragData 拖拽数据.
         */
        public constructor(type: string, dragData?: any) {
            super(type);
            this._dragData = dragData;
        }

        /**
         * 获取拖拽数据.
         */
        get dragData(): any {
            return this._dragData;
        }
    }
}
