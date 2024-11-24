const myMd = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const myMdPro = require('../model/product');
const { default: mongoose } = require('mongoose');

exports.register = async (req, res, next) => {
    try {
        const { username, email, phone, password } = req.body;
        const existingUser = await myMd.userModel.findOne({ email });
        if (existingUser) {
            console.log("Email đã được đăng ký!");
            return res.status(400).json({ message: "Email đã được đăng ký." });
        }

        const user = await myMd.userModel.findOne({username});
        if(user){
            console.log("Người dùng đã tồn tại");
            return res.status(400).json({message:"Người dùng đã tồn tại"});
        }

        if (password > 6) {
            const newUser = new myMd.userModel({
                username,
                email,
                phone,
                password,
                role: "1",
                cart: [],
                address: [],
                wishlist: [],
                order: []
            });

            await newUser.save();
            console.log("Đăng ký người dùng thành công!");
        } else {
            console.log("Password phải nhiều hơn 6 ký tự");
            return;
        }

        res.status(201).json({ message: "Người dùng đã được tạo thành công." });

    } catch (error) {
        console.log("Đã xảy ra lỗi khi xử lý yêu cầu của bạn! : " + error);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await myMd.userModel.findOne({ email: email });
        if (!user) {
            console.log("Người dùng không tồn tại");
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        if (user.password !== password) {
            console.log("Sai mật khẩu");
            return res.status(401).json({ message: "Sai mật khẩu" });
        }

        if (user.role === 'admin') {
            res.status(401).json({ message: "Tài khoản không có quyền truy cập" });
            return;
        } else {
            const userPayload = { userid: user.id, username: user.username, email: user.email, phone: user.phone, cart: user.cart, wishlist: user.wishlist };
            const token = jwt.sign(userPayload, 'ijbfehgvfhgvdw', { expiresIn: '1h' });
            console.log(userPayload);
            console.log(("Đăng nhập thành công"));
            res.status(200).json(userPayload);
        }


    } catch (error) {
        console.log("Đã xảy ra lỗi khi xử lý yêu cầu của bạn :" + error);
    }
};

exports.getInfomation = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split('')[1];
        const decoded = jwt.verify(token, 'ijbfehgvfhgvdw');
        const { userId, username, email, phone } = decoded;
        console.log("Thông tin người dùng", userId, username, email, phone);
        res.status(200).json({ userId, username, email, phone });
    } catch (error) {

    }
}

// địa chỉ ng dùng
exports.addAddress = async (req, res) => {
    try {
        const { userId, address } = req.body;

        const user = await myMd.userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.address.push(address);
        await user.save();
        console.log("Thêm địa chỉ thành công");
    } catch (error) {
        console.log("Đã xảy ra lỗi khi thêm địa chỉ :" + error);
    }
}

exports.getAddress = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await myMd.userModel.findById(userId);

        if (!user) {
            console.log("User not found");
        }
        console.log("Địa chỉ :" + user.address);
        res.status(200).json({ address: user.address });
    } catch (error) {
        console.log("Đã có lỗi khi lấy danh sách địa chỉ :" + error);
    }
}

// lấy danh sách yêu thích

// lấy sản phẩm thêm giỏ hàng

// check id người dùng giỏ hàng theo id 

exports.ChangePassword = async (req, res) => {
    try {
        const { email, password, newpassword, confirmpassword } = req.body;
        const user = await myMd.userModel.findOne({email:email});
        if(!user){
            console.log("User not found");
            res.json({message: "Người dùng không tồn tại"});
        }

        if(user.password !== password){
            console.log("Mật khẩu hiện tại không chính xác");
            return;
        }
        if(password < 6 || confirmpassword <6){
            console.log("Mật khẩu phải lớn hơn hoặc bằng 6 ký tự");
            return;
        }
        if(newpassword !== confirmpassword){
            console.log("Mật khẩu mới và xác nhận mật khẩu không trùng nhau");
            return;
        }

        user.password = newpassword;
        await user.save();
        console.log("Đổi mật khẩu thành công ");
        res.json({message:"Đổi mật khẩu thành công "});
    } catch (error) {
        console.log("Đã có lỗi");
    }
}