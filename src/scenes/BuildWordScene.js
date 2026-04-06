import Phaser from 'phaser';
import { WORDS } from '../data/words';

export default class BuildWordScene extends Phaser.Scene {
  constructor() {
    super('BuildWordScene');
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

    // Võta andmed words.js failist
    this.wordPairs = WORDS
  .filter(item => item.usableInBuild)
  .map(item => ({
    parts: item.syllables,
    answer: item.word,
    image: item.image
    }));

    this.shuffledTasks = Phaser.Utils.Array.Shuffle([...this.wordPairs]);
    this.maxRounds = Math.min(this.maxRounds, this.shuffledTasks.length);

    this.cameras.main.setBackgroundColor('#fff7d6');

    // Tagasi menüüsse nupp
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

    this.feedbackText = this.add.text(450, 520, '', {
      fontSize: '34px',
      color: '#2b9348',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.generateRound();
  }

  getDistractorParts(correctParts) {
    const allParts = this.wordPairs.flatMap(item => item.parts);
    const uniqueParts = [...new Set(allParts)];
    const filtered = uniqueParts.filter(part => !correctParts.includes(part));

    Phaser.Utils.Array.Shuffle(filtered);

    return filtered.slice(0, 2);
  }

  generateRound() {
    if (this.optionObjects) {
      this.optionObjects.forEach(obj => obj.destroy());
    }
    if (this.targetBoxes) {
      this.targetBoxes.forEach(obj => obj.destroy());
    }
    if (this.currentWordText) {
      this.currentWordText.destroy();
    }
    if (this.instructionText) {
      this.instructionText.destroy();
    }
    if (this.hintImage) {
      this.hintImage.destroy();
    }
    if (this.helperText) {
      this.helperText.destroy();
    }

    this.optionObjects = [];
    this.targetBoxes = [];
    this.feedbackText.setText('');
    this.selectedParts = [];

    const current = this.shuffledTasks[this.round - 1];
    this.currentParts = current.parts;
    this.correctAnswer = current.answer;
    this.currentImage = current.image;

    this.instructionText = this.add.text(450, 95, 'Pane sõna kokku', {
      fontSize: '42px',
      color: '#3a2e39',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.helperText = this.add.text(450, 145, 'Vaata pilti ja vajuta silpe õiges järjekorras', {
      fontSize: '24px',
      color: '#5a4b57'
    }).setOrigin(0.5);

    // Pildi vihje
    this.hintImage = this.add.image(450, 220, this.currentImage);

    const maxSize = 140;
    this.hintImage.setScale(
      maxSize / Math.max(this.hintImage.width, this.hintImage.height)
    );

    // Sihtkastid sõna jaoks
    const boxSpacing = 120;
    const totalWidth = (this.currentParts.length - 1) * boxSpacing;
    const startX = 450 - totalWidth / 2;

    for (let i = 0; i < this.currentParts.length; i++) {
      const x = startX + i * boxSpacing;

      const box = this.add.rectangle(x, 300, 100, 80, 0xffffff)
        .setStrokeStyle(4, 0x8d6e63);

      const placeholder = this.add.text(x, 300, '?', {
        fontSize: '36px',
        color: '#999'
      }).setOrigin(0.5);

      this.targetBoxes.push(box, placeholder);
    }

    // Dünaamilised eksitajad
    const distractors = this.getDistractorParts(this.currentParts);
    const shuffledParts = Phaser.Utils.Array.Shuffle([
      ...this.currentParts,
      ...distractors
    ]);

    const spacing = 170;
    const totalButtonsWidth = (shuffledParts.length - 1) * spacing;
    const buttonStartX = 450 - totalButtonsWidth / 2;

    shuffledParts.forEach((part, index) => {
      const x = buttonStartX + index * spacing;
      const y = 420;

      const button = this.add.rectangle(x, y, 130, 85, 0xbde0fe)
        .setStrokeStyle(5, 0x6d6875)
        .setInteractive({ useHandCursor: true });

      const text = this.add.text(x, y, part, {
        fontSize: '34px',
        color: '#3a2e39',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      button.on('pointerover', () => {
        button.setScale(1.05);
        text.setScale(1.05);
      });

      button.on('pointerout', () => {
        button.setScale(1);
        text.setScale(1);
      });

      button.on('pointerdown', () => {
        this.clickSound.play();
        this.selectPart(part, button, text);
      });

      this.optionObjects.push(button, text);
    });

    this.currentWordText = this.add.text(450, 300, '', {
      fontSize: '38px',
      color: '#2d6a4f',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  selectPart(part, button, text) {
    if (button.selected) return;

    button.selected = true;
    button.setFillStyle(0xcaffbf);

    this.selectedParts.push(part);

    const index = this.selectedParts.length - 1;

    // Leia vastav ? tekst ja asenda silbiga
    const placeholder = this.targetBoxes[index * 2 + 1];
    placeholder.setText(part);
    placeholder.setColor('#2d6a4f');

    if (this.selectedParts.length === this.currentParts.length) {
      this.checkWord();
    }
  }

  checkWord() {
    const builtWord = this.selectedParts.join('');

    if (builtWord === this.correctAnswer) {
      this.correctSound.play();
      this.score++;
      this.scoreText.setText(`Punktid: ${this.score}`);
      this.feedbackText.setColor('#2b9348');
      this.feedbackText.setText('Õige! Tubli! 🎉');

      this.round++;

      if (this.round > this.maxRounds) {
        this.time.delayedCall(1200, () => {
          this.showEndScreen();
        });
      } else {
        this.roundText.setText(`Voor: ${this.round}/${this.maxRounds}`);
        this.time.delayedCall(1200, () => {
          this.generateRound();
        });
      }
    } else {
      this.wrongSound.play();
      this.feedbackText.setColor('#d62828');
      this.feedbackText.setText(`Proovi uuesti 🙂 Õige sõna oli ${this.correctAnswer}`);

      this.time.delayedCall(1200, () => {
        this.generateRound();
      });
    }
  }

  showEndScreen() {
    this.cameras.main.setBackgroundColor('#d8f3dc');
    this.children.removeAll();

    this.add.text(450, 100, 'Tubli töö! 📚', {
      fontSize: '48px',
      color: '#2d6a4f',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(450, 165, 'Tase 2 on läbitud!', {
      fontSize: '36px',
      color: '#3a2e39',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(450, 225, `Said ${this.score} punkti ${this.maxRounds}-st`, {
      fontSize: '30px',
      color: '#333'
    }).setOrigin(0.5);

    this.add.text(450, 280, '🐻 🐰 🦊 🐸', {
      fontSize: '52px'
    }).setOrigin(0.5);

    // Järgmine tase
    const nextButton = this.add.rectangle(450, 360, 320, 75, 0xcaffbf)
      .setStrokeStyle(5, 0x8d6e63)
      .setInteractive({ useHandCursor: true });

    const nextText = this.add.text(450, 360, 'Järgmine tase', {
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
      this.scene.start('ChooseWordScene');
    });

    // Menüü
    const menuButton = this.add.rectangle(450, 450, 300, 75, 0xbde0fe)
      .setStrokeStyle(5, 0x8d6e63)
      .setInteractive({ useHandCursor: true });

    const menuText = this.add.text(450, 450, 'Tagasi menüüsse', {
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
    const restartButton = this.add.rectangle(450, 540, 300, 75, 0xffd166)
      .setStrokeStyle(5, 0x8d6e63)
      .setInteractive({ useHandCursor: true });

    const restartText = this.add.text(450, 540, 'Mängi uuesti', {
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