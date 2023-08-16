if (!JS_SCtrl) {
    var grove = {
        limit_min: 0, limit_max: 180,
        origin: 0,
        period: 20,
        pulse_min: 500, pulse_max: 2400,
        angle_min: 0, angle_max: 180,
        sync_val: 0,
        current: 0,
        reversal: false
    }
    var dip = {
        limit_min: 0, limit_max: 180,
        origin: 0,
        period: 20,
        pulse_min: 500, pulse_max: 2400,
        angle_min: 0, angle_max: 180,
        sync_val: 0,
        current: 0,
        reversal: false
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
            const elm = $('#slider_grove').data('roundSlider');
            elm.options.max = val;
            if (val < elm.getValue()) {
                JS_Slider.set_value(type, val);
            }
        },
        set_min: function (type, val) {
            const elm = $('#slider_grove').data('roundSlider');
            elm.options.min = val;
            if (val > elm.getValue()) {
                JS_Slider.set_value(type, val);
            }
        },
        init_slider: function (id) {
            $(id).roundSlider({
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
                val = ((args.value - grove.angle_min) / (grove.angle_max - grove.angle_min)) * 100;
                append = '<br>' + val.toFixed(0) + '%';
            } else if (args.id == 'slider_dip') {
                val = ((args.value - dip.angle_min) / (dip.angle_max - dip.angle_min)) * 100;
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
                    if (true == s_g.options.disabled) {
                        if (true == grove.reversal) {
                            s_g.setValue(dip.sync_val - val_d + grove.sync_val);
                        } else {
                            s_g.setValue(val_d - dip.sync_val + grove.sync_val);
                        }
                    }
                    val_g = parseInt(s_g.getValue());
                    if (true == s_d.options.disabled) {
                        if (true == dip.reversal) {
                            s_d.setValue(grove.sync_val - val_g + dip.sync_val);
                        } else {
                            s_d.setValue(val_g - grove.sync_val + dip.sync_val);
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
                            grove.current = ok.data.grove;
                            dip.current = ok.data.dip;
                        }
                        , error => alert(error.status.messages)
                    );
                }
            }
        }
    }

    var JS_SCtrl = {
        save_before: function (type, data) {
            data.limit_min = document.getElementById('limit_min_' + type).value;
            data.limit_max = document.getElementById('limit_max_' + type).value;
            data.origin = document.getElementById('origin_' + type).value;
            data.period = document.getElementById('period_' + type).value;
            data.pulse_min = document.getElementById('pulse_min_' + type).value;
            data.pulse_max = document.getElementById('pulse_max_' + type).value;
            data.angle_min = document.getElementById('angle_min_' + type).value;
            data.angle_max = document.getElementById('angle_max_' + type).value;
            //data.sync_val = 0;
            data.current = JS_Slider.get_value(type);
            data.reversal = document.getElementById('reversal_' + type).checked;
        },
        save: function (type, data, mode) {
            JS_SCtrl.save_before(type, data);
            JS_AJAX.get('/set/config' + '?mode=' + mode + '&type=' + type
                + '&ln=' + data.limit_min
                + '&lx=' + data.limit_max
                + '&o=' + data.origin
                + '&h=' + data.period
                + '&pn=' + data.pulse_min
                + '&px=' + data.pulse_max
                + '&an=' + data.angle_min
                + '&ax=' + data.angle_max
                + '&s=' + data.sync_val
                + '&r=' + (data.reversal ? 1 : 0)
            ).then(
                ok => {
                    JS_SCtrl.copy_data(ok.data.dip, dip);
                    JS_SCtrl.init_elm('dip', dip);
                }
                , error => alert(error.status.messages)
            );
        },
        set_elm_max: function (id, val) {
            const elm = document.getElementById(id);
            elm.max = val;
            if (val < elm.value) {
                elm.value = val;
            }
        },
        set_elm_min: function (id, val) {
            const elm = document.getElementById(id);
            elm.min = val;
            if (val > elm.value) {
                elm.value = val;
            }
        },
        set_limit_max: function (type, val) {
            JS_SCtrl.set_elm_max('origin_' + type, val);
            JS_Slider.set_max(type, val);
        },
        set_limit_min: function (type, val) {
            JS_SCtrl.set_elm_min('origin_' + type, val);
            JS_Slider.set_min(type, val);
        },
        set_angle_max: function (type, val) {
            JS_SCtrl.set_elm_max('limit_min_' + type, val);
            JS_SCtrl.set_elm_max('limit_max_' + type, val);
            JS_SCtrl.set_elm_max('angle_min_' + type, val);
            JS_SCtrl.set_limit_max(type, parseInt(document.getElementById('limit_max_' + type).value));
        },
        set_angle_min: function (type, val) {
            JS_SCtrl.set_elm_min('limit_min_' + type, val);
            JS_SCtrl.set_elm_min('limit_max_' + type, val);
            JS_SCtrl.set_elm_min('angle_max_' + type, val);
            JS_SCtrl.set_limit_min(type, parseInt(document.getElementById('limit_min_' + type).value));
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
            grove.sync_val = JS_Slider.get_value('grove');
            dip.sync_val = JS_Slider.get_value('dip');
            return result;
        },
        begin: function () {
            JS_AJAX.get('/get/config').then(
                ok => JS_SCtrl.set_config(ok)
                , error => alert('[' + error.status.messages + ']\\n\\nCommunication failed.\\nPlease try to reboot.')
            );
        },
        cp: function (src, dst) {
            if (undefined != src) {
                dst = src;
            }
        },
        copy_data: function (src, dst) {
            if (undefined != src) {
                JS_SCtrl.cp(src.limit_min, dst.limit_min);
                JS_SCtrl.cp(src.limit_max, dst.limit_max);
                JS_SCtrl.cp(src.origin, dst.origin);
                JS_SCtrl.cp(src.period, dst.period);
                JS_SCtrl.cp(src.pulse_min, dst.pulse_min);
                JS_SCtrl.cp(src.pulse_max, dst.pulse_max);
                JS_SCtrl.cp(src.angle_min, dst.angle_min);
                JS_SCtrl.cp(src.angle_max, dst.angle_max);
                JS_SCtrl.cp(src.sync_val, dst.sync_val);
                JS_SCtrl.cp(src.current, dst.current);
            }
        },
        set_config: function (result) {
            JS_SCtrl.copy_data(result.data.grove, grove);
            JS_SCtrl.copy_data(result.data.dip, dip);
            JS_SCtrl.open();
        },
        limit_vale: function (data, val) {
            if (val > data.limit_max) { val = data.limit_max; }
            if (val < data.limit_min) { val = data.limit_min; }
            return val;
        },
        open: function () {
            let elements = document.getElementsByClassName('types');
            Array.prototype.forEach.call(elements, function (element) {
                element.classList.remove('visibility_hidden');
            });
            document.getElementById('reversal_dip').addEventListener('change', () => {
                document.getElementById('reversal_grove').checked = document.getElementById('reversal_dip').checked;;
            });
            document.getElementById('reversal_grove').addEventListener('change', () => {
                document.getElementById('reversal_dip').checked = document.getElementById('reversal_grove').checked;;
            });
            document.getElementById('sync_grove').addEventListener('click', () => {
                dip.reversal = document.getElementById('reversal_grove').checked;
                JS_SCtrl.change_disabled('dip', !JS_SCtrl.enable_sync('#slider_dip'));
            });
            document.getElementById('max_grove').addEventListener('click', () => {
                JS_Slider.set_value('grove', parseInt(document.getElementById('limit_max_grove').value));
                JS_Slider.send();
            });
            document.getElementById('reset_grove').addEventListener('click', () => {
                JS_Slider.set_value('grove', parseInt(document.getElementById('origin_grove').value));
                JS_Slider.send();
            });
            document.getElementById('min_grove').addEventListener('click', () => {
                JS_Slider.set_value('grove', parseInt(document.getElementById('limit_min_grove').value));
                JS_Slider.send();
            });
            document.getElementById('save_grove').addEventListener('click', () => {
                JS_SCtrl.save('grove', grove, 0);
            });
            document.getElementById('attach_grove').addEventListener('click', () => {
                JS_SCtrl.save('grove', grove, 1);
            });
            document.getElementById('load_grove').addEventListener('click', () => {
                JS_AJAX.get('/get/config').then(
                    ok => {
                        JS_SCtrl.copy_data(ok.data.grove, grove);
                        JS_SCtrl.init_elm('grove', grove);
                    }
                    , error => alert(error.status.messages)
                );
            });

            document.getElementById('sync_dip').addEventListener('click', () => {
                grove.reversal = document.getElementById('reversal_dip').checked;
                JS_SCtrl.change_disabled('grove', !JS_SCtrl.enable_sync('#slider_grove'));
            });
            document.getElementById('max_dip').addEventListener('click', () => {
                JS_Slider.set_value('dip', parseInt(document.getElementById('limit_max_dip').value));
                JS_Slider.send();
            });
            document.getElementById('reset_dip').addEventListener('click', () => {
                JS_Slider.set_value('dip', parseInt(document.getElementById('origin_dip').value));
                JS_Slider.send();
            });
            document.getElementById('min_dip').addEventListener('click', () => {
                JS_Slider.set_value('dip', parseInt(document.getElementById('limit_min_dip').value));
                JS_Slider.send();
            });
            document.getElementById('save_dip').addEventListener('click', () => {
                JS_SCtrl.save('dip', dip, 0);
            });
            document.getElementById('attach_dip').addEventListener('click', () => {
                JS_SCtrl.save('dip', dip, 1);
            });
            document.getElementById('load_dip').addEventListener('click', () => {
                JS_AJAX.get('/get/config').then(
                    ok => {
                        JS_SCtrl.copy_data(ok.data.dip, dip);
                        JS_SCtrl.init_elm('dip', dip);
                    }
                    , error => alert(error.status.messages)
                );
            });

            document.getElementById('limit_min_grove').addEventListener('change', (event) => {
                grove.limit_min = parseInt(event.currentTarget.value);
                JS_SCtrl.set_limit_min('grove', grove.limit_min);
            });
            document.getElementById('limit_max_grove').addEventListener('change', (event) => {
                grove.limit_max = parseInt(event.currentTarget.value);
                JS_SCtrl.set_limit_max('grove', grove.limit_max);
            });
            document.getElementById('origin_grove').addEventListener('change', (event) => {
                grove.origin = JS_SCtrl.limit_vale(grove, parseInt(event.currentTarget.value));
            });
            document.getElementById('period_grove').addEventListener('change', (event) => {
                grove.period = parseInt(event.currentTarget.value);
            });
            document.getElementById('pulse_min_grove').addEventListener('change', (event) => {
                grove.pulse_min = parseInt(event.currentTarget.value);
                JS_SCtrl.set_elm_min('pulse_max_grove', grove.pulse_min);
            });
            document.getElementById('pulse_max_grove').addEventListener('change', (event) => {
                grove.pulse_max = parseInt(event.currentTarget.value);
                JS_SCtrl.set_elm_max('pulse_min_grove', grove.pulse_max);
            });
            document.getElementById('angle_min_grove').addEventListener('change', (event) => {
                grove.angle_min = parseInt(event.currentTarget.value);
                JS_SCtrl.set_angle_min('grove', grove.angle_min);
            });
            document.getElementById('angle_max_grove').addEventListener('change', (event) => {
                grove.angle_max = parseInt(event.currentTarget.value);
                JS_SCtrl.set_angle_max('grove', grove.angle_max);
            });

            document.getElementById('limit_min_dip').addEventListener('change', (event) => {
                dip.limit_min = parseInt(event.currentTarget.value);
                JS_SCtrl.set_limit_min('dip', dip.limit_min);
            });
            document.getElementById('limit_max_dip').addEventListener('change', (event) => {
                dip.limit_max = parseInt(event.currentTarget.value);
                JS_SCtrl.set_limit_max('dip', dip.limit_max);
            });
            document.getElementById('origin_dip').addEventListener('change', (event) => {
                dip.origin = JS_SCtrl.limit_vale(dip, parseInt(event.currentTarget.value));
            });
            document.getElementById('period_dip').addEventListener('change', (event) => {
                dip.period = parseInt(event.currentTarget.value);
            });
            document.getElementById('pulse_min_dip').addEventListener('change', (event) => {
                dip.pulse_min = parseInt(event.currentTarget.value);
                JS_SCtrl.set_elm_min('pulse_max_dip', dip.pulse_min);
            });
            document.getElementById('pulse_max_dip').addEventListener('change', (event) => {
                dip.pulse_max = parseInt(event.currentTarget.value);
                JS_SCtrl.set_elm_max('pulse_min_dip', dip.pulse_max);
            });
            document.getElementById('angle_min_dip').addEventListener('change', (event) => {
                dip.angle_min = parseInt(event.currentTarget.value);
                JS_SCtrl.set_angle_min('dip', dip.angle_min);
            });
            document.getElementById('angle_max_dip').addEventListener('change', (event) => {
                dip.angle_max = parseInt(event.currentTarget.value);
                JS_SCtrl.set_angle_max('dip', dip.angle_max);
            });
            JS_Slider.init_slider('#slider_grove');
            JS_Slider.init_slider('#slider_dip');

            JS_SCtrl.set_setting('grove', grove);
            JS_SCtrl.set_setting('dip', dip);
        },
        set_setting: function (type, data) {
            JS_SCtrl.init_elm(type, data);
            data.current = JS_SCtrl.limit_vale(data, data.current);
            JS_Slider.set_value(type, data.current);
        },
        init_elm: function (type, data) {
            JS_SCtrl.set_angle_min(type, data.angle_min);
            JS_SCtrl.set_angle_max(type, data.angle_max);
            JS_SCtrl.set_limit_min(type, data.limit_min);
            JS_SCtrl.set_limit_max(type, data.limit_max);
            JS_SCtrl.set_elm_min('pulse_max_' + type, data.pulse_min);
            JS_SCtrl.set_elm_max('pulse_min_' + type, data.pulse_max);
            document.getElementById('angle_min_' + type).value = data.angle_min;
            document.getElementById('angle_max_' + type).value = data.angle_max;
            document.getElementById('limit_min_' + type).value = data.limit_min;
            document.getElementById('limit_max_' + type).value = data.limit_max;
            document.getElementById('pulse_min_' + type).value = data.pulse_min;
            document.getElementById('pulse_max_' + type).value = data.pulse_max;
            document.getElementById('period_' + type).value = data.period;
            document.getElementById('origin_' + type).value = data.origin;
        }
    }
}

window.onload = function () {
    JS_SCtrl.begin();
};
