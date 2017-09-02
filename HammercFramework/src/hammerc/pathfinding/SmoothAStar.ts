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
     * SmoothAStar 类基于 KeyPointAStar 类实现, 添加了获取平滑路径的功能.
     * <p><b>注意: </b>该类得到的路径在关键点路径的基础上去掉额外行走的路径, 更加接近现实的行走.</p>
     * @author wizardc
     */
    export class SmoothAStar extends KeyPointAStar {
        /**
         * 创建一个 SmoothAStar 对象.
         * @param heuristic 应用的启发函数, 为空则使用曼哈顿启发函数.
         */
        public constructor(heuristic: (node1: AStarNode, node2: AStarNode) => number = null) {
            super(heuristic);
        }

        /**
         * 获取平滑的最优路径.
         */
        public get smoothPath(): AStarNode[] {
            let path = this.keyPointPath;
            if (path == null || path.length < 3) {
                return path;
            } else {
                path = this.smoothPathByFloyd(path);
            }
            return path;
        }

        private smoothPathByFloyd(path: AStarNode[]): AStarNode[] {
            let result: AStarNode[] = [];
            result.push(path[0]);
            let len = path.length;
            let nowIndex = 0;
            let testIndex = 2;
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
            let dx = node1.x - node2.x;
            dx = dx < 0 ? -dx : dx;
            let dy = node1.y - node2.y;
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
            let col = node1.x;
            let minRow = node1.y > node2.y ? node2.y : node1.y;
            let maxRow = node1.y > node2.y ? node1.y : node2.y;
            for (let i = minRow + 1; i < maxRow; i++) {
                if (!this._grid.getNode(col, i).walkable) {
                    return true;
                }
            }
            return false;
        }

        private horizontalHasObstacle(node1: AStarNode, node2: AStarNode): boolean {
            let row = node1.y;
            let minCol = node1.x > node2.x ? node2.x : node1.x;
            let maxCol = node1.x > node2.x ? node1.x : node2.x;
            for (let i = minCol + 1; i < maxCol; i++) {
                if (!this._grid.getNode(i, row).walkable) {
                    return true;
                }
            }
            return false;
        }

        private slopeHasObstacle(node1: AStarNode, node2: AStarNode): boolean {
            let leftNode = node1.x > node2.x ? node2 : node1;
            let rightNode = node1.x > node2.x ? node1 : node2;
            let up = leftNode.y > rightNode.y;
            let x = leftNode.x;
            let y = leftNode.y;
            for (let i = 0, len = rightNode.x - leftNode.x + 1; i < len; i++) {
                if (i == 0) {
                    if (!this._grid.getNode(x + 1, y).walkable) {
                        return true;
                    }
                } else if (i == len - 1) {
                    if (!this._grid.getNode(x - 1, y).walkable) {
                        return true;
                    }
                } else {
                    for (let j = -1; j < 2; j++) {
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
            let k = (node1.y - node2.y) / (node1.x - node2.x);
            let b = node1.y - k * node1.x;
            let vertical = dx < dy;
            let leftNode = node1.x > node2.x ? node2 : node1;
            let rightNode = node1.x > node2.x ? node1 : node2;
            let up = leftNode.y > rightNode.y;
            dx *= 1000;
            dy *= 1000;
            b *= 1000;
            let startX = leftNode.x * 1000 + 500;
            let endX = startX + dx;
            let startY = up ? leftNode.y * 1000 - 500 : leftNode.y * 1000 + 500;
            let endY = up ? startY - dy : startY + dy;
            let x = startX;
            let y = startY;
            while (true) {
                if (vertical) {
                    x = (y - b) / k;
                } else {
                    y = k * x + b;
                }
                let i: number, iLen: number, j: number, jLen: number;
                if (this.is4GridCenterPoint(x, y)) {
                    for (i = x / 1000, iLen = i + 1; i <= iLen; i++) {
                        for (j = y / 1000, jLen = j + 1; j <= jLen; j++) {
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
