import {Scene} from 'kontra';
import {createAsteroid} from '../sprites/asteroid';
import {createScoresText} from '../sprites/scoresText';
import {createShip} from '../sprites/ship';
import {createTextButton} from '../sprites/textButton';
import {state} from '../state';

const ASTEROID_QUANTITY = 8;

function createSprites() {
	const scoresText = createScoresText();
	state.sprites.push(scoresText);

	const ship = createShip();
	state.sprites.push(ship);

	const pushButton = createTextButton({
		x: state.canvas.width - 100,
		y: state.canvas.height - 100,
		onUp() {
			console.log('press');
		},
	});
	state.sprites.push(pushButton);

	for (let i = 0; i < ASTEROID_QUANTITY; i++) {
		const asteroid = createAsteroid();
		state.sprites.push(asteroid);
	}
}

export function createGameScene() {
	createSprites();
	const gameScene = Scene({
		id: 'game',
		update() {
			state.sprites.forEach(sprite => sprite.update());
		},
		render() {
			state.sprites.forEach(sprite => sprite.render());
		},
	});
	state.sprites.forEach(sprite => gameScene.addChild(sprite));
	return gameScene;
}
