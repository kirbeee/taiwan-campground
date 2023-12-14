const ejsMate = require("ejs-mate")
const express = require("express")
const methodOverride = require("method-override")
const path = require("path")

const Campground = require("./models/campground")
const catchAsync = require("./utils/catchAsync")
const expressError = require("./utils/ExpressError")
const {Connection, Request} = require("tedious");
const config = require("./models/dbConfig");
const {promises} = require("msnodesqlv8");

const app = express()

app.set("view engine", "ejs")
app.set("views",path.join(__dirname,"views"))
app.engine('ejs',ejsMate)

app.use(express.urlencoded({ extended: true}))
app.use(methodOverride("_method"))

app.get('/',(req,res)=>{
    res.render("home")
})
app.get("/campgrounds", catchAsync(async (req,res)=>{

    const Connection = require('tedious').Connection;
    const config = require("./models/dbConfig")

    const connection = new Connection(config);
// Setup event handler when the connection is established.
    connection.on('connect', function (err) {
        if (err) {
            console.log('Error: ', err)
        }
        // If no error, then good to go...
        else {
            console.log("connected success")
            async function getdata(){
                const campgrounds = await querySql()
                console.log(campgrounds)
                res.render("campgrounds/index",{campgrounds})
            }

            getdata()
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
        return new Promise(function (resolve, reject) {
            request.on("row", function (columns) {
                let db_Data = []
                columns.forEach(function (column,index) {
                    if(index === 0){
                        db_Data.push({});
                    }
                    db_Data[db_Data.length-1][column.metadata.colName] = column.value;
                    // console.log(index,column.metadata.colName,column.value);
                })
                resolve(db_Data)
            })
            request.on("requestCompleted", function (rowCount, more) {
                connection.close();

            });
            connection.execSql(request);
        })


        // request.on('done', function (rowCount, more) {
        //     console.log(rowCount + ' rows returned');
        // });

    }
}))
// app.get("/campgrounds/new",(req,res)=>{
//     res.render("campgrounds/new");
// })
// app.post('/campgrounds', catchAsync(async (req, res,next) => {
//         const campground = new Campground(req.body.campground);
//         await campground.save();
//         res.redirect(`/campgrounds/${campground._id}`)
// }))
// app.get("/campgrounds/:id", catchAsync(async(req,res)=>{
//     const campground = await Campground.findById(req.params.id)
//     res.render("campgrounds/show.ejs",{campground})
// }))
// app.get("/campgrounds/:id/edit", catchAsync(async (req,res)=>{
//     const  campground = await Campground.findById(req.params.id)
//     res.render("campgrounds/edit",{campground})
// }))
// app.put("/campgrounds/:id", catchAsync(async (req,res) =>{
//     const {id} = req.params
//     const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
//     res.redirect(`/campgrounds/${campground._id}`)
// }))
// app.delete("/campgrounds/:id", catchAsync(async (req,res)=>{
//     const {id} = req.params;
//     await Campground.findByIdAndDelete(id)
//     res.redirect("/campgrounds")
// }))
//
// app.all("*",(req, res, next)=>{
//     next(new expressError("Page Not Found", 404))
// })
//
// app.use((err, req, res, next)=>{
//     const {statusCode=500, message="Something went wrong"} = err
//     res.status(statusCode).send(message)
// })
app.listen(8000, ()=>{
    console.log("serving on port 8000")
})