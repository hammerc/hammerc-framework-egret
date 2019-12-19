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
     * DijkstraGrid 类记录并描述一个需要被寻路的由多个节点组成的图.
     * @author wizardc
     */
    export class DijkstraGrid {
        /**
         * 记录所有节点的哈希表对象.
         */
        protected _grid: { [name: string]: DijkstraNode };

        /**
         * 节点数量.
         */
        protected _size: number = 0;

        /**
         * 记录开始格子.
         */
        protected _startNode: DijkstraNode;

        /**
         * 记录终点格子.
         */
        protected _endNode: DijkstraNode;

        /**
         * 创建一个 DijkstraGrid 对象.
         */
        public constructor() {
            this._grid = {};
        }

        /**
         * 获取节点数量.
         */
        public get size(): number {
            return this._size;
        }

        /**
         * 设置或获取寻路的起始节点.
         */
        public set startNode(value: DijkstraNode) {
            this._startNode = value;
        }
        public get startNode(): DijkstraNode {
            return this._startNode;
        }

        /**
         * 设置或获取寻路的终止节点.
         */
        public set endNode(value: DijkstraNode) {
            this._endNode = value;
        }
        public get endNode(): DijkstraNode {
            return this._endNode;
        }

        /**
         * 添加一个或多个节点.
         * @param name 节点名称.
         */
        public addNode(name: string | string[]): void {
            if (Array.isArray(name)) {
                for (let value of name) {
                    if (!this._grid.hasOwnProperty(value)) {
                        let node = new DijkstraNode(value);
                        this._grid[value] = node;
                        this._size++;
                    }
                }
            } else {
                if (!this._grid.hasOwnProperty(name)) {
                    let node = new DijkstraNode(name);
                    this._grid[name] = node;
                    this._size++;
                }
            }
        }

        /**
         * 设定一条路径.
         * @param start 起始节点名称.
         * @param end 终止节点名称.
         * @param cost 移动的代价.
         */
        public setNodeLink(start: string, end: string, cost: number): void {
            if (cost < 0) {
                throw new Error("移动的代价不能小于0！");
            }
            let startNode = this._grid[start];
            let endNode = this._grid[end];
            if (startNode.link.hasOwnProperty(endNode.name)) {
                startNode.link[endNode.name].cost = cost;
            } else {
                let link = new DijkstraLink(endNode, cost);
                startNode.link[endNode.name] = link;
            }
        }

        /**
         * 获取地图中的一个指定的节点对象.
         * @param name 节点名称.
         * @return 返回指定的节点.
         */
        public getNode(name: string): DijkstraNode {
            return this._grid[name];
        }

        /**
         * 设置寻路起点.
         * @param name 节点名称.
         */
        public setStartNode(name: string): void {
            this._startNode = this._grid[name];
        }

        /**
         * 设置寻路终点.
         * @param name 节点名称.
         */
        public setEndNode(name: string): void {
            this._endNode = this._grid[name];
        }
    }

    /**
     * DijkstraNode 类定义了图的一个节点的属性.
     * @author wizardc
     */
    export class DijkstraNode {
        /**
         * 节点名称.
         */
        public name: string;

        /**
         * 可移动到其它节点数据.
         */
        public link: { [name: string]: DijkstraLink };

        /**
         * 创建一个 DijkstraNode 对象.
         * @param name 节点名称.
         */
        public constructor(name: string) {
            this.name = name;
            this.link = {};
        }
    }

    /**
     * DijkstraLink 类定义了一个节点可移动到的节点的关系.
     * @author wizardc
     */
    export class DijkstraLink {
        /**
         * 节点对象.
         */
        public node: DijkstraNode;

        /**
         * 移动的代价.
         */
        public cost: number = 0;

        /**
         * 创建一个 DijkstraLink 对象.
         * @param node 节点对象.
         * @param cost 移动的代价.
         */
        public constructor(node: DijkstraNode, cost: number) {
            this.node = node;
            this.cost = cost;
        }
    }
}
