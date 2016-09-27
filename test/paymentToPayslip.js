const _ = require('lodash');
const assert = require('assert');
const paymentToPayslip = require('../paymentToPayslip');


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
        assert(/required/.test(paymentToPayslip().error));
        assert(/required/.test(paymentToPayslip({}).error));
        assert(/required/.test(paymentToPayslip({ firstName: 'lol' }).error));
    });

    it('complains if annual salary is not positive', () => {
        assert(/positive/.test(paymentToPayslip(makePayment({ annualSalary: -2 })).error));
    });

    it('complains if super rate is out of bounds', () => {
        assert(/within/.test(paymentToPayslip(makePayment({ superRate: -2 })).error));
        assert(/within/.test(paymentToPayslip(makePayment({ superRate: 51 })).error));
    });

    it('complains if fed an invalid date', () => {
        assert(/date/.test(paymentToPayslip(makePayment({ paymentEndDate: '31 March' })).error));
        assert(/date/.test(paymentToPayslip(makePayment({ paymentEndDate: '32 March 2011' })).error));
        assert(/date/.test(paymentToPayslip(makePayment({ paymentEndDate: 'garble!' })).error));
    });

    it('complains if start date is beyond end date', () => {
        assert(/must be before/.test(paymentToPayslip(makePayment({ paymentEndDate: '1999-01-01' })).error));
    });

    it('complains if start date is not the very start of the month', () => {
        assert(/start/.test(paymentToPayslip(makePayment({ paymentStartDate: '2013-01-02' })).error));
        assert(/start/.test(paymentToPayslip(makePayment({ paymentStartDate: '2013-01-22' })).error));
        assert(/start/.test(paymentToPayslip(makePayment({ paymentStartDate: '2013-01-31' })).error));
    });

    it('complains if end date is not the very end of the month', () => {
        console.log((paymentToPayslip(makePayment({ paymentEndDate: '2013-03-30' })).error));
        assert(/end/.test(paymentToPayslip(makePayment({ paymentEndDate: '2013-03-30' })).error));
        assert(/end/.test(paymentToPayslip(makePayment({ paymentEndDate: '2013-03-22' })).error));
        assert(/end/.test(paymentToPayslip(makePayment({ paymentEndDate: '2013-03-02' })).error));
    });

    it('complains if a months is divided in two financial years', () => {
        //TODO
    });


    // TODO: test success

});
