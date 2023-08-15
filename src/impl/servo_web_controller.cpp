/**
 * @file servo_web_controller.cpp
 * @brief
 * @version 0.0.1
 * @date 2023-08-14
 *
 * @copyright Copyright (c) 2023 / MaSiRo Project.
 *
 */
#include "servo_web_controller.hpp"

#include "web_data.hpp"

namespace MaSiRoProject
{
namespace WEB
{
#define WEB_HEADER_CACHE_CONTROL_SHORT_TIME "max-age=100, immutable"
#define WEB_HEADER_CACHE_CONTROL_LONGTIME   "max-age=31536000, immutable"
#define WEB_HEADER_CACHE_CONTROL_NO_CACHE   "no-cache"

bool ServoWebController::setup_server(AsyncWebServer *server)
{
    bool result = true;
    if (nullptr != server) {
        server->on("/", std::bind(&ServoWebController::html_root, this, std::placeholders::_1));

        server->on("/set/value", std::bind(&ServoWebController::json_set_value, this, std::placeholders::_1));
        server->on("/set/config", std::bind(&ServoWebController::json_set_config, this, std::placeholders::_1));
        server->on("/get/setting", std::bind(&ServoWebController::json_get_setting, this, std::placeholders::_1));
        server->on("/update/servo", std::bind(&ServoWebController::json_update_servo, this, std::placeholders::_1));
        server->on("/update/config", std::bind(&ServoWebController::json_update_config, this, std::placeholders::_1));
        server->on("/save", std::bind(&ServoWebController::json_save, this, std::placeholders::_1));

        server->on("/roundslider.js", std::bind(&ServoWebController::js_roundslider, this, std::placeholders::_1));
        server->on("/jquery-1.11.3.min.js", std::bind(&ServoWebController::js_jquery, this, std::placeholders::_1));
        server->on("/servo_controller.js", std::bind(&ServoWebController::js_servo_controller, this, std::placeholders::_1));

        server->on("/roundslider.css", std::bind(&ServoWebController::css_roundslider, this, std::placeholders::_1));
        server->on("/servo_controller.css", std::bind(&ServoWebController::css_servo_controller, this, std::placeholders::_1));

        result = true;
    }
    return result;
}

void ServoWebController::json_set_value(AsyncWebServerRequest *request)
{
    bool result      = false;
    std::string data = "{";
    data.append("}");

    std::string json = this->template_json_result(result, data);

    AsyncWebServerResponse *response = request->beginResponse(200, "application/json; charset=utf-8", json.c_str());
    response->addHeader("Cache-Control", WEB_HEADER_CACHE_CONTROL_NO_CACHE);
    response->addHeader("X-Content-Type-Options", "nosniff");
    request->send(response);
}
void ServoWebController::json_set_config(AsyncWebServerRequest *request)
{
    bool result      = false;
    std::string data = "{";
    data.append("}");

    std::string json = this->template_json_result(result, data);

    AsyncWebServerResponse *response = request->beginResponse(200, "application/json; charset=utf-8", json.c_str());
    response->addHeader("Cache-Control", WEB_HEADER_CACHE_CONTROL_NO_CACHE);
    response->addHeader("X-Content-Type-Options", "nosniff");
    request->send(response);
}
void ServoWebController::json_get_setting(AsyncWebServerRequest *request)
{
    bool result      = false;
    std::string data = "{";
    data.append("}");

    std::string json = this->template_json_result(result, data);

    AsyncWebServerResponse *response = request->beginResponse(200, "application/json; charset=utf-8", json.c_str());
    response->addHeader("Cache-Control", WEB_HEADER_CACHE_CONTROL_NO_CACHE);
    response->addHeader("X-Content-Type-Options", "nosniff");
    request->send(response);
}
void ServoWebController::json_update_servo(AsyncWebServerRequest *request)
{
    bool result      = false;
    std::string data = "{";
    data.append("}");

    std::string json = this->template_json_result(result, data);

    AsyncWebServerResponse *response = request->beginResponse(200, "application/json; charset=utf-8", json.c_str());
    response->addHeader("Cache-Control", WEB_HEADER_CACHE_CONTROL_NO_CACHE);
    response->addHeader("X-Content-Type-Options", "nosniff");
    request->send(response);
}
void ServoWebController::json_update_config(AsyncWebServerRequest *request)
{
    bool result      = false;
    std::string data = "{";
    data.append("}");

    std::string json = this->template_json_result(result, data);

    AsyncWebServerResponse *response = request->beginResponse(200, "application/json; charset=utf-8", json.c_str());
    response->addHeader("Cache-Control", WEB_HEADER_CACHE_CONTROL_NO_CACHE);
    response->addHeader("X-Content-Type-Options", "nosniff");
    request->send(response);
}
void ServoWebController::json_save(AsyncWebServerRequest *request)
{
    bool result      = false;
    std::string data = "{";
    data.append("}");

    std::string json = this->template_json_result(result, data);

    AsyncWebServerResponse *response = request->beginResponse(200, "application/json; charset=utf-8", json.c_str());
    response->addHeader("Cache-Control", WEB_HEADER_CACHE_CONTROL_NO_CACHE);
    response->addHeader("X-Content-Type-Options", "nosniff");
    request->send(response);
}

void ServoWebController::js_roundslider(AsyncWebServerRequest *request)
{
    AsyncWebServerResponse *response = request->beginResponse_P(200, "text/javascript; charset=utf-8", WEB_SC_ROUNDSLIDER_JS);
    response->addHeader("Cache-Control", WEB_HEADER_CACHE_CONTROL_LONGTIME);
    response->addHeader("X-Content-Type-Options", "nosniff");
    request->send(response);
}
void ServoWebController::js_jquery(AsyncWebServerRequest *request)
{
    AsyncWebServerResponse *response = request->beginResponse_P(200, "text/javascript; charset=utf-8", WEB_SC_JQUERY_JS);
    response->addHeader("Cache-Control", WEB_HEADER_CACHE_CONTROL_LONGTIME);
    response->addHeader("X-Content-Type-Options", "nosniff");
    request->send(response);
}
void ServoWebController::js_servo_controller(AsyncWebServerRequest *request)
{
    AsyncWebServerResponse *response = request->beginResponse_P(200, "text/javascript; charset=utf-8", WEB_SC_SERVO_CONTROLLER_JS);
    response->addHeader("Cache-Control", WEB_HEADER_CACHE_CONTROL_LONGTIME);
    response->addHeader("X-Content-Type-Options", "nosniff");
    request->send(response);
}

void ServoWebController::css_roundslider(AsyncWebServerRequest *request)
{
    AsyncWebServerResponse *response = request->beginResponse_P(200, "text/css; charset=utf-8", WEB_SC_ROUNDSLIDER_CSS);
    response->addHeader("Cache-Control", WEB_HEADER_CACHE_CONTROL_LONGTIME);
    response->addHeader("X-Content-Type-Options", "nosniff");
    request->send(response);
}
void ServoWebController::css_servo_controller(AsyncWebServerRequest *request)
{
    AsyncWebServerResponse *response = request->beginResponse_P(200, "text/css; charset=utf-8", WEB_SC_SERVO_CONTROLLER_CSS);
    response->addHeader("Cache-Control", WEB_HEADER_CACHE_CONTROL_LONGTIME);
    response->addHeader("X-Content-Type-Options", "nosniff");
    request->send(response);
}

void ServoWebController::html_root(AsyncWebServerRequest *request)
{
    AsyncWebServerResponse *response = request->beginResponse_P(200, "text/html; charset=utf-8", WEB_SC_ROOT_HTML);
    response->addHeader("Cache-Control", WEB_HEADER_CACHE_CONTROL_SHORT_TIME);
    response->addHeader("X-Content-Type-Options", "nosniff");
    request->send(response);
}

} // namespace WEB
} // namespace MaSiRoProject
