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
    const sql_text = "SELECT top 5 * FROM T2005E_BCB_Products"
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


router.get("/product",async function (req,res) {
    const sql_text = "SELECT * FROM T2005E_BCB_Products"
    let data = {
        sanphams: []
    }
    try {
        const rows = await db.query(sql_text);
        data.sanphams = rows.recordsets[0];
    }catch (e) {
    }
    res.render("all-products",data);
});

//product detail page

router.get("/product-detail/:id",async function (req,res) {
    let productId= req.params.id;
    const sql_text = "SELECT * FROM T2005E_BCB_Categories;SELECT * FROM T2005E_BCB_Brand; " +
        "SELECT * FROM T2005E_BCB_Products WHERE ID="+productId+"; SELECT * FROM T2005E_BCB_Review WHERE IdProduct="+productId;
    let data = {
        categories: [],
        brands: [],
        product: {},
        reviews:[]
    }
    try {
        const rows = await db.query(sql_text);
        data.categories = rows.recordsets[0];
        data.brands = rows.recordsets[1];
        data.product = rows.recordsets[2].length>0?rows.recordsets[2][0]:{};
        data.reviews = rows.recordsets[3];
    }catch (e) {

    }
    res.render("product-detail",data);
})

//search page

router.get("/tim-kiem",async function (req,res) {
    let keyword = req.query.search;
    let page = req.query.page !== undefined?req.query.page:1;
    const limit = 6;
    let sql_text = "SELECT * FROM T2005E_BCB_Categories;SELECT * FROM T2005E_BCB_Brand;" +
        `SELECT a.* FROM T2005E_BCB_Products as a ` +
        "LEFT JOIN T2005E_BCB_Categories as b ON b.ID = a.CategoryID " +
        "LEFT JOIN T2005E_BCB_Brand as c ON c.ID = a.BrandID " +
        `WHERE a.TenSP LIKE N'%${keyword}%' `+
        `OR b.CategoryName LIKE N'%${keyword}%' `+
        `OR c.BrandName LIKE N'%${keyword}%' `+
        `ORDER BY a.ID DESC OFFSET ${(page-1)*limit} ROWS FETCH FIRST ${limit} ROWS ONLY;`+
        `SELECT count(a.ID) as total FROM SanPham as a ` +
        "LEFT JOIN DanhMuc as b ON b.ID = a.DanhMucID " +
        "LEFT JOIN ThuongHieu as c ON c.ID = a.ThuongHieuID " +
        `WHERE a.TenSP LIKE N'%${keyword}%' `+
        `OR b.TenDanhMuc LIKE N'%${keyword}%' `+
        `OR c.TenThuongHieu LIKE N'%${keyword}%';`;
    let data = {
        danhmucs: [],
        thuonghieus: [],
        sanphams: [],
        page:parseInt(page),
        keyword:keyword,
        total:0,
        pageNumber:1
    }
    try{
        const rows = await db.query(sql_text);
        data.danhmucs = rows.recordsets[0];
        data.thuonghieus = rows.recordsets[1];
        data.sanphams = rows.recordsets[2];
        data.total =  rows.recordsets[3][0].total;
        data.pageNumber = Math.ceil(data.total/limit);
    }catch (e) {
        //console.log(e.message);
    }
   res.render("search",data);
})


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