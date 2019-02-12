const { app, BrowserWindow } = require("electron");
let win, pixiWindow;

function createMainWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600
  });
  //win.setIgnoreMouseEvents(true);
  win.setMenu(null);
  win.loadURL(`file://${__dirname}/src/main_window/main_window.html`);
  win.webContents.openDevTools();
  win.on("closed", () => {
    app.emit("window-all-closed");
    win = null;
  });
}

function createPixiWindow() {
  pixiWindow = new BrowserWindow({
    width: 64,
    height: 64,
    frame: false,
    transparent: true
  });
  pixiWindow.setMenu(null);
  pixiWindow.loadURL(`file://${__dirname}/src/pixi/pixi.html`);
  pixiWindow.on("closed", () => {
    pixiWindow = null;
  });
}

app.on("ready", () => {
  createMainWindow();
  createPixiWindow();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createMainWindow();
  }
  if (pixiWindow === null) {
    createPixiWindow();
  }
});
