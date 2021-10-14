import {
	init,
	GameLoop,
	initKeys,
} from 'kontra';
import {store} from './store';
import {createAsteroid} from './sprites/asteroid';
import {createShip} from './sprites/ship';
import {createScoresText} from './sprites/scoresText';
import './style.css';

const MAX_CANVAS_SIZE = 900;
const ASTEROID_QUANTITY = 5;

const {canvas} = init();
initKeys();

canvas.height
  = window.innerHeight > MAX_CANVAS_SIZE ? MAX_CANVAS_SIZE : window.innerHeight;
canvas.width
  = window.innerWidth > MAX_CANVAS_SIZE ? MAX_CANVAS_SIZE : window.innerWidth;
store.canvas = canvas;

const loop = GameLoop({
	// Create the main game loop
	update() {
		// Update the game state
		store.sprites.forEach(sprite => sprite.update());
	},
	render() {
		// Render the game state
		store.sprites.forEach(sprite => sprite.render());
	},
});

function createSprites() {
	const scoresText = createScoresText();
	store.sprites.push(scoresText);

	const ship = createShip();
	store.sprites.push(ship);

	for (let i = 0; i < ASTEROID_QUANTITY; i++) {
		const asteroid = createAsteroid();
		store.sprites.push(asteroid);
	}
}

createSprites();
loop.start(); // Start the game
