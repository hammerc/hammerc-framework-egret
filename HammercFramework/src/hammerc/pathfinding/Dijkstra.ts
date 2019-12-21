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
     * Dijkstra 类提供寻找图中两个节点间的最短路径功能.
     * <p><b>注意: </b>该类不支持负权重寻路.</p>
     * @author wizardc
     */
    export class Dijkstra {
        protected _map: DijkstraMap;

        private _startNode: DijkstraNode;
        private _endNode: DijkstraNode;

        private _path: string[];

        /**
         * 创建一个 Dijkstra 对象.
         */
        public constructor() {
        }

        /**
         * 获取最优路径.
         */
        public get path(): string[] {
            return this._path;
        }

        /**
         * 根据传入的图获取一个最佳路径.
         * @param grid 需要寻路的图对象.
         * @return 本次移动的总代价, 如果没有找到路径则返回 -1.
         */
        public findPath(grid: DijkstraMap): number {
            if (this._map != null) {
                this.clear();
            }
            this._map = grid;
            this._startNode = this._map.startNode;
            this._endNode = this._map.endNode;
            return this.search();
        }

        protected search(): number {
            let start = this._startNode;
            let end = this._endNode;
            this._path = [];
            if (start == end) {
                return 0;
            }

            let queue = new PriorityQueue();
            let distances = {};
            let previous = {};

            for (let node of this._map.list) {
                if (node == start) {
                    distances[node.name] = 0;
                    queue.enqueue(node.name, 0);
                } else {
                    distances[node.name] = Infinity;
                    queue.enqueue(node.name, Infinity);
                }
            }

            while (!queue.empty) {
                let smallest = queue.dequeue();
                if (smallest == end.name) {
                    while (previous[smallest]) {
                        this._path.push(smallest);
                        smallest = previous[smallest];
                    }
                    break;
                }
                if (!smallest || distances[smallest] === Infinity) {
                    continue;
                }
                let link = this._map.getNode(smallest).link;
                for (let neighbor in link) {
                    let alt = distances[smallest] + link[neighbor].cost;
                    if (alt < distances[neighbor]) {
                        distances[neighbor] = alt;
                        previous[neighbor] = smallest;
                        queue.enqueue(neighbor, alt);
                    }
                }
            }

            if (this._path.length == 0) {
                return -1;
            }

            this._path.push(start.name);
            this._path.reverse();
            let cost = 0;
            for (let i = 0, len = this._path.length - 1; i < len; i++) {
                let start = this._path[i];
                let end = this._path[i + 1];
                cost += this._map.getNode(start).link[end].cost;
            }
            return cost;
        }

        /**
         * 清空所有数据.
         */
        public clear(): void {
            this._map = null;
            this._startNode = null;
            this._endNode = null;
            this._path = null;
        }
    }

    /**
     * PriorityQueue 类实现了优先级队列.
     * @author wizardc
     */
    class PriorityQueue {
        private _nodes: PriorityNode[];

        /**
         * 创建一个 PriorityQueue 对象.
         */
        public constructor() {
            this._nodes = [];
        }

        /**
         * 队列是否为空.
         */
        public get empty(): boolean {
            return !this._nodes.length;
        }

        /**
         * 加入队列.
         * @param name 节点名称.
         * @param cost 移动的代价.
         */
        public enqueue(name: string, cost: number): void {
            this._nodes.push(new PriorityNode(name, cost));
            this._nodes.sort(this.sortFunc);
        }

        private sortFunc(a: PriorityNode, b: PriorityNode): number {
            return a.cost - b.cost;
        }

        /**
         * 移出队列.
         * @returns 节点名称.
         */
        public dequeue(): string {
            return this._nodes.shift().name;
        }
    }

    /**
     * PriorityNode 类实现了优先级节点.
     * @author wizardc
     */
    class PriorityNode {
        /**
         * 节点名称.
         */
        public name: string;

        /**
         * 移动的代价.
         */
        public cost: number;

        /**
         * 创建一个 PriorityNode 对象.
         * @param name 节点名称.
         * @param cost 移动的代价.
         */
        public constructor(name: string, cost: number) {
            this.name = name;
            this.cost = cost;
        }
    }
}
