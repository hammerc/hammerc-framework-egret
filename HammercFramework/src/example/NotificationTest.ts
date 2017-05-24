namespace example {
    export class NotificationTest {
        private _num: number = 0;

        public constructor() {

            var nc1: hammerc.NotificationCenter<string> = new hammerc.NotificationCenter<string>();
            nc1.regiestMessage("msg1", this.messageHandler, this);
            nc1.sendMessage("msg1");
            nc1.sendMessage("msg1");

            var nc2: hammerc.NotificationCenter<number> = new hammerc.NotificationCenter<number>();
            nc2.regiestMessage(10, (msgType: number, info: string) => {
                hammerc.Logger.log(msgType, info, this._num++);
            });
            nc2.sendMessage(10, "haha");
            nc2.sendMessage(10, "heihei");

            var nc3: hammerc.NotificationCenter<EnumTest> = new hammerc.NotificationCenter<EnumTest>();
            nc3.regiestMessage(EnumTest.HanMeimei, (msgType: EnumTest, info: string, num: number) => {
                hammerc.Logger.log(msgType, info, num, this._num++);
            });
            nc3.sendMessage(EnumTest.HanMeimei, "haha2", 123);
            nc3.sendMessage(EnumTest.HanMeimei, "heihei2", 123.456);
        }

        private messageHandler(msgType: string): void {
            hammerc.Logger.log(msgType, this._num++);
        }
    }

    export enum EnumTest {
        LiLei,
        HanMeimei,
    }
}
