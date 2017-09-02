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
     * Command 类实现了一个简单的命令类.
     * @author wizardc
     */
    export abstract class Command extends Notifier implements ICommand {
        /**
         * 代理 MVC 中所有处理方法的外观对象.
         */
        protected _facade: Facade = Facade.instance;

        /**
         * Command 类为抽象类, 不能被实例化.
         */
        public constructor() {
            super();
        }

        /**
         * 执行具体命令的方法.
         * @param notificationName 消息的名称.
         * @param args 附带的数据.
         */
        public abstract execute(notificationName: string, ...args): void;
    }
}
