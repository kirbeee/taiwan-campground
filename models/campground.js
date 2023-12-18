const config = require("./dbConfig")
const {Request, Connection} = require("tedious");

function querySQL(command) {
    return new Promise(function (resolve, reject) {
        let db_data = []
        const connection = new Connection(config);
        connection.on('connect', async function (err) {
            if (err) {
                reject(err)
            } else {
                console.log("connection success")
                getData()
            }
        });

        function getData() {
            const request = new Request(command, function (err) {
                if (err) {
                    console.error("Request error: " + err);
                    reject(err);
                }
            })
            request.on("row", function (columns) {
                columns.forEach(function (column, index) {
                    if (index === 0) {
                        db_data.push({});
                    }
                    db_data[db_data.length - 1][column.metadata.colName] = column.value;
                    // console.log(index, column.metadata.colName, column.value);
                })
            })
            request.on("requestCompleted", () => {
                connection.close();
                resolve(db_data)
                // console.log(db_data)
                // console.log("disconnect sql")
            });

            connection.execSql(request);

        }

        connection.connect()
    })









}

module.exports.querySQL = querySQL