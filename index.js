const ejsMate = require("ejs-mate")
const express = require("express")
const methodOverride = require("method-override")
const path = require("path")


const catchAsync = require("./utils/catchAsync")
const expressError = require("./utils/ExpressError")
const app = express()
const sql = require("./models/campground")

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.engine('ejs', ejsMate)

app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))


app.get('/', (req, res) => {
    res.render("home")
})
app.get("/campgrounds", catchAsync(async (req, res) => {
    const campgrounds = await sql.querySQL("SELECT * FROM camp_information")
    res.render("campgrounds/index", {campgrounds})
}))
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
})
app.post('/campgrounds', catchAsync(async (req, res,next) => {
        console.log(req.body.campground);
        const id = await sql.insertSQL(req.body.campground)
        res.redirect(`/campgrounds/${id}`)
}))
app.get("/campgrounds/:id", catchAsync(async (req, res) => {
    let campground = await sql.querySQL(`select * FROM camp_information WHERE campgroundID IN (${req.params.id})`)
    campground = campground[0]
    res.render("campgrounds/show.ejs", {campground})
}))
app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    let campground = await sql.querySQL(`select * FROM camp_information WHERE campgroundID IN (${req.params.id})`)
    campground = campground[0]
    res.render("campgrounds/edit", {campground})
}))
app.put("/campgrounds/:id", catchAsync(async (req,res) =>{
    const {id} = req.params
    const campgroundID = await sql.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campgroundID}`)
}))
app.delete("/campgrounds/:id", catchAsync(async (req,res)=>{
    const {id} = req.params;
    await sql.findByIdAndDelete(id)
    res.redirect("/campgrounds")
}))

app.all("*", (req, res, next) => {
    next(new expressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = "Something went wrong"} = err
    res.status(statusCode).send(message)
})
app.listen(8000, () => {
    console.log("serving on port 8000")
})