export function createMuteButton(scene) {
  // Kui väärtust veel pole, siis vaikimisi heli sees
  if (window.gameMuted === undefined) {
    window.gameMuted = false;
  }

  const button = scene.add.rectangle(830, 50, 90, 50, 0xffffff)
    .setStrokeStyle(4, 0x8d6e63)
    .setInteractive({ useHandCursor: true });

  const icon = scene.add.text(
    830,
    50,
    window.gameMuted ? '🔇' : '🔊',
    {
      fontSize: '28px'
    }
  ).setOrigin(0.5);

  button.on('pointerdown', () => {
    window.gameMuted = !window.gameMuted;

    scene.sound.mute = window.gameMuted;
    icon.setText(window.gameMuted ? '🔇' : '🔊');
  });

  button.on('pointerover', () => {
    button.setScale(1.05);
    icon.setScale(1.05);
  });

  button.on('pointerout', () => {
    button.setScale(1);
    icon.setScale(1);
  });

  return { button, icon };
}

export function showMuteStatus(scene) {
  if (window.gameMuted === undefined) {
    window.gameMuted = false;
  }

  const box = scene.add.rectangle(830, 50, 90, 50, 0xffffff)
    .setStrokeStyle(4, 0x8d6e63);

  const icon = scene.add.text(
    830,
    50,
    window.gameMuted ? '🔇' : '🔊',
    {
      fontSize: '28px'
    }
  ).setOrigin(0.5);

  return { box, icon };
}

export function applyMute(scene) {
  if (window.gameMuted === undefined) {
    window.gameMuted = false;
  }

  scene.sound.mute = window.gameMuted;
}