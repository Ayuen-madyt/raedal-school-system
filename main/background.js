import { app } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import axios from "axios";
require("../server");
require("../api/script");

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      customStyles: `
      border-bottom: 2px solid red;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      transition: background-color 0.3s ease-in-out;
    `,
    },
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    const checkUserUrl = "http://localhost:8001/api/users/check";
    axios
      .get(checkUserUrl)
      .then((res) => {
        console.log(
          "User check successful or default admin user created.",
          res
        );
      })
      .catch((error) => {
        console.error(
          "Error checking user or creating default admin:",
          error.message
        );
      });

    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
