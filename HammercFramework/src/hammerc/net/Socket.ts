// =================================================================================================
//
//    Hammerc Framework
//    Copyright 2018 hammerc.org All Rights Reserved.
//
//    See LICENSE for full license information.
//
// =================================================================================================

namespace hammerc {
    /**
     * Socket 类定义了套接字对象.
     * @author wizardc
     */
    export class Socket extends egret.EventDispatcher {
        /**
         * 连接成功事件.
         */
        public static OPEN: string = "open";

        /**
         * 消息到达事件.
         */
        public static MESSAGE: string = "message";

        /**
         * 连接关闭事件.
         */
        public static CLOSE: string = "close";

        /**
         * 连接错误事件.
         */
        public static ERROR: string = "error";

        private _webSocket: WebSocket;
        private _endian: string = egret.Endian.BIG_ENDIAN;
        private _input: egret.ByteArray;
        private _output: egret.ByteArray;

        private _connected: boolean = false;

        private _cacheInput: boolean = true;
        private _addInputPosition: number = 0;

        /**
         * 创建一个 Socket 对象.
         * @param host 地址.
         * @param port 端口.
         */
        public constructor(host?: string, port?: number) {
            super();
            if (host && port > 0 && port < 65535) {
                this.connect(host, port);
            }
        }

        /**
         * 套接字字节码顺序.
         */
        public set endian(value: string) {
            this._endian = value;
        }
        public get endian(): string {
            return this._endian;
        }

        /**
         * 获取输入流.
         */
        public get input(): egret.ByteArray {
            return this._input;
        }

        /**
         * 获取输出流.
         */
        public get output(): egret.ByteArray {
            return this._output;
        }

        /**
         * 当前是否已经连接.
         */
        public get connected(): boolean {
            return this._connected;
        }

        /**
         * 是否缓存服务端发送的数据到输入流中.
         */
        public set cacheInput(value: boolean) {
            this._cacheInput = value;
        }
        public get cacheInput(): boolean {
            return this._cacheInput;
        }

        /**
         * 连接服务端.
         * @param host 地址.
         * @param port 端口.
         */
        public connect(host: string, port: number): void {
            let url;
            if (window.location.protocol == "https:") {
                url = "wss://" + host + ":" + port;
            } else {
                url = "ws://" + host + ":" + port;
            }
            this.connectByUrl(url);
        }

        /**
         * 连接服务端.
         * @param url 连接地址.
         */
        public connectByUrl(url: string): void {
            if (this._webSocket) {
                this.close();
            }
            this._webSocket = new WebSocket(url);
            this._webSocket.binaryType = "arraybuffer";
            this._input = new egret.ByteArray();
            this._input.endian = this.endian;
            this._output = new egret.ByteArray();
            this._output.endian = this.endian;
            this._addInputPosition = 0;
            this._webSocket.onopen = (event: Event) => {
                this.onOpen(event);
            };
            this._webSocket.onmessage = (messageEvent: MessageEvent) => {
                this.onMessage(messageEvent);
            };
            this._webSocket.onclose = (event: CloseEvent) => {
                this.onClose(event);
            };
            this._webSocket.onerror = (event: Event) => {
                this.onError(event);
            };
        }

        private onOpen(event: Event): void {
            this._connected = true;
            this.dispatchEventWith(Socket.OPEN, false, event);
        }

        private onMessage(messageEvent: MessageEvent): void {
            if (!messageEvent || !messageEvent.data) {
                return;
            }
            let data = messageEvent.data;
            //不缓存接收的数据则直接抛出数据
            if (!this._cacheInput && data) {
                this.dispatchEventWith(Socket.MESSAGE, false, data)
                return;
            }
            //如果输入流全部被读取完毕则清空
            if (this._input.length > 0 && this._input.bytesAvailable < 1) {
                this._input.clear();
                this._addInputPosition = 0;
            }
            //获取当前的指针位置
            let pre = this._input.position;
            if (!this._addInputPosition) {
                this._addInputPosition = 0;
            }
            //指向添加数据的指针位置
            this._input.position = this._addInputPosition;
            if (data) {
                //添加数据
                if ((typeof data == "string")) {
                    this._input.writeUTFBytes(data);
                } else {
                    this._input._writeUint8Array(new Uint8Array(data));
                }
                //记录下一次添加数据的指针位置
                this._addInputPosition = this._input.position;
                //还原到当前的指针位置
                this._input.position = pre;
            }
            this.dispatchEventWith(Socket.MESSAGE, false, data);
        }

        private onClose(event: CloseEvent): void {
            this._connected = false;
            this.dispatchEventWith(Socket.CLOSE, false, event);
        }

        private onError(event: Event): void {
            this.dispatchEventWith(Socket.ERROR, false, event);
        }

        /**
         * 发送数据到服务器.
         * @param data 数据.
         */
        public send(data: string | ArrayBuffer): void {
            this._webSocket.send(data);
        }

        /**
         * 将输出流中的数据发送到服务器.
         */
        public flush(): void {
            if (this._output && this._output.length > 0) {
                let error;
                try {
                    if (this._webSocket) {
                        this._webSocket.send(this._output.buffer);
                    }
                } catch (e) {
                    error = e;
                }
                this._output.endian = this.endian;
                this._output.clear();
                if (error) {
                    this.dispatchEventWith(Socket.ERROR, false, error);
                }
            }
        }

        /**
         * 关闭连接.
         */
        public close(): void {
            if (this._webSocket) {
                this.cleanSocket();
            }
        }

        private cleanSocket() {
            this._webSocket.close();
            this._connected = false;
            this._webSocket.onopen = null;
            this._webSocket.onmessage = null;
            this._webSocket.onclose = null;
            this._webSocket.onerror = null;
            this._webSocket = null;
        }
    }
}
