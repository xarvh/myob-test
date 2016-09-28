const _ = require('lodash');
const assert = require('assert');
const sinon = require('sinon');
const main = require('../main');


function assertMatch(re, string) {
    assert(re.test(string), `String "${string}" should match ${re}`);
}



describe('main', () => {

    const makeConsole = () => ({
        info: sinon.spy(),
        error: sinon.spy(),
    })

    const makeProcess = (input) => ({
        argv: [ 'node', 'main.js', input || 'test.json' ],
        exit: (function fakeExit(code) { throw new Error('exit ' + code);}),
    });


    it('complains if input is not specified', () => {
        const c = makeConsole();
        const p = _.extend(makeProcess(), { argv: [] });
        assert.throws((() => main(p, c)), 'exit -1');
        assertMatch(/input file name/, c.error.args[0][0]);
    });

    it('complains if input file cannot be loaded', () => {
        const c = makeConsole();
        const p = makeProcess('blaargh');
        assert.throws((() => main(p, c)), 'exit -1');
        assertMatch(/require .* valid/, c.error.args[0][0]);
    });

    it('complains if input file does not contain a list', () => {
        const c = makeConsole();
        const p = makeProcess('test/notAList.json');
        assert.throws((() => main(p, c)), 'exit -1');
        assertMatch(/Array/, c.error.args[0][0]);
    });

    it('complains if input file has errors', () => {
        const c = makeConsole();
        const p = makeProcess('test/hasErrors.json');
        assert.throws((() => main(p, c)), 'exit -1');
        assertMatch(/Payment 0: .* date/, c.error.args[0][0]);
    });

    it('correctly calculates David and Ryan\'s payslips', () => {
        const c = makeConsole();
        const p = makeProcess('test/dAndR.json');
        assert.throws((() => main(p, c)), 'exit 0');
        assert.equal(c.error.args.length, 0);
        assert.deepEqual(JSON.parse(c.info.args[0][0]), [
            {
                fullName: "David Rudd",
                period: "2013-03-01 - 2013-03-31",
                gross: 5004,
                net: 4082,
                super: 450,
                tax: 922,
            },
            {
                fullName: "Ryan Chen",
                period: "2013-03-01 - 2013-03-31",
                gross: 10000,
                net: 7304,
                super: 1000,
                tax: 2696,
            }
        ]);
    });
});
