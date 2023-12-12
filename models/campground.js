const Connection = require('tedious').Connection;
const config = require("./dbConfig")

const connection = new Connection(config);
// Setup event handler when the connection is established.
connection.on('connect', function (err) {
    if (err) {
        console.log('Error: ', err)
    }
    // If no error, then good to go...
    else {
        console.log("connected success")
        querySql()
    }

});
// Initialize the connection.
connection.connect()

// const TYPES = require('tedious').TYPES;
const Request = require('tedious').Request;
function querySql() {
    const request = new Request("SELECT * FROM camp_information", function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("query start")
        }
    })
    request.on("row", function (columns) {
    //     columns.forEach(function (column) {
    //         if (column.value == null) {
    //             console.log("NULL")
    //         } else {
    //             console.log(column.metadata.colName,column.value);
    //         }
    //
    //     })
    //     // console.log(columns)
        return columns
    })

    request.on('done', function (rowCount, more) {
        console.log(rowCount + ' rows returned');
    });
    request.on("requestCompleted", function (rowCount, more) {
        connection.close();

    });
    connection.execSql(request);
}