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
     * <code>BytesWriter</code> 类提供写入数据到字节流中的功能.
     * @author wizardc
     */
    export class BytesWriter {
        /**
         * 写入一个布尔值.
         * @param output 输出流对象.
         * @param value 要写入的数据.
         */
        public static writeBoolean(output: egret.ByteArray, value: boolean): void {
            output.writeByte(value ? 1 : 0);
        }

        /**
         * 写入一个 8 位数字.
         * @param output 输出流对象.
         * @param value 要写入的数据.
         */
        public static writeByte(output: egret.ByteArray, value: number): void {
            output.writeByte(value);
        }

        /**
         * 写入一个 16 位数字.
         * @param output 输出流对象.
         * @param value 要写入的数据.
         */
        public static writeShort(output: egret.ByteArray, value: number): void {
            output.writeShort(value);
        }

        /**
         * 写入一个带符号 32 位数字.
         * @param output 输出流对象.
         * @param value 要写入的数据.
         */
        public static writeInt(output: egret.ByteArray, value: number): void {
            output.writeInt(value);
        }

        /**
         * 写入一个无符号 32 位数字.
         * @param output 输出流对象.
         * @param value 要写入的数据.
         */
        public static writeUInt(output: egret.ByteArray, value: number): void {
            output.writeUnsignedInt(value);
        }

        /**
         * 写入一个带符号 64 位数字.
         * @param output 输出流对象.
         * @param value 要写入的数据.
         */
        public static writeLong(output: egret.ByteArray, value: Int64): void {
            Int64.writeInt64(output, value);
        }

        /**
         * 写入一个无符号 64 位数字.
         * @param output 输出流对象.
         * @param value 要写入的数据.
         */
        public static writeULong(output: egret.ByteArray, value: UInt64): void {
            UInt64.writeUnsignedInt64(output, value);
        }

        /**
         * 写入一个 32 位浮点数.
         * @param output 输出流对象.
         * @param value 要写入的数据.
         */
        public static writeFloat(output: egret.ByteArray, value: number): void {
            output.writeFloat(value);
        }

        /**
         * 写入一个 64 位浮点数.
         * @param output 输出流对象.
         * @param value 要写入的数据.
         */
        public static writeDouble(output: egret.ByteArray, value: number): void {
            output.writeDouble(value);
        }

        /**
         * 写入一个字符串.
         * @param output 输出流对象.
         * @param value 要写入的数据.
         */
        public static writeString(output: egret.ByteArray, value: string): void {
            output.writeUTF(value);
        }

        /**
         * 写入一个字节数组.
         * @param output 输出流对象.
         * @param value 要写入的数据.
         */
        public static writeBytes(output: egret.ByteArray, value: egret.ByteArray): void {
            value.position = 0;
            output.writeUnsignedInt(value.length);
            output.writeBytes(value);
        }

        /**
         * 写入一个自定义数据.
         * @param output 输出流对象.
         * @param value 自定义数据.
         */
        public static writeStruct(output: egret.ByteArray, value: Struct): void {
            value["writeExternal"](output);
        }
    }
}
