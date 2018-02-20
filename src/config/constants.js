import mqtt from 'mqtt';

const defaultConfig = {
    PORT: process.env.PORT || 8000,
}

const config = {
    DB_URL: process.env.DB_URL || '127.0.0.1',
    DB_PASS: process.env.DB_PASSWORD || 'password'
};
//
const options = {
    option: {        
        port: 1883,
        host: process.env.MQTT_URL || 'mqt://broker.hivemq.com',
        clientId: 'mqttjs_'+ Math.random().toString(16).substr(2, 8),
        // username: 'joywydem',
        // password: 'f1A0bkvykCrl',
        keepalive: 30,
        reconnectPeriod: 3000,
        reschedulePings: true,
        protocolId: 'MQTT',
        protocolVersion: 4,
        connectTimeout: 30 * 1000,
        clean: true,
        encoding: 'utf8',
        resubscribe: true
    }
}

const conn = {
    client: mqtt.connect( process.env.MQTT_URL || 'mqt://broker.hivemq.com', options.option)
}


export default {
    ...defaultConfig,
    ...config,
    ...conn
};
