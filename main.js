const {
  init,
  Sprite,
  GameLoop,
  initKeys,
  keyPressed,
  degToRad,
  collides,
  Text
} = kontra;

const { canvas } = init();

initKeys();

const sprites = [];
let scores = 0;
const scoresText = Text({
  text: "0",
  font: "32px system-ui",
  color: "white",
  x: 30,
  y: 30,
  anchor: { x: 0.5, y: 0.5 },
  textAlign: "center",
  update() {
    this.text = `${scores}`;
  },
});

const ship = Sprite({
  dt: 0,
  x: canvas.width / 4,
  y: canvas.height / 4,
  radius: 6, // we'll use this later for collision detection
  render() {
    // draw a right-facing triangle
    this.context.strokeStyle = "rgb(10, 216, 37)";
    this.context.beginPath();
    this.context.moveTo(-3, -5);
    this.context.lineTo(12, 0);
    this.context.lineTo(-3, 5);
    this.context.closePath();
    this.context.stroke();
  },
  update() {
    usePlayerKeys.call(this);
    shooting.call(this);
  },
});
sprites.push(ship);

function createAsteroid(
  size = 30,
  isChild = false,
  x = canvas.width / 2,
  y = canvas.height / 2
) {
  const asteroid = Sprite({
    type: "asteroid", // we'll use this for collision detection
    x,
    y,
    dx: Math.random() * 4 - 2,
    dy: Math.random() * 4 - 2,
    width: size * 1.333,
    height: size * 1.333,
    radius: size,
    anchor: { x: 0.5, y: 0.5 },
    isChild,
    render() {
      this.context.strokeStyle = "white";
      this.context.beginPath(); // start drawing a shape
      this.context.arc(
        this.width / 2,
        this.height / 2,
        this.radius,
        0,
        Math.PI * 2
      );
      this.context.stroke(); // outline the circle
    },
    checkCollision(entity) {
      if (
        entity.type === "bullet" &&
        entity.isAlive() &&
        collides(this, entity)
      ) {
        console.log("collides");
        if (!this.isChild) {
          Array(4)
            .fill(true)
            .forEach(() => createAsteroid(size / 2, true, this.x, this.y));
        }
        this.ttl = 0;
        entity.ttl = 0;
        scores += 1;
      }
    },
  });
  sprites.push(asteroid);
}

function createBullet(cos, sin) {
  // sprites = sprites.filter(sprite => sprite.isAlive());
  return Sprite({
    type: "bullet",
    color: "white",
    // start the bullet on the ship at the end of the triangle
    x: this.x + cos * 12,
    y: this.y + sin * 12,
    // move the bullet slightly faster than the ship
    dx: this.dx + cos * 5,
    dy: this.dy + sin * 5,
    // live only 60 frames
    ttl: 60,
    // bullets are small
    radius: 2,
    width: 2,
    height: 2,
  });
}

function shooting() {
  // allow the player to fire no more than 1 bullet every 1/4 second
  const cos = Math.cos(this.rotation);
  const sin = Math.sin(this.rotation);
  this.dt = this.dt + 1 / 60;

  if (keyPressed("space") && this.dt > 0.25) {
    this.dt = 0;
    const bullet = createBullet.call(this, cos, sin);
    sprites.push(bullet);
  }
}

function usePlayerKeys() {
  // rotate the ship left or right
  if (keyPressed("left")) {
    this.rotation += degToRad(-4);
  } else if (keyPressed("right")) {
    this.rotation += degToRad(4);
  }
  // move the ship forward in the direction it's facing
  const cos = Math.cos(this.rotation);
  const sin = Math.sin(this.rotation);
  if (keyPressed("up")) {
    this.ddx = cos * 0.05;
    this.ddy = sin * 0.05;
  } else {
    this.ddx = 0;
    this.ddy = 0;
  }
  this.advance();

  // set a max speed
  if (this.velocity.length() > 5) {
    this.dx *= 0.95;
    this.dy *= 0.95;
  }
}

for (let i = 0; i < 1; i++) {
  createAsteroid();
}

const loop = GameLoop({
  // create the main game loop
  update: function () {
    // update the game state
    scoresText.update();
    sprites.forEach((sprite) => {
      if (sprite.isAlive()) {
        sprite.update();
        if (sprite.x > canvas.width) {
          sprite.x = -sprite.width;
        }

        if (sprite.x < -sprite.width) {
          sprite.x = canvas.width;
        }

        if (sprite.y > canvas.height) {
          sprite.y = -sprite.height;
        }

        if (sprite.y < -sprite.height) {
          sprite.y = canvas.height;
        }

        if (sprite.checkCollision) {
          sprites.forEach((s) => {
            sprite.checkCollision(s);
          });
        }
      }
    });
  },
  render: function () {
    // render the game state
    sprites.forEach((sprite) => sprite.isAlive() && sprite.render());
    scoresText.render();
  },
});

loop.start(); // start the game
