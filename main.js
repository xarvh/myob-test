#!/usr/bin/env node
const paymentToPayslip = require('./paymentToPayslip');
const taxRatePeriods = require('./taxRatePeriods');


module.exports = main;
if (require.main === module) {
    main(process, console);
}


function main(proc, con) {
    const inputFileName = proc.argv[2];
    if (!inputFileName) {
        con.error("Please specify a .json or .js input file name.");
        proc.exit(-1);
    }

    try {
        const paymentsList = require(inputFileName);
    } catch (e) {
        con.error(`failed to require ${inputFileName}, is it a valid .json/.js?`);
        proc.exit(-1);
    }

    if (!Array.isArray(paymentsList)) {
        con.error(`${inputFileName} should be an Array.`);
        proc.exit(-1);
    }

    const payslips = paymentsList.map((payment) => paymentToPayslip(payment, taxRatePeriods));
    if (payslips.some((p) => p.error)) {
        payslips.forEach(function (p, index) {
            if (p.error) {
                con.error(`Payment ${index}: ${p.error}`);
            }
        });
        proc.exit(-1);
    }

    con.info(JSON.stringify(payslips));
    proc.exit(0);
}
