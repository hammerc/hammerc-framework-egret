////////////////////////////////
// ----- 加载扩展 -----
////////////////////////////////

RES.getResByUrlAsync = function(url, type) {
    return new Promise(function(resolve, reject) {
        RES.getResByUrl(url, function(data, url) {
            resolve(data);
        }, this, type);
    });
};

////////////////////////////////
// ----- 拖拽扩展 -----
////////////////////////////////

const p = egret.DisplayObject.prototype;
Object.defineProperty(p, "dropEnabled", {
    configurable: true,
    enumerable: true,
    set: function (value) {
        this.$dropEnabled = !!value;
        hammerc.DragManager.instance.dropRegister(this, this.$dropEnabled);
    },
    get: function () {
        return this.$dropEnabled === void 0 ? false : this.$dropEnabled;
    }
});
