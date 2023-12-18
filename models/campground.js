const config = require("./dbConfig")
const {Request, Connection, TYPES} = require("tedious");

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

function insertSQL(Data){
    return new Promise(function (resolve, reject) {
        const connection = new Connection(config);
        connection.on('connect', function (err) {
            if (err) {
                reject(err)
            }
            // If no error, then good to go...
            else {
                console.log("connected success")
                insertData()
            }
        });


        connection.connect()

        const Request = require("tedious").Request
        const TYPES = require("tedious").TYPES
        function insertData() {

            // for (let i = 0; i < 50; i++) {
            const request = new Request("INSERT camp_information(image, title, price, description,location) OUTPUT inserted.campgroundID VALUES (@image,@title,@price,@description,@location);", function (err) {
                if (err) {
                    reject(err)
                } else {
                    console.log("start insert")
                }
            })
            request.addParameter('image', TYPES.VarChar, Data.image)
            request.addParameter('title', TYPES.VarChar, Data.title)
            request.addParameter('price', TYPES.Int, Data.price)
            request.addParameter('description', TYPES.VarChar, Data.description)
            request.addParameter('location', TYPES.VarChar, Data.location)

            request.on('row', function (columns) {
                columns.forEach(function (column) {
                    if (column.value == null) {
                        console.log("NULL")
                    } else {
                        console.log("Product id of inserted item is " + column.value);
                        resolve(column.value)
                    }
                })
            })
            request.on("requestCompleted", function () {
                connection.close();
            })
            connection.execSql(request)
        }
    })
}
module.exports.insertSQL = insertSQL