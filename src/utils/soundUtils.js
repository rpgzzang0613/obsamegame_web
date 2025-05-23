import tileSound_1 from '../assets/sounds/tiles/1.mp3';
import tileSound_2 from '../assets/sounds/tiles/2.mp3';
import tileSound_3 from '../assets/sounds/tiles/3.mp3';
import tileSound_4 from '../assets/sounds/tiles/4.mp3';
import tileSound_5 from '../assets/sounds/tiles/5.mp3';
import endSound from '../assets/sounds/end.mp3';

let tileSounds = [];

/**
 * 타일 제거시 효과음 미리 로드하는 함수
 */
export const preloadTileSounds = async () => {
  const tileSoundFiles = [tileSound_1, tileSound_2, tileSound_3, tileSound_4, tileSound_5];

  const loadPromises = tileSoundFiles.map(async file => {
    const audio = new Audio(file);
    await new Promise(resolve => {
      audio.oncanplaythrough = resolve;
    });

    return audio;
  });

  tileSounds = await Promise.all(loadPromises);
};

/**
 * 타일 제거시 효과음 재생하는 함수
 */
export const playTileSound = tileNumber => {
  const soundIndex = tileNumber - 1;
  if (tileSounds[soundIndex]) {
    tileSounds[soundIndex].play().catch(error => {
      console.error('Failed to load sound:', error);
    });
  }
};

/**
 * 게임 오버시 효과음 재생하는 함수
 */
export const playEndSound = () => {
  const sound = new Audio(endSound);
  sound.play().catch(error => {
    console.error('Failed to load sound:', error);
  });
};
