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
     * DargManager 是拖拽管理器类.
     */
    export class DragManager {
        private static _instance: DragManager;

        public static get instance(): DragManager {
            return DragManager._instance || (DragManager._instance = new DragManager());
        }

        private _dragging: boolean = false;

        //当前的接受拖拽放下的显示对象
        private _dropTarget: egret.DisplayObject;
        //拖拽时的显示对象
        private _dragTarget: egret.DisplayObject;
        //拖拽的源对象
        private _originDrag: egret.DisplayObject;

        private _dragData: any;

        private _offsetX: number;
        private _offsetY: number;

        /**
         * 本类为单例类不能实例化.
         */
        private constructor() {
            egret.sys.$TempStage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.stageMoveHandler, this);
        }

        /**
         * 是否正在拖拽中.
         */
        public get dragging(): boolean {
            return this._dragging;
        }

        /**
         * 拖拽的源对象.
         */
        public get originDrag(): egret.DisplayObject {
            return this._originDrag;
        }

        private dropRegister(target: egret.DisplayObject, canDrop: boolean): void {
            if (canDrop) {
                target.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMove, this);
                target.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
                target.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
            } else {
                target.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMove, this);
                target.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
                target.removeEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
            }
        }

        private stageMoveHandler(event: egret.TouchEvent): void {
            if (this._dragging && this._dropTarget) {
                let end = false;
                if (this._dropTarget instanceof egret.DisplayObjectContainer) {
                    end = !(<egret.DisplayObjectContainer> this._dropTarget).contains(event.target);
                } else {
                    end = this._dropTarget !== event.target;
                }
                if (end) {
                    DragEvent.dispatchDragEvent(this._dropTarget, DragEvent.DRAG_EXIT, this._dragData);
                    this._dropTarget = null;
                }
            }
        }

        private onMove(event: egret.TouchEvent): void {
            if (this._dragging) {
                if (!this._dropTarget) {
                    this._dropTarget = event.currentTarget;
                    DragEvent.dispatchDragEvent(this._dropTarget, DragEvent.DRAG_ENTER, this._dragData);
                } else {
                    DragEvent.dispatchDragEvent(this._dropTarget, DragEvent.DRAG_MOVE, this._dragData);
                }
            }
        }

        private onEnd(event: egret.TouchEvent): void {
            if (this._dragging && this._dropTarget) {
                DragEvent.dispatchDragEvent(this._dropTarget, DragEvent.DRAG_DROP, this._dragData);
                this._dragging = false;
                this._dropTarget = null;
                this._dragData = null;
                this.endDrag();
            }
        }

        /**
         * 开始拖拽.
         * @param dragTarget 要拖拽的对象.
         * @param touchEvent 拖拽开始时对应的触摸事件.
         * @param dragData 附带的拖拽数据.
         * @param dragImage 拖拽时显示的图片, 为空则使用拖拽对象的快照.
         * @param xOffset 拖拽点偏移值 x.
         * @param yOffset 拖拽点偏移值 y.
         * @param imageAlpha 拖拽的图片透明度.
         */
        public doDrag(dragTarget: egret.DisplayObject, touchEvent: egret.TouchEvent, dragData?: any, dragImage?: egret.DisplayObject, xOffset?: number, yOffset?: number, imageAlpha: number = 1): void {
            this._dragging = true;
            this._originDrag = dragTarget;
            if (dragImage) {
                this._dragTarget = dragImage;
            } else {
                let rt = new egret.RenderTexture();
                rt.drawToTexture(dragTarget);
                this._dragTarget = new egret.Bitmap(rt);
            }
            this._dragData = dragData;
            this._dragTarget.touchEnabled = false;
            if (this._dragTarget instanceof egret.DisplayObjectContainer) {
                (<egret.DisplayObjectContainer> this._dragTarget).touchChildren = false;
            }
            this._dragTarget.alpha = imageAlpha;
            egret.sys.$TempStage.addChild(this._dragTarget);
            this._offsetX = xOffset;
            this._offsetY = yOffset;
            egret.sys.$TempStage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onStageMove, this);
            egret.sys.$TempStage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageEnd, this);
            this.onStageMove(touchEvent);
            DragEvent.dispatchDragEvent(this._originDrag, DragEvent.DRAG_START, this._dragData);
        }

        private onStageMove(event: egret.TouchEvent): void {
            this._dragTarget.x = event.stageX + this._offsetX;
            this._dragTarget.y = event.stageY + this._offsetY;
        }

        private onStageEnd(event: egret.TouchEvent): void {
            if (this._dragging) {
                DragEvent.dispatchDragEvent(this._originDrag, DragEvent.DRAG_OVER, this._dragData);
                this._dragging = false;
                this._dropTarget = null;
                this._dragData = null;
                this.endDrag();
            }
        }

        private endDrag(): void {
            egret.sys.$TempStage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onStageMove, this);
            egret.sys.$TempStage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageEnd, this);
            egret.sys.$TempStage.removeChild(this._dragTarget);
            this._dragTarget = null;
            this._originDrag = null;
        }
    }
}
