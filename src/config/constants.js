import mqtt from 'mqtt';

const defaultConfig = {
    PORT: process.env.PORT || 8000,
}

const options = {
    option: {        
        port: 1883,
        host: process.env.MQTT_URL,
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
    client: mqtt.connect( process.env.MQTT_URL, options.option)
}


export default {
    ...defaultConfig,
    ...conn
};
