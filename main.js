import { app, BrowserWindow } from "electron";

let win, a, b;

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
  win.show();
}

function createPixiWindow() {
  let w = new BrowserWindow({
    width: 512,
    height: 512,
    frame: false,
    transparent: true
  });

  w.setMenu(null);
  w.loadURL(`file://${__dirname}/src/sprite/sprite.html`);
  //w.webContents.openDevTools();
  w.show();

  return w;
}

app.on("ready", () => {
  createMainWindow();
  a = createPixiWindow();
  a.on("closed", () => {
    a = null;
  });
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
});
