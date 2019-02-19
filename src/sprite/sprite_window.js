import { ipcRenderer } from "electron";
import "pixi.js";
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
let dim = 64;
let pixi = new PIXI.Application(dim, dim, { transparent: true });
let spriteName, currSprite;
let animations;
let defaultAction = {
  mouseOver: () => {
    playAnim("hop", {
      loop: false,
      onComplete: () => playAnim("idle", defaultAction)
    });
  }
};
function loadSpritesheet() {
  PIXI.loader
    .add("green_slime", "../../assets/sheets/green_slime.json")
    .load(() => {
      spriteName = ipcRenderer.sendSync("window-ready");
      onSpritesheetLoaded();
    });
}
function onSpritesheetLoaded() {
  animations = PIXI.loader.resources[spriteName].spritesheet.animations;
  playAnim("idle", defaultAction);
}
function loadSprite(anim) {
  console.log(anim);
  let as = new PIXI.extras.AnimatedSprite(animations[anim]);
  as.interactive = true;
  as.animationSpeed = 0.15;
  as.x = pixi.screen.width / 2;
  as.y = pixi.screen.height / 2;
  as.scale.x *= 2;
  as.scale.y *= 2;
  as.play();

  return as;
}
function playAnim(
  animName,
  { loop, onComplete, mouseOver, mouseUp, mouseDown }
) {
  if (currSprite) {
    currSprite.stop();
    pixi.stage.removeChild(currSprite);
  }
  currSprite = loadSprite(`${spriteName}_${animName}`);

  if (loop === false) {
    currSprite.loop = false;
  }
  if (onComplete) {
    currSprite.onComplete = onComplete;
  }
  if (mouseOver) {
    currSprite.on("mouseover", mouseOver);
  }

  pixi.stage.addChild(currSprite);
}
loadSpritesheet();
document.body.appendChild(pixi.view);
