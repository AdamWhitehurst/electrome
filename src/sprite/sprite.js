import { BrowserWindow } from "electron";
class Sprite {
  constructor(spriteName) {
    this.spriteName = spriteName;
    this.createWindow();
  }

  createWindow() {
    let w = new BrowserWindow({
      width: 64,
      height: 64,
      frame: false,
      transparent: true
    });

    w.setMenu(null);
    w.loadURL(`file://${__dirname}/sprite_window.html`);
    //w.setIgnoreMouseEvents(true);
    w.webContents.openDevTools();
    w.show();
    this.window = w;
    w.on("closed", () => {
      this.window = null;
    });
  }

  sendState(nextState) {
    if (this.renderer) this.renderer.send("new-state", nextState);
  }
  move(x = 0, y = 0) {
    if (!this.window) return;

    let pos = this.window.getPosition();
    this.window.setPosition(pos[0] + x, pos[1] + y, true);
  }
}

export default Sprite;
