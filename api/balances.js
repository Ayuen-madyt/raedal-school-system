import express from "express";
import Datastore from "nedb";

const router = express.Router(); // Create a router instance

export const balancesDB = new Datastore({
  filename:
    process.env.APPDATA + "/Raedal-school-system/server/databases/balances.db",
  autoload: true,
});

balancesDB.ensureIndex({ fieldName: "_id", unique: true });

// Define your routes
router.get("/", function (req, res) {
  res.send("balances API");
});

router.get("/all", function (req, res) {
  balancesDB
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
  const { studentClass, year, term } = req.query;
  const filter = {};

  if (studentClass) {
    filter.partyClass = studentClass;
  }

  if (term) {
    filter["term.term"] = term;
  }

  balancesDB
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

router.get("/:partyId", function (req, res) {
  if (!req.params.partyId) {
    res.status(500).send("ID field is required.");
  } else {
    balancesDB.findOne(
      {
        partyAdmNo: parseInt(req.params.partyId),
      },
      function (err, balance) {
        res.send(balance);
      }
    );
  }
});

router.delete("/delete/:balanceId", function (req, res) {
  console.log("balance id: ", req.params.balanceId);
  balancesDB.remove(
    {
      _id: parseInt(req.params.balanceId),
    },
    function (err, numRemoved) {
      if (err) res.status(500).send(err);
      else res.sendStatus(200);
    }
  );
});

// Export the router
export default router;
