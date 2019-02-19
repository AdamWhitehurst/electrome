import "electron-prebuilt-compile";
import { app, BrowserWindow } from "electron";
import Sprite from "./src/sprite/sprite";
let mainWindow;
let spritePool = [];
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });
  mainWindow.setMenu(null);
  mainWindow.loadURL(`file://${__dirname}/src/main_window/main_window.html`);
  mainWindow.webContents.openDevTools();
  mainWindow.on("closed", () => {
    app.emit("window-all-closed");
    mainWindow = null;
  });

  mainWindow.show();
}

function createSprite() {
  spritePool.push(new Sprite("green_slime"));
}

app.on("ready", () => {
  createSprite();
  //createMainWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});
