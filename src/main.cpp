/**
 * @file main.cpp
 * @brief
 * @version 0.0.1
 * @date 2023-08-14
 *
 * @copyright Copyright (c) 2023 / MaSiRo Project.
 *
 */
#include "servo_web_controller.hpp"

#include <Arduino.h>
#include <M5Atom.h>

MaSiRoProject::WEB::ServoWebController cushy;

void notify_mode(CushyWebServer::WEB_VIEWER_MODE mode)
{
    switch (mode) {
        case CushyWebServer::WEB_VIEWER_MODE::NOT_INITIALIZED:
            log_i("NOT_INITIALIZED");
            (void)M5.dis.fillpix(CRGB::Aqua);
            break;
        case CushyWebServer::WEB_VIEWER_MODE::INITIALIZED:
            log_i("INITIALIZED");
            (void)M5.dis.fillpix(CRGB::Yellow);
            break;
        case CushyWebServer::WEB_VIEWER_MODE::DISCONNECTED:
            log_i("DISCONNECTED");
            (void)M5.dis.fillpix(CRGB::DarkRed);
            break;
        case CushyWebServer::WEB_VIEWER_MODE::RETRY:
            log_i("RETRY");
            (void)M5.dis.fillpix(CRGB::Red);
            break;
        case CushyWebServer::WEB_VIEWER_MODE::CONNECTED_STA:
            log_i("CONNECTED_STA");
            (void)M5.dis.fillpix(CRGB::Green);
            Serial.printf("STA : IP :%s", cushy.get_ip_address().toString());
            break;
        case CushyWebServer::WEB_VIEWER_MODE::CONNECTED_AP:
            log_i("CONNECTED_AP");
            (void)M5.dis.fillpix(CRGB::Blue);
            Serial.printf("AP : IP :%s", cushy.get_ip_address().toString());
            break;
#if 0
        case CushyWebServer::WEB_VIEWER_MODE::CONNECTED_AP_AND_STA:
            log_i("CONNECTED_AP_AND_STA");
            (void)M5.dis.fillpix(CRGB::Green);
            break;
#endif
        default:
            (void)M5.dis.fillpix(CRGB::Black);
            break;
    }
}

void setup()
{
    bool enable_serial  = true;
    bool enable_i2c     = false;
    bool enable_display = true;
    (void)M5.begin(enable_serial, enable_i2c, enable_display);
    (void)M5.dis.begin();
    notify_mode(CushyWebServer::WEB_VIEWER_MODE::NOT_INITIALIZED);
    bool result = false;
    do {
        result = cushy.begin();
        if (false == result) {
            delay(1000);
        }
    } while (false == result);
    cushy.set_callback_mode(&notify_mode);
}

void loop()
{
    static int SETTING_LOOP_TIME_SLEEP_DETECT = 200;
    (void)M5.update();
    if (true == M5.Btn.wasPressed()) {
        Serial.printf("IP :%s\n", cushy.get_ip_address().toString());
    }
    (void)delay(SETTING_LOOP_TIME_SLEEP_DETECT);
}
