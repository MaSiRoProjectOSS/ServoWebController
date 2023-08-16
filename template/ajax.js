if (!JS_AJAX) {
    var JS_AJAX = {
        post: function (url) { return JS_AJAX.debug_send("post", url); },
        get: function (url) { return JS_AJAX.debug_send("get", url); },
        debug_send: function (method, url) {
            return new Promise((resolve, reject) => {
                if (0 <= url.indexOf("/set/value")) {
                    resolve({
                        subject: url,
                        result: 'OK', status: {
                            num: 202, messages: ''
                        },
                        data: {
                            grove: {
                                limit_min: 11,
                                limit_max: 172,
                                origin: 13,
                                period: 24,
                                pulse_min: 105,
                                pulse_max: 2206,
                                angle_min: 7,
                                angle_max: 188,
                                current: 9
                            },
                            dip: {
                                limit_min: 20,
                                limit_max: 161,
                                origin: 32,
                                period: 23,
                                pulse_min: 304,
                                pulse_max: 4405,
                                angle_min: 6,
                                angle_max: 187,
                                current: 8
                            }
                        }
                    });

                } else if (0 <= url.indexOf("/set/config")) {
                    resolve({
                        subject: url,
                        result: 'OK', status: {
                            num: 202, messages: ''
                        },
                        data: {
                            grove: {
                                limit_min: 11,
                                limit_max: 172,
                                origin: 13,
                                period: 24,
                                pulse_min: 105,
                                pulse_max: 2206,
                                angle_min: 7,
                                angle_max: 188,
                                current: 9
                            },
                            dip: {
                                limit_min: 20,
                                limit_max: 161,
                                origin: 32,
                                period: 23,
                                pulse_min: 304,
                                pulse_max: 4405,
                                angle_min: 6,
                                angle_max: 187,
                                current: 8
                            }
                        }
                    });

                } else if ("/get/config" == url) {
                    resolve({
                        subject: url,
                        result: 'OK', status: {
                            num: 202, messages: ''
                        },
                        data: {
                            grove: {
                                limit_min: 11,
                                limit_max: 172,
                                origin: 13,
                                period: 24,
                                pulse_min: 105,
                                pulse_max: 2206,
                                angle_min: 7,
                                angle_max: 188,
                                current: 9
                            },
                            dip: {
                                limit_min: 20,
                                limit_max: 161,
                                origin: 32,
                                period: 23,
                                pulse_min: 304,
                                pulse_max: 4405,
                                angle_min: 6,
                                angle_max: 187,
                                current: 8
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
