
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/res/res.js",
	"bin-debug/hammerc/pathfinding/AStar.js",
	"bin-debug/mvc/control/Notifier.js",
	"bin-debug/hammerc/clock/ClockManager.js",
	"bin-debug/hammerc/pathfinding/KeyPointAstar.js",
	"bin-debug/mvc/control/observer/Observer.js",
	"bin-debug/hammerc/utils/Int64.js",
	"bin-debug/hammerc/managers/DragEvent.js",
	"bin-debug/hammerc/managers/DragManager.js",
	"bin-debug/hammerc/managers/LanguageManager.js",
	"bin-debug/hammerc/notification/NotificationCenter.js",
	"bin-debug/example/NotificationTest.js",
	"bin-debug/hammerc/pathfinding/AStarGrid.js",
	"bin-debug/example/DictionaryTest.js",
	"bin-debug/hammerc/pathfinding/SmoothAStar.js",
	"bin-debug/hammerc/sound/SoundManager.js",
	"bin-debug/hammerc/struct/BytesReader.js",
	"bin-debug/hammerc/struct/BytesWriter.js",
	"bin-debug/hammerc/struct/Struct.js",
	"bin-debug/hammerc/utils/BitUtil.js",
	"bin-debug/hammerc/utils/DateUtil.js",
	"bin-debug/hammerc/utils/Dictionary.js",
	"bin-debug/example/DragTest.js",
	"bin-debug/hammerc/utils/Logger.js",
	"bin-debug/hammerc/utils/MathUtil.js",
	"bin-debug/hammerc/utils/ObjectPool.js",
	"bin-debug/hammerc/utils/StringUtil.js",
	"bin-debug/hammerc/utils/UInt64.js",
	"bin-debug/Main.js",
	"bin-debug/mvc/control/command/Command.js",
	"bin-debug/mvc/control/command/CommandQueue.js",
	"bin-debug/mvc/control/Controller.js",
	"bin-debug/mvc/control/inject/MVCDecorator.js",
	"bin-debug/mvc/control/Notification.js",
	"bin-debug/hammerc/core/Injector.js",
	"bin-debug/hammerc/ds/BinaryHeaps.js",
	"bin-debug/mvc/control/observer/Provider.js",
	"bin-debug/mvc/facade/Facade.js",
	"bin-debug/mvc/interfaces/Interfaces.js",
	"bin-debug/mvc/model/AbstractProxy.js",
	"bin-debug/mvc/model/ModelManager.js",
	"bin-debug/mvc/view/AbstractMediator.js",
	"bin-debug/mvc/view/ViewManager.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    egret_native.requireFiles();
    egret.TextField.default_fontFamily = "/system/fonts/DroidSansFallback.ttf";
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 30,
		scaleMode: "showAll",
		contentWidth: 640,
		contentHeight: 1136,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:30,textColor:0x00c200,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel(egret.TextField.default_fontFamily, 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};