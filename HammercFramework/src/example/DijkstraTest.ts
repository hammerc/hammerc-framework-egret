namespace example {
    export class DijkstraTest {
        public constructor() {
            {
                let grid = new hammerc.DijkstraMap();

                grid.setNodeLink("A", "B", 5);
                grid.setNodeLink("A", "C", 1);

                grid.setNodeLink("B", "E", 10);

                grid.setNodeLink("C", "D", 5);
                grid.setNodeLink("C", "F", 6);

                grid.setNodeLink("D", "E", 3);

                grid.setNodeLink("E", "H", 3);

                grid.setNodeLink("F", "G", 2);

                grid.setNodeLink("G", "H", 10);

                grid.setStartNode("A");
                grid.setEndNode("H");

                let dijkstra = new hammerc.Dijkstra();
                let cost = dijkstra.findPath(grid);
                if (cost == -1) {
                    console.log("图 1 找不到路径");
                } else {
                    console.log("图 1 最小消耗：" + cost);
                    let path = dijkstra.path;
                    console.log("图 1 最短路径：" + path.join(", "));
                }
            }

            {
                let grid = new hammerc.DijkstraMap();

                grid.setNodeLink("A", "B", 1);
                grid.setNodeLink("B", "C", 1);
                grid.setNodeLink("C", "A", 1);

                grid.setNodeLink("D", "E", 1);
                grid.setNodeLink("E", "F", 1);
                grid.setNodeLink("F", "D", 1);

                let dijkstra = new hammerc.Dijkstra();
                let cost: number;

                grid.setStartNode("A");
                grid.setEndNode("C");
                cost = dijkstra.findPath(grid);
                if (cost == -1) {
                    console.log("图 2 找不到路径");
                } else {
                    console.log("图 2 最小消耗：" + cost);
                    let path = dijkstra.path;
                    console.log("图 2 最短路径：" + path.join(", "));
                }

                grid.setStartNode("D");
                grid.setEndNode("F");
                cost = dijkstra.findPath(grid);
                if (cost == -1) {
                    console.log("图 2 找不到路径");
                } else {
                    console.log("图 2 最小消耗：" + cost);
                    let path = dijkstra.path;
                    console.log("图 2 最短路径：" + path.join(", "));
                }

                grid.setStartNode("A");
                grid.setEndNode("D");
                cost = dijkstra.findPath(grid);
                if (cost == -1) {
                    console.log("图 2 找不到路径");
                } else {
                    console.log("图 2 最小消耗：" + cost);
                    let path = dijkstra.path;
                    console.log("图 2 最短路径：" + path.join(", "));
                }
            }
        }
    }
}
