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

        server->on("/roundslider.min.js", std::bind(&ServoWebController::js_roundslider, this, std::placeholders::_1));
        server->on("/jquery-3.7.0.min.js", std::bind(&ServoWebController::js_jquery, this, std::placeholders::_1));
        server->on("/servo_controller.js", std::bind(&ServoWebController::js_servo_controller, this, std::placeholders::_1));

        server->on("/roundslider.min.css", std::bind(&ServoWebController::css_roundslider, this, std::placeholders::_1));
        server->on("/servo_controller.css", std::bind(&ServoWebController::css_servo_controller, this, std::placeholders::_1));

        result = true;
    }
    return result;
}

void ServoWebController::json_set_value(AsyncWebServerRequest *request)
{
    bool result = false;
    int grove   = 0;
    int dip     = 0;
    try {
        if (request->args() > 0) {
            if (request->hasArg("grove")) {
                grove = this->to_int(request->arg("grove"));
            }
            if (request->hasArg("dip")) {
                dip = this->to_int(request->arg("dip"));
            }
            result = true;
        }
    } catch (...) {
        result = false;
    }
    char buffer[255] = "";
    sprintf(buffer, "set_value: grove[%d],dip[%d]", grove, dip);
    Serial.println(buffer);

    std::string json = this->template_json_result(result, "");

    AsyncWebServerResponse *response = request->beginResponse(200, "application/json; charset=utf-8", json.c_str());
    response->addHeader("Cache-Control", WEB_HEADER_CACHE_CONTROL_NO_CACHE);
    response->addHeader("X-Content-Type-Options", "nosniff");
    request->send(response);
}
void ServoWebController::json_set_config(AsyncWebServerRequest *request)
{
    bool result = false;
    try {
        if (request->args() > 0) {
            if (request->hasArg("mode")) {
                int mode = this->to_int(request->arg("mode"));
            }
            if (request->hasArg("type")) {
                String type = request->arg("type");
            }
            if (request->hasArg("ln")) {
                int limit_min = this->to_int(request->arg("ln"));
            }
            if (request->hasArg("lx")) {
                int limit_max = this->to_int(request->arg("lx"));
            }
            if (request->hasArg("o")) {
                int origin = this->to_int(request->arg("o"));
            }
            if (request->hasArg("h")) {
                int period = this->to_int(request->arg("h"));
            }
            if (request->hasArg("pn")) {
                int pulse_min = this->to_int(request->arg("pn"));
            }
            if (request->hasArg("px")) {
                int pulse_max = this->to_int(request->arg("px"));
            }
            if (request->hasArg("an")) {
                int angle_min = this->to_int(request->arg("an"));
            }
            if (request->hasArg("ax")) {
                int angle_max = this->to_int(request->arg("ax"));
            }
            if (request->hasArg("s")) {
                int sync_val = this->to_int(request->arg("s"));
            }
            if (request->hasArg("r")) {
                int reversal = this->to_int(request->arg("r"));
            }
            result = true;
        }
    } catch (...) {
        result = false;
    }

    std::string json = this->template_json_result(result, "");

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
    data.append("\"grove\": {");
    sprintf(buffer,
            "\"limit_min\": %d,"
            "\"limit_max\": %d,"
            "\"pulse_min\": %d,"
            "\"pulse_max\": %d,"
            "\"angle_min\": %d,"
            "\"angle_max\": %d,"
            "\"period\": %d,"
            "\"origin\": %d,"
            "\"current\": %d"
            ///
            ,
            2,    // limit_min
            182,  // limit_max
            502,  // pulse_min
            2402, // pulse_max
            2,    // angle_min
            182,  // angle_max
            22,   // period
            12,   //origin
            12    //current
    );
    data.append(buffer);
    data.append("},");
    data.append("\"dip\": {");
    sprintf(buffer,
            "\"limit_min\": %d,"
            "\"limit_max\": %d,"
            "\"pulse_min\": %d,"
            "\"pulse_max\": %d,"
            "\"angle_min\": %d,"
            "\"angle_max\": %d,"
            "\"period\": %d,"
            "\"origin\": %d,"
            "\"current\": %d"
            ///
            ,
            1,    // limit_min
            181,  // limit_max
            501,  // pulse_min
            2401, // pulse_max
            1,    // angle_min
            181,  // angle_max
            21,   // period
            11,   //origin
            11    //current
    );
    data.append(buffer);
    data.append("}");
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

} // namespace WEB
} // namespace MaSiRoProject
