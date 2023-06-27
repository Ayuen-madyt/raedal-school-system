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

let teachersDB = new Datastore({
  filename: process.env.APPDATA + "/Raedal-school-system/server/databases/teachers.db",
  autoload: true,
});

teachersDB.ensureIndex({ fieldName: '_id', unique: true });

// Define your routes
router.get("/", function (req, res) {
  res.send("teachers API");
});

router.get("/all", function (req, res) {
  teachersDB.find({}).sort({ date: -1 }).exec(function (err, docs) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(docs);
    }
  });
});

  

router.get( "/:teacherId", function ( req, res ) {
    if ( !req.params.teacherId ) {
        res.status( 500 ).send( "ID field is required." );
    } else {
        teachersDB.findOne( {
            _id: parseInt(req.params.teacherId)
        }, function ( err, teacher ) {
            res.send( teacher );
        } );
    }
} );


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
  
    let teacher = {
      _id: parseInt(req.body.id),
      firstName: req.body.firstName,
      secondName: req.body.secondName,
      lastName: req.body.lastName,
      title: req.body.title,
      passport: req.body.passport,
      image: image,
      state: req.body.state,
      status: req.body.status,
      contact: req.body.contact,
      email: req.body.email,
    };
  
    if (req.body.id == "") {
      teacher._id = Math.floor(Date.now() / 1000);
      teachersDB.insert(teacher, function (err, teacher) {
        if (err) res.status(500).send(err);
        else res.send(teacher);
      });
    } else {
      teachersDB.update(
        {
          _id: parseInt(req.body.id),
        },
        teacher,
        {},
        function (err, numReplaced, teacher) {
          if (err) res.status(500).send(err);
          else res.sendStatus(200);
        }
      );
    }
  });


router.delete("/delete/:teacherId", function (req, res) {
    teachersDB.remove(
      {
        _id: parseInt(req.params.teacherId),
      },
      function (err, numRemoved) {
        if (err) res.status(500).send(err);
        else res.sendStatus(200);
      }
    );
  });

// Export the router
export default router;
