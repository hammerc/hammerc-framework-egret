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
     * Logger 类提供了一个简便的日志记录功能.
     * @author wizardc
     */
    export class Logger {
        /**
         * 记录当前日志进行记录的消息, 默认会对所有消息进行记录和输出.
         */
        public static channels: number;

        /**
         * 指定输出的消息是否包含通道的信息.
         */
        public static includeChannels: boolean = true;

        /**
         * 指定输出的消息是否包含日期.
         */
        public static includeDate: boolean = true;

        /**
         * 指定输出的消息是否包含时间.
         */
        public static includeTime: boolean = true;

        /**
         * 设置或获取是否输出一条用于应用程序调试的消息.
         */
        public static set printLog(value: boolean) {
            Logger.channels = BitUtil.setBit32(Logger.channels, 0, value);
        }
        public static get printLog(): boolean {
            return BitUtil.getBit32(Logger.channels, 0);
        }

        /**
         * 输出一条用于应用程序调试的消息.
         * @param args 各种需要输出的数据.
         */
        public static log(...args): void {
            if (Logger.printLog) {
                Logger.logging(LoggerChannel.LOG, "LOG", args);
            }
        }

        /**
         * 设置或获取是否输出一条对应用程序运行提供说明的消息.
         */
        public static set printInfo(value: boolean) {
            Logger.channels = BitUtil.setBit32(Logger.channels, 1, value);
        }
        public static get printInfo(): boolean {
            return BitUtil.getBit32(Logger.channels, 1);
        }

        /**
         * 输出一条对应用程序运行提供说明的消息.
         * @param args 各种需要输出的数据.
         */
        public static info(...args): void {
            if (Logger.printInfo) {
                Logger.logging(LoggerChannel.INFO, "INFO", args);
            }
        }

        /**
         * 设置或获取是否输出一条会对应用程序造成损害的消息.
         */
        public static set printWarn(value: boolean) {
            Logger.channels = BitUtil.setBit32(Logger.channels, 2, value);
        }
        public static get printWarn(): boolean {
            return BitUtil.getBit32(Logger.channels, 2);
        }

        /**
         * 输出一条会对应用程序造成损害的消息.
         * @param args 各种需要输出的数据.
         */
        public static warn(...args): void {
            if (Logger.printWarn) {
                Logger.logging(LoggerChannel.WARN, "WARN", args);
            }
        }

        /**
         * 设置或获取是否输出一条会使应用程序无法继续运行的消息.
         */
        public static set printError(value: boolean) {
            Logger.channels = BitUtil.setBit32(Logger.channels, 3, value);
        }
        public static get printError(): boolean {
            return BitUtil.getBit32(Logger.channels, 3);
        }

        /**
         * 输出一条会使应用程序无法继续运行的消息.
         * @param args 各种需要输出的数据.
         */
        public static error(...args): void {
            if (Logger.printError) {
                Logger.logging(LoggerChannel.ERROR, "ERROR", args);
            }
        }

        private static logging(channel: number, channelName: string, args: Array<any>) {
            var message: string = Logger.getTips(channelName) + " " + args.join(", ");
            switch (channel) {
                case LoggerChannel.LOG:
                    console.log(message);
                    break;
                case LoggerChannel.INFO:
                    console.info(message);
                    break;
                case LoggerChannel.WARN:
                    console.warn(message);
                    break;
                case LoggerChannel.ERROR:
                    console.error(message);
                    break;
            }
        }

        private static getTips(channelName: string): string {
            var result: string = "";
            if (Logger.includeChannels) {
                result += channelName + " ";
            }
            if (Logger.includeDate || Logger.includeTime) {
                var date: Date = new Date();
            }
            if (Logger.includeDate) {
                result += DateUtil.dateFormat(date, "YYYY-MM-DD") + " ";
            }
            if (Logger.includeTime) {
                result += DateUtil.dateFormat(date, "HH:NN:SS") + " ";
            }
            if (result.length > 0) {
                result = result.substr(0, result.length - 1);
                result = "[" + result + "]";
            }
            return result;
        }
    }

    /**
     * LoggerChannel 类定义了消息通道的枚举.
     * @author wizardc
     */
    export class LoggerChannel {
        /**
         * 提示不输出任何消息.
         */
        public static NONE: number = 0;

        /**
         * 提示用于应用程序调试的消息.
         */
        public static LOG: number = 1;

        /**
         * 提示对应用程序运行提供说明的消息.
         */
        public static INFO: number = 2;

        /**
         * 提示会对应用程序造成损害的消息.
         */
        public static WARN: number = 4;

        /**
         * 提示会使应用程序无法继续运行的消息.
         */
        public static ERROR: number = 8;

        /**
         * 提示输出所有消息.
         */
        public static ALL: number = LoggerChannel.LOG | LoggerChannel.INFO | LoggerChannel.WARN | LoggerChannel.ERROR;
    }
}

hammerc.Logger.channels = hammerc.LoggerChannel.ALL;
