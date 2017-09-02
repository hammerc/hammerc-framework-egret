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
     * MathUtil 类提供各种游戏中的基础数学运算.
     * @author wizardc
     */
    export class MathUtil {
        /**
         * 计算两个点之间的距离.
         * @param x1 第一个点的 x 轴坐标.
         * @param y1 第一个点的 y 轴坐标.
         * @param x2 第二个点的 x 轴坐标.
         * @param y2 第二个点的 y 轴坐标.
         * @return 两个点之间的距离.
         */
        public static distance(x1: number, y1: number, x2: number, y2: number): number {
            let dx = x2 - x1;
            let dy = y2 - y1;
            return Math.sqrt(dx * dx + dy * dy);
        }

        /**
         * 计算两个点之间的距离.
         * @param point1 第一个点.
         * @param point2 第二个点.
         * @return 两个点之间的距离.
         */
        public static distance2(point1: egret.Point, point2: egret.Point): number {
            let dx = point2.x - point1.x;
            let dy = point2.y - point1.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        /**
         * 计算两个点之间的弧度.
         * @param x1 第一个点的 x 轴坐标.
         * @param y1 第一个点的 y 轴坐标.
         * @param x2 第二个点的 x 轴坐标.
         * @param y2 第二个点的 y 轴坐标.
         * @return 两个点之间的弧度.
         */
        public static radians(x1: number, y1: number, x2: number, y2: number): number {
            let dx = x2 - x1;
            let dy = y2 - y1;
            return Math.atan2(dy, dx);
        }

        /**
         * 计算两个点之间的弧度.
         * @param point1 第一个点.
         * @param point2 第二个点.
         * @return 两个点之间的弧度.
         */
        public static radians2(point1: egret.Point, point2: egret.Point): number {
            let dx = point2.x - point1.x;
            let dy = point2.y - point1.y;
            return Math.atan2(dy, dx);
        }

        /**
         * 计算两个点之间的角度.
         * @param x1 第一个点的 x 轴坐标.
         * @param y1 第一个点的 y 轴坐标.
         * @param x2 第二个点的 x 轴坐标.
         * @param y2 第二个点的 y 轴坐标.
         * @return 两个点之间的角度.
         */
        public static degrees(x1: number, y1: number, x2: number, y2: number): number {
            return MathUtil.toDegrees(MathUtil.radians(x1, y1, x2, y2));
        }

        /**
         * 计算两个点之间的角度.
         * @param point1 第一个点.
         * @param point2 第二个点.
         * @return 两个点之间的角度.
         */
        public static degrees2(point1: egret.Point, point2: egret.Point): number {
            return MathUtil.toDegrees(MathUtil.radians2(point1, point2));
        }

        /**
         * 将一个角度转换为弧度.
         * @param degrees 需要被转换的角度.
         * @return 该角度对应的弧度.
         */
        public static toRadians(degrees: number): number {
            return degrees * Math.PI / 180;
        }

        /**
         * 将一个弧度转换为角度.
         * @param radians 需要被转换的弧度.
         * @return 该角度对应的角度.
         */
        public static toDegrees(radians: number): number {
            return radians * 180 / Math.PI;
        }
    }
}
