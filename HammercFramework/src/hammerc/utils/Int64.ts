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
     * Int64 类提供 64 位带符号整型数字的支持.
     * <p>注意: 本类仅有记录数字的功能, 不支持运算.</p>
     * @author wizardc
     */
    export class Int64 {
        /**
         * 该常量表示数字 -1.
         */
        public static NEG_ONE: Int64 = new Int64(0xffffffff, 0xffffffff);

        /**
         * 该常量表示数字 0.
         */
        public static ZERO: Int64 = new Int64();

        /**
         * 该常量表示数字 1.
         */
        public static ONE: Int64 = new Int64(1);

        /**
         * 该常量表示 Int64 数字的最小值.
         */
        public static MIN_VALUE = new Int64(0, 0x80000000);

        /**
         * 该常量表示 Int64 数字的最大值.
         */
        public static MAX_VALUE: Int64 = new Int64(0xffffffff, 0x7fffffff);

        /**
         * 从字节流中读取一个 64 位的带符号整数, 会读取 8 个字节.
         * @param input 要读取的字节流.
         * @return 64 位的带符号整数.
         */
        public static readInt64(input: egret.ByteArray): Int64 {
            var low: number;
            var high: number;
            if (input.endian == egret.Endian.LITTLE_ENDIAN) {
                low = input.readUnsignedInt();
                high = input.readUnsignedInt();
            } else {
                high = input.readUnsignedInt();
                low = input.readUnsignedInt();
            }
            return new Int64(low, high);
        }

        /**
         * 向字节流写入一个 64 位的带符号整数, 会写入 8 个字节.
         * @param output 要写入的字节流.
         * @param value 要写入的 64 位的带符号整数.
         */
        public static writeInt64(output: egret.ByteArray, value: Int64): void {
            if (output.endian == egret.Endian.LITTLE_ENDIAN) {
                output.writeUnsignedInt(value.low);
                output.writeUnsignedInt(value.high);
            } else {
                output.writeUnsignedInt(value.high);
                output.writeUnsignedInt(value.low);
            }
        }

        /**
         * 解析字符串为 64 位的带符号整数.
         * @param value 待解析的字符串.
         * @param radix 表示要分析的数字的基数 (基) 的整数.
         * @return 64 位的带符号整数.
         */
        public static parseInt64(value: string, radix: number = 10): Int64 {
            value = value.toLowerCase();
            var negative: boolean = value.indexOf("-") == 0;
            if (negative) {
                value = value.substr(1);
            }
            var div: number = 4294967296;
            var low: number = 0;
            var high: number = 0;
            for (var i: number = 0; i < value.length; i++) {
                var num: number = value.charCodeAt(i) - 48;
                if (num > 9) {
                    num -= 39;
                }
                low = low * radix + num;
                high = high * radix + low / div;
                low = low % div;
            }
            if (negative) {
                low = ~low;
                high = ~high;
                if (low == 0xffffffff) {
                    ++high;
                }
                ++low;
            }
            return new Int64(low, high);
        }

        private _low: number = 0;
        private _high: number = 0;

        /**
         * 创建一个 Int64 对象.
         * @param low 低位数字.
         * @param high 高位数字.
         */
        public constructor(low: number = 0, high: number = 0) {
            this._low = low;
            this._high = high;
        }

        /**
         * 设置或获取低位数字.
         */
        public set low(value: number) {
            this._low = value;
        }
        public get low(): number {
            return this._low;
        }

        /**
         * 设置或获取高位数字.
         */
        public set high(value: number) {
            this._high = value;
        }
        public get high(): number {
            return this._high;
        }

        /**
         * 判断是否和指定的数字相同.
         * @param value 需要判断的数字.
         * @return 两个数字大小是否相同.
         */
        public equals(value: Int64): boolean {
            if (value == null)  {
                return false;
            }
            return (value.low == this.low) && (value.high == this.high);
        }

        /**
         * 将该数字转换为一个字节数组.
         * @param endian 字节顺序.
         * @return 对应的字节数组.
         */
        public toByteArray(endian: string = "littleEndian"): egret.ByteArray {
            var bytes: egret.ByteArray = new egret.ByteArray();
            bytes.endian = endian;
            if (bytes.endian == egret.Endian.LITTLE_ENDIAN) {
                bytes.writeUnsignedInt(this._low);
                bytes.writeUnsignedInt(this._high);
            } else {
                bytes.writeUnsignedInt(this._high);
                bytes.writeUnsignedInt(this._low);
            }
            return bytes;
        }

        /**
         * 获取本对象的字符串表示形式.
         * @param radix 指定要用于数字到字符串的转换的基数.
         * @return 本对象的字符串表示形式.
         */
        public toString(radix: number = 10): string {
            if (radix < 2 || radix > 36) {
                throw new RangeError("基数必须介于2到36之间，当前为" + radix + "！");
            }
            var result: string = "";
            var lowUint: number = this._low;
            var highUint: number = this._high;
            var temp: number = highUint | (1 << 31);
            var negative: boolean = (highUint == temp);
            if (negative) {
                if (lowUint == 0) {
                    --highUint;
                }
                --lowUint;
                lowUint = ~lowUint;
                highUint = ~highUint;
            }
            var highRemain: number = 0;
            var lowRemain: number = 0;
            var tempNum: number = 0;
            var maxLowUint: number = 4294967296;
            while (highUint != 0 || lowUint != 0) {
                highRemain = highUint % radix;
                tempNum = highRemain * maxLowUint + lowUint;
                lowRemain = tempNum % radix;
                result = lowRemain.toString(radix) + result;
                highUint = (highUint - highRemain) / radix;
                lowUint = (tempNum - lowRemain) / radix;
            }
            if (negative) {
                result = "-" + result;
            }
            return result;
        }

        /**
         * 复制本对象的副本.
         * @return 与本对象一致的副本.
         */
        public clone(): Int64 {
            return new Int64(this._low, this._high);
        }
    }
}
