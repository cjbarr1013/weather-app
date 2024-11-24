export const converter = (function () {
  const degreesToCardinal = (deg) => {
    const val = Math.floor(deg / 22.5 + 0.5);
    const directions = [
      'N',
      'NNE',
      'NE',
      'ENE',
      'E',
      'ESE',
      'SE',
      'SSE',
      'S',
      'SSW',
      'SW',
      'WSW',
      'W',
      'WNW',
      'NW',
      'NNW',
    ];
    return directions[val % 16];
  };

  const moonToPhase = (moon) => {
    if (moon === 0 || moon === 1) {
      return 'moon-new';
    } else if (0 < moon && moon < 0.25) {
      return 'moon-waxing-crescent';
    } else if (moon === 0.25) {
      return 'moon-first-quarter';
    } else if (0.25 < moon && moon < 0.5) {
      return 'moon-waxing-gibbous';
    } else if (moon === 0.5) {
      return 'moon-full';
    } else if (0.5 < moon && moon < 0.75) {
      return 'moon-waning-gibbous';
    } else if (moon === 0.75) {
      return 'moon-last-quarter';
    } else if (0.75 < moon && moon < 1) {
      return 'moon-waning-crescent';
    }
  };

  return {
    degreesToCardinal,
    moonToPhase,
  };
})();
