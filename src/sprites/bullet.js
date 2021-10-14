import {Sprite} from 'kontra';

export function createBullet(sprite, cos, sin) {
	// Sprites = sprites.filter(sprite => sprite.isAlive());
	return Sprite({
		type: 'bullet',
		color: 'white',
		// Start the bullet on the ship at the end of the triangle
		x: sprite.x + (cos * 12),
		y: sprite.y + (sin * 12),
		// Move the bullet slightly faster than the ship
		dx: sprite.dx + (cos * 5),
		dy: sprite.dy + (sin * 5),
		// Live only 60 frames
		ttl: 60,
		// Bullets are small
		radius: 2,
		width: 2,
		height: 2,
		render() {
			if (this.isAlive()) {
				this.draw();
			}
		},
		destroy() {
			this.ttl = 0;
		},
	});
}
