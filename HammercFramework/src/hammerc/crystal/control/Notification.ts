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
     * <code>Notification</code> 类实现了一个最简单的消息对象.
     * @author wizardc
     */
    export class Notification implements INotification {
        private static _pool: Notification[];
        
        /**
         * 从对象池中取出一个消息对象.
         * @param name 消息名称.
         * @param type 消息的类型.
         * @param body 消息的数据.
         * @return 消息对象.
         */
        public static fromPool(name: string, type?: string, body?: any): Notification {
            if (Notification._pool.length > 0) {
                return Notification._pool.pop().reset(name, type, body);
            } else {
                return new Notification(name, type, body);
            }
        }
        
        /**
         * 回收一个消息对象.
         * @param notification 消息对象.
         */
        public static toPool(notification: INotification): void {
            if (notification instanceof Notification) {
                (<Notification> notification).clear();
                Notification._pool[Notification._pool.length] = notification;
            }
        }
        
        private _name: string;
        private _type: string;
        private _body: any;
        
        /**
         * 创建一个 <code>Notification</code> 对象.
         * @param name 消息名称.
         * @param type 消息的类型.
         * @param body 消息的数据.
         */
        public constructor(name: string, type?: string, body?: any) {
            this._name = name;
            this._type = type;
            this._body = body;
        }
        
        /**
         * 获取消息名称.
         */
        public get name(): string {
            return this._name;
        }
        
        /**
         * 设置或获取消息的类型.
         */
        public set type(value: string) {
            this._type = value;
        }
        public get type(): string {
            return this._type;
        }
        
        /**
         * 设置或获取消息的数据.
         */
        public set body(value: any) {
            this._body = value;
        }
        public get body(): any {
            return this._body;
        }
        
        /**
         * 重置消息的数据.
         * @param name 消息名称.
         * @param type 消息的类型.
         * @param body 消息的数据.
         * @return 消息对象.
         */
        public reset(name: string, type?: string, body?: any): Notification {
            this._name = name;
            this._type = type;
            this._body = body;
            return this;
        }
        
        /**
         * 清除消息的数据.
         */
        public clear(): void {
            this._name = null;
            this._type = null;
            this._body = null;
        }
        
        /**
         * 获取本对象的字符串描述.
         * @return 本对象的字符串描述.
         */
        public toString(): string {
            return "Notification[name=\"" + this._name + "\", type=\"" + this._type + "\", body=\"" + this._body + "\"]";
        }
    }
}
