import { ipcRenderer } from "electron";
import "pixi.js";

let pixi;
let spriteName, currSprite;
let animations;

function initPixiApp() {
  if (pixi !== undefined) document.body.removeChild(pixi.view);

  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

  pixi = new PIXI.Application(64, 64, { transparent: true });

  let i = pixi.renderer.plugins.interaction;
  i.on("pointerover", () => ipcPointerEvent("pointerover"));
  i.on("pointerdown", () => ipcPointerEvent("pointerdown"));
  i.on("pointerup", () => ipcPointerEvent("pointerup"));
  i.on("pointerupoutside", () => ipcPointerEvent("pointerupoutside"));
  i.on("mouspointerouteout", () => ipcPointerEvent("pointerout"));

  document.body.appendChild(pixi.view);
  loadSpritesheet();
}

function loadSpritesheet() {
  PIXI.loader
    .add("green_slime", "../../assets/sheets/green_slime.json")
    .load(onSpritesheetLoaded);
}

function onSpritesheetLoaded(loader, resources) {
  spriteName = ipcRenderer.sendSync("window-ready");
  animations = resources[spriteName].spritesheet.animations;
}

function loadSprite(anim) {
  let as = new PIXI.extras.AnimatedSprite(animations[anim]);
  as.loop = false;
  as.onComplete = () => ipcAnimEvent("complete");
  as.animationSpeed = 0.15;
  as.x = pixi.screen.width / 2;
  as.y = pixi.screen.height / 2;
  as.scale.x *= 2;
  as.scale.y *= 2;
  as.play();

  return as;
}

function playAnim(animName) {
  if (currSprite) {
    currSprite.stop();
    pixi.stage.removeChild(currSprite);
  }
  currSprite = loadSprite(`${spriteName}_${animName}`);

  pixi.stage.addChild(currSprite);
}

function ipcPointerEvent(event) {
  ipcRenderer.send("pointer-event", event);
}

function ipcAnimEvent(event) {
  ipcRenderer.send("anim-event", event);
}

ipcRenderer.on("new-state", (event, state) => {
  playAnim(state);
});

initPixiApp();
