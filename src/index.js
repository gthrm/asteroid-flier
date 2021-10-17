import {
	init,
	GameLoop,
	initKeys,
	initPointer,
} from 'kontra';
import {state} from './state';
import {createAsteroid} from './sprites/asteroid';
import {createShip} from './sprites/ship';
import {createScoresText} from './sprites/scoresText';
import {createGameScene} from './scenes/createGameScene';
import './style.css';
import {createMenuScene} from './scenes/menuScene';

const MAX_CANVAS_SIZE = 900;
const ASTEROID_QUANTITY = 8;

const {canvas} = init();
initKeys();
initPointer();

canvas.height
  = window.innerHeight > MAX_CANVAS_SIZE ? MAX_CANVAS_SIZE : window.innerHeight - 20;
canvas.width
  = window.innerWidth > MAX_CANVAS_SIZE ? MAX_CANVAS_SIZE : window.innerWidth - 20;
state.canvas = canvas;

function createSprites() {
	const scoresText = createScoresText();
	state.sprites.push(scoresText);

	const ship = createShip();
	state.sprites.push(ship);

	for (let i = 0; i < ASTEROID_QUANTITY; i++) {
		const asteroid = createAsteroid();
		state.sprites.push(asteroid);
	}

	const gameScene = createGameScene();
	const menuScene = createMenuScene();
	state.scenes[gameScene.name] = gameScene;
	state.scenes[menuScene.name] = menuScene;

	state.scenes.active = state.scenes[menuScene.name];
	state.scenes[menuScene.name].show();
}

createSprites();

const loop = GameLoop({
	fps: 60,
	// Create the main game loop
	update() {
		// Update the game state
		state.scenes.active.update();
	},
	render() {
		// Render the game state
		state.scenes.active.render();
	},
});

loop.start(); // Start the game
