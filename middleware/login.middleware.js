exports.checkLogin = (req,res) => {
    const user = req.user;
    if(user.role === 0){
        return res.status(401).json({ message: "Tài khoản không có quyền truy cập" });
    } 
    next();
};