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

void setup()
{
    bool enable_serial  = false;
    bool enable_i2c     = false;
    bool enable_display = true;
    (void)M5.begin(enable_serial, enable_i2c, enable_display);
    (void)M5.dis.begin();
    (void)M5.dis.fillpix(CRGB::White);
    bool result = false;
    do {
        result = cushy.begin();
        if (false == result) {
            delay(1000);
        }
    } while (false == result);
    (void)M5.dis.fillpix(CRGB::Green);
}

void loop()
{
    delay(250);
}
