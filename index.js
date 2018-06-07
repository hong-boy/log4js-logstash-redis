'use strict';

const Redis = require('ioredis');
const util = require('util');
const layouts = require('log4js').layouts;
let redis = null;

function logstashRedis(config, layout) {
    layout = layout || layouts.dummyLayout;
    if(!config.fields) {
        config.fields = {};
    }

    return function log(loggingEvent) {
        if(!redis){
            redis = config.redis ? new Redis(config.redis) : new Redis();
        }
        if (loggingEvent.data.length > 1) {
            const secondEvData = loggingEvent.data[1];
            for (let k in secondEvData) {
                config.fields[k] = secondEvData[k];
            }
        }
        config.fields.level = loggingEvent.level.levelStr;

        const logObject = {
            '@version': '1',
            '@timestamp': (new Date(loggingEvent.startTime)).toISOString(),
            type: config.logType ? config.logType : config.category,
            message: layout(loggingEvent),
            fields: config.fields
        };
        sendLog(redis, config.key, logObject);
    };
}

function sendLog(redis, key, logObject) {
    const logString = JSON.stringify(logObject);
    redis.rpush(key, logString, function (err, result) {
        if (err) {
            console.error("log4js-logstash-redis - Error: %s", util.inspect(err))
        }
    });
}

function configure(config, layouts) {
    let layout = layouts.dummyLayout;
    if (config.layout) {
        layout = layouts.layout(config.layout.type, config.layout);
    }
    return logstashRedis(config, layout);
}

exports.configure = configure;