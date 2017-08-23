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
     * KeyPointAStar 类基于 AStar 类实现, 添加了获取关键点路径的功能.
     * <p><b>注意: </b>该类得到的路径中如果属于同一条直线的路径则仅保留直线的两个端点, 每个格子对象按直线作为路径, 格子对象都出现在需要拐角处.</p>
     * @author wizardc
     */
    export class KeyPointAStar extends AStar {
        /**
         * 创建一个 KeyPointAStar 对象.
         * @param heuristic 应用的启发函数, 为空则使用曼哈顿启发函数.
         */
        public constructor(heuristic: (node1: AStarNode, node2: AStarNode) => number = null) {
            super(heuristic);
        }

        /**
         * 获取关键点路径.
         */
        public get keyPointPath(): AStarNode[] {
            var path: AStarNode[] = this.path;
            if (path == null || path.length < 3) {
                return path;
            } else {
                path = this.removeCollinearAStarNode(path);
            }
            return path;
        }

        private removeCollinearAStarNode(path: AStarNode[]): AStarNode[] {
            var result: AStarNode[] = [];
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
    }
}
