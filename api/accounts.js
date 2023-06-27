import express from "express";
import Datastore from "nedb";

const router = express.Router(); // Create a router instance

export const accountsDB = new Datastore({
  filename:
    process.env.APPDATA + "/Raedal-school-system/server/databases/accounts.db",
  autoload: true,
});

accountsDB.ensureIndex({ fieldName: "_id", unique: true });

// Define your routes
router.get("/", function (req, res) {
  res.send("accounts API");
});

router.get("/all", function (req, res) {
  accountsDB.find({}).sort({ date: -1 }).exec(function (err, docs) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(docs);
    }
  });
});


router.post("/post", function (req, res) {
  console.log(req.body);

  let account1 = {
    _id: parseInt(req.body.id),
    account: "Student Receivable",
    date: req.body.date,
    party: req.body.party,
    balance: parseInt(-req.body.actualAmountPaid),
    debit: parseInt(0),
    credit: parseInt(req.body.actualAmountPaid)
  };

  let account2 = {
    _id: parseInt(req.body.id),
    account: "Fee Revenue",
    date: req.body.date,
    party: req.body.party,
    balance: parseInt(0),
    debit: parseInt(req.body.actualAmountPaid),
    credit: parseInt(0),
  };

  if (req.body.id == "") {
    account1._id = Math.floor(Date.now() / 1000);
    accountsDB.insert(account1, function (err, account1) {
      if (err) res.status(500).send(err);
      else {
        account2._id = Math.floor(Date.now() / 1000) + 1;
        accountsDB.insert(account2, function (err, account2) {
          if (err) res.status(500).send(err);
          else res.send([account1, account2]); 
        });
      }
    });
  } else {
    accountsDB.update(
      {
        _id: parseInt(req.body.id),
      },
      account1,
      {},
      function (err, numReplaced, account) {
        if (err) res.status(500).send(err);
        else {
          accountsDB.update(
            {
              _id: parseInt(req.body.id),
            },
            account2,
            {},
            function (err, numReplaced, account) {
              if (err) res.status(500).send(err);
              else res.sendStatus(200);
            }
          );
        }
      }
    );
  }
});


// Function to calculate the total of Fee Revenue and Student Receivable for the same month
router.get("/totals", function (req, res) {
  // Get the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // January is month 0
  const currentYear = currentDate.getFullYear();

  // Create variables to store the totals
  let totalFeeRevenue = 0;
  let totalStudentReceivable = 0;

  accountsDB.find({}, function (err, accounts) {
    if (err) {
      res.status(500).send(err);
    } else {
      // Iterate over the accounts and calculate the totals for the same month
      accounts.forEach(account => {
        // Extract the month and year from the account's date
        const accountDate = new Date(account.date);
        const accountMonth = accountDate.getMonth() + 1; // January is month 0
        const accountYear = accountDate.getFullYear();

        // Check if the account's date is within the same month and year
        if (accountMonth === currentMonth && accountYear === currentYear) {
          if (account.account === "Fee Revenue") {
            totalFeeRevenue += account.debit;
          } else if (account.account === "Student Receivable") {
            totalStudentReceivable += account.debit;
          }
        }
      });

      // Return the month and the totals
      const currentMonthPattern = `${currentMonth}/${currentYear}`;
      res.send({
        month: currentMonthPattern,
        totalFeeRevenue: totalFeeRevenue,
        totalStudentReceivable: totalStudentReceivable
      });
    }
  });
});




export default router;
