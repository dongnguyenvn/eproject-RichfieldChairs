const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

app.listen(PORT,function () {
    console.log("server is running.....");
});

app.use(express.static("public"));
app.set("view engine","ejs");

app.get("/",function (req,res) {
    res.render("home");
});

app.get("/product",function (req,res) {
    res.render("product-detail");
});