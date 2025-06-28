Louder.define("Game", ["exports", "UI", "GameObject"], function (exports, UI, GameObject) {
    Object.assign(exports, {
        gravity: 0.25,

        GameObject: GameObject,

        init: function () {
            setInterval(exports.util.spawnFruit, 1200);
        },

        util: {
            spawnFruit() {
                const x = Math.random() * (UI.canvas.width - 59) + 30;
                const y = UI.canvas.height + 30;
                GameObject._fruits.push(new GameObject.Fruit(x, y));
            },

            sliceFruit(fruit) {
                const leftHalf = new GameObject.FruitHalf(
                    fruit.x,
                    fruit.y,
                    fruit.radius,
                    fruit.color,
                    fruit.vx - 2,
                    fruit.vy - 2,
                    Math.PI / 2,
                    Math.PI * 1.5
                );
                const rightHalf = new GameObject.FruitHalf(
                    fruit.x,
                    fruit.y,
                    fruit.radius,
                    fruit.color,
                    fruit.vx + 2,
                    fruit.vy - 2,
                    Math.PI * 1.5,
                    Math.PI / 2 + 2 * Math.PI
                );
                GameObject._halves.push(leftHalf, rightHalf);
            },

            detectSlice(x, y) {
                GameObject._fruits.forEach((fruit, index) => {
                    const dx = fruit.x - x;
                    const dy = fruit.y - y;
                    if (!fruit.marked && Math.sqrt(dx * dx + dy * dy) < fruit.radius) {
                        fruit.marked = true;
                        UI.score++;
                        UI.scoreTable.textContent = `得分: ${UI.score}`;
                        exports.util.sliceFruit(fruit);
                        GameObject._fruits.splice(index, 1);
                    }
                });
            }
        }
    });
});
