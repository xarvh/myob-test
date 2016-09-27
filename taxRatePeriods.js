module.exports = [
    {
        start: "2012-07-01",
        end: "2013-06-30",
        brackets: [
            { bottom:      0, top:    18200, base:     0, threshold:      0, rate: 0 },
            { bottom:  18201, top:    37000, base:     0, threshold:  18200, rate: 0.19 },
            { bottom:  37001, top:    80000, base:  3572, threshold:  37000, rate: 0.325 },
            { bottom:  80001, top:   180000, base: 17547, threshold:  80000, rate: 0.37 },
            { bottom: 180001, top: Infinity, base: 54547, threshold: 180000, rate: 0.45 },
        ],
    },
];
