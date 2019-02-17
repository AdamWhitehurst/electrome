import * as P from "pixi.js";
import { ipcRenderer } from "electron";
P.settings.SCALE_MODE = P.SCALE_MODES.NEAREST;
let dim = 64;
let pixi = new P.Application(dim, dim, { transparent: true });
let spriteName, currSprite;
let sprites = {};

function loadSpritesheet() {
  P.loader
    .add("green_slime", "../../assets/sheets/green_slime.json")
    .load(() => {
      spriteName = ipcRenderer.sendSync("window-ready");
      onSpritesheetLoaded();
    });
}
function onSpritesheetLoaded() {
  initAnimations();
}
function initAnimations() {
  let animations = P.loader.resources[spriteName].spritesheet.animations;

  for (const anim in animations) {
    console.log(anim, animations[anim]);
    let as = new P.extras.AnimatedSprite(animations[anim]);
    as.interactive = true;
    as.animationSpeed = 0.15;
    as.x = pixi.screen.width / 2;
    as.y = pixi.screen.height / 2;
    as.scale.x *= 2;
    as.scale.y *= 2;
    sprites[anim] = as;
  }

  loadSprite("melt");
}
function loadSprite(animName) {
  if (currSprite) {
    currSprite.stop();
    pixi.stage.removeChild(currSprite);
  }
  currSprite = sprites[`${spriteName}_${animName}`];
  currSprite.play();
  pixi.stage.addChild(currSprite);
}
loadSpritesheet();
document.body.appendChild(pixi.view);
