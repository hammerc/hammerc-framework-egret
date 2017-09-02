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
     * StringUtil 类提供对字符串的各种处理.
     * @author wizardc
     */
    export class StringUtil {
        /**
         * 使用传入的各个参数替换指定的字符串内的 "{n}" 标记.
         * @param string 要在其中进行替换的字符串. 该字符串可包含 {n} 形式的特殊标记, 其中 n 为从零开始的索引, 它将被该索引处的其他参数 (如果指定) 替换.
         * @param rest 可在 string 参数中的每个 {n} 位置被替换的其他参数, 其中 n 是一个对指定值数组的整数索引值 (从 0 开始). 如果第一个参数是一个数组, 则该数组将用作参数列表.
         * @return 使用指定的各个参数替换了所有 {n} 标记的新字符串.
         */
        public static substitute(str: string, ...rest): string {
            let len = rest.length;
            let args: any[];
            if (len == 1 && rest[0] instanceof Array) {
                args = rest[0];
                len = args.length;
            } else {
                args = rest;
            }
            for (let i = 0; i < len; i++) {
                str = str.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
            }
            return str;
        }

        /**
         * 判断一个字符串是否以指定的字符串开头.
         * @param string 要判断的字符串.
         * @param subString 开头的字符串.
         * @return 字符串是否以指定的字符串开头.
         */
        public static startsWith(str: string, subString: string): boolean {
            return (str.indexOf(subString) == 0);
        }

        /**
         * 判断一个字符串是否以指定的字符串结尾.
         * @param string 要判断的字符串.
         * @param subString 结尾的字符串.
         * @return 字符串是否以指定的字符串结尾.
         */
        public static endsWith(str: string, subString: string): boolean {
            return (str.lastIndexOf(subString) == (str.length - subString.length));
        }
    }
}
