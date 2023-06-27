import express from "express";
import Datastore from "nedb";
import bodyParser from "body-parser";
import async from "async";

const router = express.Router(); // Create a router instance

export const  feesDB = new Datastore({
  filename: process.env.APPDATA + "/Raedal-school-system/server/databases/fees.db",
  autoload: true,
});

feesDB.ensureIndex({ fieldName: '_id', unique: true });

// Define your routes
router.get("/", function (req, res) {
  res.send("staffs API");
});

router.get("/all", function (req, res) {
    feesDB.find({}, function (err, docs) {
      res.send(docs);
    });
  });
  

router.get( "/:feeId", function ( req, res ) {
    if ( !req.params.feeId ) {
        res.status( 500 ).send( "ID field is required." );
    } else {
        feesDB.findOne( {
            _id: parseInt(req.params.feeId)
        }, function ( err, fee ) {
            res.send( fee );
        } );
    }
} );


router.post("/post", function (req, res) {
    console.log(req.body)
  
    let fee = {
      _id: parseInt(req.body.id),
      fields: req.body.fields,
      total: req.body.totalAmount,
      term: req.body.term,
      termStartDate: req.body.termStartDate,
      termEndDate: req.body.termEndDate
    };
  
    if (req.body.id == "") {
      fee._id = Math.floor(Date.now() / 1000);
      feesDB.insert(fee, function (err, fee) {
        if (err) res.status(500).send(err);
        else res.send(fee);
      });
    } else {
      feesDB.update(
        {
          _id: parseInt(req.body.id),
        },
        fee,
        {},
        function (err, numReplaced, fee) {
          if (err) res.status(500).send(err);
          else res.sendStatus(200);
        }
      );
    }
  });


router.delete("/delete/:feeId", function (req, res) {
    feesDB.remove(
      {
        _id: parseInt(req.params.feeId),
      },
      function (err, numRemoved) {
        if (err) res.status(500).send(err);
        else res.sendStatus(200);
      }
    );
  });

// Export the router
export default router;
