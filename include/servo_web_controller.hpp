/**
 * @file servo_web_controller.hpp
 * @brief
 * @version 0.0.1
 * @date 2023-08-14
 *
 * @copyright Copyright (c) 2023 / MaSiRo Project.
 *
 */
#ifndef SERVO_WEB_CONTROLLER_SERVER_HPP
#define SERVO_WEB_CONTROLLER_SERVER_HPP

#include "servo_controller.hpp"

#include <cushy_web_server.hpp>

namespace MaSiRoProject
{
namespace WEB
{
using namespace MaSiRoProject::Driver;
class ServoWebController : public CushyWebServer {
public:
    bool setup_server(AsyncWebServer *server);

private:
    void json_set_value(AsyncWebServerRequest *request);
    void json_get_value(AsyncWebServerRequest *request);
    void json_set_config(AsyncWebServerRequest *request);
    void json_get_config(AsyncWebServerRequest *request);

    void js_roundslider(AsyncWebServerRequest *request);
    void js_jquery(AsyncWebServerRequest *request);
    void js_servo_controller(AsyncWebServerRequest *request);

    void css_roundslider(AsyncWebServerRequest *request);
    void css_servo_controller(AsyncWebServerRequest *request);

    void html_root(AsyncWebServerRequest *request);

private:
    ServoController _controller;

    std::string make_json_servo_config(ServoController::ConnectType type, bool append_data);
};

} // namespace WEB
} // namespace MaSiRoProject
#endif
