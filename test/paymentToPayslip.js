const _ = require('lodash');
const assert = require('assert');
const paymentToPayslip = require('../paymentToPayslip');


function assertMatch(re, string) {
    assert(re.test(string), `String "${string}" should match ${re}`);
}



describe('paymentToPayslip', () => {

    const tax = [
        {
            start: "2012-07-01",
            end: "2014-06-30",
            brackets: [
                { bottom:      0, top:    18200, base:     0, threshold:      0, rate: 0 },
                { bottom:  18201, top:    37000, base:     0, threshold:  18200, rate: 0.19 },
                { bottom:  37001, top:    80000, base:  3572, threshold:  37000, rate: 0.325 },
                { bottom:  80001, top:   180000, base: 17547, threshold:  80000, rate: 0.37 },
                { bottom: 180001, top: Infinity, base: 54547, threshold: 180000, rate: 0.45 },
            ],
        },
    ];


    function makePayment(obj) {
        return _.defaults(obj, {
            firstName: 'John',
            lastName: 'Smith',
            annualSalary: 56000,
            superRate: 9,
            paymentStartDate: '2013-03-01',
            paymentEndDate: '2013-03-31',
        });
    }

    it('complains if an argument is not provided', () => {
        assertMatch(/required/, paymentToPayslip().error);
        assertMatch(/required/, paymentToPayslip({}).error);
        assertMatch(/required/, paymentToPayslip({ firstName: 'lol' }).error);
    });

    it('complains if annual salary is not positive', () => {
        assertMatch(/positive/, paymentToPayslip(makePayment({ annualSalary: -2 })).error);
    });

    it('complains if super rate is out of bounds', () => {
        assertMatch(/within/, paymentToPayslip(makePayment({ superRate: -2 })).error);
        assertMatch(/within/, paymentToPayslip(makePayment({ superRate: 51 })).error);
    });

    it('complains if fed an invalid date', () => {
        assertMatch(/date/, paymentToPayslip(makePayment({ paymentEndDate: '31 March' })).error);
        assertMatch(/date/, paymentToPayslip(makePayment({ paymentEndDate: '32 March 2011' })).error);
        assertMatch(/date/, paymentToPayslip(makePayment({ paymentEndDate: 'garble!' })).error);
    });

    it('complains if start date is beyond end date', () => {
        assertMatch(/must be before/, paymentToPayslip(makePayment({ paymentEndDate: '1999-01-01' })).error);
    });

    it('complains if start date is not the very start of the month', () => {
        assertMatch(/start/, paymentToPayslip(makePayment({ paymentStartDate: '2013-01-02' })).error);
        assertMatch(/start/, paymentToPayslip(makePayment({ paymentStartDate: '2013-01-22' })).error);
        assertMatch(/start/, paymentToPayslip(makePayment({ paymentStartDate: '2013-01-31' })).error);
    });

    it('complains if end date is not the very end of the month', () => {
        assertMatch(/end/, paymentToPayslip(makePayment({ paymentEndDate: '2013-03-30' })).error);
        assertMatch(/end/, paymentToPayslip(makePayment({ paymentEndDate: '2013-03-22' })).error);
        assertMatch(/end/, paymentToPayslip(makePayment({ paymentEndDate: '2013-03-02' })).error);
    });

    it('complains if a months is divided in two financial years', () => {
        const t1 = _.extend({}, tax[0], { end: '2013-03-10' });
        const t2 = _.extend({}, tax[0], { start: '2013-03-11' });
        assertMatch(/spanning/, paymentToPayslip(makePayment(), [t1, t2]).error);
    });

    it('produces a correct single payslip', () => {
        assert.deepEqual(paymentToPayslip(makePayment(), tax), [{
            fullName: 'John Smith',
            period: '2013-03-01 - 2013-03-31',
            gross: 4667,
            tax: 812,
            net: 3855,
            super: 420,
        }]);
    });

    it('produces correct multiple payslip', () => {
        assert.deepEqual(paymentToPayslip(makePayment({ paymentEndDate: '2013-04-30' }), tax), [{
            fullName: 'John Smith',
            period: '2013-03-01 - 2013-03-31',
            gross: 4667,
            tax: 812,
            net: 3855,
            super: 420,
        }, {
            fullName: 'John Smith',
            period: '2013-04-01 - 2013-04-30',
            gross: 4667,
            tax: 812,
            net: 3855,
            super: 420,
        }]);
    });
});
