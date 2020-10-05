const express = require('express');
const router = express.Router();

const Cart = require('../models/cart');

const mssql = require("mssql");
const config = {
    server: '101.99.13.2',
    user:'sa',
    password:'z@GH7ytQ',
    database:'test'
}
mssql.connect(config,function (err) {
    if(err) console.log(err);
    else console.log("ket noi DB thanh cong!");
})
const db = new mssql.Request();


router.get("/",async function (req,res,next) {
    const sql_text = "SELECT * FROM T2005E_BCB_Products"
    let data = {
        sanphams: []
    }
    try {
        const rows = await db.query(sql_text);
        data.sanphams = rows.recordsets[0];
    }catch (e) {
    }
    res.render("home",data);
});


router.get("/product",function (req,res) {
    res.render("all-products");
});


// add remove products

router.get('/add/:id', async function(req, res, next) {
    let productId = req.params.id;


    const sql_text = "SELECT * FROM T2005E_BCB_Products"
    try {
        const rows = await db.query(sql_text);
        sanphams = rows.recordsets[0];
    }catch (e) {
    }

    var cart = new Cart(req.session.cart ? req.session.cart : {});
    var product = sanphams.filter(function(item) {
        return item.ID == productId;
    });
    cart.add(product[0], productId);
    req.session.cart = cart;
    res.redirect('/');
});

router.get('/cart', function(req, res, next) {
    if (!req.session.cart) {
        return res.render('cart', {
            products: null
        });
    }
    var cart = new Cart(req.session.cart);
    res.render('cart', {
        title: 'NodeJS Shopping Cart',
        products: cart.getItems(),
        totalPrice: cart.totalPrice
    });
    console.log(cart.getItems());
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.remove(productId);
    req.session.cart = cart;
    res.redirect('/cart');
});

module.exports = router;