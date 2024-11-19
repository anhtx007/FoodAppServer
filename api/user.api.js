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

exports.addToWithList = async (req, res) => {
    try {
        const userId = req.body.userId;
        const productId = req.body.productId;

        // Lấy thông tin sản phẩm từ cơ sở dữ liệu
        const product = await myMdPro.prodcuctModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        const user = await myMd.userModel.findOne({ _id: userId });

        // Kiểm tra xem sản phẩm đã tồn tại trong danh sách mong muốn của người dùng hay chưa
        const isProductInWishlist = user.wishlist.some(item => item.toString() === productId);

        let updatedUser;
        if (isProductInWishlist) {
            // Nếu sản phẩm đã tồn tại trong danh sách mong muốn, loại bỏ nó
            updatedUser = await myMd.userModel.findByIdAndUpdate(
                { _id: userId },
                { $pull: { wishlist: productId } },
                { new: true }
            );
        } else {
            // Nếu sản phẩm chưa tồn tại trong danh sách mong muốn, thêm nó
            updatedUser = await myMd.userModel.findByIdAndUpdate(
                { _id: userId },
                { $push: { wishlist: productId } },
                { new: true }
            );
        }

        res.json(updatedUser);
    } catch (error) {
        console.log("Đã xảy ra lỗi khi thêm sản phẩm vào danh sách mong muốn : " + error);
        res.status(500).json({ error: "Đã xảy ra lỗi khi thêm sản phẩm vào danh sách mong muốn" });
    }
}


exports.getWithList = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await myMd.userModel.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        const withlist = user.wishlist;
        const fullwithlist = [];
        for (const productId of withlist) {
            const product = await myMdPro.prodcuctModel.findById({ _id: productId });
            if (product) {
                fullwithlist.push(product);
            }
        }
        console.log("Thông tin sản phẩm : " + fullwithlist);
        res.status(200).json(fullwithlist);
    } catch (error) {
        console.log("Không thể lấy được danh sách yêu thích của người dùng : " + error);
    }
}

exports.addCart = async (req, res) => {
    try {
        const { productId, quantity, price, total_order } = req.body;
        const userId = req.body.userId;

        const user = await myMd.userModel.findById(userId);
        if (!user) {
            console.log("User not found");
        }
        if (!user.cart) {
            user.cart = [];
        }

        const existingProductIndex = user.cart.findIndex(item => item.productId.toString() === productId);
        if (existingProductIndex !== -1) {
            // Nếu sản phẩm đã tồn tại trong giỏ hàng, cộng dồn thêm quantity và totalOrder
            user.cart[existingProductIndex].quantity += quantity;
            user.cart[existingProductIndex].total_order += total_order;
        } else {
            // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm mới vào giỏ hàng
            user.cart.push({ productId: productId, price: price, total_order: total_order, quantity: quantity });

        }
        user.save();
        console.log("cart : " + user.cart);
        res.json(user.cart);
    } catch (error) {
        console.log("Đã có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng :" + error);
    }
}

exports.getCart = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await myMd.userModel.findById(userId).populate('cart.productId');
        if (!user) {
            res.status(404).json({ message: "Người dùng không tồn tại" });
        }
        const cartWithInfoProduct = [];
        for (const item of user.cart) {
            const product = await myMdPro.prodcuctModel.findById(item.productId);
            if (product) {
                cartWithInfoProduct.push({
                    productId: product._id,
                    productname: product.productname,
                    price: product.price,
                    imageproduct: product.imageproduct,
                    quantity: item.quantity,
                    total_order: item.total_order,
                });
            }
        }

        res.json(cartWithInfoProduct);
    } catch (error) {
        console.log("Đã có lỗi xảy ra khi lấy thông tin giỏ hàng : " + error);
    }
}

exports.upDateCart = async (req, res) => {
    try {
        const { userId, cartId, quantity } = req.body;

        const user = await myMd.userModel.findById(userId);
        if (!user) {
            console.log("User not found");

        }

        const cartItem = user.cart.id(cartId);
        console.log(cartItem);
        if (!cartItem) {
            console.log("Cart not found");

        }

        cartItem.quantity = quantity;
        await user.save();
        console.log("Cập nhật thành công");
    } catch (error) {
        console.log("Lỗi cập nhật : " + error.message);
    }
}

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