import { BrowserWindow } from "electron";
import { ipcMain } from "electron";
import States from "../../assets/states/green_slime";

class Sprite {
  constructor(spriteName) {
    this.spriteName = spriteName || "green_slime";
    this.renderer;
    this.currState = "idle";
    this.initIPC();
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

  initIPC() {
    ipcMain.once("window-ready", (event, arg) => {
      event.returnValue = this.spriteName;
      this.renderer = event.sender;
      this.sendState("idle");
    });

    ipcMain.on("pointer-event", (event, pointerEvent) => {
      this.updateState(pointerEvent);
    });
    ipcMain.on("anim-event", (event, animEvent) => {
      this.updateState(animEvent);
    });
  }

  updateState(event) {
    console.log("Update event", event);
    let nextState = States[this.currState][event];
    if (nextState !== undefined) {
      if (typeof nextState === "object") {
        let sumWeights = 0;
        for (const state in nextState) {
          sumWeights += nextState[state];
        }
        let rand = Math.random() * sumWeights;
        sumWeights = 0;
        for (const state in nextState) {
          sumWeights += nextState[state];
          if (sumWeights >= rand) {
            this.transitionState(state);
            break;
          }
        }
      } else {
        this.transitionState(nextState);
      }
    }
  }

  transitionState(nextState) {
    // console.log("transitionState()", nextState);
    this.currState = nextState;
    this.sendState(nextState);
    if (States[nextState]["state-action"]) {
      this.performAction(States[nextState]["state-action"]);
    }
  }
  performAction(action) {
    // console.log("performAction()", action);
    switch (action) {
      case "move":
        this.move(4, 4);
        break;

      default:
        console.error(`Unrecognized action: ${action}`);
        break;
    }
  }
  sendState(nextState) {
    this.renderer.send("new-state", nextState);
  }
  move(x = 0, y = 0) {
    if (!this.window) return;

    let pos = this.window.getPosition();
    this.window.setPosition(pos[0] + x, pos[1] + y, true);
  }
}

export default Sprite;
