// this is a script to update balances when the term ends
import { balancesDB } from "./balances";
import { feesDB } from "./fee"


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
    feesDB.find({}).sort({ date: -1 }).exec(function (err, docs) {
        if (err) {
            console.error("Error fetching fees:", err);
        } else {
            console.log(docs)
            const currentSemester = getCurrentSemester(docs);
            if (currentSemester) {
                if (currentSemester.toLowerCase() === "term 1") {
                    const nextSemester = docs?.find(doc => doc.term.toLowerCase() === "term 2")
                    console.log("next semester:", nextSemester)
                    if (docs.termEndDate === new Date().getMonth()) {
                        balancesDB.find({}).sort({ date: -1 }).exec(function (err, balanceDoc) {
                            balanceDoc.forEach(balanceDoc => {
                                balancesDB.update({ _id: balanceDoc._id },
                                    {
                                        $set: {
                                            term: nextSemester.term,
                                            balance: balanceDoc.balance + (nextSemester.total - balanceDoc.overPaidBalance),
                                            overPaidBalance: 0,
                                            date: new Date(),
                                        }
                                    }, {}, function (err, numReplaced) {
                                        if (err) {
                                            console.error("Error updating balance:", err);
                                        } else {
                                            console.log(`Balance updated for document with _id: ${balanceDoc._id}`);
                                        }
                                    });
                            })
                        })
                    }
                }
                if (currentSemester.toLowerCase() === "term 2") {
                    const nextSemester = docs?.find(doc => doc.term.toLowerCase() === "term 3")
                    console.log("heeehee next semester:", nextSemester)
                    if (docs.termEndDate === new Date().getMonth()) {
                        balancesDB.find({}).sort({ date: -1 }).exec(function (err, balanceDoc) {
                            balanceDoc.forEach(balanceDoc => {
                                balancesDB.update({ _id: balanceDoc._id },
                                    {
                                        $set: {
                                            term: nextSemester.term,
                                            balance: balanceDoc.balance + (nextSemester.total - balanceDoc.overPaidBalance),
                                            overPaidBalance: 0,
                                            date: new Date(),
                                        }
                                    }, {}, function (err, numReplaced) {
                                        if (err) {
                                            console.error("Error updating balance:", err);
                                        } else {
                                            console.log(`Balance updated for document with _id: ${balanceDoc._id}`);
                                        }
                                    });
                            })
                        })
                    }
                } else if (currentSemester.toLowerCase() === "term 3") {
                    const nextSemester = docs?.find(doc => doc.term.toLowerCase() === "term 1")
                    console.log("next semester:", nextSemester)
                    if (docs.termEndDate === new Date().getMonth()) {
                        balancesDB.find({}).sort({ date: -1 }).exec(function (err, balanceDoc) {
                            balanceDoc.forEach(balanceDoc => {
                                balancesDB.update({ _id: balanceDoc._id },
                                    {
                                        $set: {
                                            term: nextSemester.term,
                                            balance: balanceDoc.balance + (nextSemester.total - balanceDoc.overPaidBalance),
                                            overPaidBalance: 0,
                                            date: new Date(),
                                        }
                                    }, {}, function (err, numReplaced) {
                                        if (err) {
                                            console.error("Error updating balance:", err);
                                        } else {
                                            console.log(`Balance updated for document with _id: ${balanceDoc._id}`);
                                        }
                                    });
                            })
                        })
                    }
                }
            } else {
                console.log("No current semester found.");
            }
        }
    });
}



updateBalance()
