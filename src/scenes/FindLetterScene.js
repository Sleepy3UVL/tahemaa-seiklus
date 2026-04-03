import Phaser from 'phaser';
import { WORDS } from '../data/words';

export default class FindLetterScene extends Phaser.Scene {
  constructor() {
    super('FindLetterScene');
  }

  preload() {
    WORDS.forEach(item => {
      this.load.image(item.image, `/images/${item.image}.png`);
    });

    this.load.audio('correct', '/sounds/correct.mp3');
    this.load.audio('wrong', '/sounds/wrong.mp3');
    this.load.audio('click', '/sounds/click.mp3');
  }

  create() {
    this.correctSound = this.sound.add('correct', { volume: 0.4 });
    this.wrongSound = this.sound.add('wrong', { volume: 0.35 });
    this.clickSound = this.sound.add('click', { volume: 0.25 });

    this.score = 0;
    this.round = 1;
    this.maxRounds = 5;

    this.cameras.main.setBackgroundColor('#dff7ff');

    // Võta andmed words.js failist
    this.letterTasks = WORDS.map(item => ({
      letter: item.firstLetter,
      word: item.word,
      image: item.image
    }));

    this.shuffledTasks = Phaser.Utils.Array.Shuffle([...this.letterTasks]);
    this.maxRounds = Math.min(this.maxRounds, this.shuffledTasks.length);

    // Menüü nupp
    const backButton = this.add.rectangle(120, 50, 180, 55, 0xffffff)
      .setStrokeStyle(4, 0x8d6e63)
      .setInteractive({ useHandCursor: true });

    const backText = this.add.text(120, 50, '⬅ Menüü', {
      fontSize: '24px',
      color: '#3a2e39',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    backButton.on('pointerover', () => {
      backButton.setScale(1.05);
      backText.setScale(1.05);
    });

    backButton.on('pointerout', () => {
      backButton.setScale(1);
      backText.setScale(1);
    });

    backButton.on('pointerdown', () => {
      this.clickSound.play();
      this.scene.start('StartScene');
    });

    // Dekoratsioon
    this.add.text(100, 120, '⭐', { fontSize: '42px' }).setAlpha(0.5);
    this.add.text(780, 100, '☁️', { fontSize: '52px' }).setAlpha(0.6);
    this.add.text(150, 500, '🌼', { fontSize: '42px' }).setAlpha(0.5);
    this.add.text(760, 500, '🌈', { fontSize: '48px' }).setAlpha(0.5);

    this.scoreText = this.add.text(30, 95, 'Punktid: 0', {
      fontSize: '28px',
      color: '#3a2e39',
      fontStyle: 'bold'
    });

    this.roundText = this.add.text(700, 50, `Voor: 1/${this.maxRounds}`, {
      fontSize: '28px',
      color: '#3a2e39',
      fontStyle: 'bold'
    });

    this.feedbackText = this.add.text(450, 525, '', {
      fontSize: '34px',
      color: '#2b9348',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.generateRound();
  }

  generateRound() {
    if (this.letterObjects) {
      this.letterObjects.forEach(obj => obj.destroy());
    }

    if (this.instructionText) this.instructionText.destroy();
    if (this.helperText) this.helperText.destroy();
    if (this.hintImage) this.hintImage.destroy();
    if (this.wordHintText) this.wordHintText.destroy();

    this.letterObjects = [];
    this.feedbackText.setText('');

    const currentTask = this.shuffledTasks[this.round - 1];
    this.correctLetter = currentTask.letter;
    this.currentWord = currentTask.word;
    this.currentImage = currentTask.image;

    // Vali 5 tähte, kus üks on õige
    const allLetters = ['A', 'E', 'I', 'O', 'U', 'M', 'K', 'S', 'T', 'L', 'P', 'R'];
    const wrongLetters = allLetters.filter(letter => letter !== this.correctLetter);
    const randomWrong = Phaser.Utils.Array.Shuffle([...wrongLetters]).slice(0, 4);
    const chosenLetters = Phaser.Utils.Array.Shuffle([this.correctLetter, ...randomWrong]);

    this.instructionText = this.add.text(450, 95, `Leia täht ${this.correctLetter}`, {
      fontSize: '42px',
      color: '#3a2e39',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.helperText = this.add.text(450, 145, 'Vaata pilti ja leia õige algustäht', {
      fontSize: '24px',
      color: '#5a4b57'
    }).setOrigin(0.5);

    this.hintImage = this.add.image(450, 220, this.currentImage);

    const maxSize = 140;
    this.hintImage.setScale(
      maxSize / Math.max(this.hintImage.width, this.hintImage.height)
    );

    this.wordHintText = this.add.text(450, 280, `${this.correctLetter} nagu ${this.currentWord}`, {
      fontSize: '30px',
      color: '#2d6a4f',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const positions = [
      { x: 180, y: 390 },
      { x: 340, y: 390 },
      { x: 500, y: 390 },
      { x: 660, y: 390 },
      { x: 820, y: 390 }
    ];

    const colors = [0xffc8dd, 0xcdb4db, 0xbde0fe, 0xcaffbf, 0xffe599];

    chosenLetters.forEach((letter, index) => {
      const circle = this.add.circle(positions[index].x, positions[index].y, 58, colors[index])
        .setStrokeStyle(5, 0x6d6875)
        .setInteractive({ useHandCursor: true });

      const letterText = this.add.text(positions[index].x, positions[index].y, letter, {
        fontSize: '46px',
        color: '#3a2e39',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      circle.on('pointerover', () => {
        circle.setScale(1.08);
        letterText.setScale(1.08);
      });

      circle.on('pointerout', () => {
        circle.setScale(1);
        letterText.setScale(1);
      });

      circle.on('pointerdown', () => {
        this.clickSound.play();
        this.checkAnswer(letter, circle, letterText);
      });

      this.letterObjects.push(circle, letterText);
    });
  }

  checkAnswer(selectedLetter, circle, letterText) {
    if (selectedLetter === this.correctLetter) {
      this.correctSound.play();
      this.score++;
      this.scoreText.setText(`Punktid: ${this.score}`);
      this.feedbackText.setColor('#2b9348');
      this.feedbackText.setText('Tubli! 🎉');

      this.tweens.add({
        targets: [circle, letterText],
        scale: 1.2,
        duration: 200,
        yoyo: true
      });

      this.round++;

      if (this.round > this.maxRounds) {
        this.time.delayedCall(1000, () => {
          this.showEndScreen();
        });
      } else {
        this.roundText.setText(`Voor: ${this.round}/${this.maxRounds}`);
        this.time.delayedCall(1000, () => {
          this.generateRound();
        });
      }
    } else {
      this.wrongSound.play();
      this.feedbackText.setColor('#d62828');
      this.feedbackText.setText('Proovi uuesti 🙂');

      this.tweens.add({
        targets: [circle, letterText],
        x: circle.x + 10,
        duration: 50,
        yoyo: true,
        repeat: 3
      });
    }
  }

  showEndScreen() {
    this.cameras.main.setBackgroundColor('#caffbf');
    this.children.removeAll();

    this.add.text(450, 120, 'Tubli töö! 🌟', {
      fontSize: '50px',
      color: '#2d6a4f',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(450, 190, 'Tase 1 on läbitud!', {
      fontSize: '38px',
      color: '#3a2e39',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(450, 250, `Said ${this.score} punkti ${this.maxRounds}-st`, {
      fontSize: '30px',
      color: '#333'
    }).setOrigin(0.5);

    this.add.text(450, 310, '🐻 🐰 🦊 🐸', {
      fontSize: '52px'
    }).setOrigin(0.5);

    // Järgmine tase
    const nextButton = this.add.rectangle(450, 390, 320, 75, 0xcaffbf)
      .setStrokeStyle(5, 0x8d6e63)
      .setInteractive({ useHandCursor: true });

    const nextText = this.add.text(450, 390, 'Järgmine tase', {
      fontSize: '28px',
      color: '#3a2e39',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    nextButton.on('pointerover', () => {
      nextButton.setScale(1.05);
      nextText.setScale(1.05);
    });

    nextButton.on('pointerout', () => {
      nextButton.setScale(1);
      nextText.setScale(1);
    });

    nextButton.on('pointerdown', () => {
      this.clickSound.play();
      this.scene.start('BuildWordScene');
    });

    // Menüü
    const menuButton = this.add.rectangle(450, 480, 300, 75, 0xbde0fe)
      .setStrokeStyle(5, 0x8d6e63)
      .setInteractive({ useHandCursor: true });

    const menuText = this.add.text(450, 480, 'Tagasi menüüsse', {
      fontSize: '28px',
      color: '#3a2e39',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    menuButton.on('pointerover', () => {
      menuButton.setScale(1.05);
      menuText.setScale(1.05);
    });

    menuButton.on('pointerout', () => {
      menuButton.setScale(1);
      menuText.setScale(1);
    });

    menuButton.on('pointerdown', () => {
      this.clickSound.play();
      this.scene.start('StartScene');
    });

    // Uuesti
    const restartButton = this.add.rectangle(450, 570, 300, 75, 0xffd166)
      .setStrokeStyle(5, 0x8d6e63)
      .setInteractive({ useHandCursor: true });

    const restartText = this.add.text(450, 570, 'Mängi uuesti', {
      fontSize: '28px',
      color: '#3a2e39',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    restartButton.on('pointerover', () => {
      restartButton.setScale(1.05);
      restartText.setScale(1.05);
    });

    restartButton.on('pointerout', () => {
      restartButton.setScale(1);
      restartText.setScale(1);
    });

    restartButton.on('pointerdown', () => {
      this.clickSound.play();
      this.scene.restart();
    });
  }
}