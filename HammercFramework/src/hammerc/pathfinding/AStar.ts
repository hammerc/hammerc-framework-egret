// =================================================================================================
//
//	Hammerc Framework
//	Copyright 2016 hammerc.org All Rights Reserved.
//
//	See LICENSE for full license information.
//
// =================================================================================================

module hammerc {
    /**
     * <code>AStar</code> 类提供了基本的 A 星寻路功能.
	 * <p>该类基于《Flash ActionScript 3.0 动画高级教程》一书中寻路章节的脚本改写, 并对寻路效率进行了特别优化.</p>
	 * <p><b>注意: </b>该类得到的最短路径为一个个连续的格子对象, 该路径并非为平滑的最佳最短路径.</p>
	 * @author wizardc
     */
    export class AStar {
		/**
		 * 上下左右的移动成本.
		 */
        public static STRAIGHT_COST: number = 10;
		
		/**
		 * 斜角的移动成本.
		 */
        public static DIAG_COST: number = 14;
		
		/**
		 * 曼哈顿启发函数.
		 * @param node1 第一个节点.
		 * @param node2 第二个节点.
		 * @return 两个节点移动的代价.
		 */
        public static manhattan(node1: AStarNode, node2: AStarNode): number {
            var dx: number = node1.x > node2.x ? node1.x - node2.x : node2.x - node1.x;
            var dy: number = node1.y > node2.y ? node1.y - node2.y : node2.y - node1.y;
            return (dx + dy) * AStar.STRAIGHT_COST;
        }
        
		/**
		 * 欧式启发函数.
		 * @param node1 第一个节点.
		 * @param node2 第二个节点.
		 * @return 两个节点移动的代价.
		 */
        public static euclidian(node1: AStarNode, node2: AStarNode): number {
            var dx: number = node1.x > node2.x ? node1.x - node2.x : node2.x - node1.x;
            var dy: number = node1.y > node2.y ? node1.y - node2.y : node2.y - node1.y;
            return (dx * dx + dy * dy) * AStar.STRAIGHT_COST;
        }
        
		/**
		 * 对角启发函数.
		 * @param node1 第一个节点.
		 * @param node2 第二个节点.
		 * @return 两个节点移动的代价.
		 */
        public static diagonal(node1: AStarNode, node2: AStarNode): number {
            var dx: number = node1.x > node2.x ? node1.x - node2.x : node2.x - node1.x;
            var dy: number = node1.y > node2.y ? node1.y - node2.y : node2.y - node1.y;
            return dx > dy ? AStar.DIAG_COST * dy + AStar.STRAIGHT_COST * (dx - dy) : AStar.DIAG_COST * dx + AStar.STRAIGHT_COST * (dy - dx);
        }

        private _heuristic: (node1: AStarNode, node2: AStarNode) => number;

        protected _grid: AStarGrid;

        private _startNode: AStarNode;
        private _endNode: AStarNode;

        private _nowCheckNum: number = 1;
        private _binaryHeaps: BinaryHeaps<AStarNode>;

        private _path: Array<AStarNode>;
        
		/**
		 * 创建一个 <code>AStar</code> 对象.
		 * @param heuristic 应用的启发函数, 为空则使用曼哈顿启发函数.
		 */
        public constructor(heuristic: (node1: AStarNode, node2: AStarNode) => number = null) {
            this._binaryHeaps = new BinaryHeaps<AStarNode>(this.compare);
            if (heuristic == null) {
                this._heuristic = AStar.manhattan;
            } else {
                this._heuristic = heuristic;
            }
        }

        private compare(a: AStarNode, b: AStarNode): number {
            return b._f - a._f;
        }
        
		/**
		 * 获取最优路径.
		 */
        public get path(): Array<AStarNode> {
            return this._path.concat();
        }
        
		/**
		 * 根据传入的地图获取一个最佳路径.
		 * @param grid 需要寻路的地图对象.
		 * @return 是否可以搜寻到该路径.
		 */
        public findPath(grid: AStarGrid): boolean {
            if (this._grid != null) {
                this.clear();
            }
            this._grid = grid;
            this._startNode = this._grid.startNode;
            this._endNode = this._grid.endNode;
            this._startNode._g = 0;
            this._startNode._h = this._heuristic(this._startNode, this._endNode);
            this._startNode._f = this._startNode._g + this._startNode._h;
            return this.search();
        }
        
		/**
		 * 开始对该地图进行搜索.
		 * @return 是否可以搜寻到该路径.
		 */
        protected search(): boolean {
            var node: AStarNode = this._startNode;
            while (node != this._endNode) {
                var aroundLinks: Array<AStarLink> = node._aroundLinks;
                for (var i: number = 0, len: number = aroundLinks.length; i < len; i++) {
                    var test: AStarNode = aroundLinks[i].node;
                    var cost: number = aroundLinks[i].cost;
                    var g: number = node._g + cost;
                    var h: number = this._heuristic(test, this._endNode);
                    var f: number = g + h;
                    if (test._checkNum == this._nowCheckNum) {
                        if (test._f > f) {
                            test._f = f;
                            test._g = g;
                            test._h = h;
                            test._parent = node;
                            this._binaryHeaps.modify(test, test);
                        }
                    } else {
                        test._f = f;
                        test._g = g;
                        test._h = h;
                        test._parent = node;
                        this._binaryHeaps.enqueue(test);
                        test._checkNum = this._nowCheckNum;
                    }
                }
                node._checkNum = this._nowCheckNum;
                if (this._binaryHeaps.length == 0) {
                    this._nowCheckNum++;
                    return false;
                }
                node = this._binaryHeaps.dequeue();
            }
            this.buildPath();
            this._nowCheckNum++;
            return true;
        }

        private buildPath() {
            this._path = new Array<AStarNode>();
            var node: AStarNode = this._endNode;
            this._path.push(node);
            while (node != this._startNode) {
                node = node._parent;
                this._path.push(node);
            }
            this._path = this._path.reverse();
        }
        
		/**
		 * 清空所有数据.
		 */
        public clear() {
            this._grid = null;
            this._startNode = null;
            this._endNode = null;
            this._binaryHeaps.clear();
            this._path = null;
        }
    }
}
