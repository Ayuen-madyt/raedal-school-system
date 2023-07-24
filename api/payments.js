import express from "express";
import Datastore from "nedb";
import bodyParser from "body-parser";
import async from "async";
import multer from "multer";
import fs from "fs";
import fileUpload from "express-fileupload";

const router = express.Router(); // Create a router instance

export const paymentsDB = new Datastore({
  filename:
    process.env.APPDATA + "/Raedal-school-system/server/databases/payments.db",
  autoload: true,
});

paymentsDB.ensureIndex({ fieldName: "_id", unique: true });

// Define your routes
router.get("/", function (req, res) {
  res.send("payments API");
});

router.get("/all", function (req, res) {
  paymentsDB
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

router.get("/:paymentId", function (req, res) {
  if (!req.params.paymentId) {
    res.status(500).send("ID field is required.");
  } else {
    paymentsDB.findOne(
      {
        _id: parseInt(req.params.paymentId),
      },
      function (err, payment) {
        res.send(payment);
      }
    );
  }
});

router.delete("/delete/:paymentId", function (req, res) {
  paymentsDB.remove(
    {
      _id: parseInt(req.params.paymentId),
    },
    function (err, numRemoved) {
      if (err) res.status(500).send(err);
      else res.sendStatus(200);
    }
  );
});

// Export the router
export default router;
