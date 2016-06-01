﻿// =================================================================================================
//
//	Hammerc Framework
//	Copyright 2016 hammerc.org All Rights Reserved.
//
//	See LICENSE for full license information.
//
// =================================================================================================

module hammerc {
    /**
     * <code>SmoothAStar</code> 类基于 <code>AStar</code> 类实现, 添加了获取平滑路径的功能.
	 * <p><b>注意: </b>该类得到的平滑路径为多个连续或不连续的格子对象, 每个格子对象按直线作为路径, 格子对象都出现在需要拐角处.</p>
	 * @author wizardc
     */
    export class SmoothAStar extends AStar {
		/**
		 * 创建一个 <code>SmoothAStar</code> 对象.
		 * @param heuristic 应用的启发函数, 为空则使用曼哈顿启发函数.
		 */
        public constructor(heuristic: (node1: AStarNode, node2: AStarNode) => number = null) {
            super(heuristic);
        }
        
		/**
		 * 获取平滑的最优路径.
		 */
        public get smoothPath(): Array<AStarNode> {
            var path: Array<AStarNode> = this.path;
            if (path == null || path.length < 3) {
                return path;
            } else {
                path = this.removeCollinearAStarNode(path);
                path = this.smoothPathByFloyd(path);
            }
            return path;
        }

        private removeCollinearAStarNode(path: Array<AStarNode>): Array<AStarNode> {
            var result: Array<AStarNode> = new Array<AStarNode>();
            result.push(path[0]);
            var offsetX: number = path[0].x - path[1].x;
            var offsetY: number = path[0].y - path[1].y;
            var len: number = path.length - 1;
            var nowIndex: number = 1;
            while (len > nowIndex) {
                if ((path[nowIndex].x - path[nowIndex + 1].x) != offsetX || (path[nowIndex].y - path[nowIndex + 1].y) != offsetY) {
                    result.push(path[nowIndex]);
                    offsetX = path[nowIndex].x - path[nowIndex + 1].x;
                    offsetY = path[nowIndex].y - path[nowIndex + 1].y;
                }
                nowIndex++;
            }
            result.push(path[nowIndex]);
            return result;
        }

        private smoothPathByFloyd(path: Array<AStarNode>): Array<AStarNode> {
            var result: Array<AStarNode> = new Array<AStarNode>();
            result.push(path[0]);
            var len: number = path.length;
            var nowIndex: number = 0;
            var testIndex: number = 2;
            while (len > testIndex) {
                if (this.hasObstacle(path[nowIndex], path[testIndex])) {
                    result.push(path[testIndex - 1]);
                    nowIndex = testIndex - 1;
                    testIndex++;
                } else {
                    testIndex++;
                }
            }
            result.push(path[path.length - 1]);
            return result;
        }

        private hasObstacle(node1: AStarNode, node2: AStarNode): boolean {
            var dx: number = node1.x - node2.x;
            dx = dx < 0 ? -dx : dx;
            var dy: number = node1.y - node2.y;
            dy = dy < 0 ? -dy : dy;
            if (dx < 2 && dy < 2) {
                return false;
            } else if (dx == 0) {
                return this.verticalHasObstacle(node1, node2);
            } else if (dy == 0) {
                return this.horizontalHasObstacle(node1, node2);
            } else if (dx == dy) {
                return this.slopeHasObstacle(node1, node2);
            } else {
                return this.otherHasObstacle(dx, dy, node1, node2);
            }
        }

        private verticalHasObstacle(node1: AStarNode, node2: AStarNode): boolean {
            var col: number = node1.x;
            var minRow: number = node1.y > node2.y ? node2.y : node1.y;
            var maxRow: number = node1.y > node2.y ? node1.y : node2.y;
            for (var i: number = minRow + 1; i < maxRow; i++) {
                if (!this._grid.getNode(col, i).walkable) {
                    return true;
                }
            }
            return false;
        }

        private horizontalHasObstacle(node1: AStarNode, node2: AStarNode): boolean {
            var row: number = node1.y;
            var minCol: number = node1.x > node2.x ? node2.x : node1.x;
            var maxCol: number = node1.x > node2.x ? node1.x : node2.x;
            for (var i: number = minCol + 1; i < maxCol; i++) {
                if (!this._grid.getNode(i, row).walkable) {
                    return true;
                }
            }
            return false;
        }

        private slopeHasObstacle(node1: AStarNode, node2: AStarNode): boolean {
            var leftNode: AStarNode = node1.x > node2.x ? node2 : node1;
            var rightNode: AStarNode = node1.x > node2.x ? node1 : node2;
            var up: boolean = leftNode.y > rightNode.y;
            var x: number = leftNode.x;
            var y: number = leftNode.y;
            for (var i: number = 0, len: number = rightNode.x - leftNode.x + 1; i < len; i++) {
                if (i == 0) {
                    if (!this._grid.getNode(x + 1, y).walkable) {
                        return true;
                    }
                } else if (i == len - 1) {
                    if (!this._grid.getNode(x - 1, y).walkable) {
                        return true;
                    }
                } else {
                    for (var j: number = -1; j < 2; j++) {
                        if (!this._grid.getNode(x + j, y).walkable) {
                            return true;
                        }
                    }
                }
                x++;
                up ? y-- : y++;
            }
            return false;
        }

        private otherHasObstacle(dx: number, dy: number, node1: AStarNode, node2: AStarNode): boolean {
            var k: number = (node1.y - node2.y) / (node1.x - node2.x);
            var b: number = node1.y - k * node1.x;
            var vertical: boolean = dx < dy;
            var leftNode: AStarNode = node1.x > node2.x ? node2 : node1;
            var rightNode: AStarNode = node1.x > node2.x ? node1 : node2;
            var up: boolean = leftNode.y > rightNode.y;
            dx *= 1000;
            dy *= 1000;
            b *= 1000;
            var startX: number = leftNode.x * 1000 + 500;
            var endX: number = startX + dx;
            var startY: number = up ? leftNode.y * 1000 - 500 : leftNode.y * 1000 + 500;
            var endY: number = up ? startY - dy : startY + dy;
            var x: number = startX;
            var y: number = startY;
            while (true) {
                if (vertical) {
                    x = (y - b) / k;
                } else {
                    y = k * x + b;
                }
                if (this.is4GridCenterPoint(x, y)) {
                    for (var i: number = x / 1000, iLen: number = i + 1; i <= iLen; i++) {
                        for (var j: number = y / 1000, jLen: number = j + 1; j <= jLen; j++) {
                            if (this._grid.getNode(i, j) != this._grid.startNode && this._grid.getNode(i, j) != this._grid.endNode && !this._grid.getNode(i, j).walkable) {
                                return true;
                            }
                        }
                    }
                } else {
                    if (vertical) {
                        i = (x + 500) / 1000;
                        j = y / 1000;
                        for (jLen = j + 1; j <= jLen; j++) {
                            if (this._grid.getNode(i, j) != this._grid.startNode && this._grid.getNode(i, j) != this._grid.endNode && !this._grid.getNode(i, j).walkable) {
                                return true;
                            }
                        }
                    } else {
                        i = x / 1000;
                        j = (y + 500) / 1000;
                        for (iLen = i + 1; i <= iLen; i++) {
                            if (this._grid.getNode(i, j) != this._grid.startNode && this._grid.getNode(i, j) != this._grid.endNode && !this._grid.getNode(i, j).walkable) {
                                return true;
                            }
                        }
                    }
                }
                if (vertical) {
                    if (up) {
                        y -= 1000;
                        if (y <= endY) {
                            break;
                        }
                    } else {
                        y += 1000;
                        if (y >= endY) {
                            break;
                        }
                    }
                } else {
                    x += 1000;
                    if (x >= endX) {
                        break;
                    }
                }
            }
            return false;
        }

        private is4GridCenterPoint(x: number, y: number): boolean {
            if (x % 500 != 0 || y % 500 != 0) {
                return false;
            }
            if (x % 1000 != 500 || y % 1000 != 500) {
                return false;
            }
            return true;
        }
    }
}