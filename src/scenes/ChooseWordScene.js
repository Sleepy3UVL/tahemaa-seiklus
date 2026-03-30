import Phaser from 'phaser';

export default class ChooseWordScene extends Phaser.Scene {
  constructor() {
    super('ChooseWordScene');
  }

  preload() {
    this.load.image('maja', '/images/maja.png');
    this.load.image('kala', '/images/kala.png');
    this.load.image('auto', '/images/auto.png');
    this.load.image('koer', '/images/koer.png');
    this.load.image('ema', '/images/ema.png');
    this.load.image('isa', '/images/isa.png');
    this.load.image('pall', '/images/pall.png');
    this.load.image('lill', '/images/lill.png');

    this.load.audio('correct', '/sounds/correct.mp3');
    this.load.audio('wrong', '/sounds/wrong.mp3');
    this.load.audio('click', '/sounds/click.mp3');
  }

  create() {
    this.cameras.main.setBackgroundColor('#fff7e6');

    this.correctSound = this.sound.add('correct', { volume: 0.4 });
    this.wrongSound = this.sound.add('wrong', { volume: 0.35 });
    this.clickSound = this.sound.add('click', { volume: 0.25 });

    this.score = 0;
    this.round = 0;
    this.maxRounds = 5;

    this.wordTasks = [
      { word: 'MAJA', image: 'maja' },
      { word: 'KALA', image: 'kala' },
      { word: 'AUTO', image: 'auto' },
      { word: 'KOER', image: 'koer' },
      { word: 'EMA', image: 'ema' },
      { word: 'ISA', image: 'isa' },
      { word: 'PALL', image: 'pall' },
      { word: 'LILL', image: 'lill' }
    ];

    this.shuffledTasks = Phaser.Utils.Array.Shuffle([...this.wordTasks]);
    this.maxRounds = Math.min(this.maxRounds, this.shuffledTasks.length);

    this.scoreText = this.add.text(40, 30, 'Punktid: 0', {
      fontSize: '28px',
      color: '#3a2e39',
      fontStyle: 'bold'
    });

    this.roundText = this.add.text(700, 30, 'Voor: 1/5', {
      fontSize: '28px',
      color: '#3a2e39',
      fontStyle: 'bold'
    });

    const backButton = this.add.rectangle(120, 90, 180, 55, 0xbde0fe)
      .setStrokeStyle(4, 0x8d6e63)
      .setInteractive({ useHandCursor: true });

    const backText = this.add.text(120, 90, '⬅ Menüü', {
      fontSize: '24px',
      color: '#3a2e39',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    backButton.on('pointerdown', () => {
      this.clickSound.play();
      this.scene.start('StartScene');
    });

    this.generateRound();
  }

  generateRound() {
    if (this.round >= this.maxRounds) {
      this.showEndScreen();
      return;
    }

    if (this.titleText) this.titleText.destroy();
    if (this.imageHint) this.imageHint.destroy();
    if (this.feedbackText) this.feedbackText.destroy();

    if (this.optionButtons) {
      this.optionButtons.forEach(btn => btn.destroy());
    }
    if (this.optionTexts) {
      this.optionTexts.forEach(txt => txt.destroy());
    }

    this.optionButtons = [];
    this.optionTexts = [];

    const current = this.shuffledTasks[this.round];
    this.correctWord = current.word;
    this.currentImage = current.image;

    this.titleText = this.add.text(450, 140, 'Leia õige sõna', {
      fontSize: '40px',
      color: '#ff7f50',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.imageHint = this.add.image(450, 250, this.currentImage);

      const maxWidth = 160;
      const maxHeight = 160;

      const scaleX = maxWidth / this.imageHint.width;
      const scaleY = maxHeight / this.imageHint.height;
      const scale = Math.min(scaleX, scaleY);

    this.imageHint.setScale(scale);

    let wrongOptions = this.wordTasks
      .filter(item => item.word !== this.correctWord)
      .map(item => item.word);

    Phaser.Utils.Array.Shuffle(wrongOptions);

    let options = [
      this.correctWord,
      wrongOptions[0],
      wrongOptions[1]
    ];

    Phaser.Utils.Array.Shuffle(options);

    const positions = [250, 450, 650];

    options.forEach((word, index) => {
      const button = this.add.rectangle(positions[index], 430, 170, 80, 0xffd166)
        .setStrokeStyle(4, 0x8d6e63)
        .setInteractive({ useHandCursor: true });

      const text = this.add.text(positions[index], 430, word, {
        fontSize: '28px',
        color: '#3a2e39',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      button.on('pointerdown', () => {
        this.clickSound.play();
        this.checkAnswer(word, button, text);
      });

      this.optionButtons.push(button);
      this.optionTexts.push(text);
    });

    this.roundText.setText(`Voor: ${this.round + 1}/${this.maxRounds}`);
  }

  checkAnswer(selectedWord, button, text) {
    this.optionButtons.forEach(btn => btn.disableInteractive());

    if (selectedWord === this.correctWord) {
      this.correctSound.play();
      button.setFillStyle(0xa8e6a3);
      text.setColor('#1b4332');
      this.score++;

      this.feedbackText = this.add.text(450, 540, 'Tubli! ⭐', {
        fontSize: '34px',
        color: '#2d6a4f',
        fontStyle: 'bold'
      }).setOrigin(0.5);
    } else {
      this.wrongSound.play();
      button.setFillStyle(0xffadad);
      text.setColor('#7f1d1d');

      this.feedbackText = this.add.text(450, 540, 'Proovi uuesti 😊', {
        fontSize: '34px',
        color: '#d62828',
        fontStyle: 'bold'
      }).setOrigin(0.5);
    }

    this.scoreText.setText(`Punktid: ${this.score}`);

    this.time.delayedCall(1500, () => {
      this.round++;
      this.generateRound();
    });
  }

  showEndScreen() {
    this.children.removeAll();

    this.cameras.main.setBackgroundColor('#d8f3dc');

    this.add.text(450, 140, 'Tubli töö! 🌟', {
      fontSize: '48px',
      color: '#2d6a4f',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(450, 220, 'Mäng läbi!', {
      fontSize: '40px',
      color: '#3a2e39',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(450, 300, `Said ${this.score} punkti ${this.maxRounds}-st`, {
      fontSize: '32px',
      color: '#555'
    }).setOrigin(0.5);

    const menuButton = this.add.rectangle(450, 430, 320, 85, 0xbde0fe)
      .setStrokeStyle(5, 0x8d6e63)
      .setInteractive({ useHandCursor: true });

    const menuText = this.add.text(450, 430, 'Tagasi menüüsse', {
      fontSize: '30px',
      color: '#3a2e39',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    menuButton.on('pointerdown', () => {
      this.clickSound.play();
      this.scene.start('StartScene');
    });

    const restartButton = this.add.rectangle(450, 540, 320, 85, 0xffd166)
      .setStrokeStyle(5, 0x8d6e63)
      .setInteractive({ useHandCursor: true });

    const restartText = this.add.text(450, 540, 'Mängi uuesti', {
      fontSize: '30px',
      color: '#3a2e39',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    restartButton.on('pointerdown', () => {
      this.clickSound.play();
      this.scene.restart();
    });
  }
}