// this is a script to update balances when the term ends
import { balancesDB } from "./balances";
import { feesDB } from "./fee";
import { studentsDB } from "./students";

function getCurrentSemester(termFee) {
  const currentDate = new Date().getMonth();
  for (const term of termFee) {
    const termStartDate = term.termStartDate;
    const termEndDate = term.termEndDate;

    if (currentDate >= termStartDate && currentDate <= termEndDate) {
      return term.term;
    }
  }
  return null;
}

function updateBalance() {
  feesDB
    .find({})
    .sort({ date: -1 })
    .exec(function (err, docs) {
      if (err) {
        console.error("Error fetching fees:", err);
      } else {
        console.log(docs);
        const currentSemester = getCurrentSemester(docs);
        if (currentSemester) {
          if (currentSemester.toLowerCase() === "term 1") {
            const nextSemester = docs?.find(
              (doc) => doc.term.toLowerCase() === "term 2"
            );
            console.log("next semester:", nextSemester);
            if (docs.termEndDate === new Date().getMonth()) {
              balancesDB
                .find({})
                .sort({ date: -1 })
                .exec(function (err, balanceDoc) {
                  balanceDoc.forEach((balanceDoc) => {
                    balancesDB.update(
                      { _id: balanceDoc._id },
                      {
                        $set: {
                          term: nextSemester.term,
                          balance:
                            balanceDoc.balance +
                            (nextSemester.total - balanceDoc.overPaidBalance),
                          overPaidBalance: 0,
                          date: new Date(),
                        },
                      },
                      {},
                      function (err, numReplaced) {
                        if (err) {
                          console.error("Error updating balance:", err);
                        } else {
                          console.log(
                            `Balance updated for document with _id: ${balanceDoc._id}`
                          );
                        }
                      }
                    );
                  });
                });
            }
          }
          if (currentSemester.toLowerCase() === "term 2") {
            const nextSemester = docs?.find(
              (doc) => doc.term.toLowerCase() === "term 3"
            );
            console.log("heeehee next semester:", nextSemester);
            if (docs.termEndDate === new Date().getMonth()) {
              balancesDB
                .find({})
                .sort({ date: -1 })
                .exec(function (err, balanceDoc) {
                  balanceDoc.forEach((balanceDoc) => {
                    balancesDB.update(
                      { _id: balanceDoc._id },
                      {
                        $set: {
                          term: nextSemester.term,
                          balance:
                            balanceDoc.balance +
                            (nextSemester.total - balanceDoc.overPaidBalance),
                          overPaidBalance: 0,
                          date: new Date(),
                        },
                      },
                      {},
                      function (err, numReplaced) {
                        if (err) {
                          console.error("Error updating balance:", err);
                        } else {
                          console.log(
                            `Balance updated for document with _id: ${balanceDoc._id}`
                          );
                        }
                      }
                    );
                  });
                });
            }
          } else if (currentSemester.toLowerCase() === "term 3") {
            const nextSemester = docs?.find(
              (doc) => doc.term.toLowerCase() === "term 1"
            );
            console.log("next semester:", nextSemester);
            if (docs.termEndDate === new Date().getMonth()) {
              balancesDB
                .find({})
                .sort({ date: -1 })
                .exec(function (err, balanceDoc) {
                  balanceDoc.forEach((balanceDoc) => {
                    balancesDB.update(
                      { _id: balanceDoc._id },
                      {
                        $set: {
                          term: nextSemester.term,
                          balance:
                            balanceDoc.balance +
                            (nextSemester.total - balanceDoc.overPaidBalance),
                          overPaidBalance: 0,
                          date: new Date(),
                        },
                      },
                      {},
                      function (err, numReplaced) {
                        if (err) {
                          console.error("Error updating balance:", err);
                        } else {
                          console.log(
                            `Balance updated for document with _id: ${balanceDoc._id}`
                          );
                        }
                      }
                    );
                  });
                });
            }
          }
        } else {
          console.log("No current semester found.");
        }
      }
    });
}

// Function to promote a student to the next class or mark as graduated
function promoteStudent(student) {
  const currentClass = parseInt(student.studentClass);
  console.log("current class of each student", currentClass);

  if (!isNaN(currentClass) && currentClass < 4) {
    const nextClass = currentClass + 1;
    student.studentClass = nextClass;
  } else {
    student.studentClass = "Graduated";
  }

  studentsDB.update({ _id: student._id }, student, {}, (err, numReplaced) => {
    if (err) {
      console.error("Error updating student:", err);
    } else {
      console.log(`Student ${student.firstName} ${student.lastName} promoted.`);
    }
  });
}

function isTermOver(term, termEndDate) {
  const today = new Date().getMonth();

  if (term.toLowerCase() === "term 3") {
    return today > termEndDate;
  } else {
    return null;
  }
}

function promoteStudentsIfTermOver() {
  feesDB.find({}, (err, fees) => {
    if (err) {
      console.error("Error fetching fees from the database:", err);
    } else {
      const currentTerm = getCurrentSemester(fees);
      fees.forEach((fee) => {
        if (isTermOver(currentTerm, fee.termEndDate)) {
          studentsDB.find({}, (err, students) => {
            if (err) {
              console.error("Error fetching students from the database:", err);
            } else {
              students.forEach((student) => {
                promoteStudent(student);
              });
            }
          });
        } else {
          console.log(
            `Term ${fee.term} is not over yet. No promotion required.`
          );
        }
      });
    }
  });
}

promoteStudentsIfTermOver();

updateBalance();
