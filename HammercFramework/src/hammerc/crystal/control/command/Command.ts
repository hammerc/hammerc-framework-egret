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
     * <code>Command</code> 类实现了一个简单的命令类.
     * @author wizardc
     */
    export abstract class Command extends Notifier implements ICommand {
        /**
         * 代理 MVC 中所有处理方法的外观对象.
         */
        protected _facade: Facade = Facade.getInstance();

        /**
         * <code>Command</code> 类为抽象类, 不能被实例化.
         */
        public constructor() {
            super();
        }

        /**
         * 执行具体命令的方法.
         * @param notification 对应的消息对象.
         */
        public abstract execute(notification: INotification): void;
    }
}
