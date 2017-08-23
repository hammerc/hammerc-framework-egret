module example {
    export class DragTest extends egret.Sprite {
        public constructor() {
            super();

            egret.sys.$TempStage.addChild(this);

            let dragObj = new egret.Shape();
            dragObj.x = 100;
            dragObj.y = 100;
            dragObj.graphics.beginFill(0xff0000);
            dragObj.graphics.drawRect(0, 0, 100, 100);
            dragObj.graphics.endFill();
            this.addChild(dragObj);

            let dropObj = new egret.Shape();
            dropObj.x = 300;
            dropObj.y = 300;
            dropObj.graphics.beginFill(0xffff00);
            dropObj.graphics.drawRect(0, 0, 100, 100);
            dropObj.graphics.endFill();
            this.addChild(dropObj);

            dropObj.dropEnabled = true;
            dropObj.addEventListener(hammerc.DragEvent.DRAG_ENTER, (e: hammerc.DragEvent) => {
                console.log("DRAG_ENTER: " + e.dragData.name);
            }, this);
            dropObj.addEventListener(hammerc.DragEvent.DRAG_MOVE, (e: hammerc.DragEvent) => {
                console.log("DRAG_MOVE: " + e.dragData.name);
            }, this);
            dropObj.addEventListener(hammerc.DragEvent.DRAG_EXIT, (e: hammerc.DragEvent) => {
                console.log("DRAG_EXIT: " + e.dragData.name);
            }, this);
            dropObj.addEventListener(hammerc.DragEvent.DRAG_DROP, (e: hammerc.DragEvent) => {
                console.log("DRAG_DROP: " + e.dragData.name);
            }, this);

            dragObj.addEventListener(hammerc.DragEvent.DRAG_START, (e: hammerc.DragEvent) => {
                console.log("DRAG_START: " + e.dragData.name);
            }, this);
            dragObj.addEventListener(hammerc.DragEvent.DRAG_OVER, (e: hammerc.DragEvent) => {
                console.log("DRAG_OVER: " + e.dragData.name);
            }, this);

            dropObj.touchEnabled = true;
            dragObj.touchEnabled = true;
            
            dragObj.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e) => {
                let p = dragObj.globalToLocal(e.stageX, e.stageY);
                hammerc.DragManager.instance.doDrag(dragObj, e, {name: "Li Lei"}, null, -p.x, -p.y);
            }, this);

            
        }
    }
}