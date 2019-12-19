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
        protected _grid: DijkstraGrid;

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
        public findPath(grid: DijkstraGrid): number {
            if (this._grid != null) {
                this.clear();
            }
            this._grid = grid;
            this._startNode = this._grid.startNode;
            this._endNode = this._grid.endNode;
            return this.search();
        }

        protected search(): number {
            let start: DijkstraNode = this._startNode;
            let end: DijkstraNode = this._endNode;
            if (start === end) {
                this._path = [];
                return 0;
            }

            let costMap: { [name: string]: number } = {};
            let parentMap: { [name: string]: string } = {};
            let checkedList: string[] = [];

            for (let name in start.link) {
                let cost = start.link[name].cost;
                costMap[name] = cost;
                parentMap[name] = start.name;
            }

            let minCost = this.getMinCost(costMap, checkedList);
            while (minCost) {
                let linkMap = this._grid.getNode(minCost).link;
                if (linkMap) {
                    this.handleNode(minCost, linkMap, costMap, parentMap);
                }
                checkedList.push(minCost);
                minCost = this.getMinCost(costMap, checkedList);
            }

            if (!parentMap.hasOwnProperty(end.name)) {
                return -1;
            }

            this._path = [];
            let parentName = parentMap[end.name];
            while (parentName) {
                this._path.unshift(this._grid.getNode(parentName).name);
                parentName = parentMap[parentName];
            }
            this._path.push(end.name);

            return costMap[end.name];
        }

        private getMinCost(costMap: { [name: string]: number }, nameList: string[]): string {
            let min = Number.MAX_VALUE;
            let minName: string;
            for (let name in costMap) {
                if (nameList.indexOf(name) == -1) {
                    let cost = costMap[name];
                    if (min > cost) {
                        min = cost;
                        minName = name;
                    }
                }
            }
            return minName;
        }

        private handleNode(startName: string, linkMap: { [name: string]: DijkstraLink }, costMap: { [name: string]: number }, parentMap: { [name: string]: string }): void {
            for (let name in linkMap) {
                let hasCost = costMap[startName];
                let cost = linkMap[name].cost;
                cost += hasCost;
                if (!costMap.hasOwnProperty(name)) {
                    costMap[name] = cost;
                    parentMap[name] = startName;
                } else {
                    let oldCost = costMap[name];
                    if (cost < oldCost) {
                        costMap[name] = cost;
                        parentMap[name] = startName;
                    }
                }
            }
        }

        /**
         * 清空所有数据.
         */
        public clear(): void {
            this._grid = null;
            this._startNode = null;
            this._endNode = null;
            this._path = null;
        }
    }
}
