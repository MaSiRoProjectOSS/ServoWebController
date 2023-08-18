if (!JS_AJAX) {
    var JS_AJAX = {
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

                } else if ("/config/get" == url) {
                    resolve({
                        subject: url,
                        result: 'OK', status: {
                            num: 202, messages: ''
                        },
                        data: {
                            grove: {
                                angle_max: 300,
                                angle_min: 0,
                                current: 150,
                                limit_max: 200,
                                limit_min: 100,
                                origin: 175,
                                period: 30,
                                pulse_max: 2400,
                                pulse_min: 500,
                                reversal: 0,
                                sync_enable: 0,
                                sync_value: 150
                            },
                            dip: {
                                angle_max: 400,
                                angle_min: 100,
                                current: 250,
                                limit_max: 300,
                                limit_min: 200,
                                origin: 225,
                                period: 40,
                                pulse_max: 2500,
                                pulse_min: 400,
                                reversal: 1,
                                sync_enable: 1,
                                sync_value: 250
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
