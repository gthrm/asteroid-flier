
import {collides, Sprite} from 'kontra';
const ASTEROID_SIZE = 8;
const ASTEROID_LIVES = 3;
import {store} from '../store';
import {checkGlobalCollision, checkPhysics, collidesWithRotation} from '../utils';

export function createAsteroid(
	size = ASTEROID_SIZE,
	live = ASTEROID_LIVES,
	x = store.canvas.width / 2,
	y = store.canvas.height / 2,
) {
	return Sprite({
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
			if (this.isAlive()) {
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
			}
		},
		destroy() {
			this.live--;
			if (this.live > 0) {
				Array(4)
					.fill(true)
					.forEach(() => {
						const asteroid = createAsteroid(size, this.live, this.x, this.y);
						store.sprites.push(asteroid);
					});
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
				store.scores += 1;
			}

			if (entity.type === 'ship' && collidesWithRotation(this, entity)) {
				this.destroy();
				this.dx = -(this.dx + entity.dx);
				this.dy = -(this.dy + entity.dy);
				entity.dx = -(entity.dx + this.dx);
				entity.dy = -(entity.dy + this.dy);
				store.lives--;
			}
		},
		update() {
			if (this.isAlive()) {
				this.advance();
				checkPhysics(this, store.canvas);
				checkGlobalCollision(this, store.sprites);
			}
		},
	});
}
