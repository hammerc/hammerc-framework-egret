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
     * <code>BytesReader</code> 类提供从字节流中读取数据的功能.
     * @author wizardc
     */
    export class BytesReader {
        /**
         * 读取一个布尔值.
         * @param input 输入流对象.
         * @return 对应的数据.
         */
        public static readBoolean(input: egret.ByteArray): boolean {
            return input.readByte() != 0;
        }

        /**
         * 读取一个带符号 8 位数字.
         * @param input 输入流对象.
         * @return 对应的数据.
         */
        public static readByte(input: egret.ByteArray): number {
            return input.readByte();
        }

        /**
         * 读取一个无符号 8 位数字.
         * @param input 输入流对象.
         * @return 对应的数据.
         */
        public static readUByte(input: egret.ByteArray): number {
            return input.readUnsignedByte();
        }

        /**
         * 读取一个带符号 16 位数字.
         * @param input 输入流对象.
         * @return 对应的数据.
         */
        public static readShort(input: egret.ByteArray): number {
            return input.readShort();
        }

        /**
         * 读取一个无符号 16 位数字.
         * @param input 输入流对象.
         * @return 对应的数据.
         */
        public static readUShort(input: egret.ByteArray): number {
            return input.readUnsignedShort();
        }

        /**
         * 读取一个带符号 32 位数字.
         * @param input 输入流对象.
         * @return 对应的数据.
         */
        public static readInt(input: egret.ByteArray): number {
            return input.readInt();
        }

        /**
         * 读取一个无符号 32 位数字.
         * @param input 输入流对象.
         * @return 对应的数据.
         */
        public static readUInt(input: egret.ByteArray): number {
            return input.readUnsignedInt();
        }

        /**
         * 读取一个带符号 64 位数字.
         * @param input 输入流对象.
         * @return 对应的数据.
         */
        public static readLong(input: egret.ByteArray): Int64 {
            return Int64.readInt64(input);
        }

        /**
         * 读取一个无符号 64 位数字.
         * @param input 输入流对象.
         * @return 对应的数据.
         */
        public static readULong(input: egret.ByteArray): UInt64 {
            return UInt64.readUnsignedInt64(input);
        }

        /**
         * 读取一个 32 位浮点数.
         * @param input 输入流对象.
         * @return 对应的数据.
         */
        public static readFloat(input: egret.ByteArray): number {
            return input.readFloat();
        }

        /**
         * 读取一个 64 位浮点数.
         * @param input 输入流对象.
         * @return 对应的数据.
         */
        public static readDouble(input: egret.ByteArray): number {
            return input.readDouble();
        }

        /**
         * 读取一个字符串.
         * @param input 输入流对象.
         * @return 对应的数据.
         */
        public static readString(input: egret.ByteArray): string {
            return input.readUTF();
        }

        /**
         * 读取一个字节数组.
         * @param input 输入流对象.
         * @return 对应的数据.
         */
        public static readBytes(input: egret.ByteArray): egret.ByteArray {
            var len: number = input.readUnsignedInt();
            var bytes: egret.ByteArray = new egret.ByteArray();
            input.readBytes(bytes, 0, len);
            return bytes;
        }

        /**
         * 读取一个自定义数据.
         * @param input 输入流对象.
         * @param structClass 自定义数据类.
         * @return 自定义数据.
         */
        public static readStruct(input: egret.ByteArray, structClass: any): Struct {
            var target: Struct = <Struct> new structClass();
            target["readExternal"](input);
            return target;
        }
    }
}
