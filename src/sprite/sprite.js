import * as P from "pixi.js";
P.settings.SCALE_MODE = P.SCALE_MODES.NEAREST;

class Sprite {
  constructor(spriteName = "green_slime", dim = 64) {
    this.pixi = new P.Application(dim, dim, { transparent: true });
    this.spriteName = spriteName;
    this.initSprites();
    document.body.appendChild(this.pixi.view);
  }

  initSprites() {
    P.loader.add("sprites", "../../assets/sheets/sprites.json").load(() => {
      this.loadSprite();
    });
  }
  loadSprite() {
    let frames = [];
    for (let i = 0; i < 10; i++) {
      frames.push(P.utils.TextureCache[`${this.spriteName}${i}.png`]);
    }

    let as = new P.extras.AnimatedSprite(frames);
    as.interactive = true;
    as.on("mousedown", () => {
      as.scale.x *= 2;
      as.scale.y *= 2;
    });
    as.animationSpeed = 0.15;
    as.anchor.set(0.5);
    as.x = this.pixi.screen.width / 2;
    as.y = this.pixi.screen.height / 2;
    as.scale.x *= 2;
    as.scale.y *= 2;
    as.play();
    this.sprite = as;
    this.pixi.stage.addChild(this.sprite);
  }
}

let s = new Sprite();
