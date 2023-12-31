!function(t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e(require("jspdf"), require("html2canvas")) : "function" == typeof define && define.amd ? define(["jspdf", "html2canvas"], e) : "object" == typeof exports ? exports["jspdf-html2canvas"] = e(require("jspdf"), require("html2canvas")) : t.html2PDF = e(t.jspdf, t.html2canvas)
}(self, ((t,e)=>(()=>{
    "use strict";
    var n = {
        498: t=>{
            t.exports = e
        }
        ,
        676: e=>{
            e.exports = t
        }
    }
      , o = {};
    function r(t) {
        var e = o[t];
        if (void 0 !== e)
            return e.exports;
        var a = o[t] = {
            exports: {}
        };
        return n[t](a, a.exports, r),
        a.exports
    }
    r.n = t=>{
        var e = t && t.__esModule ? ()=>t.default : ()=>t;
        return r.d(e, {
            a: e
        }),
        e
    }
    ,
    r.d = (t,e)=>{
        for (var n in e)
            r.o(e, n) && !r.o(t, n) && Object.defineProperty(t, n, {
                enumerable: !0,
                get: e[n]
            })
    }
    ,
    r.o = (t,e)=>Object.prototype.hasOwnProperty.call(t, e);
    var a = {};
    return (()=>{
        r.d(a, {
            default: ()=>g
        });
        var t = r(676)
          , e = r(498)
          , n = r.n(e);
        const o = {
            jsPDF: {
                unit: "pt",
                format: "a4"
            },
            html2canvas: {
                imageTimeout: 15e3,
                logging: !0,
                useCORS: !1
            },
            margin: {
                right: 0,
                top: 0,
                bottom: 0,
                left: 0
            },
            imageType: "image/jpeg",
            imageQuality: 1,
            autoResize: !0,
            output: "jspdf-generate.pdf",
            watermark: void 0,
            init: function() {},
            success: function(t) {
                t.save(this.output)
            }
        }
          , i = window.devicePixelRatio
          , f = {
            "image/jpeg": "JPEG",
            "image/png": "PNG",
            "image/webp": "WEBP"
        }
          , c = function(t) {
            return f[t]
        }
          , s = function(t, e, n) {
            let {pdf: o, pdfContentWidth: r, pdfContentHeight: a, pdfWidth: f, pdfHeight: s, position: p, currentPage: d, pageOfCurrentNode: u} = e;
            const {pageData: l, printWidth: g, printHeight: m} = function({canvas: t, pdf: e, pdfContentWidth: n, opts: o}) {
                const r = t.toDataURL(o.imageType, o.imageQuality)
                  , a = e.getImageProperties(r);
                return {
                    pageData: r,
                    printWidth: o.autoResize ? n : a.width / i,
                    printHeight: o.autoResize ? n / a.width * a.height : a.height / i
                }
            }({
                canvas: t,
                pdf: o,
                pdfContentWidth: r,
                opts: n
            });
            let h = m;
            p < 0 && (o.addPage(),
            d += 1,
            u = 1,
            p = 0);
            const {margin: v} = n;
            for (; h > 0; ) {
                if (o.addImage(l, c(n.imageType), v.left, p + v.top * u + v.bottom * (u - 1), g, m),
                o.setFillColor(255, 255, 255),
                o.rect(0, 0, f, v.top, "F"),
                o.rect(0, s - v.bottom, f, v.bottom, "F"),
                h < a) {
                    p -= h;
                    break
                }
                h -= a,
                p -= s,
                o.addPage(),
                d += 1,
                u += 1
            }
            !function(t, e, n, o, r) {
                t.pdf = e,
                t.position = n,
                t.currentPage = o,
                t.pageOfCurrentNode = r
            }(e, o, p, d, u)
        };
        const p = function(t, e) {
            return n = this,
            o = void 0,
            a = function*() {
                e.watermark && (yield function(t, e) {
                    return new Promise((n=>{
                        var o;
                        const r = new Image
                          , a = "string" == typeof e.watermark ? e.watermark : "function" != typeof e.watermark && (null === (o = e.watermark) || void 0 === o ? void 0 : o.src)
                          , i = ()=>{
                            t.pdf = function(t, e) {
                                var n, o;
                                const r = t.internal.getNumberOfPages();
                                if ("function" == typeof e.watermark)
                                    for (let n = 1; n <= r; n++) {
                                        t.setPage(n);
                                        const o = {
                                            pdf: t,
                                            pageNumber: n,
                                            totalPageNumber: r
                                        };
                                        e.watermark.call(e, o)
                                    }
                                else if (e.watermarkImg) {
                                    const a = t.getImageProperties(e.watermarkImg)
                                      , i = "string" != typeof e.watermark && (null === (n = e.watermark) || void 0 === n ? void 0 : n.scale) || 1;
                                    for (let n = 1; n <= r; n++)
                                        if (t.setPage(n),
                                        "string" != typeof e.watermark && (null === (o = e.watermark) || void 0 === o ? void 0 : o.handler)) {
                                            const o = {
                                                pdf: t,
                                                pageNumber: n,
                                                totalPageNumber: r,
                                                imgNode: e.watermarkImg
                                            };
                                            e.watermark.handler.call(e, o)
                                        } else
                                            t.addImage(e.watermarkImg, c("image/png"), (t.internal.pageSize.width - a.width * i) / 2, (t.internal.pageSize.height - a.height * i) / 2, a.width * i, a.height * i)
                                } else
                                    console.warn('[jspdf-html2canvas] "watermark" option should be either "string" or "function" type.');
                                return t
                            }(t.pdf, e),
                            n(null)
                        }
                        ;
                        a ? (r.onload = function() {
                            e.watermarkImg = r,
                            i()
                        }
                        ,
                        r.crossOrigin = "Anonymous",
                        r.src = a) : "function" == typeof e.watermark && i()
                    }
                    ))
                }(t, e))
            }
            ,
            new ((r = void 0) || (r = Promise))((function(t, e) {
                function i(t) {
                    try {
                        c(a.next(t))
                    } catch (t) {
                        e(t)
                    }
                }
                function f(t) {
                    try {
                        c(a.throw(t))
                    } catch (t) {
                        e(t)
                    }
                }
                function c(e) {
                    var n;
                    e.done ? t(e.value) : (n = e.value,
                    n instanceof r ? n : new r((function(t) {
                        t(n)
                    }
                    ))).then(i, f)
                }
                c((a = a.apply(n, o || [])).next())
            }
            ));
            var n, o, r, a
        };
        function d(t) {
            return null !== t && "object" == typeof t
        }
        function u(t) {
            return "function" == typeof t
        }
        function l(t, e) {
            for (let n = 0, o = Object.keys(t); n < o.length; n++) {
                const r = o[n];
                if (r in e) {
                    const n = d(t[r])
                      , o = d(e[r]);
                    n && o ? u(t[r]) && u(e[r]) ? u(t[r]) && !u(e[r]) ? console.error(`[jspdf-html2canvas] config key "${r}" type invalid`) : t[r] = e[r] : t[r] = l(t[r], e[r]) : o ? (e[r].old = t[r],
                    t[r] = e[r]) : n ? t[r].new = e[r] : t[r] = e[r],
                    delete e[r]
                }
            }
            return Object.assign(t, e)
        }
        const g = function(e, r={}) {
            return a = this,
            i = void 0,
            c = function*() {
                const a = l(o, r)
                  , i = function(e) {
                    const {margin: n} = e
                      , o = new t.jsPDF(e.jsPDF)
                      , r = o.internal.pageSize.getWidth()
                      , a = o.internal.pageSize.getHeight();
                    return {
                        pdf: o,
                        pdfWidth: r,
                        pdfHeight: a,
                        pdfContentWidth: r - (n.left + n.right),
                        pdfContentHeight: a - (n.top + n.bottom),
                        position: 0,
                        currentPage: 1,
                        pageOfCurrentNode: 1
                    }
                }(a);
                if (a.init.call(a, i.pdf),
                "length"in e)
                    for (let t = 0; t < e.length; t++) {
                        const o = yield n()(e[t], a.html2canvas);
                        s(o, i, a)
                    }
                else {
                    const t = yield n()(e, a.html2canvas);
                    s(t, i, a)
                }
                return yield p(i, a),
                a.success.call(r, i.pdf),
                i.pdf
            }
            ,
            new ((f = void 0) || (f = Promise))((function(t, e) {
                function n(t) {
                    try {
                        r(c.next(t))
                    } catch (t) {
                        e(t)
                    }
                }
                function o(t) {
                    try {
                        r(c.throw(t))
                    } catch (t) {
                        e(t)
                    }
                }
                function r(e) {
                    var r;
                    e.done ? t(e.value) : (r = e.value,
                    r instanceof f ? r : new f((function(t) {
                        t(r)
                    }
                    ))).then(n, o)
                }
                r((c = c.apply(a, i || [])).next())
            }
            ));
            var a, i, f, c
        }
    }
    )(),
    a.default
}
)()));
