import {createGameScene} from './gameScene';
import {createMenuScene} from './menuScene';
import {state} from '../state';

export function createScenes() {
	const gameScene = createGameScene();
	const menuScene = createMenuScene();
	state.scenes[gameScene.name] = gameScene;
	state.scenes[menuScene.name] = menuScene;

	state.scenes.active = state.scenes[menuScene.name];
	state.scenes[menuScene.name].show();
}
