if (!JS_AJAX) {
    var JS_AJAX = {
        data: {
            grove: {
                angle_max: 180,
                angle_min: 0,
                current: 0,
                limit_max: 180,
                limit_min: 0,
                origin: 0,
                period: 20,
                pulse_max: 2400,
                pulse_min: 500,
                reversal: 0,
                sync_enable: 0,
                sync_value: 0
            },
            dip: {
                angle_max: 180,
                angle_min: 0,
                current: 0,
                limit_max: 180,
                limit_min: 0,
                origin: 0,
                period: 20,
                pulse_max: 2400,
                pulse_min: 500,
                reversal: 0,
                sync_enable: 0,
                sync_value: 0
            }
        },

        post: function (url) { return JS_AJAX.debug_send("post", url); },
        get: function (url) { return JS_AJAX.debug_send("get", url); },
        debug_send: function (method, url) {
            console.log("JS_AJAX.send(" + method + ", " + url + ")");
            return new Promise((resolve, reject) => {
                if (0 <= url.indexOf("/set/value")) {
                    resolve({
                        subject: url,
                        result: 'OK', status: {
                            num: 202, messages: ''
                        },
                        data: {
                            grove: {
                                angle_max: JS_AJAX.data.grove.angle_max,
                                angle_min: JS_AJAX.data.grove.angle_max,
                                current: JS_AJAX.data.grove.current,
                                limit_max: JS_AJAX.data.grove.limit_max,
                                limit_min: JS_AJAX.data.grove.limit_min,
                                origin: JS_AJAX.data.grove.origin,
                                period: JS_AJAX.data.grove.period,
                                pulse_max: JS_AJAX.data.grove.pulse_max,
                                pulse_min: JS_AJAX.data.grove.pulse_min,
                                reversal: JS_AJAX.data.grove.reversal,
                                sync_enable: JS_AJAX.data.grove.sync_enable,
                                sync_value: JS_AJAX.data.grove.sync_value
                            },
                            dip: {
                                angle_max: JS_AJAX.data.dip.angle_max,
                                angle_min: JS_AJAX.data.dip.angle_max,
                                current: JS_AJAX.data.dip.current,
                                limit_max: JS_AJAX.data.dip.limit_max,
                                limit_min: JS_AJAX.data.dip.limit_min,
                                origin: JS_AJAX.data.dip.origin,
                                period: JS_AJAX.data.dip.period,
                                pulse_max: JS_AJAX.data.dip.pulse_max,
                                pulse_min: JS_AJAX.data.dip.pulse_min,
                                reversal: JS_AJAX.data.dip.reversal,
                                sync_enable: JS_AJAX.data.dip.sync_enable,
                                sync_value: JS_AJAX.data.dip.sync_value
                            }
                        }
                    });

                } else if (0 <= url.indexOf("/config/set")) {
                    resolve({
                        subject: url,
                        result: 'OK', status: {
                            num: 202, messages: ''
                        },
                        data: {
                            grove: {
                                angle_max: 180,
                                angle_min: 0,
                                current: 0,
                                limit_max: 180,
                                limit_min: 0,
                                origin: 0,
                                period: 20,
                                pulse_max: 2400,
                                pulse_min: 500,
                                reversal: 0,
                                sync_enable: 0,
                                sync_value: 0
                            },
                            dip: {
                                angle_max: 180,
                                angle_min: 0,
                                current: 0,
                                limit_max: 180,
                                limit_min: 0,
                                origin: 0,
                                period: 20,
                                pulse_max: 2400,
                                pulse_min: 500,
                                reversal: 0,
                                sync_enable: 0,
                                sync_value: 0
                            }
                        }
                    });

                } else if (0 <= url.indexOf("/config/clear")) {
                    JS_AJAX.data.grove.angle_max = 180;
                    JS_AJAX.data.grove.angle_max = 0;
                    JS_AJAX.data.grove.current = 0;
                    JS_AJAX.data.grove.limit_max = 180;
                    JS_AJAX.data.grove.limit_min = 0;
                    JS_AJAX.data.grove.origin = 0;
                    JS_AJAX.data.grove.period = 0;
                    JS_AJAX.data.grove.pulse_max = 2400;
                    JS_AJAX.data.grove.pulse_min = 500;
                    JS_AJAX.data.grove.reversal = 0;
                    JS_AJAX.data.grove.sync_enable = 0;
                    JS_AJAX.data.grove.sync_value = 0;

                    JS_AJAX.data.dip.angle_max = 180;
                    JS_AJAX.data.dip.angle_max = 0;
                    JS_AJAX.data.dip.current = 0;
                    JS_AJAX.data.dip.limit_max = 180;
                    JS_AJAX.data.dip.limit_min = 0;
                    JS_AJAX.data.dip.origin = 0;
                    JS_AJAX.data.dip.period = 0;
                    JS_AJAX.data.dip.pulse_max = 2400;
                    JS_AJAX.data.dip.pulse_min = 500;
                    JS_AJAX.data.dip.reversal = 0;
                    JS_AJAX.data.dip.sync_enable = 0;
                    JS_AJAX.data.dip.sync_value = 0;

                    resolve({
                        subject: url,
                        result: 'OK', status: {
                            num: 202, messages: ''
                        },
                        data: {

                            grove: {
                                angle_max: JS_AJAX.data.grove.angle_max,
                                angle_min: JS_AJAX.data.grove.angle_max,
                                current: JS_AJAX.data.grove.current,
                                limit_max: JS_AJAX.data.grove.limit_max,
                                limit_min: JS_AJAX.data.grove.limit_min,
                                origin: JS_AJAX.data.grove.origin,
                                period: JS_AJAX.data.grove.period,
                                pulse_max: JS_AJAX.data.grove.pulse_max,
                                pulse_min: JS_AJAX.data.grove.pulse_min,
                                reversal: JS_AJAX.data.grove.reversal,
                                sync_enable: JS_AJAX.data.grove.sync_enable,
                                sync_value: JS_AJAX.data.grove.sync_value
                            },
                            dip: {
                                angle_max: JS_AJAX.data.dip.angle_max,
                                angle_min: JS_AJAX.data.dip.angle_max,
                                current: JS_AJAX.data.dip.current,
                                limit_max: JS_AJAX.data.dip.limit_max,
                                limit_min: JS_AJAX.data.dip.limit_min,
                                origin: JS_AJAX.data.dip.origin,
                                period: JS_AJAX.data.dip.period,
                                pulse_max: JS_AJAX.data.dip.pulse_max,
                                pulse_min: JS_AJAX.data.dip.pulse_min,
                                reversal: JS_AJAX.data.dip.reversal,
                                sync_enable: JS_AJAX.data.dip.sync_enable,
                                sync_value: JS_AJAX.data.dip.sync_value
                            }
                        }
                    });

                } else if ("/config/get" == url) {
                    resolve({
                        subject: url,
                        result: 'OK', status: {
                            num: 202, messages: ''
                        },
                        data: {
                            grove: {
                                angle_max: JS_AJAX.data.grove.angle_max,
                                angle_min: JS_AJAX.data.grove.angle_max,
                                current: JS_AJAX.data.grove.current,
                                limit_max: JS_AJAX.data.grove.limit_max,
                                limit_min: JS_AJAX.data.grove.limit_min,
                                origin: JS_AJAX.data.grove.origin,
                                period: JS_AJAX.data.grove.period,
                                pulse_max: JS_AJAX.data.grove.pulse_max,
                                pulse_min: JS_AJAX.data.grove.pulse_min,
                                reversal: JS_AJAX.data.grove.reversal,
                                sync_enable: JS_AJAX.data.grove.sync_enable,
                                sync_value: JS_AJAX.data.grove.sync_value
                            },
                            dip: {
                                angle_max: JS_AJAX.data.dip.angle_max,
                                angle_min: JS_AJAX.data.dip.angle_max,
                                current: JS_AJAX.data.dip.current,
                                limit_max: JS_AJAX.data.dip.limit_max,
                                limit_min: JS_AJAX.data.dip.limit_min,
                                origin: JS_AJAX.data.dip.origin,
                                period: JS_AJAX.data.dip.period,
                                pulse_max: JS_AJAX.data.dip.pulse_max,
                                pulse_min: JS_AJAX.data.dip.pulse_min,
                                reversal: JS_AJAX.data.dip.reversal,
                                sync_enable: JS_AJAX.data.dip.sync_enable,
                                sync_value: JS_AJAX.data.dip.sync_value
                            }
                        }
                    });
                } else {
                    reject({
                        subject: url,
                        result: 'NG', status: { num: 503, messages: 'Timeout' }
                    });
                }
            })
        },
        send: function (method, url) {
            return new Promise((resolve, reject) => {
                if ("post" != method) {
                    if ("get" != method) {
                        method = get;
                    }
                }
                const request = new XMLHttpRequest();
                request.ontimeout = () => {
                    reject({
                        subject: url,
                        result: 'NG', status: { num: 503, messages: 'Timeout' }
                    });
                };
                request.onload = function (event) {
                    if (request.readyState === 4 && request.status === 200) {
                        if (!request.responseText) {
                            reject({
                                subject: url,
                                result: 'NG', status: { num: 500, messages: 'Internal Server Error' }
                            });
                        }
                        resolve(JSON.parse(request.responseText));
                    } else {
                        reject({
                            subject: url,
                            result: 'NG', status: { num: request.status, messages: request.statusText }
                        });
                    }
                };
                request.onerror = function (event) {
                    reject({
                        subject: url,
                        result: 'NG', status: { num: 404, messages: 'Not found' }
                    });
                }
                request.timeout = 10000;
                request.open(method, url, true);
                request.send(null);
            })
        }
    }
}
