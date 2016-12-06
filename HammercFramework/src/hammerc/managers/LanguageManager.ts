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
     * <code>LanguageManager</code> 类提供多语言管理的支持.
     * <ul><code>addLanguage</code> 方法中的 <code>content</code> 传入的语言内容文本须符合下面的规定：
     *   <li>使用换行分割每一条数据;</li>
     *   <li>取每一行的第一个等号 "=" 为键与值的分割标示;</li>
     *   <li>如果新的一行中没有等号 "=" 则本行数据视为上一行数据的值;</li>
     *   <li>键名不能包含任何的空白字符;</li>
     *   <li>使用 "\r" 或 "\n" 来表示换行;</li>
     *   <li>每行开头使用 "!" 或 "#" 可以标示该一行为注释文本;</li>
     *   <li>使用 "{0}" 进行参数替换, 括号中间的数字为参数索引;</li>
     * </ul>
     * @author wizardc
     */
    export class LanguageManager {
        private static _languageMap: Object = {};
        private static _defaultLanguage: string;

        /**
         * 设置或获取默认使用的语言包.
         */
        public static set defaultLanguage(value: string) {
            LanguageManager._defaultLanguage = value;
        }
        public static get defaultLanguage(): string {
            return LanguageManager._defaultLanguage;
        }

        /**
         * 获取当前可以使用的所有语言包名称列表.
         */
        public static get languageList(): string[] {
            var list: string[] = [];
            for (var key in LanguageManager._languageMap) {
                list.push(key);
            }
            return list;
        }

        /**
         * 添加一个语言包, 名称相同的语言包可以叠加.
         * @param language 要添加的语言包名称.
         * @param content 要添加的语言包内容.
         */
        public static addLanguage(language: string, content: string): void {
            if (!LanguageManager._languageMap.hasOwnProperty(language)) {
                LanguageManager._languageMap[language] = {};
            }
            var contentMap: any = LanguageManager._languageMap[language];
            var textLines: string[] = content.split(/\r?\n|\n/);
            var key: string, value: string;
            for (var i = 0, len = textLines.length; i < len; i++) {
                var textLine: string = textLines[i];
                if (textLine != null && textLine.length > 0 && textLine.charAt(0) != "!" && textLine.charAt(0) != "#") {
                    if (/^\S+=.*/.test(textLine)) {
                        var index: number = textLine.indexOf("=");
                        key = textLine.slice(0, index);
                        value = textLine.slice(index + 1);
                        contentMap[key] = LanguageManager.analyzeText(value);
                    } else if (key != null) {
                        contentMap[key] += LanguageManager.analyzeText(textLine);
                    }
                }
            }
        }

        private static analyzeText(text: string): string {
            text = text.replace(/\\t/g, "\t");
            text = text.replace(/\\r/g, "\r");
            text = text.replace(/\\n/g, "\n");
            return text;
        }

        /**
         * 获取指定的文本.
         * @param key 文本的键名.
         * @param args 用于替换文本内容的参数.
         * @return 指定的文本.
         */
        public static getString(key: string, ...args): string {
            return LanguageManager.getStringByLanguage.apply(null, [LanguageManager._defaultLanguage, key].concat(args));
        }

        /**
         * 获取指定语言包的文本.
         * @param language 指定的语言包.
         * @param key 文本的键名.
         * @param args 用于替换文本内容的参数.
         * @return 指定的文本.
         */
        public static getStringByLanguage(language: string, key: string, ...args): string {
            if (LanguageManager._languageMap.hasOwnProperty(language)) {
                var contentMap: Object = LanguageManager._languageMap[language];
                if (contentMap.hasOwnProperty(key)) {
                    var text: string = contentMap[key];
                    return StringUtil.substitute.apply(null, [text].concat(args));
                }
            }
            return language + "#" + key;
        }

        /**
         * 移除指定的语言包.
         * @param language 要移除的语言包.
         */
        public static removeLanguage(language: string): void {
            if (LanguageManager._languageMap.hasOwnProperty(language)) {
                delete LanguageManager._languageMap[language];
            }
            if (LanguageManager._defaultLanguage == language) {
                LanguageManager._defaultLanguage = null;
            }
        }

        /**
         * 移除所有的语言包.
         */
        public static removeAllLanguage(): void {
            LanguageManager._languageMap = {};
            LanguageManager._defaultLanguage = null;
        }
    }
}
