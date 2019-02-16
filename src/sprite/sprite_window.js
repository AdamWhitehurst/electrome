import * as P from "pixi.js";
import { ipcRenderer } from "electron";
P.settings.SCALE_MODE = P.SCALE_MODES.NEAREST;
let dim = 64;
let pixi = new P.Application(dim, dim, { transparent: true });
let spriteName;
let sprite;

function initSprites() {
  P.loader.add("sprites", "../../assets/sheets/sprites.json").load(() => {
    spriteName = ipcRenderer.sendSync("window-ready");
    loadSprite();
  });
}

function loadSprite() {
  let frames = [];
  for (let i = 0; i < 10; i++) {
    frames.push(P.utils.TextureCache[`${spriteName}${i}.png`]);
  }

  let as = new P.extras.AnimatedSprite(frames);
  as.interactive = true;
  as.on("mousedown", () => {
    as.scale.x *= 2;
    as.scale.y *= 2;
  });
  as.animationSpeed = 0.15;
  as.anchor.set(0.5);
  as.x = pixi.screen.width / 2;
  as.y = pixi.screen.height / 2;
  as.scale.x *= 2;
  as.scale.y *= 2;
  as.play();
  sprite = as;
  pixi.stage.addChild(sprite);
}
initSprites();
document.body.appendChild(pixi.view);
