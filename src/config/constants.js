const defaultConfig = {
    PORT: process.env.PORT || 8000,
}

const config = {
    DB_URL: '...',
    DB_PASS: '....'
};


export default {
    ...defaultConfig,
    ...config
};
