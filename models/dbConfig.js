const config = {
    server: "localhost", // or "localhost"
    options: {
        trustServerCertificate: true,
        database: "CampGround"
    },
    authentication: {
        type: "default",
        options: {
            userName: "sa",
            password: "<YourStrong@Passw0rd>",
        },
    }
};

module.exports = config