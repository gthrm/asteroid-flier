import {Scene, track} from 'kontra';
import {createTextButton} from '../sprites/textButton';
import {state} from '../state';

export function createMenuScene() {
	const startButton = createTextButton({
		x: state.canvas.width / 2,
		y: state.canvas.height / 2,
		onUp() {
			console.log('click');
			state.scenes.active.hide();
			state.scenes.active = state.scenes.game;
			state.scenes.active.show();
		},
		text: 'Start',
		size: 8,
	});
	track(startButton);

	const menuScene = Scene({
		id: 'menu',
		onShow() {
			startButton.focus();
		},
		focus() {
			startButton.focus();
		},
	});

	menuScene.addChild(startButton);
	return menuScene;
}
