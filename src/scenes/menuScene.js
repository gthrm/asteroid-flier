import {Button, Scene, track} from 'kontra';
import {state} from '../state';

export function createMenuScene() {
	const startButton = Button({
		text: {
			color: 'white',
			font: '30px Monospace',
			text: 'Start',
			anchor: {x: 0.5, y: 0.5},
		},
		anchor: {x: 0.5, y: 0.5},
		x: state.canvas.width / 2,
		y: state.canvas.height / 2,
		onUp() {
			state.scenes.active.hide();
			state.scenes.active = state.scenes.game;
			state.scenes.active.show();
		},
		render() {
			this.draw();

			if (this.focused || this.hovered) {
				this.textNode.color = 'red';
			} else {
				this.textNode.color = 'white';
			}
		},
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

