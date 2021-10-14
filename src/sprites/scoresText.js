import {Sprite} from 'kontra';
import {printText} from '../font';
import {store} from '../store';

export function createScoresText() {
	return Sprite({
		dt: 0,
		x: 30,
		y: 20,
		render() {
			printText(this.context, this.text, 4);
		},
		update() {
			if (this.text !== `${store.scores}`) {
				this.text = `Score ${store.scores}  Lives ${store.lives}`;
			}
		},
	});
}
