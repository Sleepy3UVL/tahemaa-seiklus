import Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  preload() {
    this.load.audio('click', '/sounds/click.mp3');
    this.load.audio('menuMusic', '/sounds/menu-music.mp3');
  }

  create() {
    this.cameras.main.setBackgroundColor('#dff7ff');

    // Heli
    this.clickSound = this.sound.add('click', { volume: 0.25 });

    // Taustamuusika
  if (!this.sound.get('menuMusic')) {
    this.menuMusic = this.sound.add('menuMusic', {
      volume: 0.2,
      loop: true
    });
  } else {
    this.menuMusic = this.sound.get('menuMusic');
  }

    // VERY IMPORTANT: unlock audio on first tap (iPhone fix)
    this.input.once("pointerdown", () => {

    // kui audio on blokeeritud, vabasta see
    if (this.sound.context.state === "suspended") {
      this.sound.context.resume();
    }

    // käivita muusika
    if (!this.menuMusic.isPlaying) {
      this.menuMusic.play();
    }

    });
    // Dekoratsioon
    this.add.text(110, 70, '☁️', { fontSize: '42px' }).setAlpha(0.6);
    this.add.text(770, 70, '☁️', { fontSize: '46px' }).setAlpha(0.6);
    this.add.text(140, 520, '🌼', { fontSize: '38px' }).setAlpha(0.5);
    this.add.text(750, 520, '🌈', { fontSize: '42px' }).setAlpha(0.5);

    // Pealkiri
    this.add.text(450, 95, 'TÄHEMAA SEIKLUS', {
      fontSize: '44px',
      color: '#ff7f50',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(450, 145, 'Lõbus mäng tähtede ja sõnade õppimiseks!', {
      fontSize: '22px',
      color: '#3a2e39'
    }).setOrigin(0.5);

    // Loomad
    this.add.text(450, 210, '🐻 🐰 🦊 🐸', {
      fontSize: '54px'
    }).setOrigin(0.5);

    // Nupp 1 - Leia täht
    const button1 = this.add.rectangle(450, 305, 360, 75, 0xffd166)
      .setStrokeStyle(5, 0x8d6e63)
      .setInteractive({ useHandCursor: true });

    const button1Text = this.add.text(450, 305, 'Leia täht', {
      fontSize: '30px',
      color: '#3a2e39',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    button1.on('pointerover', () => {
      button1.setScale(1.05);
      button1Text.setScale(1.05);
    });

    button1.on('pointerout', () => {
      button1.setScale(1);
      button1Text.setScale(1);
    });

    button1.on('pointerdown', () => {
      this.clickSound.play();

      const music = this.sound.get('menuMusic');
      if (music && music.isPlaying) {
        music.stop();
      }

      this.scene.start('FindLetterScene');
    });

    // Nupp 2 - Pane sõna kokku
    const button2 = this.add.rectangle(450, 400, 360, 75, 0xbde0fe)
      .setStrokeStyle(5, 0x8d6e63)
      .setInteractive({ useHandCursor: true });

    const button2Text = this.add.text(450, 400, 'Pane sõna kokku', {
      fontSize: '30px',
      color: '#3a2e39',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    button2.on('pointerover', () => {
      button2.setScale(1.05);
      button2Text.setScale(1.05);
    });

    button2.on('pointerout', () => {
      button2.setScale(1);
      button2Text.setScale(1);
    });

    button2.on('pointerdown', () => {
      this.clickSound.play();

      const music = this.sound.get('menuMusic');
      if (music && music.isPlaying) {
        music.stop();
      }

      this.scene.start('BuildWordScene');
    });

    // Nupp 3 - Leia õige sõna
    const button3 = this.add.rectangle(450, 495, 360, 75, 0xcaffbf)
      .setStrokeStyle(5, 0x8d6e63)
      .setInteractive({ useHandCursor: true });

    const button3Text = this.add.text(450, 495, 'Leia õige sõna', {
      fontSize: '28px',
      color: '#3a2e39',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    button3.on('pointerover', () => {
      button3.setScale(1.05);
      button3Text.setScale(1.05);
    });

    button3.on('pointerout', () => {
      button3.setScale(1);
      button3Text.setScale(1);
    });

    button3.on('pointerdown', () => {
      this.clickSound.play();

      const music = this.sound.get('menuMusic');
      if (music && music.isPlaying) {
        music.stop();
      }

      this.scene.start('ChooseWordScene');
    });
  }
}