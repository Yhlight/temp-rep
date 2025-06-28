Louder.define("UI", ["require", "exports", "Game"], function (require, exports, Game) {
    Object.assign(exports, {
        canvas: null,
        _ctx: null,
        score: 0,
        scoreTable: null,
        _trails: [],

        init: function () {
            exports.canvas = document.getElementById("canvas");
            exports.canvas.width = window.innerWidth;
            exports.canvas.height = window.innerHeight;

            exports._ctx = exports.canvas.getContext("2d");
            exports.scoreTable = document.getElementById("score");

            exports.canvas.addEventListener("mousemove", e => {
                exports._trails.push({ x: e.clientX, y: e.clientY, time: Date.now() });
                Game.util.detectSlice(e.clientX, e.clientY);
            });

            window.addEventListener("resize", () => {
                exports.canvas.width = window.innerWidth;
                exports.canvas.height = window.innerHeight;
            });

            exports.util.animate();
        },

        util: {
            drawTrails() {
                if (exports._trails.length < 2) return;
                exports._ctx.beginPath();
                for (let i = 0; i < exports._trails.length; i++) {
                    if (i === 0) {
                        exports._ctx.moveTo(exports._trails[i].x, exports._trails[i].y);
                    } else {
                        exports._ctx.lineTo(exports._trails[i].x, exports._trails[i].y);
                    }
                }
                exports._ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
                exports._ctx.lineWidth = 6;
                exports._ctx.lineCap = "round";
                exports._ctx.lineJoin = "round";
                exports._ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
                exports._ctx.shadowBlur = 12;
                exports._ctx.stroke();
                exports._ctx.shadowBlur = 0;
            },

            animate() {
                exports._ctx.clearRect(0, 0, exports.canvas.width, exports.canvas.height);
                for (let i = Game.GameObject._fruits.length - 1; i >= 0; i--) {
                    const fruit = Game.GameObject._fruits[i];
                    if (fruit.y > exports.canvas.height + 100) {
                        Game.GameObject._fruits.splice(i, 1);
                        continue;
                    }
                    fruit.update();
                    fruit.draw();
                }

                for (let i = Game.GameObject._halves.length - 1; i >= 0; i--) {
                    const half = Game.GameObject._halves[i];
                    if (half.alpha <= 0) {
                        Game.GameObject._halves.splice(i, 1);
                        continue;
                    }
                    half.update();
                    half.draw();
                }

                const now = Date.now();
                exports._trails = exports._trails.filter(p => now - p.time < 300);
                exports.util.drawTrails();
                requestAnimationFrame(exports.util.animate);
            }
        }
    });
});
