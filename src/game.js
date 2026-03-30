import Phaser from 'phaser';
import StartScene from './scenes/StartScene';
import FindLetterScene from './scenes/FindLetterScene';
import BuildWordScene from './scenes/BuildWordScene';
import ChooseWordScene from './scenes/ChooseWordScene';

const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 600,
  backgroundColor: '#d0f4ff',
  parent: 'game-container',
  scene: [StartScene, FindLetterScene, BuildWordScene, ChooseWordScene]
};

new Phaser.Game(config);