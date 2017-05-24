namespace example {
    export class DictionaryTest {
        public constructor() {
            //普通使用测试
            var map1: hammerc.Dictionary<number, string> = new hammerc.Dictionary<number, string>();
            map1.add(100, "I am 100!");
            map1.add(101, "I am 101!");
            map1.add(102, "I am 102!");

            map1.forEach((item: string, key: number, map: hammerc.Dictionary<number, string>) => {
                hammerc.Logger.log(item, key);
            }, this);

            //HashObject 使用测试
            var map2: hammerc.Dictionary<TestObj, number> = new hammerc.Dictionary<TestObj, number>();
            map2.add(new TestObj("Li Lei", 27), 123);
            map2.add(new TestObj("Han Meimei", 26), 456);

            map2.forEach((item: number, key: TestObj, map: hammerc.Dictionary<TestObj, number>) => {
                hammerc.Logger.log(item, key.name, key.age);
            }, this);

            //API 测试
            var map3: hammerc.Dictionary<number, string> = new hammerc.Dictionary<number, string>();
            map3.add(100, "I am 100!");
            map3.add(101, "I am 101!");
            map3.add(102, "I am 102!");

            hammerc.Logger.log(map3.toString());
            hammerc.Logger.log(map3.size);
            hammerc.Logger.log(map3.has(99));
            hammerc.Logger.log(map3.has(100));

            hammerc.Logger.log(map3.remove(101));
            hammerc.Logger.log(map3.toString());
            hammerc.Logger.log(map3.size);
            
            map3.clear();
            hammerc.Logger.log(map3.toString());
        }
    }

    export class TestObj extends egret.HashObject {
        public name: string;
        public age: number;

        public constructor(name: string, age: number) {
            super();
            this.name = name;
            this.age = age;
        }
    }
}
