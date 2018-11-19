!function (e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else {
        var n;
        n = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, n.paymentjs = e()
    }
}(function () {
    return function e(n, t, r) {
        function o(a, u) {
            if (!t[a]) {
                if (!n[a]) {
                    var d = "function" == typeof require && require;
                    if (!u && d) return d(a, !0);
                    if (i) return i(a, !0);
                    var f = new Error("Cannot find module '" + a + "'");
                    throw f.code = "MODULE_NOT_FOUND", f
                }
                var l = t[a] = {exports: {}};
                n[a][0].call(l.exports, function (e) {
                    var t = n[a][1][e];
                    return o(t ? t : e)
                }, l, l.exports, e, n, t, r)
            }
            return t[a].exports
        }

        for (var i = "function" == typeof require && require, a = 0; a < r.length; a++) o(r[a]);
        return o
    }({
        1: [function (e, n, t) {
            n.exports = {
                userCallback: void 0, innerCallback: function (e, n) {
                    'function' == typeof this.userCallback && ('undefined' == typeof n && (n = this.error()), this.userCallback(e, n), this.userCallback = void 0)
                }, error: function (e, n) {
                    return e = 'undefined' == typeof e ? '' : e, n = 'undefined' == typeof n ? '' : n, {
                        msg: e,
                        extra: n
                    }
                }
            }
        }, {}], 2: [function (e, n, t) {
            var r = {}.hasOwnProperty, o = {};
            n.exports = o, o.channels = {
                sand_h5: e('./channel/sand_h5'),
                sand_pc: e('./channel/sand_pc'),
                bank_pc: e('./channel/bank_pc')
            }, o.getChannelModule = function (e) {
                if (r.call(o.channels, e)) return o.channels[e]
            }
        }, {"./channel/bank_pc": 3, "./channel/sand_h5": 4, "./channel/sand_pc": 5}], 3: [function (e, n, t) {
            var r = e('../utils');
            ({}).hasOwnProperty;
            n.exports = {
                handleCharge: function (e) {
                    var n = e.params, t = e.submitUrl;
                    r.formSubmitNew(t, 'post', n)
                }
            }
        }, {"../utils": 7}], 4: [function (e, n, t) {
            var r = e('../utils');
            ({}).hasOwnProperty;
            n.exports = {
                handleCharge: function (e) {
                    var n = e.params, t = e.submitUrl;
                    r.redirectTo(t + '?params=' + n)
                }
            }
        }, {"../utils": 7}], 5: [function (e, n, t) {
            var r = e('../utils');
            ({}).hasOwnProperty;
            n.exports = {
                handleCharge: function (e) {
                    var n = e.params, t = e.submitUrl;
                    r.formSubmit(t, 'post', n)
                }
            }
        }, {"../utils": 7}], 6: [function (e, n, t) {
            var r = e('./callbacks'), o = e('./channelMod'), i = {}.hasOwnProperty, PaymentSDK = function () {
            };
            PaymentSDK.prototype = {
                createPayment: function (e, n) {
                    'function' == typeof n && (r.userCallback = n);
                    var t;
                    if ('string' == typeof e) try {
                        t = JSON.parse(e)
                    } catch (e) {
                        return void r.innerCallback('fail', r.error('json_decode_fail', e))
                    } else t = e;
                    if ('undefined' == typeof t) return void r.innerCallback('fail', r.error('json_decode_fail'));
                    if (!i.call(t, 'submitUrl')) return void r.innerCallback('fail', r.error('invalid_charge', 'no_submitUrl'));
                    var a = t.payMode;
                    if (!i.call(t, 'params')) return void r.innerCallback('fail', r.error('invalid_charge', 'no_params'));
                    var u = o.getChannelModule(a);
                    u.handleCharge(t)
                }
            }, n.exports = new PaymentSDK
        }, {"./callbacks": 1, "./channelMod": 2}], 7: [function (e, n, t) {
            var r = {}.hasOwnProperty, o = n.exports = {
                stringifyData: function (e, n, t) {
                    'undefined' == typeof t && (t = !1);
                    var o = [];
                    for (var i in e) r.call(e, i) && 'function' != typeof e[i] && ('bfb_wap' == n && 'url' == i || 'yeepay_wap' == n && 'mode' == i || 'channel_url' != i && o.push(i + '=' + (t ? encodeURIComponent(e[i]) : e[i])));
                    return o.join('&')
                }, request: function (e, n, t, i, a, u) {
                    if ('undefined' == typeof XMLHttpRequest) return void console.log('Function XMLHttpRequest is undefined.');
                    var d = new XMLHttpRequest;
                    if ('undefined' != typeof d.timeout && (d.timeout = 6e3), n = n.toUpperCase(), 'GET' === n && 'object' == typeof t && t && (e += '?' + o.stringifyData(t, '', !0)), d.open(n, e, !0), 'undefined' != typeof u) for (var f in u) r.call(u, f) && d.setRequestHeader(f, u[f]);
                    'POST' === n ? (d.setRequestHeader('Content-type', 'application/json; charset=utf-8'), d.send(JSON.stringify(t))) : d.send(), 'undefined' == typeof i && (i = function () {
                    }), 'undefined' == typeof a && (a = function () {
                    }), d.onreadystatechange = function () {
                        4 == d.readyState && i(d.responseText, d.status, d)
                    }, d.onerror = function (e) {
                        a(d, 0, e)
                    }
                }, formSubmitNew: function (e, n, t) {
                    if ('undefined' == typeof window) return void console.log('Not a browser, form submit url: ' + e);
                    var o = document.createElement('form');
                    o.setAttribute('method', n), o.setAttribute('action', e), o.setAttribute('target', '_blank');
                    for (var i in t) if (r.call(t, i)) {
                        var a = document.createElement('input');
                        a.setAttribute('type', 'hidden'), a.setAttribute('name', i), a.setAttribute('value', t[i]), o.appendChild(a)
                    }
                    document.body.appendChild(o), o.submit()
                }, formSubmit: function (e, n, t) {
                    if ('undefined' == typeof window) return void console.log('Not a browser, form submit url: ' + e);
                    var o = document.createElement('form');
                    o.setAttribute('method', n), o.setAttribute('action', e);
                    for (var i in t) if (r.call(t, i)) {
                        var a = document.createElement('input');
                        a.setAttribute('type', 'hidden'), a.setAttribute('name', i), a.setAttribute('value', t[i]), o.appendChild(a)
                    }
                    document.body.appendChild(o), o.submit()
                }, randomString: function (e) {
                    'undefined' == typeof e && (e = 32);
                    for (var n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', t = n.length, r = '', o = 0; o < e; o++) r += n.charAt(Math.floor(Math.random() * t));
                    return r
                }, redirectTo: function (e) {
                    return 'undefined' == typeof window ? void console.log('Not a browser, redirect url: ' + e) : void(window.location.href = e)
                }, documentReady: function (e) {
                    return 'undefined' == typeof document ? void e() : void('loading' != document.readyState ? e() : document.addEventListener('DOMContentLoaded', e))
                }
            }
        }, {}]
    }, {}, [6])(6)
});
//# sourceMappingURL=paymentjs.js.map
