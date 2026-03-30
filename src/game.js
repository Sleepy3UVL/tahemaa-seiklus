import Phaser from 'phaser';
import StartScene from './scenes/StartScene';
import FindLetterScene from './scenes/FindLetterScene';
import BuildWordScene from './scenes/BuildWordScene';
import ChooseWordScene from './scenes/ChooseWordScene';

const config = {
  type: Phaser.AUTO,

  backgroundColor: '#d0f4ff',
  parent: 'game-container',

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 900,
    height: 600
  },

  scene: [
    StartScene,
    FindLetterScene,
    BuildWordScene,
    ChooseWordScene
  ]
};

const game = new Phaser.Game(config);