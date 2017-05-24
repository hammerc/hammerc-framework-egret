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
     * <code>BitUtil</code> 类提供对比特 (bit) 的各种处理.
     * @author wizardc
     */
    export class BitUtil {
        /**
         * 设置指定位为高位还是低位, 本方法使用 32 位数据.
         * @param target 要设置的数据.
         * @param position 指定的位的位置, 从低位开始, 范围为 [0-32).
         * @param value 设置为高位 (<code>true</code>) 还是低位 (<code>false</code>).
         * @return 设置后的数据.
         */
        public static setBit32(target: number, position: number, value: boolean): number {
            BitUtil.validPosition(position);
            if (value) {
                target |= 1 << position;
            } else {
                target &= ~(1 << position);
            }
            return target;
        }

        /**
         * 获取指定位为高位还是低位, 本方法使用 32 位数据.
         * @param target 要设置的数据.
         * @param position 指定的位的位置, 从低位开始, 范围为 [0-32).
         * @return 指定的位是高位 (<code>true</code>) 还是低位 (<code>false</code>).
         */
        public static getBit32(target: number, position: number): boolean {
            BitUtil.validPosition(position);
            return target == (target | (1 << position));
        }

        /**
         * 交换指定位的高低位, 本方法使用 32 位数据.
         * @param target 要设置的数据.
         * @param position 指定的位的位置, 从低位开始, 范围为 [0-32).
         * @return 设置后的数据.
         */
        public static switchBit32(target: number, position: number): number {
            BitUtil.validPosition(position);
            target ^= 1 << position;
            return target;
        }

        /**
         * 设置指定位为高位还是低位, 本方法使用 64 位数据.
         * @param target 要设置的数据.
         * @param position 指定的位的位置, 从低位开始, 范围为 [0-64).
         * @param value 设置为高位 (<code>true</code>) 还是低位 (<code>false</code>).
         * @return 设置后的数据.
         */
        public static setBit64(target: number, position: number, value: boolean): number {
            BitUtil.validPosition(position, false);
            if (value) {
                target |= 1 << position;
            }
            else {
                target &= ~(1 << position);
            }
            return target;
        }

        /**
         * 获取指定位为高位还是低位, 本方法使用 64 位数据.
         * @param target 要设置的数据.
         * @param position 指定的位的位置, 从低位开始, 范围为 [0-64).
         * @return 指定的位是高位 (<code>true</code>) 还是低位 (<code>false</code>).
         */
        public static getBit64(target: number, position: number): boolean {
            BitUtil.validPosition(position, false);
            return target == (target | (1 << position));
        }

        /**
         * 交换指定位的高低位, 本方法使用 64 位数据.
         * @param target 要设置的数据.
         * @param position 指定的位的位置, 从低位开始, 范围为 [0-64).
         * @return 设置后的数据.
         */
        public static switchBit64(target: number, position: number): number {
            BitUtil.validPosition(position, false);
            target ^= 1 << position;
            return target;
        }

        private static validPosition(position: number, bit32: boolean = true): void {
            var maxNum: number = bit32 ? 32 : 64;
            if (position < 0 || position >= maxNum) {
                throw new Error("参数\"position\"的数据无效，设置为" + position + "无效！");
            }
        }
    }
}
