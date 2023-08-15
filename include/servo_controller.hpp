/**
 * @file servo_controller.hpp
 * @brief
 * @version 0.0.1
 * @date 2023-08-13
 *
 * @copyright Copyright (c) 2023
 *
 */
#ifndef SERVO_CONTROLLER_HPP
#define SERVO_CONTROLLER_HPP

#include <ESP32Servo.h>

namespace MaSiRoProject
{
namespace Driver
{
class ServoController {
public:
    ServoController();

    void set_speed(int speed);

    void attached(int pin);

    void config();

private:
    int index;
    Servo servo;
    int PERIOD_HERTZ = 40;
    int MIN_PULSE    = 500;
    int MAX_PULSE    = 2400;
    int MIN_ANGLE    = 0;
    int MAX_ANGLE    = 180;
};

} // namespace Driver
} // namespace MaSiRoProject

#endif // MOTOR_CONTROLLER_HPP
