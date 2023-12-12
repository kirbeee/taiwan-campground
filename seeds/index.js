const Connection = require('tedious').Connection;
const config = require("../models/dbConfig")
const cities = require("./cities")
const {places, descriptors} = require("./seedHelpers")
for (let i = 0; i < 50; i++) {
    const connection = new Connection(config);
// Setup event handler when the connection is established.
    connection.on('connect', function (err) {
        if (err) {
            console.log('Error: ', err)
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

    const sample = array => array[Math.floor(Math.random() * array.length)]

    function insertData() {

        // for (let i = 0; i < 50; i++) {
        const request = new Request("INSERT camp_information(image, title, price, description,location) OUTPUT inserted.campgroundID VALUES (@image,@title,@price,@description,@location);", function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log("start insert")
            }
        })
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        request.addParameter('image', TYPES.VarChar, "https://source.unsplash.com/collection/483251")
        request.addParameter('title', TYPES.VarChar, `${sample(descriptors)} ${sample(places)}`)
        request.addParameter('price', TYPES.Int, price)
        request.addParameter('description', TYPES.VarChar, "Lorem ipsum dolor sit amet?")
        request.addParameter('location', TYPES.VarChar, `${cities[random1000].city}, ${cities[random1000].state}`)

        request.on('row', function (columns) {
            columns.forEach(function (column) {
                if (column.value == null) {
                    console.log("NULL")
                } else {
                    console.log("Product id of inserted item is " + column.value);
                }
            })
        })

        request.on("requestCompleted", function (rowCount, more) {
            connection.close();
        })

        connection.execSql(request)
        // }
    }
}
