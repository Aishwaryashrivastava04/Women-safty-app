var express = require('express');
var router = express.Router();
var Admin = require('../Models/admin_tbl');
const jwt=require("jsonwebtoken");
JWT_Secret="wertyu34567890poiuytrewq";
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express from admin' });
});


router.post("/register",async(req,res)=>{
 try {
    const{name,email,password}=req.body;
    const existingUser = await Admin.findOne({email});
    if(existingUser){
      return res.status(400).json({message:"Email already exist"})
    }

    const newAdmin = new Admin({name,email,password});
    const saveAdmin = await newAdmin.save();
       return res.status(201).json(
        {
        message:"Admin registered successfully",
        user:saveAdmin,
        success:true
       }
      );
 } catch(error) {
  console.error("Register Error",error);
  return res.status(500).json({
    message:error.message || "server not responding",
    success: false,
  }); 
 }
})
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }

    const token = jwt.sign({ _id: user._id, email: user.email }, JWT_Secret, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Login Successfully",
      token,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;


