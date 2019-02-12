const PIXI = require("pixi.js");
const app = new PIXI.Application(64, 64, { transparent: true });
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
const pl = PIXI.loader;
let tex;

function init() {
  pl.add("../../assets/sheets/sprites.json").load(() => {
    tex = pl.resources["../../assets/sheets/sprites.json"].textures;
    document.body.appendChild(app.view);
    loadSprite();
  });
}

function loadSprite() {
  let frames = [];
  for (let i = 0; i < 10; i++) {
    frames.push(tex[`${i}.png`]);
  }
  let animatedSlime = new PIXI.extras.AnimatedSprite(frames);
  animatedSlime.interactive = true;
  animatedSlime.on("mouseover", () => {
    animatedSlime.scale.x *= 2;
    animatedSlime.scale.y *= 2;
  });
  animatedSlime.animationSpeed = 0.15;
  animatedSlime.anchor.set(0.5);
  animatedSlime.x = app.screen.width / 2;
  animatedSlime.y = app.screen.height / 2;
  animatedSlime.scale.x *= 2;
  animatedSlime.scale.y *= 2;
  animatedSlime.play();
  app.stage.addChild(animatedSlime);
}

init();
