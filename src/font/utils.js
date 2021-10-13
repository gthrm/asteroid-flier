import {letters} from './letters';

// https://github.com/PaulBGD/PixelFont
export function printText(context, string = '', size = 10, color = 'rgb(10, 216, 37)') {
	const needed = [];
	string = string.toUpperCase(); // Because I only did uppercase letters
	for (let i = 0; i < string.length; i++) {
		const letter = letters[string.charAt(i)];
		if (letter) { // Because there's letters I didn't do
			needed.push(letter);
		}
	}

	context.fillStyle = color;
	let currX = 0;
	for (let i = 0; i < needed.length; i++) {
		const letter = needed[i];
		let currY = 0;
		let addX = 0;
		for (let y = 0; y < letter.length; y++) {
			const row = letter[y];
			for (let x = 0; x < row.length; x++) {
				if (row[x]) {
					context.fillRect(currX + (x * size), currY, size, size);
				}
			}

			addX = Math.max(addX, row.length * size);
			currY += size;
		}

		currX += size + addX;
	}
}
