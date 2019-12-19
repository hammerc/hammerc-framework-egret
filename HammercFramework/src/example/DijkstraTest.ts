namespace example {
    export class DijkstraTest {
        public constructor() {
            let grid = new hammerc.DijkstraGrid();
            grid.addNode(["A", "B", "C", "D", "E", "F", "G", "H"]);

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
                console.log("找不到路径");
            } else {
                console.log("最小消耗：" + cost);
                let path = dijkstra.path;
                console.log("最短路径：" + path.join(", "));
            }
        }
    }
}
