// =================================================================================================
//
//    Hammerc Framework
//    Copyright 2016 hammerc.org All Rights Reserved.
//
//    See LICENSE for full license information.
//
// =================================================================================================

module hammerc {
    /**
     * <code>Struct</code> 类是可以写入字节流和从字节流中读取的自定义数据类.
     * @author wizardc
     */
    export class Struct {
        /**
         * 自定义数据类的编码字节序.
         */
        public static STRUCT_ENDIAN: string = egret.Endian.BIG_ENDIAN;
        
        /**
         * 创建一个 <code>Struct</code> 对象.
         */
        public constructor() {
        }
        
        /**
         * 将该类序列化为字节数组.
         * @param output 输出流对象.
         */
        public writeExternal(output: egret.ByteArray): void {
            output.endian = Struct.STRUCT_ENDIAN;
            this.writeToBytes(output);
        }
        
        /**
         * 编码本对象.
         * @param output 输出流对象.
         */
        protected writeToBytes(output: egret.ByteArray): void {
        }
        
        /**
         * 从字节数组中读取该类.
         * @param input 输入流对象.
         */
        public readExternal(input: egret.ByteArray): void {
            input.endian = Struct.STRUCT_ENDIAN;
            this.readFromBytes(input);
        }
        
        /**
         * 解码本对象.
         * @param input 输入流对象.
         */
        protected readFromBytes(input: egret.ByteArray): void {
        }
    }
}
