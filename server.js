 const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Order");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb+srv://pkomali440_db_user:tracker03@financetracker.xocysbb.mongodb.net/ecommerceDB?retryWrites=true&w=majority&appName=FinanceTracker")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Get Products
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find();

        console.log("Products:", products);

        res.json(products);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Register User
app.post("/register", async (req, res) => {

    const user = new User(req.body);

    await user.save();

    res.json({
        message: "Registration Successful"
    });

});

// Login

app.post("/login", async (req, res) => {

    const user = await User.findOne({

        email: req.body.email,
        password: req.body.password

    });

    if(user){

        res.json({
            success:true
        });

    }else{

        res.json({
            success:false
        });

    }

});

// Save Order

app.post("/orders", async(req,res)=>{

    const order = new Order(req.body);

    await order.save();

    res.json({
        message:"Order Placed Successfully"
    });

});

app.listen(5000, () => {

    console.log("Server Running on Port 5000");

});
mongoose.connection.once("open", async () => {
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(collections);
});