﻿// =================================================================================================
//
//    Hammerc Framework
//    Copyright 2016 hammerc.org All Rights Reserved.
//
//    See LICENSE for full license information.
//
// =================================================================================================

namespace hammerc {
    /**
     * Contorller 类是整个 MVC 框架中的控制者, 它是一个单例类, 为模块或视图广播命令 ICommand 对象接收并处理命令提供支持.
     * @author wizardc
     */
    export class Controller {
        private static _instance: Controller;

        /**
         * 获取本类的唯一实例.
         * @return 本类的唯一实例.
         */
        public static get instance(): Controller {
            return Controller._instance || (Controller._instance = new Controller());
        }

        private _commandMap: { [k: string]: any[] };

        /**
         * 本类为单例类不能实例化.
         */
        private constructor() {
            this._commandMap = {};
        }

        /**
         * 注册一个命令类对象映射到对应的消息名称上.
         * @param notificationName 消息名称.
         * @param commandClass 要被映射到该消息名称的类.
         */
        public registerCommand(notificationName: string, commandClass: any): void {
            if (notificationName != null && notificationName != "" && commandClass != null) {
                if (!this.hasCommand(notificationName)) {
                    this._commandMap[notificationName] = [];
                }
                let list = this._commandMap[notificationName];
                if (list.indexOf(commandClass) == -1) {
                    list.push(commandClass);
                }
            }
        }

        /**
         * 判断一个消息名称是否正在被侦听.
         * @param notificationName 消息名称.
         */
        public hasCommand(notificationName: string): boolean {
            return this._commandMap.hasOwnProperty(notificationName);
        }

        /**
         * 移除一个消息名称的所有侦听.
         * @param notificationName 消息名称.
         */
        public removeCommand(notificationName: string): void {
            if (notificationName != null && notificationName != "") {
                if (this.hasCommand(notificationName)) {
                    delete this._commandMap[notificationName];
                }
            }
        }

        /**
         * 执行一个命令.
         * @param notificationName 消息的名称.
         * @param args 附带的数据.
         */
        public executeCommand(notificationName: string, ...args): void {
            if (this.hasCommand(notificationName)) {
                let list = this._commandMap[notificationName];
                for (let key in list) {
                    let commandClass = list[key];
                    let instance: ICommand = new commandClass();
                    if (instance != null) {
                        instance.execute(notificationName, ...args);
                    }
                }
            }
        }
    }
}
