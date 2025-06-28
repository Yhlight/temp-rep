Louder.define("GameObject", ["exports", "UI", "Game"], function (exports, UI, Game) {
    Object.assign(exports, {
        _fruits: [],
        _halves: [],

        Fruit: class {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.radius = 30;
                this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
                this.vx = Math.random() * 4 - 2;
                const vyMin = Math.sqrt(UI.canvas.height / 12);
                this.vy = -vyMin - Math.random() * 5;
                this.marked = false;
            }

            update() {
                this.x += this.vx;
                this.vy += Game.gravity;
                this.y += this.vy;
            }

            draw() {
                UI._ctx.beginPath();
                UI._ctx.fillStyle = this.color;
                UI._ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                UI._ctx.fill();
            }
        },

        FruitHalf: class {
            constructor(x, y, radius, color, vx, vy, startAngle, endAngle) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.color = color;
                this.vx = vx;
                this.vy = vy;
                this.startAngle = startAngle;
                this.endAngle = endAngle;
                this.rotation = 0;
                this.rotationSpeed = (Math.random() - 0.5) * 0.2;
                this.alpha = 1;
            }

            update() {
                this.x += this.vx;
                this.vy += Game.gravity;
                this.y += this.vy;
                this.rotation += this.rotationSpeed;
                this.alpha -= 0.01;
            }

            draw() {
                UI._ctx.save();
                UI._ctx.translate(this.x, this.y);
                UI._ctx.rotate(this.rotation);
                UI._ctx.globalAlpha = this.alpha;
                UI._ctx.beginPath();
                UI._ctx.fillStyle = this.color;
                UI._ctx.moveTo(0, 0);
                UI._ctx.arc(0, 0, this.radius, this.startAngle, this.endAngle);
                UI._ctx.closePath();
                UI._ctx.fill();
                UI._ctx.restore();
                UI._ctx.globalAlpha = 1;
            }
        },
    });
});
