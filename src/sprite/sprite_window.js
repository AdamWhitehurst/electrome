import { ipcRenderer } from "electron";
import "pixi.js";

let pixi;
let spriteName;
let currAnim;
let animations;

function initPixiApp() {
  if (pixi !== undefined) document.body.removeChild(pixi.view);

  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

  pixi = new PIXI.Application(64, 64, { transparent: true });

  let i = pixi.renderer.plugins.interaction;
  i.on("pointerover", () => ipcSendEvent("pointerover"));
  i.on("pointerdown", () => ipcSendEvent("pointerdown"));
  i.on("pointerup", () => ipcSendEvent("pointerup"));
  i.on("pointerupoutside", () => ipcSendEvent("pointerupoutside"));
  i.on("pointerout", () => ipcSendEvent("pointerout"));

  document.body.appendChild(pixi.view);
  spriteName = ipcRenderer.sendSync("window-ready");
  loadSpritesheet();
}

function loadSpritesheet() {
  let url = `../../assets/sheets/${spriteName}.json`;
  PIXI.loader.add(spriteName, url).load(onSpritesheetLoaded);
}

function onSpritesheetLoaded(loader, resources) {
  animations = resources[spriteName].spritesheet.animations;
  ipcRenderer.send("spritesheet-loaded");
}

function playAnim(name) {
  let animName = `${spriteName}_${name}`;

  if (!animations[animName]) {
    console.log(`No animation found for ${animName}`);
    return;
  }

  if (currAnim) {
    currAnim.stop();
    pixi.stage.removeChild(currAnim);
  }
  currAnim = new PIXI.extras.AnimatedSprite(animations[animName]);
  currAnim.loop = false;
  currAnim.onComplete = () => ipcSendEvent("animcomplete");
  currAnim.animationSpeed = 0.15;
  currAnim.x = pixi.screen.width / 2;
  currAnim.y = pixi.screen.height / 2;
  currAnim.scale.x *= 2;
  currAnim.scale.y *= 2;
  currAnim.play();

  pixi.stage.addChild(currAnim);
}

function ipcSendEvent(event) {
  ipcRenderer.send("event", event);
}

ipcRenderer.on("new-state", (event, state) => {
  playAnim(state);
});

initPixiApp();
