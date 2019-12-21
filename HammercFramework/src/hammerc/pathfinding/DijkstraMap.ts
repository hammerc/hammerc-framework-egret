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
    export class DijkstraMap {
        /**
         * 记录所有节点的哈希表对象.
         */
        protected _map: { [name: string]: DijkstraNode };

        /**
         * 记录所有节点的列表对象.
         */
        protected _list: DijkstraNode[];

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
            this._map = {};
            this._list = [];
        }

        /**
         * 获取节点列表.
         */
        public get list(): DijkstraNode[] {
            return this._list;
        }

        /**
         * 获取节点数量.
         */
        public get size(): number {
            return this._list.length;
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
         * 设定一条路径.
         * @param start 起始节点名称.
         * @param end 终止节点名称.
         * @param cost 移动的代价.
         */
        public setNodeLink(start: string, end: string, cost: number): void {
            if (cost < 0) {
                throw new Error("移动的代价不能小于0！");
            }
            this.addNode(start);
            let startNode = this._map[start];
            this.addNode(end);
            let endNode = this._map[end];
            if (startNode.link.hasOwnProperty(endNode.name)) {
                startNode.link[endNode.name].cost = cost;
            } else {
                let link = new DijkstraLink(endNode, cost);
                startNode.link[endNode.name] = link;
            }
        }

        private addNode(name: string): void {
            if (!this._map.hasOwnProperty(name)) {
                let node = new DijkstraNode(name);
                this._map[name] = node;
                this._list.push(node);
            }
        }

        /**
         * 获取地图中的一个指定的节点对象.
         * @param name 节点名称.
         * @return 返回指定的节点.
         */
        public getNode(name: string): DijkstraNode {
            return this._map[name];
        }

        /**
         * 设置寻路起点.
         * @param name 节点名称.
         */
        public setStartNode(name: string): void {
            this._startNode = this._map[name];
        }

        /**
         * 设置寻路终点.
         * @param name 节点名称.
         */
        public setEndNode(name: string): void {
            this._endNode = this._map[name];
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
