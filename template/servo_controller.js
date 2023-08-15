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
        set_value: function (type, val) {
            $("#slider_" + type).roundSlider("option", "value", val);
            JS_Slider.set_sync_val();
        },
        set_max: function (type, val) {
            $("#slider_" + type).roundSlider("option", "max", val);
        },
        set_min: function (type, val) {
            $("#slider_" + type).roundSlider("option", "min", val);
        },
        init_slider: function (id) {
            $(id).roundSlider({
                animation: false,
                circleShape: 'quarter-bottom-left',
                sliderType: 'min-range',
                showTooltip: false,
                min: 0,
                max: 100,
                value: 0,
                showTooltip: true,
                svgMode: true,
                tooltipFormat: JS_Slider.tip_txt,
                update: JS_Slider.changed,
                mouseScrollAction: true,
                keyboardAction: true,
                radius: 120,
                lineCap: 'round'
            });
        },
        tip_txt: function (args) {
            var append = '';

            if (args.id == 'slider_grove') {
                val = (args.value / (grove.angle_max - grove.angle_min)) * 100;
                append = '<br>' + val.toFixed(0) + '%';
            } else if (args.id == 'slider_dip') {
                val = (args.value / (dip.angle_max - dip.angle_min)) * 100;
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
                            s_g.setValue(grove.sync_val - val_g + dip.sync_val);
                        } else {
                            s_g.setValue(val_g - grove.sync_val + dip.sync_val);
                        }
                    }
                }
            }
        },
        changed: function () {
            JS_Slider.set_sync_val();
        }
    }

    var JS_SCtrl = {
        print: function (name) {

            console.log(name);
            console.log('GROVE');
            console.log(grove);
            console.log('DIP');
            console.log(dip);

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
            JS_SCtrl.set_elm_max('origin_' + type, parseInt(document.getElementById('limit_max_' + type).value));
        },
        set_angle_min: function (type, val) {
            JS_SCtrl.set_elm_min('limit_min_' + type, val);
            JS_SCtrl.set_elm_min('limit_max_' + type, val);
            JS_SCtrl.set_elm_min('angle_max_' + type, val);
            JS_SCtrl.set_elm_min('origin_' + type, parseInt(document.getElementById('limit_min_' + type).value));
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
            grove.sync_val = parseInt($("#slider_grove").roundSlider("option", "value"));
            dip.sync_val = parseInt($("#slider_dip").roundSlider("option", "value"));
            return result;
        },
        begin: function () {
            JS_AJAX.get('/get/config').then(
                ok => JS_SCtrl.set_config(ok)
                , error => alert("[" + error.status.messages + "]\n\nCommunication failed.\nPlease try to reboot.")
            );
        },
        copy_data: function (src, dst) {
            dst.limit_min = src.limit_min;
            dst.limit_max = src.limit_max;
            dst.origin = src.origin;
            dst.period = src.period;
            dst.pulse_min = src.pulse_min;
            dst.pulse_max = src.pulse_max;
            dst.angle_min = src.angle_min;
            dst.angle_max = src.angle_max;
            dst.sync_val = src.sync_val;
            dst.current = src.current;
        },
        set_config: function (result) {
            JS_SCtrl.copy_data(result.status.data.grove, grove);
            JS_SCtrl.copy_data(result.status.data.dip, dip);
            console.log('GROVE');
            console.log(result.status.data.grove);
            console.log('DIP');
            console.log(result.status.data.dip);
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
                element.classList.remove("visibility_hidden");
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
                JS_Slider.set_value('grove', grove.limit_max);
            });
            document.getElementById('reset_grove').addEventListener('click', () => {
                JS_Slider.set_value('grove', grove.origin);
            });
            document.getElementById('min_grove').addEventListener('click', () => {
                JS_Slider.set_value('grove', grove.limit_min);
            });

            document.getElementById('save_grove').addEventListener('click', () => {
                // TODO
                JS_SCtrl.print('save_grove');
            });
            document.getElementById('attach_grove').addEventListener('click', () => {
                // TODO
                JS_SCtrl.print('attach_grove');
            });
            document.getElementById('load_grove').addEventListener('click', () => {
                // TODO
                JS_SCtrl.print('load_grove');
            });

            document.getElementById('sync_dip').addEventListener('click', () => {
                grove.reversal = document.getElementById('reversal_dip').checked;
                JS_SCtrl.change_disabled('grove', !JS_SCtrl.enable_sync('#slider_grove'));
            });
            document.getElementById('max_dip').addEventListener('click', () => {
                JS_Slider.set_value('dip', dip.limit_max);
            });
            document.getElementById('reset_dip').addEventListener('click', () => {
                JS_Slider.set_value('dip', dip.origin);
            });
            document.getElementById('min_dip').addEventListener('click', () => {
                JS_Slider.set_value('dip', dip.limit_min);
            });

            document.getElementById('save_dip').addEventListener('click', () => {
                // TODO
                JS_SCtrl.print('save_dip');
            });
            document.getElementById('attach_dip').addEventListener('click', () => {
                // TODO
                JS_SCtrl.print('attach_dip');
            });
            document.getElementById('load_dip').addEventListener('click', () => {
                // TODO
                JS_SCtrl.print('load_dip');
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

            JS_SCtrl.init_elm('grove', grove);
            JS_SCtrl.init_elm('dip', dip);
        },
        init_elm: function (type, data) {
            JS_Slider.init_slider('#slider_' + type);
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
            data.current = JS_SCtrl.limit_vale(data, data.current);
            JS_Slider.set_value(type, data.current);
        }
    }
}

window.onload = function () {
    JS_SCtrl.begin();
};
