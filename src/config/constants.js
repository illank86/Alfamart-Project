const defaultConfig = {
    PORT: process.env.PORT || 8000,
}

const config = {
    DB_URL: 'us-cdbr-iron-east-05.cleardb.net',
    DB_PASS: '714c3527'
};


export default {
    ...defaultConfig,
    ...config
};