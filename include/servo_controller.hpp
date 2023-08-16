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
    enum ConnectType
    {
        GROVE = 0,
        DIP,
        UNKNOWN,
        _ENUM_MAX = ConnectType::UNKNOWN
    };
    struct ServoConfig {
    public:
        int limit_min   = 5;
        int limit_max   = 175;
        int origin      = 5;
        int period      = 50;
        int pulse_min   = 500;
        int pulse_max   = 2400;
        int angle_min   = 0;
        int angle_max   = 180;
        int current     = 5;
        int sync_enable = 0;
        int sync_value  = 0;
        int reversal    = 0;

        bool initialize_at_startup = false;
    };

public:
    ServoController();
    void init(ConnectType type, int pin);

    int set_speed(ConnectType type, int speed);
    int get_speed(ConnectType type);

    bool attach(ConnectType type);

    void set_config(ConnectType type, ServoConfig request);

    ServoConfig get_config(ConnectType type);

private:
    int pin[static_cast<int>(ConnectType::_ENUM_MAX)] = { -1 };
    Servo servo[static_cast<int>(ConnectType::_ENUM_MAX)];
    ServoConfig config[static_cast<int>(ConnectType::_ENUM_MAX)];

    int _get_index(ConnectType type, bool check_pin = true);
};

} // namespace Driver
} // namespace MaSiRoProject

#endif // MOTOR_CONTROLLER_HPP
