// hub.min.js v1.0.0
function _typeof(t) {
    return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
        return typeof t
    } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
    })(t)
}

!function (t, n) {
    "object" === ("undefined" == typeof exports ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define(n) : (t = "undefined" != typeof globalThis ? globalThis : t || self).$hub = n()
}(this, function () {
    "use strict";

    function _(t, n, e) {
        void 0 !== t[n] && t[n].forEach(function (t, n) {
            t(e)
        })
    }

    var h = {
        iterator: function (t, n, e, o) {
            var i = this;
            2 !== arguments.length || e ? 3 !== arguments.length || o ? n < t.length ? e(t[n], function () {
                i.iterator(t, ++n, e, o)
            }) : n >= t.length - 1 && o && o() : this.iterator(t, 0, n, e) : this.iterator(t, 0, n, null)
        }, await: function (t, n) {
            t.then ? t.then(function (t) {
                n && n(t)
            }) : n && n(t)
        }
    };
    var t = {}, n = {};
    return {
        observer: t, data: n, chainer: {}, socket: {ws: [], io: []}, emit: function (c, f) {
            function t(t) {
                var n, e, o, i;
                if (0 === c.indexOf("@store/") && (n = c.split("@store/")[1], void 0 !== a[n] && (a[n] = f)), 0 === c.indexOf("@chain/")) {
                    var r = c.split("@chain/")[1];
                    if (void 0 !== s[r]) return e = s[r], o = f, i = function (t) {
                        _(u, c, t)
                    }, void h.iterator(e, function (t, n) {
                        h.await(t(o), function (t) {
                            o = t, n()
                        })
                    }, function () {
                        i(o)
                    })
                }
                _(u, t, f)
            }

            var u = this.observer, a = this.data, s = this.chainer;
            c instanceof Array ? c.forEach(t) : t(c)
        }, on: function (t, e) {
            function n(t) {
                var n;
                void 0 === i[t] && (i[t] = []), i[t].push(e), 0 === t.indexOf("@store/") && (n = t.split("@store/")[1], void 0 !== r[n] && e(r[n]))
            }

            var o = this, i = this.observer, r = this.data, c = {};
            return (c.key = t) instanceof Array ? (t.forEach(n), c.off = function () {
                return t.forEach(function (t) {
                    return o.off(t, e)
                })
            }) : (n(t), c.off = function () {
                return o.off(t, e)
            }), c
        }, off: function (t, o) {
            function n(e) {
                void 0 !== i[e] && i[e].forEach(function (t, n) {
                    t === o && i[e].splice(n, 1)
                })
            }

            var i = this.observer;
            t instanceof Array ? t.forEach(n) : n(t)
        }, store: function (i, r) {
            try {
                return new window.Proxy({}, {
                    get: function (t, n) {
                        return i[n]
                    }, set: function (t, n, e) {
                        var o;
                        i[n] && i[n] === e || (i[n] = e, o = "@store/".concat(n), void 0 !== r[o] && r[o].forEach(function (t, n) {
                            return t(e)
                        }))
                    }
                })
            } catch (t) {
                console.error('[hub.js] Browser not support "Proxy"')
            }
        }(n, t), DOM: function (t) {
            var o = this;
            if (t) {
                var e = "string" == typeof t ? document.body.querySelector(t) : t;
                if (e) {
                    var i = this.emit, n = this.converter, r = {}, c = [], f = function (t) {
                        var e, n, o, i, r = t.type;
                        c.forEach(function (t, n) {
                            "__from__" === t.type && t.func === r && (e = n)
                        }), void 0 === e || 0 < (n = c.slice(e + 1, c.length)).length && (o = t, i = !1, h.iterator(n, function (t, n) {
                            if (!i) switch (t.type) {
                                case"__convert__":
                                    h.await(t.func(o), function (t) {
                                        o = t, n()
                                    });
                                    break;
                                case"__emit__":
                                    t.func(o), n();
                                    break;
                                case"__from__":
                                    i = !0, n()
                            }
                        }))
                    };
                    return r.convert = function (t) {
                        return n[t] && c.push({type: "__convert__", func: n[t]}), r
                    }, r.from = function (t) {
                        return c.push({type: "__from__", func: t}), e.addEventListener(t, f), r
                    }, r.emit = function (n, e) {
                        return c.push({
                            type: "__emit__", func: function (t) {
                                e ? i.bind(o)(n, {event: t, data: e}) : i.bind(o)(n, t)
                            }
                        }), r
                    }, r.off = function () {
                        c.forEach(function (t, n) {
                            "__from__" === t.type && e.removeEventListener(t.func, f)
                        })
                    }, r
                }
            }
        }, Fetch: function (t) {
            var o = this, n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
            if (t) {
                var i, r = this.emit, e = this.converter, c = {}, f = [], u = function (e) {
                    0 < f.length && h.iterator(f, function (t, n) {
                        switch (t.type) {
                            case"__convert__":
                                h.await(t.func(e), function (t) {
                                    e = t, n()
                                });
                                break;
                            case"__emit__":
                                t.func(e)
                        }
                    })
                };
                return c.convert = function (t) {
                    return e[t] && f.push({type: "__convert__", func: e[t]}), c
                }, c.emit = function (n, e) {
                    return f.push({
                        type: "__emit__", func: function (t) {
                            e ? r.bind(o)(n, {result: t, data: e}) : r.bind(o)(n, t)
                        }
                    }), i && clearTimeout(i), i = setTimeout(function () {
                        c.reload()
                    }, 0), c
                }, c.reload = function () {
                    window.fetch(t, n).then(function (t) {
                        200 === t.status && t.json ? t.json().then(u) : u(t)
                    }).catch(function (t) {
                        u(t)
                    })
                }, c
            }
        }, WS: function (t) {
            var o = this;
            if (t) {
                var i = this.emit, n = this.socket, e = this.converter, r = {}, c = [], f = new window.WebSocket(t);
                n.ws.push({url: t, socket: n}), r.socket = f;
                var u = function (n) {
                    if (n.data) try {
                        a(JSON.parse(n.data))
                    } catch (t) {
                        a(n.data)
                    } else a(n)
                };
                f.addEventListener("message", u);
                var a = function (t) {
                    var e;
                    0 < c.length && (e = t, h.iterator(c, function (t, n) {
                        switch (t.type) {
                            case"__convert__":
                                h.await(t.func(e), function (t) {
                                    e = t, n()
                                });
                                break;
                            case"__emit__":
                                t.func(e), n()
                        }
                    }))
                };
                return r.convert = function (t) {
                    return e[t] && c.push({type: "__convert__", func: e[t]}), r
                }, r.emit = function (n, e) {
                    return c.push({
                        type: "__emit__", func: function (t) {
                            e ? i.bind(o)(n, {result: t, data: e}) : i.bind(o)(n, t)
                        }
                    }), r
                }, r.off = function () {
                    f.removeEventListener("message", u)
                }, r
            }
        }, IO: function (t) {
            var o = this;
            if (t) {
                var i = this.emit, n = this.socket, e = this.converter, r = {}, u = [], c = window.io(t);
                r.socket = c, n.io.push({url: t, socket: n});
                return r.convert = function (t) {
                    return e[t] && u.push({type: "__convert__", func: e[t]}), r
                }, r.from = function (f) {
                    function t(t) {
                        var e, n, o, i, r, c;
                        e = f, n = t, u.forEach(function (t, n) {
                            "__from__" === t.type && t.func === e && (o = n)
                        }), void 0 === o || 0 < (i = u.slice(o + 1, u.length)).length && (r = n, c = !1, h.iterator(i, function (t, n) {
                            if (!c) switch (t.type) {
                                case"__convert__":
                                    h.await(t.func(r), function (t) {
                                        r = t, n()
                                    });
                                    break;
                                case"__emit__":
                                    t.func(r), n();
                                    break;
                                case"__from__":
                                    c = !0, n()
                            }
                        }))
                    }

                    return u.push({type: "__from__", func: f, _eventListener: t}), c.on(f, t), r
                }, r.emit = function (n, e) {
                    return u.push({
                        type: "__emit__", func: function (t) {
                            e ? i.bind(o)(n, {event: t, data: e}) : i.bind(o)(n, t)
                        }
                    }), r
                }, r.off = function () {
                    u.forEach(function (t, n) {
                        "__from__" === t.type && c.off(t.func, t._eventListener)
                    })
                }, r
            }
        }, chain: function (o) {
            var i = this.chainer, r = {
                pipe: function () {
                    for (var t = arguments.length, n = new Array(t), e = 0; e < t; e++) n[e] = arguments[e];
                    return i[o] ? i[o] = i[o].concat(n) : i[o] = n, r
                }
            };
            return r
        }, converter: {}, once: function (t, n) {
            var e = this.on(t, function (t) {
                n(t), e.off()
            })
        }
    }
});
//# sourceMappingURL=hub.min.js.map
