const _ = require('lodash');
const assert = require('assert');
const cartography = require('cartography');
const moment = require('moment');


function formatMoment(m) {
    return m.format('YYYY-MM-DD');
}


module.exports = function paymentToPayslip(unsafePaymentInformation, taxRatePeriods) {

    const f = cartography.filters;
    const toNumber = (v) => +(v || NaN)
    const isPositive = f.assert((v) => v > 0, "must be positive");
    const isWithin = (a, b) => f.assert((v) => v >= a && v <= b, `must be within [${a},${b}]`);
    const toMoment = (v) => f.assert((m) => m.isValid(), "must be a valid ISO 8601 date")(moment(v, moment.ISO_8601));

    const outputSchema = {
        firstName: [f.required, f.isString],
        lastName: [f.required, f.isString],
        annualSalary: [f.required, toNumber, f.isInteger, isPositive],
        superRate: [f.required, toNumber, isWithin(0, 50)],
        startMoment: ['paymentStartDate', f.required, toMoment],
        endMoment: ['paymentEndDate', f.required, toMoment],
    };


    try {
        var {firstName, lastName, annualSalary, superRate, startMoment, endMoment} = cartography.map(unsafePaymentInformation, outputSchema);

        assert(startMoment.isSameOrBefore(endMoment), "paymentStartDate must be before paymentEndDate");

        // TODO: these assertions can be relaxed once we support daily/hourly rates.
        assert(startMoment.isSame(startMoment.clone().startOf('month'), 'day'), "payment start date must be the start of the month");
        assert(endMoment.isSame(endMoment.clone().endOf('month'), 'day'), "payment end date must be the end of the month");

    } catch (e) {
        return { error: e.message };
    }


    // The specs seem to indicate that the pay period should be "per calendar month" rather than "per specified period".
    var payslips = [];
    for (let monthOffset = 0; monthOffset <= endMoment.diff(startMoment, 'month'); monthOffset++) {

        const monthStart = startMoment.clone().add(monthOffset, 'month');
        const monthEnd = monthStart.clone().endOf('month');

        function findPeriod(m) {
            return _.find(taxRatePeriods, (p) => m.isSameOrAfter(p.start) && m.isSameOrBefore(p.end));
        }

        const taxRatePeriod = findPeriod(monthStart);
        if (!taxRatePeriod) {
            return { error: `could not find tax period for ${formatMoment(monthStart)}` };
        }

        // TODO: this also can be relaxed once we support daily/hourly rates.
        if (taxRatePeriod !== findPeriod(monthEnd)) {
            return { error: "unable to handle calendar months spanning two financial years" };
        }


        const bracket = _.find(taxRatePeriod.brackets, (b) => annualSalary >= b.bottom && annualSalary <= b.top);
        const gross = Math.round(annualSalary / 12);
        const tax = Math.round((bracket.base + (annualSalary - bracket.threshold) * bracket.rate) / 12);

        payslips.push({
            fullName: `${firstName} ${lastName}`,
            period: `${formatMoment(monthStart)} - ${formatMoment(monthEnd)}`,
            gross: gross,
            tax: tax,
            net: gross - tax,
            super: Math.round(gross * superRate / 100),
        });
    }

    return payslips;
}
