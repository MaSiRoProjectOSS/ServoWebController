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

        server->on("/get/config", std::bind(&ServoWebController::json_get_config, this, std::placeholders::_1));
        server->on("/set/config", std::bind(&ServoWebController::json_set_config, this, std::placeholders::_1));
        server->on("/set/value", std::bind(&ServoWebController::json_set_value, this, std::placeholders::_1));
        server->on("/get/value", std::bind(&ServoWebController::json_get_value, this, std::placeholders::_1));

        server->on("/roundslider.min.js", std::bind(&ServoWebController::js_roundslider, this, std::placeholders::_1));
        server->on("/jquery-3.7.0.min.js", std::bind(&ServoWebController::js_jquery, this, std::placeholders::_1));
        server->on("/servo_controller.js", std::bind(&ServoWebController::js_servo_controller, this, std::placeholders::_1));

        server->on("/roundslider.min.css", std::bind(&ServoWebController::css_roundslider, this, std::placeholders::_1));
        server->on("/servo_controller.css", std::bind(&ServoWebController::css_servo_controller, this, std::placeholders::_1));

        result = true;
    }
    this->_controller.init(ServoController::ConnectType::GROVE, SERVO_GROVE_PIN);
    this->_controller.init(ServoController::ConnectType::DIP, SERVO_DIP_PIN);

    return result;
}

void ServoWebController::json_get_value(AsyncWebServerRequest *request)
{
    bool result      = true;
    std::string data = "{";
    data.append(this->make_json_servo_config(ServoController::ConnectType::GROVE, false));
    data.append(this->make_json_servo_config(ServoController::ConnectType::DIP, true));
    data.append("}");
    int grove = this->_controller.get_speed(ServoController::ConnectType::GROVE);
    int dip   = this->_controller.get_speed(ServoController::ConnectType::DIP);

    char message[255] = "";
    sprintf(message, "get_speed: grove[%d],dip[%d]", grove, dip);

    std::string json = this->template_json_result(result, data, message);

    AsyncWebServerResponse *response = request->beginResponse(200, "application/json; charset=utf-8", json.c_str());
    response->addHeader("Cache-Control", WEB_HEADER_CACHE_CONTROL_NO_CACHE);
    response->addHeader("X-Content-Type-Options", "nosniff");
    request->send(response);
}
void ServoWebController::json_set_value(AsyncWebServerRequest *request)
{
    bool result = false;
    int grove   = 0;
    int dip     = 0;
    try {
        if (request->args() > 0) {
            if (request->hasArg("grove")) {
                grove = this->_controller.set_speed(ServoController::ConnectType::GROVE, this->to_int(request->arg("grove")));
            }
            if (request->hasArg("dip")) {
                dip = this->_controller.set_speed(ServoController::ConnectType::DIP, this->to_int(request->arg("dip")));
            }
            result = true;
        }
    } catch (...) {
        result = false;
    }
    std::string data = "{";
    data.append(this->make_json_servo_config(ServoController::ConnectType::GROVE, false));
    data.append(this->make_json_servo_config(ServoController::ConnectType::DIP, true));
    data.append("}");

    char message[255] = "";
    sprintf(message, "set_speed: grove[%d],dip[%d]", grove, dip);

    std::string json = this->template_json_result(result, data, message);

    AsyncWebServerResponse *response = request->beginResponse(200, "application/json; charset=utf-8", json.c_str());
    response->addHeader("Cache-Control", WEB_HEADER_CACHE_CONTROL_NO_CACHE);
    response->addHeader("X-Content-Type-Options", "nosniff");
    request->send(response);
}
void ServoWebController::json_set_config(AsyncWebServerRequest *request)
{
    bool result         = false;
    std::string message = "";
    try {
        if (request->args() > 0) {
            bool attach = false;
            ServoController::ServoConfig config;
            ServoController::ConnectType type = ServoController::ConnectType::UNKNOWN;
            if (request->hasArg("mode")) {
                int mode = this->to_int(request->arg("mode"));
                if (1 == mode) {
                    // request attach
                    attach = true;
                } else {
                    // request save
                }
            }
            if (request->hasArg("type")) {
                String connect_type = request->arg("type");
                if (connect_type.equals("grove")) {
                    type = ServoController::ConnectType::GROVE;
                } else if (connect_type.equals("dip")) {
                    type = ServoController::ConnectType::DIP;
                }
            }
            if (request->hasArg("ln")) {
                config.limit_min = this->to_int(request->arg("ln"));
            }
            if (request->hasArg("lx")) {
                config.limit_max = this->to_int(request->arg("lx"));
            }
            if (request->hasArg("o")) {
                config.origin = this->to_int(request->arg("o"));
            }
            if (request->hasArg("h")) {
                config.period = this->to_int(request->arg("h"));
            }
            if (request->hasArg("pn")) {
                config.pulse_min = this->to_int(request->arg("pn"));
            }
            if (request->hasArg("px")) {
                config.pulse_max = this->to_int(request->arg("px"));
            }
            if (request->hasArg("an")) {
                config.angle_min = this->to_int(request->arg("an"));
            }
            if (request->hasArg("ax")) {
                config.angle_max = this->to_int(request->arg("ax"));
            }
            if (request->hasArg("se")) {
                config.sync_enable = this->to_int(request->arg("se"));
            }
            if (request->hasArg("sv")) {
                config.sync_value = this->to_int(request->arg("sv"));
            }
            if (request->hasArg("r")) {
                config.reversal = this->to_int(request->arg("r"));
            }
            this->_controller.set_config(type, config);
            if (true == attach) {
                result = this->_controller.attach(type);
                if (true == result) {
                    message.append("Attach succeeded.");
                } else {
                    message.append("Attach failed.");
                }
            }
            result = true;
        }
    } catch (...) {
        result = false;
    }
    std::string data = "{";
    data.append(this->make_json_servo_config(ServoController::ConnectType::GROVE, false));
    data.append(this->make_json_servo_config(ServoController::ConnectType::DIP, true));
    data.append("}");

    std::string json = this->template_json_result(result, data, message);

    AsyncWebServerResponse *response = request->beginResponse(200, "application/json; charset=utf-8", json.c_str());
    response->addHeader("Cache-Control", WEB_HEADER_CACHE_CONTROL_NO_CACHE);
    response->addHeader("X-Content-Type-Options", "nosniff");
    request->send(response);
}
void ServoWebController::json_get_config(AsyncWebServerRequest *request)
{
    bool result      = false;
    char buffer[255] = "";
    std::string data = "{";
    data.append(this->make_json_servo_config(ServoController::ConnectType::GROVE, false));
    data.append(this->make_json_servo_config(ServoController::ConnectType::DIP, true));
    data.append("}");
    result           = true;
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
std::string ServoWebController::make_json_servo_config(ServoController::ConnectType type, bool append_data)
{
    bool result      = false;
    std::string data = "";
    if (true == append_data) {
        data.append(",");
    }

    if (ServoController::ConnectType::GROVE == type) {
        result = true;
        data.append("\"grove\":{");
    } else if (ServoController::ConnectType::DIP == type) {
        result = true;
        data.append("\"dip\":{");
    }
    if (true == result) {
        ServoController::ServoConfig config = this->_controller.get_config(type);
        char buffer[255]                    = "";
        sprintf(buffer,
                "\"limit_min\": %d,"   //
                "\"limit_max\": %d,"   //
                "\"pulse_min\": %d,"   //
                "\"pulse_max\": %d,"   //
                "\"angle_min\": %d,"   //
                "\"angle_max\": %d,"   //
                "\"period\": %d,"      //
                "\"origin\": %d,"      //
                "\"sync_enable\": %d," //
                "\"sync_value\": %d,"  //
                "\"reversal\": %d,"    //
                "\"current\": %d"      //
                ,
                config.limit_min,
                config.limit_max,
                config.pulse_min,
                config.pulse_max,
                config.angle_min,
                config.angle_max,
                config.period,
                config.origin,
                config.sync_enable,
                config.sync_value,
                config.reversal,
                config.current);
        data.append(buffer);
        data.append("}");
    }

    return data;
}

} // namespace WEB
} // namespace MaSiRoProject
