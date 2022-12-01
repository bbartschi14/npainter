/**
 * https://gist.github.com/steveruizok/09a1d3ff88175b077f9affbee1d4ce73
 * Seeded random number generator, using [xorshift](https://en.wikipedia.org/wiki/Xorshift).
 * Adapted from [seedrandom](https://github.com/davidbau/seedrandom).
 * Between -0.5 and +0.5
 * @param seed {string} The seed for random numbers.
 */
export default function rng(seed = "") {
  let x = 0;
  let y = 0;
  let z = 0;
  let w = 0;

  function next() {
    const t = x ^ (x << 11);
    x = y;
    y = z;
    z = w;
    w ^= ((w >>> 19) ^ t ^ (t >>> 8)) >>> 0;
    return w / 0x100000000;
  }

  for (var k = 0; k < seed.length + 64; k++) {
    x ^= seed.charCodeAt(k) | 0;
    next();
  }

  return next;
}

// const getRandom = rng("someId")
// getRandom() // always -0.1967178131453693
// getRandom() // always 0.2110769241116941
