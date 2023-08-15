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

void ServoController::attached(int pin)
{
    if (true == this->servo.attached()) {
        this->servo.detach();
    }

    if (false == this->servo.attached()) {
        this->servo.setPeriodHertz(this->PERIOD_HERTZ);
        this->index = this->servo.attach(pin, this->MIN_PULSE, this->MAX_PULSE);
    }
}

void ServoController::set_speed(int speed)
{
    if (speed < this->MIN_ANGLE) {
        speed = this->MIN_ANGLE;
    } else if (speed > this->MAX_ANGLE) {
        speed = this->MAX_ANGLE;
    }
    this->servo.write(speed);
}

} // namespace Driver
} // namespace MaSiRoProject
