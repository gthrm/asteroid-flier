import {Button} from 'kontra';
import {printText} from '../font';

export function createTextButton({x, y, onUp = () => {}, onDown = () => {}, text = '', size = 4, render = () => {}}) {
	return Button({
		anchor: {x: 0.5, y: 0.5},
		x,
		y,
		width: (text.length || 1) * size * 4,
		height: 50,
		onUp,
		onDown,
		render() {
			this.draw();
			if (text) {
				printText(this.context, text, size);
			}

			render();
		},
	});
}
