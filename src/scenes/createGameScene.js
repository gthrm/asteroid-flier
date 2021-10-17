import {Scene} from 'kontra';
import {state} from '../state';

export function createGameScene() {
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
