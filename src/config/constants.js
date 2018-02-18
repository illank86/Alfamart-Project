import mqtt from 'mqtt';

const defaultConfig = {
    PORT: process.env.PORT || 8000,
}

const config = {
    DB_URL: 'us-cdbr-iron-east-05.cleardb.net',
    DB_PASS: '714c3527'
};
//
const options = {
    option: {        
        port: 15752,
        host: 'mqtt://m13.cloudmqtt.com',
        clientId: 'mqttjs_'+ Math.random().toString(16).substr(2, 8),
        username: 'joywydem',
        password: 'f1A0bkvykCrl',
        keepalive: 30,
        reconnectPeriod: 3000,
        reschedulePings: true,
        protocolId: 'MQIsdp',
        protocolVersion: 3,
        connectTimeout: 30 * 1000,
        clean: true,
        encoding: 'utf8',
        resubscribe: true
    }
}

const conn = {
    client: mqtt.connect('mqtt://m13.cloudmqtt.com', options.option)
}


export default {
    ...defaultConfig,
    ...config,
    ...conn
};
