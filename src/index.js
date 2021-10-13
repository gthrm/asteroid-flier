import {
	init,
	Sprite,
	GameLoop,
	initKeys,
	keyPressed,
	degToRad,
	collides,
} from 'kontra';
import {printText} from './font';
import './style.css';
import {collidesWithRotation} from './utils';

const MAX_CANVAS_SIZE = 900;
const ASTEROID_QUANTITY = 5;
const ASTEROID_SIZE = 8;
const ASTEROID_LIVES = 3;

const {canvas} = init();

canvas.height = window.innerHeight > MAX_CANVAS_SIZE ? MAX_CANVAS_SIZE : window.innerHeight;
canvas.width = window.innerWidth > MAX_CANVAS_SIZE ? MAX_CANVAS_SIZE : window.innerWidth;

initKeys();

const sprites = [];
let scores = 0;
let lives = 3;

const scoresText = Sprite({
	dt: 0,
	x: 30,
	y: 20,
	render() {
		printText(this.context, this.text, 4);
	},
	update() {
		if (this.text !== `${scores}`) {
			this.text = `Score ${scores}  Lives ${lives}`;
		}
	},
});

const ship = Sprite({
	dt: 0,
	x: canvas.width / 4,
	y: canvas.height / 4,
	type: 'ship',
	radius: 6,
	render() {
		// Draw a right-facing triangle
		this.context.strokeStyle = 'rgb(10, 216, 37)';
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
	size = ASTEROID_SIZE,
	live = ASTEROID_LIVES,
	x = canvas.width / 2,
	y = canvas.height / 2,
) {
	const asteroid = Sprite({
		type: 'asteroid', // We'll use this for collision detection
		x,
		y,
		dx: (Math.random() * 4) - 2,
		dy: (Math.random() * 4) - 2,
		width: size * live * 1.333,
		height: size * live * 1.333,
		radius: size * live,
		live,
		render() {
			// this.context.fillStyle = 'red';
			// this.context.fillRect(0, 0, this.width, this.height);
			this.context.strokeStyle = 'white';
			this.context.beginPath(); // Start drawing a shape
			this.context.arc(
				this.width / 2,
				this.height / 2,
				this.radius,
				0,
				Math.PI * 2,
			);
			this.context.stroke(); // Outline the circle
		},
		destroy() {
			this.live--;
			if (this.live) {
				Array(4)
					.fill(true)
					.forEach(() => createAsteroid(size, this.live, this.x, this.y));
			}

			this.ttl = 0;
		},
		checkCollision(entity) {
			if (
				entity.type === 'bullet'
        && entity.isAlive()
        && collides(this, entity)
			) {
				this.destroy();
				entity.destroy();
				scores += 1;
			}

			if (entity.type === 'ship' && collidesWithRotation(this, entity)) {
				this.destroy();
				this.dx = -this.dx;
				this.dy = -this.dy;
				entity.dx = -entity.dx;
				entity.dy = -entity.dy;
				lives--;
			}
		},
	});
	sprites.push(asteroid);
}

function createBullet(cos, sin) {
	// Sprites = sprites.filter(sprite => sprite.isAlive());
	return Sprite({
		type: 'bullet',
		color: 'white',
		// Start the bullet on the ship at the end of the triangle
		x: this.x + (cos * 12),
		y: this.y + (sin * 12),
		// Move the bullet slightly faster than the ship
		dx: this.dx + (cos * 5),
		dy: this.dy + (sin * 5),
		// Live only 60 frames
		ttl: 60,
		// Bullets are small
		radius: 2,
		width: 2,
		height: 2,
		destroy() {
			this.ttl = 0;
		},
	});
}

function shooting() {
	// Allow the player to fire no more than 1 bullet every 1/4 second
	const cos = Math.cos(this.rotation);
	const sin = Math.sin(this.rotation);
	this.dt += 1 / 60;

	if (keyPressed('space') && this.dt > 0.25) {
		this.dt = 0;
		const bullet = createBullet.call(this, cos, sin);
		sprites.push(bullet);
	}
}

function usePlayerKeys() {
	// Rotate the ship left or right
	if (keyPressed('left')) {
		this.rotation += degToRad(-4);
	} else if (keyPressed('right')) {
		this.rotation += degToRad(4);
	}

	// Move the ship forward in the direction it's facing
	const cos = Math.cos(this.rotation);
	const sin = Math.sin(this.rotation);
	if (keyPressed('up')) {
		this.ddx = cos * 0.05;
		this.ddy = sin * 0.05;
	} else {
		this.ddx = 0;
		this.ddy = 0;
	}

	this.advance();

	// Set a max speed
	if (this.velocity.length() > 5) {
		this.dx *= 0.95;
		this.dy *= 0.95;
	}
}

for (let i = 0; i < ASTEROID_QUANTITY; i++) {
	createAsteroid();
}

const loop = GameLoop({
	// Create the main game loop
	update() {
		// Update the game state
		scoresText.update();
		sprites.forEach(sprite => {
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
					sprites.forEach(s => {
						sprite.checkCollision(s);
					});
				}
			}
		});
	},
	render() {
		// Render the game state
		sprites.forEach(sprite => sprite.isAlive() && sprite.render());
		scoresText.render();
	},
});

loop.start(); // Start the game
