import { BrowserWindow } from "electron";
import { ipcMain } from "electron";

class Sprite {
  constructor(spriteName) {
    this.spriteName = spriteName || "green_slime";
    this.renderer;
    ipcMain.on("window-ready", (event, arg) => {
      event.returnValue = this.spriteName;
      this.renderer = event.sender;
    });

    this.createWindow();
  }

  createWindow() {
    let w = new BrowserWindow({
      width: 640,
      height: 640
      // frame: false,
      // transparent: true
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

  move(x = 0, y = 0) {
    if (!this.window) return;

    let pos = this.window.getPosition();
    this.window.setPosition(pos[0] + x, pos[1] + y, true);
  }
}

export default Sprite;
