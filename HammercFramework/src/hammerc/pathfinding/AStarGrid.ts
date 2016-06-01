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
     * <code>AStarGrid</code> 类记录并描述一个需要被寻路的由多个格子组成的地图.
	 * @author wizardc
     */
    export class AStarGrid {
		/**
		 * 记录所有格子的列表对象.
		 */
        protected _grid: AStarNode[][];

		/**
		 * 记录地图的列数.
		 */
        protected _cols: number = 0;
		
		/**
		 * 记录地图的行数.
		 */
        protected _rows: number = 0;
		
		/**
		 * 记录开始格子.
		 */
        protected _startNode: AStarNode;
		
		/**
		 * 记录终点格子.
		 */
        protected _endNode: AStarNode;
        
		/**
		 * 创建一个 <code>AStarGrid</code> 对象.
		 * @param cols 设置地图的列数.
		 * @param rows 设置地图的行数.
		 */
        public constructor(cols: number, rows: number) {
            this._cols = cols;
            this._rows = rows;
            this._grid = [];
            for (var i: number = 0; i < this._cols; i++) {
                this._grid[i] = [];
                for (var j: number = 0; j < this._rows; j++) {
                    this._grid[i][j] = this.createNode(i, j);
                }
            }
        }
        
		/**
		 * 创建需要记录数据的格子对象.
		 * @param x 该格子在地图上的第几列.
		 * @param y 该格子在地图上的第几行.
		 * @return 需要记录数据的格子对象.
		 */
        protected createNode(x: number, y: number): AStarNode {
            return new AStarNode(x, y);
        }
        
		/**
		 * 获取地图的列数.
		 */
        public get cols(): number {
            return this._cols;
        }
        
		/**
		 * 获取地图的行数.
		 */
        public get rows(): number {
            return this._rows;
        }
        
		/**
		 * 设置或获取寻路的起点格子.
		 */
        public set startNode(value: AStarNode) {
            this._startNode = value;
        }
        public get startNode(): AStarNode {
            return this._startNode;
        }
        
		/**
		 * 设置或获取寻路的终点格子.
		 */
        public set endNode(value: AStarNode) {
            this._endNode = value;
        }
        public get endNode(): AStarNode {
            return this._endNode;
        }
        
		/**
		 * 预处理每个格子四周可移动的格子数据.
		 * <p>注意: 在设置好地图数据后调用一次即可.</p>
		 */
        public cacheAroundLinks() {
            for (var i: number = 0; i < this._cols; i++) {
                for (var j: number = 0; j < this._rows; j++) {
                    var node: AStarNode = this._grid[i][j];
                    node._aroundLinks = new Array<AStarLink>();
                    var startX: number = Math.max(0, node.x - 1);
                    var endX: number = Math.min(this._cols - 1, node.x + 1);
                    var startY: number = Math.max(0, node.y - 1);
                    var endY: number = Math.min(this._rows - 1, node.y + 1);
                    for (var m: number = startX; m <= endX; m++) {
                        for (var n: number = startY; n <= endY; n++) {
                            var test: AStarNode = this._grid[m][n];
                            if (test == node || !test.walkable || !this._grid[node.x][test.y].walkable || !this._grid[test.x][node.y].walkable) {
                                continue;
                            }
                            var cost: number = AStar.STRAIGHT_COST;
                            if (!((node.x == test.x) || (node.y == test.y))) {
                                cost = AStar.DIAG_COST;
                            }
                            node._aroundLinks.push(new AStarLink(test, cost));
                        }
                    }
                }
            }
        }
        
		/**
		 * 获取地图中的一个指定的格子对象.
		 * @param x 指定要获取的格子在地图上的第几列.
		 * @param y 指定要获取的格子在地图上的第几行.
		 * @return 返回指定的格子.
		 */
        public getNode(x: number, y: number): AStarNode {
            return this._grid[x][y];
        }
        
		/**
		 * 设置地图中的一个指定格子的地形代价.
		 * @param x 指定要设定的格子在地图上的第几列.
		 * @param y 指定要设定的格子在地图上的第几行.
		 * @param value 指定该格子的地形代价.
		 */
        public setCostMultiplier(x: number, y: number, value: number) {
            this._grid[x][y].costMultiplier = value;
        }
        
		/**
		 * 设置地图中的一个指定的格子是否可以通行.
		 * @param x 指定要设定的格子在地图上的第几列.
		 * @param y 指定要设定的格子在地图上的第几行.
		 * @param value 指定该格子是否可以通行.
		 */
        public setWalkable(x: number, y: number, value: boolean) {
            this._grid[x][y].walkable = value;
        }
        
		/**
		 * 设置寻路起点.
		 * @param x 设置起点格子在地图上的第几列.
		 * @param y 设置起点格子在地图上的第几行.
		 */
        public setStartNode(x: number, y: number) {
            this._startNode = this._grid[x][y];
        }
        
		/**
		 * 设置寻路终点.
		 * @param x 设置终点格子在地图上的第几列.
		 * @param y 设置终点格子在地图上的第几行.
		 */
        public setEndNode(x: number, y: number) {
            this._endNode = this._grid[x][y];
        }
    }

	/**
	 * <code>AStarNode</code> 类定义了寻路地图的每一个格子的属性.
	 * @author wizardc
	 */
    export class AStarNode {
		/**
		 * 该格子的 x 轴坐标.
		 */
        public x: number = 0;
		
		/**
		 * 该格子的 y 轴坐标.
		 */
        public y: number = 0;
		
		/**
		 * 该格子是否可以通过.
		 */
        public walkable: boolean = false;
		
		/**
		 * 该格子的地形代价.
		 */
        public costMultiplier: number = 0;
		
		/**
		 * 记录该格子的总代价.
		 */
        public _f: number = 0;

		/**
		 * 记录该格子到相邻格子的代价.
		 */
        public _g: number = 0;

		/**
		 * 记录该格子到目标格子的代价.
		 */
        public _h: number = 0;

		/**
		 * 记录该格子的上一层格子.
		 */
        public _parent: AStarNode;

		/**
		 * 记录该格子是否已经被检查过.
		 */
        public _checkNum: number = 0;

		/**
		 * 记录该格子周围的格子及移动的代价.
		 */
        public _aroundLinks: Array<AStarLink>;
        
		/**
		 * 创建一个 <code>AStarNode</code> 对象.
		 * @param x 格子的 x 轴坐标.
		 * @param y 格子的 y 轴坐标.
		 * @param walkable 格子是否可以通过.
		 * @param costMultiplier 格子的地形代价.
		 */
        public constructor(x: number, y: number, walkable: boolean = true, costMultiplier: number = 1) {
            this.x = x;
            this.y = y;
            this.walkable = walkable;
            this.costMultiplier = costMultiplier;
        }
    }

    /**
     * <code>AStarLink</code> 类定义了一个格子可移动到的格子的关系.
	 * @author wizardc
     */
    export class AStarLink {
        /**
		 * 格子对象.
		 */
        public node: AStarNode;
		
		/**
		 * 移动的代价.
		 */
        public cost: number = 0;
        
		/**
		 * 创建一个 <code>AStarLink</code> 对象.
		 * @param node 格子对象.
		 * @param cost 移动的代价.
		 */
        public constructor(node: AStarNode, cost: number) {
            this.node = node;
            this.cost = cost;
        }
    }
}
