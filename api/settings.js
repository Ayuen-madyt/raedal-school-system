const app = require("express")();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const Datastore = require("nedb");
const multer = require("multer");
const fileUpload = require("express-fileupload");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: process.env.APPDATA + "/Raedal-school-system/uploads",
  filename: function (req, file, callback) {
    callback(null, Date.now() + ".jpg"); //
  },
});

let upload = multer({ storage: storage });

app.use(bodyParser.json());

module.exports = app;

let settingsDB = new Datastore({
  filename:
    process.env.APPDATA + "/Raedal-school-system/server/databases/settings.db",
  autoload: true,
});

app.get("/", function (req, res) {
  res.send("Settings API");
});

app.get("/get", function (req, res) {
  settingsDB.findOne(
    {
      _id: 1,
    },
    function (err, docs) {
      res.send(docs);
    }
  );
});

app.post("/post", upload.single("imagename"), function (req, res) {
  let image = "";

  if (req.body.logo != "") {
    image = req.body.logo;
  }

  if (req.file) {
    image = req.file.filename;
  }

  if (req.body.remove == "1") {
    const path =
      process.env.APPDATA + "/Raedal-school-system/uploads/" + req.body.logo;
    try {
      fs.unlinkSync(path);
    } catch (err) {
      console.error(err);
    }

    if (!req.file) {
      image = "";
    }
  }

  let Settings = {
    _id: 1,
    settings: {
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      contact: req.body.contact,
      currency: req.body.currency,
      logo: image,
    },
  };

  if (req.body.id == "") {
    settingsDB.insert(Settings, function (err, settings) {
      if (err) res.status(500).send(err);
      else res.send(settings);
    });
  } else {
    settingsDB.update(
      {
        _id: 1,
      },
      Settings,
      {},
      function (err, numReplaced, settings) {
        if (err) res.status(500).send(err);
        else res.sendStatus(200);
      }
    );
  }
});
