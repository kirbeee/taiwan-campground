// const Connection = require('tedious').Connection;
// const config = require("./dbConfig")
//
// const connection = new Connection(config);
// // Setup event handler when the connection is established.
// connection.on('connect', function(err) {
//     if (err) {
//         console.log('Error: ', err)
//     }
//     // If no error, then good to go...
//     else {
//         console.log("connected success")
//         querySql();
//     }
// });
//
// // Initialize the connection.
// connection.connect()
//
// const Request = require('tedious').Request;
// const TYPES = require('tedious').TYPES;
//
// function querySql(){
//     const request = new Request("SELECT student_ID FROM University.student_information",function (err) {
//         if(err){
//             console.log(err)
//         }else{
//             console.log("query success")
//         }
//     })
//     let result = ""
//     request.on("row",function (columns) {
//         columns.forEach(function (column){
//             if(column.value == null){
//                 console.log("NULL")
//             }else{
//                 console.log(column.value)
//                 result += column.value+" ";
//             }
//         })
//     })
//     request.on('done',function (rowCount, more){
//         console.log(rowCount + ' rows returned');
//     });
//     request.on("requestCompleted",function (rowCount, more) {
//         connection.close();
//     });
//     connection.execSql(request);
// }
//
//
//
