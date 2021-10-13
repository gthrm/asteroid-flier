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
