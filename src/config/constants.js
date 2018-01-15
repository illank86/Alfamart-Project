const defaultConfig = {
    PORT: process.env.PORT || 8000,
}

const config = {
    DB_URL: 'localhost',
    DB_PASS: 'password'
};


export default {
    ...defaultConfig,
    ...config
};