import express from "express";
import Datastore from "nedb";
import bodyParser from "body-parser";
import async from "async";
import { paymentsDB } from "./payments";
import { balancesDB } from "./balances";
import { accountsDB } from "./accounts";
import { formatNumber } from "../renderer/components/common/formatNumber";

const router = express.Router(); // Create a router instance

let invoiceDB = new Datastore({
  filename:
    process.env.APPDATA + "/Raedal-school-system/server/databases/invoice.db",
  autoload: true,
});

invoiceDB.ensureIndex({ fieldName: "_id", unique: true });

// Define your routes
router.get("/", function (req, res) {
  res.send("invoice API");
});

router.get("/all", function (req, res) {
  invoiceDB
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

router.get("/:invoiceId", function (req, res) {
  if (!req.params.invoiceId) {
    res.status(500).send("ID field is required.");
  } else {
    invoiceDB.findOne(
      {
        _id: parseInt(req.params.invoiceId),
      },
      function (err, invoice) {
        res.send(invoice);
      }
    );
  }
});

router.post("/post", function (req, res) {
  let invoice = {
    _id: parseInt(req.body.id),
    party: req.body.party,
    term: req.body.term,
    actualAmountPaid: req.body.actualAmountPaid,
    amount: req.body.amount,
    date: req.body.date,
    status: req.body.status,
    notes: req.body.notes,
    outstandingAmount: req.body.outstandingAmount,
  };

  let payment = {
    _id: "",
    status: req.body.status,
    partyAdmNo: req.body.party._id,
    party: req.body.party.firstName + " " + req.body.party.secondName,
    amount: formatNumber(req.body.amount),
    date: req.body.date,
  };

  let balance = {
    _id: "",
    term: req.body.term,
    party: req.body.party.firstName + " " + req.body.party.secondName,
    partyClass: req.body.party.studentClass,
    partyAdmNo: req.body.party._id,
    balance: req.body.outstandingAmount < 0 ? 0 : req.body.outstandingAmount,
    overPaidBalance:
      req.body.outstandingAmount < 0 ? req.body.outstandingAmount : 0,
    date: new Date(req.body.date),
  };

  if (req.body.id == "") {
    invoice._id = Math.floor(Date.now() / 1000);
    invoiceDB.insert(invoice, function (err, newInvoice) {
      if (err) res.status(500).send(err);
      else {
        payment._id = newInvoice._id;
        balance._id = newInvoice._id;

        // Insert the payment into the paymentsDB
        paymentsDB.insert(payment, function (err, newPayment) {
          if (err) res.status(500).send(err);
          else {
            // Check if a balance already exists for the student
            balancesDB.findOne(
              { partyAdmNo: req.body.party._id },
              function (err, existingBalance) {
                if (err) {
                  res.status(500).send(err);
                } else {
                  if (existingBalance) {
                    // Balance exists, update it
                    if (req.body.outstandingAmount < 0) {
                      if (
                        existingBalance.balance >
                        Math.abs(req.body.outstandingAmount)
                      ) {
                        balancesDB.update(
                          { partyAdmNo: req.body.party._id },
                          {
                            $set: {
                              term: req.body.term,
                              balance:
                                existingBalance.balance -
                                Math.abs(req.body.outstandingAmount),
                              partyClass: req.body.party.studentClass,
                              overPaidBalance: 0,
                              date: new Date(req.body.date),
                            },
                          },
                          {},
                          function (err, numReplaced) {
                            if (err) {
                              res.status(500).send(err);
                            } else {
                              res.sendStatus(200);
                            }
                          }
                        );
                      } else if (
                        Math.abs(req.body.outstandingAmount) >
                        existingBalance.balance
                      ) {
                        balancesDB.update(
                          { partyAdmNo: req.body.party._id },
                          {
                            $set: {
                              term: req.body.term,
                              balance: 0,
                              overPaidBalance:
                                Math.abs(req.body.outstandingAmount) -
                                existingBalance.balance,
                              partyClass: req.body.party.studentClass,
                              date: new Date(req.body.date),
                            },
                          },
                          {},
                          function (err, numReplaced) {
                            if (err) {
                              res.status(500).send(err);
                            } else {
                              res.sendStatus(200);
                            }
                          }
                        );
                      }
                    }

                    if (req.body.outstandingAmount >= 0) {
                      if (
                        existingBalance.overPaidBalance >
                        req.body.outstandingAmount
                      ) {
                        balancesDB.update(
                          { partyAdmNo: req.body.party._id },
                          {
                            $set: {
                              term: req.body.term,
                              balance: 0,
                              overPaidBalance:
                                existingBalance.overPaidBalance -
                                req.body.outstandingAmount,
                              partyClass: req.body.party.studentClass,
                              date: new Date(req.body.date),
                            },
                          },
                          {},
                          function (err, numReplaced) {
                            if (err) {
                              res.status(500).send(err);
                            } else {
                              res.sendStatus(200);
                            }
                          }
                        );
                      }
                      if (
                        req.body.outstandingAmount >
                        existingBalance.overPaidBalance
                      ) {
                        balancesDB.update(
                          { partyAdmNo: req.body.party._id },
                          {
                            $set: {
                              term: req.body.term,
                              balance:
                                existingBalance.balance +
                                req.body.outstandingAmount -
                                existingBalance.overPaidBalance,
                              overPaidBalance: 0,
                              partyClass: req.body.party.studentClass,
                              date: new Date(req.body.date),
                            },
                          },
                          {},
                          function (err, numReplaced) {
                            if (err) {
                              res.status(500).send(err);
                            } else {
                              res.sendStatus(200);
                            }
                          }
                        );
                      }
                      if (req.body.outstandingAmount == 0) {
                        balancesDB.update(
                          { partyAdmNo: req.body.party._id },
                          {
                            $set: {
                              term: req.body.term,
                              balance: existingBalance.balance,
                              overPaidBalance: 0,
                              partyClass: req.body.party.studentClass,
                              date: new Date(req.body.date),
                            },
                          },
                          {},
                          function (err, numReplaced) {
                            if (err) {
                              res.status(500).send(err);
                            } else {
                              res.sendStatus(200);
                            }
                          }
                        );
                      }
                    }
                  } else {
                    // Balance doesn't exist, create a new one
                    balancesDB.insert(balance, function (err, newBalance) {
                      if (err) res.status(500).send(err);
                      else {
                        res.sendStatus(200);
                      }
                    });
                  }
                }
              }
            );
          }
        });
      }
    });
  } else {
    invoiceDB.update(
      {
        _id: parseInt(req.body.id),
      },
      invoice,
      {},
      function (err, numReplaced, invoice) {
        if (err) res.status(500).send(err);
        else res.sendStatus(200);
      }
    );
  }
});

router.delete("/delete/:invoiceId", function (req, res) {
  invoiceDB.remove(
    {
      _id: parseInt(req.params.invoiceId),
    },
    function (err, numRemoved) {
      if (err) res.status(500).send(err);
      else res.sendStatus(200);
    }
  );
});

// Export the router
export default router;
