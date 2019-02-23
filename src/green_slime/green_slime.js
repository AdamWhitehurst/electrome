import Sprite from "../sprite/sprite";
import Machina from "machina";
import { ipcMain } from "electron";

const GreenSlime = Machina.Fsm.extend({
  initialize: function() {
    this.spriteName = "green_slime";
    this.sprite = new Sprite(this.spriteName);
    ipcMain.once("window-ready", (event, arg) => {
      event.returnValue = this.spriteName;
      this.sprite.renderer = event.sender;
    });
    ipcMain.once("spritesheet-loaded", () => {
      this.handle("animcomplete");
    });
    ipcMain.on("event", (event, eventName) => {
      this.handle(eventName);
    });
    this.on("transition", data => {
      //console.log(`Transitioning from ${data.fromState} to ${data.toState}`);
      this.sprite.sendState(data.toState);
    });
  },
  initialState: "idle",
  states: {
    think: {
      _onEnter: function() {
        let rand = Math.floor(Math.random() * 10);
        switch (rand) {
          case 0:
          case 1:
          case 2:
          case 3:
            this.transition("hop");
            break;
          default:
            this.transition("idle");
            break;
        }
      }
    },
    idle: {
      _onEnter: function() {},
      animcomplete: function() {
        this.transition("think");
      },
      pointerup: function() {
        this.transition("squirt");
      }
    },
    hop: {
      _onEnter: function() {
        this.xAmt = Math.floor(Math.random() * 3 - 1);
        this.yAmt = Math.floor(Math.random() * 3 - 1);
        this.moveInt = setInterval(
          () => this.sprite.move(this.xAmt * 2, this.yAmt * 2),
          128
        );
      },
      animcomplete: function() {
        this.transition("idle");
      },
      _onExit: function() {
        clearInterval(this.moveInt);
      }
    },
    roll: {
      _onEnter: function() {
        this.xAmt = Math.floor(Math.random() * 20 - 10);
        this.yAmt = Math.floor(Math.random() * 20 - 10);
        this.moveInt = setInterval(
          () => this.sprite.move(this.xAmt, this.yAmt),
          16
        );
      },
      animcomplete: function() {
        this.transition("idle");
      },
      _onExit: function() {
        clearInterval(this.moveInt);
      }
    },
    melt: {
      _onEnter: function() {},
      animcomplete: function() {
        this.transition("idle");
      }
    },
    squirt: {
      _onEnter: function() {},
      pointerup: function() {
        this.transition("melt");
      },
      animcomplete: function() {
        this.transition("idle");
      }
    }
  },
  move: () => {
    console.log(this.xAmt, this.yAmt);
    this.sprite.move(this.xAmt, this.yAmt);
  }
});

export default GreenSlime;
