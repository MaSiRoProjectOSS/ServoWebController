/**
 * @file servo_controller.cpp
 * @brief
 * @version 0.0.1
 * @date 2023-08-13
 *
 * @copyright Copyright (c) 2023
 *
 */
#include "servo_controller.hpp"

namespace MaSiRoProject
{
namespace Driver
{
ServoController::ServoController()
{
    ESP32PWM::allocateTimer(0);
    ESP32PWM::allocateTimer(1);
    ESP32PWM::allocateTimer(2);
    ESP32PWM::allocateTimer(3);
}
void ServoController::init(ConnectType type, int pin)
{
    int index = this->_get_index(type, false);
    if (0 <= index) {
        this->pin[index] = pin;
        this->attach(type);
        this->config[index].gp = pin;
        if (ConnectType::DIP == type) {
            this->config[index].name = "DIP";
        } else if (ConnectType::GROVE == type) {
            this->config[index].name = "GROVE";
        }
        if (true == this->config[index].initialize_at_startup) {
            this->set_speed(type, this->config[index].origin);
        }
    }
}
int ServoController::_get_index(ConnectType type, bool check_pin)
{
    int index = static_cast<int>(type);
    if (index < 0 || index >= static_cast<int>(ConnectType::_ENUM_MAX)) {
        index = -1;
    }
    if (true == check_pin) {
        if (0 > this->pin[index]) {
            index = -1;
        }
    }
    return index;
}

bool ServoController::attach(ConnectType type)
{
    bool result = false;
    int index   = this->_get_index(type);
    if (0 <= index) {
        if (true == this->servo[index].attached()) {
            this->servo[index].detach();
        }
        if (false == this->servo[index].attached()) {
            this->servo[index].setPeriodHertz(this->config[index].period);
            this->servo[index].attach(this->pin[index], this->config[index].pulse_min, this->config[index].pulse_max);
            result = this->servo[index].attached();
        }
    }
    return result;
}

int ServoController::set_speed(ConnectType type, int speed)
{
    int result = -999;
    int index  = this->_get_index(type);
    if (0 <= index) {
        if (true == this->servo[index].attached()) {
            if (speed < this->config[index].limit_min) {
                speed = this->config[index].limit_min;
            } else if (speed > this->config[index].limit_max) {
                speed = this->config[index].limit_max;
            }
            this->servo[index].write(speed);
            result                      = this->servo[index].read();
            this->config[index].current = result;
        }
    }
    return result;
}
int ServoController::get_speed(ConnectType type)
{
    int result = -999;
    int index  = this->_get_index(type);
    if (0 <= index) {
        if (true == this->servo[index].attached()) {
            result = this->servo[index].read();
        }
    }
    return result;
}

void ServoController::set_config(ConnectType type, ServoConfig request)
{
    int index = this->_get_index(type);
    if (0 <= index) {
        this->config[index].limit_min   = request.limit_min;
        this->config[index].limit_max   = request.limit_max;
        this->config[index].origin      = request.origin;
        this->config[index].period      = request.period;
        this->config[index].pulse_min   = request.pulse_min;
        this->config[index].pulse_max   = request.pulse_max;
        this->config[index].angle_min   = request.angle_min;
        this->config[index].angle_max   = request.angle_max;
        this->config[index].sync_enable = request.sync_enable;
        this->config[index].sync_value  = request.sync_value;
        this->config[index].reversal    = request.reversal;
        // this->config[index].current     = request.current;
    }
}

ServoController::ServoConfig ServoController::get_config(ConnectType type)
{
    int index = this->_get_index(type);
    if (0 <= index) {
        return this->config[index];
    } else {
        return ServoConfig();
    }
}

} // namespace Driver
} // namespace MaSiRoProject
