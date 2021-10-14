import {
	keyPressed,
	degToRad,
} from 'kontra';
import {createBullet} from '../sprites/bullet';
import {store} from '../store';

// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection#axis-aligned_bounding_box
export function collidesWithRotation(sprite, sprite2) {
	if (sprite && sprite2) {
		const dx = (sprite.x + sprite.radius) - (sprite2.x + sprite2.radius);
		const dy = (sprite.y + sprite.radius) - (sprite2.y + sprite2.radius);
		const distance = Math.sqrt((dx * dx) + (dy * dy));

		if (distance < sprite.radius + sprite2.radius) {
			// Collision detected!
			return true;
		}

		// No collision
		return false;
	}

	return null;
}

export function checkPhysics(sprite, canvas) {
	if (sprite.isAlive()) {
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
	}
}

export function checkGlobalCollision(sprite, sprites) {
	if (sprite.checkCollision) {
		sprites.forEach(s => {
			sprite.checkCollision(s);
		});
	}
}

export function usePlayerKeys(sprite) {
	// Rotate the ship left or right
	if (keyPressed('left') || keyPressed('a')) {
		sprite.rotation += degToRad(-4);
	} else if (keyPressed('right') || keyPressed('d')) {
		sprite.rotation += degToRad(4);
	}

	// Move the ship forward in the direction it's facing
	const cos = Math.cos(sprite.rotation);
	const sin = Math.sin(sprite.rotation);
	if (keyPressed('up') || keyPressed('w')) {
		sprite.ddx = cos * 0.05;
		sprite.ddy = sin * 0.05;
	} else {
		sprite.ddx = 0;
		sprite.ddy = 0;
	}

	if (keyPressed('space') && sprite.dt > 0.25) {
		console.log('shooting');
		sprite.dt = 0;
		const bullet = createBullet(sprite, cos, sin);
		store.sprites.push(bullet);
	}
}
