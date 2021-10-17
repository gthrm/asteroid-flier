import {Sprite} from 'kontra';
import {checkGlobalCollision, checkPhysics, usePlayerKeys} from '../utils';
import {state} from '../state';

export function createShip() {
	return Sprite({
		dt: 0,
		x: state.canvas.width / 4,
		y: state.canvas.height / 4,
		type: 'ship',
		radius: 6,
		render() {
			if (this.isAlive()) {
				// Draw a right-facing triangle
				this.context.strokeStyle = 'rgb(10, 216, 37)';
				this.context.beginPath();
				this.context.moveTo(-3, -5);
				this.context.lineTo(12, 0);
				this.context.lineTo(-3, 5);
				this.context.closePath();
				this.context.stroke();
			}
		},
		update() {
			this.dt += 1 / 60;

			checkPhysics(this, state.canvas);
			checkGlobalCollision(this, state.sprites);
			usePlayerKeys(this);
			this.advance();

			// Set a max speed
			if (this.velocity.length() > 3) {
				this.dx *= 0.95;
				this.dy *= 0.95;
			}
		},
	});
}
