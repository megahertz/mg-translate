/* jshint -W101,-W074 */
// jscs:disable
var testsData = {
    ruPlural: function(p) {
        var n = Math.abs(p) || 0, i = Math.floor(n, 10) || 0, v = ((p + '').split('.')[1] || '').length, i10 = i % 10, i100 = i % 100;
        return v === 0 && i10 === 1 && i100 !== 11 ? 0 : v === 0 && (i10 >= 2 && i10 <= 4) && !(i100 >= 12 && i100 <= 14) ? 1 : v === 0 && i10 === 0 || v === 0 && (i10 >= 5 && i10 <= 9) || v === 0 && (i100 >= 11 && i100 <= 14) ? 2 : 3;
    }
};