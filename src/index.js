import {
	init,
	GameLoop,
	initKeys,
	initPointer,
} from 'kontra';
import {state} from './state';
import {createScenes} from './scenes';
import './style.css';

const MAX_CANVAS_SIZE = 900;

const {canvas} = init();
initKeys();
initPointer();

canvas.height
  = window.innerHeight > MAX_CANVAS_SIZE ? MAX_CANVAS_SIZE : window.innerHeight - 20;
canvas.width
  = window.innerWidth > MAX_CANVAS_SIZE ? MAX_CANVAS_SIZE : window.innerWidth - 20;
state.canvas = canvas;

createScenes();

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
