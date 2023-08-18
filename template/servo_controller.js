if (!JS_SCtrl) {
    var grove = {
        current: 0
    }
    var dip = {
        current: 0
    }

    var JS_Slider = {
        get_value: function (type) {
            return parseInt($('#slider_' + type).roundSlider('option', 'value'));
        },
        set_value: function (type, val) {
            $('#slider_' + type).roundSlider('option', 'value', val);
            JS_Slider.set_sync_val();
        },
        set_max: function (type, val) {
            const elm = $('#slider_' + type).data('roundSlider');
            elm.options.max = val;
            if (val < elm.getValue()) {
                JS_Slider.set_value(type, val);
            }
        },
        set_min: function (type, val) {
            const elm = $('#slider_' + type).data('roundSlider');
            elm.options.min = val;
            if (val > elm.getValue()) {
                JS_Slider.set_value(type, val);
            }
        },
        init_slider: function (type, gp) {
            $('#slider_' + type).roundSlider({
                name: type,
                animation: true,
                circleShape: 'quarter-bottom-left',
                sliderType: 'min-range',
                showTooltip: false,
                min: 0,
                max: 100,
                value: 0,
                showTooltip: true,
                svgMode: true,
                tooltipFormat: JS_Slider.tip_txt,
                update: JS_Slider.update,
                mouseScrollAction: true,
                keyboardAction: true,
                radius: 120,
                lineCap: 'round'
            });
        },
        tip_txt: function (args) {
            var append = '';
            if (args.id == 'slider_grove') {
                let min = JS_SCtrl.gi('angle_min_grove');
                let max = JS_SCtrl.gi('angle_max_grove');
                if (min == max) { val = 100; } else {
                    val = ((args.value - min) / (max - min)) * 100;
                } append = '<br>' + val.toFixed(0) + '%';
            } else if (args.id == 'slider_dip') {
                let min = JS_SCtrl.gi('angle_min_dip');
                let max = JS_SCtrl.gi('angle_max_dip');
                if (min == max) { val = 100; } else {
                    val = ((args.value - min) / (max - min)) * 100;
                }
                append = '<br>' + val.toFixed(0) + '%';
            }
            return args.value + append;
        },
        set_sync_val: function () {
            const s_g = $('#slider_grove').data('roundSlider');
            const s_d = $('#slider_dip').data('roundSlider');
            if (undefined != s_g) {
                if (undefined != s_d) {
                    val_d = parseInt(s_d.getValue());
                    val_g = parseInt(s_g.getValue());
                    let sy_g = JS_SCtrl.gi('sync_grove');
                    let sy_d = JS_SCtrl.gi('sync_dip');
                    if (true == s_g.options.disabled) {
                        if (true == document.getElementById('reversal_grove').checked) {
                            s_g.setValue(sy_d - val_d + sy_g);
                        } else {
                            s_g.setValue(val_d - sy_d + sy_g);
                        }
                    }
                    if (true == s_d.options.disabled) {
                        if (true == document.getElementById('reversal_dip').checked) {
                            s_d.setValue(sy_g - val_g + sy_d);
                        } else {
                            s_d.setValue(val_g - sy_g + sy_d);
                        }
                    }
                }
            }
        },
        update: function () {
            JS_Slider.set_sync_val();
            JS_Slider.send();
        },
        send: function () {
            const s_g = $('#slider_grove').data('roundSlider');
            const s_d = $('#slider_dip').data('roundSlider');
            if (undefined != s_g) {
                if (undefined != s_d) {
                    let val_g = parseInt(s_g.getValue());
                    let val_d = parseInt(s_d.getValue());
                    JS_AJAX.get('/set/value' + '?grove=' + val_g + '&dip=' + val_d).then(
                        ok => {
                        }
                        , error => alert(error.status.messages)
                    );
                }
            }
        }
    }

    var JS_SCtrl = {
        gi: function (id) {
            return parseInt(document.getElementById(id).value);
        },
        save: function (type, mode) {
            JS_AJAX.get('/config/set' + '?mode=' + mode + '&type=' + type
                + '&ln=' + JS_SCtrl.gi('limit_min_' + type)
                + '&lx=' + JS_SCtrl.gi('limit_max_' + type)
                + '&o=' + JS_SCtrl.gi('origin_' + type)
                + '&h=' + JS_SCtrl.gi('period_' + type)
                + '&pn=' + JS_SCtrl.gi('pulse_min_' + type)
                + '&px=' + JS_SCtrl.gi('pulse_max_' + type)
                + '&an=' + JS_SCtrl.gi('angle_min_' + type)
                + '&ax=' + JS_SCtrl.gi('angle_max_' + type)
                + '&se=' + (document.getElementById('sync_' + type).disabled ? 1 : 0)
                + '&sv=' + JS_SCtrl.gi('sync_' + type)
                + '&r=' + (document.getElementById('reversal_' + type).checked ? 1 : 0)
            ).then(
                ok => {
                    if (type == 'grove') {
                        JS_SCtrl.init_elm('grove', ok.data.grove);
                    } else if (type == 'dip') {
                        JS_SCtrl.init_elm('dip', ok.data.dip);
                    }
                }
                , error => alert(error.status.messages)
            );
        },
        set_elm: function (id, val) {
            if (undefined != val) {
                document.getElementById(id).value = val;
            }
        },
        set_elm_max: function (id, val) {
            if (undefined != val) {
                const elm = document.getElementById(id);
                elm.max = val;
                if (val < elm.value) {
                    JS_SCtrl.set_elm(id, val);
                }
            }
        },
        set_elm_min: function (id, val) {
            if (undefined != val) {
                const elm = document.getElementById(id);
                elm.min = val;
                if (val > elm.value) {
                    JS_SCtrl.set_elm(id, val);
                }
            }
        },
        set_limit_max: function (type, val) {
            var id = 'origin_' + type;
            JS_SCtrl.set_elm_max(id, val);
            const elm = document.getElementById(id);
            if (val < elm.min) {
                JS_SCtrl.set_elm_min(id, val);
            }
            JS_Slider.set_max(type, val);
        },
        set_limit_min: function (type, val) {
            var id = 'origin_' + type;
            JS_SCtrl.set_elm_min(id, val);
            const elm = document.getElementById(id);
            if (val > elm.max) {
                JS_SCtrl.set_elm_max(id, val);
            }
            JS_Slider.set_min(type, val);
        },
        set_angle_max: function (type, val) {
            JS_SCtrl.set_elm_max('limit_min_' + type, val);
            JS_SCtrl.set_elm_max('limit_max_' + type, val);
            JS_SCtrl.set_elm_max('angle_min_' + type, val);
            JS_SCtrl.set_limit_max(type, JS_SCtrl.gi('limit_max_' + type));
        },
        set_angle_min: function (type, val) {
            JS_SCtrl.set_elm_min('limit_min_' + type, val);
            JS_SCtrl.set_elm_min('limit_max_' + type, val);
            JS_SCtrl.set_elm_min('angle_max_' + type, val);
            JS_SCtrl.set_limit_min(type, JS_SCtrl.gi('limit_min_' + type));
        },
        change_disabled: function (type, mode) {
            document.getElementById('sync_' + type).disabled = mode;
            document.getElementById('max_' + type).disabled = mode;
            document.getElementById('reset_' + type).disabled = mode;
            document.getElementById('min_' + type).disabled = mode;
            document.getElementById('reversal_grove').disabled = mode;
            document.getElementById('reversal_dip').disabled = mode;
        },
        enable_sync: function (id) {
            let result;
            if (true == $(id).roundSlider('option', 'disabled')) {
                $(id).roundSlider('enable');
                result = true;
            } else {
                $(id).roundSlider('disable');
                result = false;
            }
            document.getElementById('sync_grove').value = JS_Slider.get_value('grove');
            document.getElementById('sync_dip').value = JS_Slider.get_value('dip');
            return result;
        },
        begin: function () {
            JS_AJAX.get('/config/get').then(
                ok => {
                    JS_SCtrl.open('grove', ok.data.grove);
                    JS_SCtrl.open('dip', ok.data.dip);

                    JS_SCtrl.init_elm('grove', ok.data.grove);
                    JS_SCtrl.init_elm('dip', ok.data.dip);


                    $('#slider_' + 'grove').roundSlider('option', 'value', ok.data.grove.sync_value);
                    $('#slider_' + 'dip').roundSlider('option', 'value', ok.data.dip.sync_value);
                    JS_Slider.set_value('grove',
                        ok.data.grove.sync_enable == 1 ? ok.data.grove.sync_value : ok.data.grove.origin);

                    JS_Slider.set_value('dip',
                        ok.data.dip.sync_enable == 1 ? ok.data.dip.sync_value : ok.data.dip.origin);

                    JS_SCtrl.set_setting('grove', ok.data.grove);
                    JS_SCtrl.set_setting('dip', ok.data.dip);
                    JS_SCtrl.init_body();
                }
                , error => alert('[' + error.status.messages + ']\\n\\nCommunication failed.\\nPlease try to reboot.')
            );
        },
        limit_vale: function (type, val) {
            if (val > JS_SCtrl.gi('limit_max_' + type)) { val = JS_SCtrl.gi('limit_max_' + type); }
            if (val < JS_SCtrl.gi('limit_min_' + type)) { val = JS_SCtrl.gi('limit_min_' + type); }
            return val;
        },
        open: function (type, data) {
            if (undefined != data) {
                document.getElementById('type_' + type).classList.remove('visibility_hidden');

                document.getElementById('reversal_' + type).addEventListener('change', () => {
                    if ("grove" == type) {
                        document.getElementById('reversal_dip').checked = document.getElementById('reversal_grove').checked;
                    }
                    else {
                        document.getElementById('reversal_grove').checked = document.getElementById('reversal_dip').checked;
                    }
                });
                document.getElementById('sync_' + type).addEventListener('click', () => {
                    if ("grove" == type) {
                        JS_SCtrl.change_disabled('dip', !JS_SCtrl.enable_sync('#slider_dip'));
                    } else {
                        JS_SCtrl.change_disabled('grove', !JS_SCtrl.enable_sync('#slider_grove'));

                    }
                });
                document.getElementById('max_' + type).addEventListener('click', () => {
                    JS_Slider.set_value(type, JS_SCtrl.gi('limit_max_' + type));
                    JS_Slider.send();
                });
                document.getElementById('reset_' + type).addEventListener('click', () => {
                    JS_Slider.set_value(type, JS_SCtrl.gi('origin_' + type));
                    JS_Slider.send();
                });
                document.getElementById('min_' + type).addEventListener('click', () => {
                    JS_Slider.set_value(type, JS_SCtrl.gi('limit_min_' + type));
                    JS_Slider.send();
                });
                document.getElementById('attach_' + type).addEventListener('click', () => {
                    JS_SCtrl.save(type, 1);
                });
                document.getElementById('load_' + type).addEventListener('click', () => {
                    JS_AJAX.get('/config/get').then(
                        ok => {
                            JS_SCtrl.init_elm(type, ok.data.grove);
                        }
                        , error => alert(error.status.messages)
                    );
                });

                document.getElementById('limit_min_' + type).addEventListener('change', (event) => {
                    JS_SCtrl.set_limit_min(type, parseInt(event.currentTarget.value));
                });
                document.getElementById('limit_max_' + type).addEventListener('change', (event) => {
                    JS_SCtrl.set_limit_max(type, parseInt(event.currentTarget.value));
                });
                //document.getElementById('origin_' + type).addEventListener('change', (event) => {
                //});
                //document.getElementById('period_' + type).addEventListener('change', (event) => {
                //});
                document.getElementById('pulse_min_' + type).addEventListener('change', (event) => {
                    JS_SCtrl.set_elm_min('pulse_max_' + type, parseInt(event.currentTarget.value));
                });
                document.getElementById('pulse_max_' + type).addEventListener('change', (event) => {
                    JS_SCtrl.set_elm_max('pulse_min_' + type, parseInt(event.currentTarget.value));
                });
                document.getElementById('angle_min_' + type).addEventListener('change', (event) => {
                    JS_SCtrl.set_angle_min(type, parseInt(event.currentTarget.value));
                });
                document.getElementById('angle_max_' + type).addEventListener('change', (event) => {
                    JS_SCtrl.set_angle_max(type, parseInt(event.currentTarget.value));
                });
                JS_Slider.init_slider(type);
            }
        },
        set_setting: function (type, data) {
            if (undefined != data) {
                if (undefined != data.reversal) {
                    document.getElementById('reversal_' + type).checked = data.reversal ? true : false;
                }
                if (undefined != data.sync_enable) {
                    var id = '#slider_' + type;
                    if (true == data.sync_enable) {
                        $(id).roundSlider('enable');
                    } else {
                        $(id).roundSlider('disable');
                    }
                    JS_SCtrl.change_disabled(type, !JS_SCtrl.enable_sync(id));
                }
                JS_SCtrl.set_elm('sync_' + type, data.sync_value);
            }
        },
        init_elm: function (type, data) {
            if (undefined != data) {
                JS_SCtrl.set_angle_min(type, data.angle_min);
                JS_SCtrl.set_angle_max(type, data.angle_max);
                JS_SCtrl.set_limit_min(type, data.limit_min);
                JS_SCtrl.set_limit_max(type, data.limit_max);
                JS_SCtrl.set_elm_min('pulse_max_' + type, data.pulse_min);
                JS_SCtrl.set_elm_max('pulse_min_' + type, data.pulse_max);
                JS_SCtrl.set_elm('angle_min_' + type, data.angle_min);
                JS_SCtrl.set_elm('angle_max_' + type, data.angle_max);
                JS_SCtrl.set_elm('limit_min_' + type, data.limit_min);
                JS_SCtrl.set_elm('limit_max_' + type, data.limit_max);
                JS_SCtrl.set_elm('pulse_min_' + type, data.pulse_min);
                JS_SCtrl.set_elm('pulse_max_' + type, data.pulse_max);
                JS_SCtrl.set_elm('period_' + type, data.period);
                JS_SCtrl.set_elm('origin_' + type, data.origin);
            }
        },
        init_body: function () {
            document.getElementById('save_data').addEventListener('click', (event) => {
                JS_SCtrl.save('grove', 0);
                JS_SCtrl.save('dip', 0);
            });
            document.getElementById('forget_data').addEventListener('click', (event) => {
                JS_AJAX.get('/config/clear').then(
                    ok => {
                        if (undefined != ok.data.grove) {
                            JS_SCtrl.init_elm('grove', ok.data.grove);
                        }
                        if (undefined != ok.data.dip) {
                            JS_SCtrl.init_elm('dip', ok.data.dip);
                        }
                    }
                    , error => alert(error.status.messages)
                );
            });
        }
    }
}

window.onload = function () {
    JS_SCtrl.begin();
};
