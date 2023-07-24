import express from "express";
import Datastore from "nedb";
import bodyParser from "body-parser";
import async from "async";
import multer from "multer";
import fs from "fs";
import fileUpload from "express-fileupload";

const router = express.Router(); // Create a router instance

const storage = multer.diskStorage({
  destination: process.env.APPDATA + "/Raedal-school-system/uploads",
  filename: function (req, file, callback) {
    callback(null, Date.now() + ".jpg"); //
  },
});

const upload = multer({ storage: storage });

export const studentsDB = new Datastore({
  filename:
    process.env.APPDATA + "/Raedal-school-system/server/databases/students.db",
  autoload: true,
});

studentsDB.ensureIndex({ fieldName: "_id", unique: true });

// Define your routes
router.get("/", function (req, res) {
  res.send("Students API");
});

router.get("/all", function (req, res) {
  studentsDB
    .find({})
    .sort({ date: -1 })
    .exec(function (err, docs) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(docs);
      }
    });
});

router.get("/filter", function (req, res) {
  const { studentClass, status } = req.query;
  const filter = {};

  if (studentClass) {
    filter.studentClass = studentClass;
  }

  if (status) {
    filter.status = status;
  }

  studentsDB
    .find(filter)
    .sort({ date: -1 })
    .exec(function (err, docs) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(docs);
      }
    });
});

router.get("/:studentId", function (req, res) {
  if (!req.params.studentId) {
    res.status(500).send("ID field is required.");
  } else {
    studentsDB.findOne(
      {
        _id: parseInt(req.params.studentId),
      },
      function (err, student) {
        res.send(student);
      }
    );
  }
});

router.post("/post", upload.single("imagename"), function (req, res) {
  let image = "";

  if (req.body.img != "") {
    image = req.body.img;
  }
  if (req.file) {
    image = req.file.filename;
  }

  console.log("image here:", image);

  if (req.body.remove == "1") {
    const path =
      process.env.APPDATA + "/Raedal-school-system/uploads/" + req.body.img;
    try {
      fs.unlinkSync(path);
    } catch (err) {
      console.error(err);
    }

    if (!req.file) {
      image = "";
    }
  }

  let student = {
    _id: parseInt(req.body.id),
    firstName: req.body.firstName,
    secondName: req.body.secondName,
    lastName: req.body.lastName,
    image: image,
    studentClass: req.body.studentClass,
    state: req.body.state,
    status: req.body.status,
    town: req.body.town,
    studentPhone: req.body.studentPhone,
    studentEmail: req.body.studentEmail,
    parentPhone: req.body.parentPhone,
    parentEmail: req.body.parentEmail,
  };

  if (req.body.id == "") {
    student._id = Math.floor(Date.now() / 1000);
    studentsDB.insert(student, function (err, student) {
      if (err) res.status(500).send(err);
      else res.send(student);
    });
  } else {
    studentsDB.update(
      {
        _id: parseInt(req.body.id),
      },
      student,
      {},
      function (err, numReplaced, student) {
        if (err) res.status(500).send(err);
        else res.sendStatus(200);
      }
    );
  }
});

router.delete("/delete/:studentId", function (req, res) {
  studentsDB.remove(
    {
      _id: parseInt(req.params.studentId),
    },
    function (err, numRemoved) {
      if (err) res.status(500).send(err);
      else res.sendStatus(200);
    }
  );
});

// Export the router
export default router;
