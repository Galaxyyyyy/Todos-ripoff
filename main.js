const { app, BrowserWindow } = require("electron");

/**
 *
 * @returns {BrowserWindow}
 */
function newWindow() {
  return new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });
}

app.whenReady().then(() => {
  const mainWindow = newWindow();
  mainWindow.maximize();
  mainWindow.setMenu(null);
  mainWindow.loadFile("./index.html");
});
app.on("window-all-closed", () => {
  app.quit();
});
