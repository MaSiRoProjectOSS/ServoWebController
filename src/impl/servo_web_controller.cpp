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

#include <SPIFFS.h>

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

        server->on("/config/get", std::bind(&ServoWebController::json_get_config, this, std::placeholders::_1));
        server->on("/config/set", std::bind(&ServoWebController::json_set_config, this, std::placeholders::_1));
        server->on("/config/clear", std::bind(&ServoWebController::json_clear_config, this, std::placeholders::_1));
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
    this->_load_setting_file();

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
                    message.append("[grove] ");
                    type = ServoController::ConnectType::GROVE;
                } else if (connect_type.equals("dip")) {
                    message.append("[dip] ");
                    type = ServoController::ConnectType::DIP;
                }
            }
            config = this->_controller.get_config(type);
            if (true == attach) {
                message.append("[setting] ");
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
            result = this->_save_setting_file();
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
void ServoWebController::json_clear_config(AsyncWebServerRequest *request)
{
    bool result      = false;
    char buffer[255] = "";
    result           = this->_delete_setting_file();
    std::string data = "{";
    data.append(this->make_json_servo_config(ServoController::ConnectType::GROVE, false));
    data.append(this->make_json_servo_config(ServoController::ConnectType::DIP, true));
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
                "\"name\": \"%s\","    //
                "\"gp\": %d,"          //
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
                config.name.c_str(),
                config.gp,
                config.current);
        data.append(buffer);
        data.append("}");
    }

    return data;
}

int ServoWebController::_get_num(String text, int default_value)
{
    int result = default_value;
    try {
        if (0 < text.length()) {
            result = text.toInt();
        }
    } catch (...) {
        result = default_value;
    }
    return result;
}

bool ServoWebController::_load_setting_file()
{
    bool result = false;
    if (SPIFFS.begin()) {
        if (true == SPIFFS.exists(this->setting_file_path)) {
            File dataFile = SPIFFS.open(this->setting_file_path, FILE_READ);
            if (!dataFile) {
                result = false;
            } else {
                result                              = true;
                ServoController::ConnectType c_type = ServoController::ConnectType::UNKNOWN;
                ServoController::ServoConfig *cfg;
                bool save = false;
                while (dataFile.available()) {
                    String word = dataFile.readStringUntil('\n');
                    word.replace("\r", "");
                    word.replace("\n", "");
                    if (2 < word.length()) {
                        if (word.startsWith("  - ")) {
                            if (word.startsWith("  - id: ")) {
                                int id = this->_get_num(word.substring(7), int(ServoController::ConnectType::UNKNOWN));
                                c_type = ServoController::ConnectType(id);
                                save   = true;
                            }
                            if (word.startsWith("  - name: ")) {
                                cfg->name = word.substring(9);
                            }
                            if (word.startsWith("  - gp: ")) {
                                cfg->gp = this->_get_num(word.substring(7), cfg->gp);
                            }
                            if (word.startsWith("  - limit_min: ")) {
                                cfg->limit_min = this->_get_num(word.substring(15), cfg->limit_min);
                            }
                            if (word.startsWith("  - limit_max: ")) {
                                cfg->limit_max = this->_get_num(word.substring(15), cfg->limit_max);
                            }
                            if (word.startsWith("  - origin: ")) {
                                cfg->origin = this->_get_num(word.substring(12), cfg->origin);
                            }
                            if (word.startsWith("  - period: ")) {
                                cfg->period = this->_get_num(word.substring(12), cfg->period);
                            }
                            if (word.startsWith("  - pulse_min: ")) {
                                cfg->pulse_min = this->_get_num(word.substring(15), cfg->pulse_min);
                            }
                            if (word.startsWith("  - pulse_max: ")) {
                                cfg->pulse_max = this->_get_num(word.substring(15), cfg->pulse_max);
                            }
                            if (word.startsWith("  - angle_min: ")) {
                                cfg->angle_min = this->_get_num(word.substring(15), cfg->angle_min);
                            }
                            if (word.startsWith("  - angle_max: ")) {
                                cfg->angle_max = this->_get_num(word.substring(15), cfg->angle_max);
                            }
                            if (word.startsWith("  - current: ")) {
                                cfg->current = this->_get_num(word.substring(13), cfg->current);
                            }
                            if (word.startsWith("  - sync_enable: ")) {
                                cfg->sync_enable = this->_get_num(word.substring(17), cfg->sync_enable);
                            }
                            if (word.startsWith("  - sync_value: ")) {
                                cfg->sync_value = this->_get_num(word.substring(16), cfg->sync_value);
                            }
                            if (word.startsWith("  - reversal: ")) {
                                cfg->reversal = this->_get_num(word.substring(14), cfg->reversal);
                            }
                            if (word.startsWith("  - running: ")) {
                                cfg->running = this->_get_num(word.substring(13), cfg->running);
                            }
                            if (word.startsWith("  - initialize_at_startup: ")) {
                                cfg->initialize_at_startup = this->_get_num(word.substring(27), cfg->initialize_at_startup) ? 1 : 0;
                            }
                        } else if (word.startsWith("GP")) {
                            // This will figure out the data start line.
                            if (save == true) {
                                this->_controller.set_config(c_type, *cfg);
                                save = false;
                            }
                            c_type = ServoController::ConnectType::UNKNOWN;
                            cfg    = new ServoController::ServoConfig();
                        }
                    }
                }
                if (save == true) {
                    this->_controller.set_config(c_type, *cfg);
                    save = false;
                }
                dataFile.close();
            }
        }
        SPIFFS.end();
    }

    return result;
}
bool ServoWebController::_save_setting_file()
{
    bool result = false;

    if (SPIFFS.begin()) {
        File dataFile = SPIFFS.open(this->setting_file_path, FILE_WRITE);
        if (!dataFile) {
            result = false;
        } else {
            for (int i = 0; i < static_cast<int>(ServoController::ConnectType::_ENUM_MAX); i++) {
                ServoController::ServoConfig cfg = this->_controller.get_config(ServoController::ConnectType(i));
                if (0 <= cfg.gp) {
                    dataFile.printf("GP%d\n", cfg.gp);
                    dataFile.printf("  - id: %d\n", i);
                    dataFile.printf("  - name: %s\n", cfg.name);
                    dataFile.printf("  - gp: %d\n", cfg.gp);
                    dataFile.printf("  - limit_min: %d\n", cfg.limit_min);
                    dataFile.printf("  - limit_max: %d\n", cfg.limit_max);
                    dataFile.printf("  - origin: %d\n", cfg.origin);
                    dataFile.printf("  - period: %d\n", cfg.period);
                    dataFile.printf("  - pulse_min: %d\n", cfg.pulse_min);
                    dataFile.printf("  - pulse_max: %d\n", cfg.pulse_max);
                    dataFile.printf("  - angle_min: %d\n", cfg.angle_min);
                    dataFile.printf("  - angle_max: %d\n", cfg.angle_max);
                    dataFile.printf("  - current: %d\n", cfg.current);
                    dataFile.printf("  - sync_enable: %d\n", cfg.sync_enable);
                    dataFile.printf("  - sync_value: %d\n", cfg.sync_value);
                    dataFile.printf("  - reversal: %d\n", cfg.reversal);
                    dataFile.printf("  - running: %d\n", cfg.running);
                    dataFile.printf("  - initialize_at_startup: %d\n", cfg.initialize_at_startup ? 1 : 0);
                }
            }

            dataFile.close();
            result = true;
        }
        SPIFFS.end();
    }
    return result;
}
bool ServoWebController::_delete_setting_file()
{
    bool result = false;
    if (SPIFFS.begin()) {
        if (true == SPIFFS.exists(this->setting_file_path)) {
            result = SPIFFS.remove(this->setting_file_path);
        }
        SPIFFS.end();
    }
    return result;
}
IPAddress ServoWebController::get_ip_address()
{
    return this->get_ip();
}

} // namespace WEB
} // namespace MaSiRoProject
