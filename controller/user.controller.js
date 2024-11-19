const myMd = require('../model/user');
var msg = "";

exports.register = async (req, res, next) => {
    const { username, email, phone, password,role } = req.body;
    const existingUser = await myMd.userModel.findOne({ email });
    if (existingUser) {
        msg = "Email đã được đăng ký";
       
    }
    if (!username || !email || !phone || !password) {
        msg = "Vui lòng nhập đầy đủ thông tin";
        
    }
    try {
     
        const newUser = new myMd.userModel({
            username,
            email,
            phone,
            password,
            role,
            cart: [],
            wishlist: [],
        
        });
        await newUser.save();
        msg = "Đăng ký người dùng thành công";

    } catch (error) {
        console.log("Đã xảy ra lỗi khi xử lý yêu cầu của bạn! : " + error);
    }

    res.render('auth/register', { msg: msg });
}


exports.login = async (req, res, next) => {
    if (req.method === 'POST') {
        try {
            const { email, password } = req.body;
            const user = await myMd.userModel.findOne({ email: email });
            
            if (!user) {
                msg = "Người dùng không tồn tại"
            }

            if(user.role === 'user'){
                msg = "Người dùng không có quyền truy cập";
                res.render('auth/login', { msg: msg });
                return;
                
            }

            if (user.password !== password) {
                msg = "Sai mật khẩu,vui lòng thử lại"
            }

            if (user != null) {
                if (user.password == req.body.password) {
                    console.log("Đã đăng nhập vào user " + user._id);
                    res.redirect('/listU')
                }
            }

        } catch (error) {
            console.log("Đã xảy ra lỗi khi xử lý yêu cầu đăng nhập của bạn :" + error);
        }
    }

    res.render('auth/login', { msg: msg });
};

exports.handelHello = (req,res) => {
    res.render('index.ejs');
}

exports.getAllUser = async (req, res) => {
    try {
        const users = await myMd.userModel.find();
        console.log("Danh sách người dùng : " + users);
        res.render("../views/user/user.ejs", { users: users });
    } catch (error) {
        console.log("Đã có lỗi khi lấy danh sách người dùng : " + error);
    }
}

exports.deleteUser = async(req,res) => {
    const idU = req.params.idU;
    try {
        await myMd.userModel.deleteOne({_id:idU});
        res.redirect('/listU')
    } catch (error) {
        console.log("Xóa bị lỗi : "+error);
    }
}

exports.addToCart = async (req,res) => {
    try {
        const {userId,productId} = req.body;
        const user = await myMd.userModel.findById(userId);
        if(!user){
            console.log("User not found");
        }


        if(!user){
            console.log("User not found");
        };
        
    } catch (error) {
        
    }
}