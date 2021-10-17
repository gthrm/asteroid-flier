import {Sprite} from 'kontra';
import {printText} from '../font';
import {state} from '../state';

export function createScoresText() {
	return Sprite({
		dt: 0,
		x: 30,
		y: 20,
		render() {
			printText(this.context, this.text, 4);
		},
		update() {
			if (this.text !== `${state.scores}`) {
				this.text = `Score ${state.scores}  Lives ${state.lives}`;
			}
		},
	});
}
