const myMd = require('../model/oders');
const myMdP = require('../model/product');
const msg = "";

exports.addOder = async (req, res) => {
    try {
        const {userId,username, total, address,payment_method,items } = req.body;

        if (!Array.isArray(items)) {
            console.log("Item is not an array");
        }
    
        const newItems = items.map(item => ({
            productname: item.productname,
            quantity: item.quantity,
            price: item.price,
        }));
        const newOrder = new myMd.oderModel({
            userId,
            username,
            total,
            oderDate: Date.now(),
            address,
            payment_method,
            items: newItems,
            status: "Confirm",
        });

        const saveOrder = await newOrder.save();
       
        console.log(saveOrder);
        console.log("Đơn hàng đã được đặt thành công");
        res.status(200).json({ newOrder, msg: `Đơn hàng ${saveOrder._id} đặt hàng thành công` });
    } catch (error) {
        console.log("Đã xảy ra lỗi khi tạo đơn hàng :" + error);
    }
};

exports.getAllOder = async (req, res) => {
    try {
        const oders = await myMd.oderModel.find();
        console.log("Oder : " + oders);
        res.json(oders);
    } catch (error) {
        console.log("Đã có lỗi xảy ra khi lấy danh sách oder " + error);
    }
}

exports.getOder = async (req, res) => {
    try {
        const {username} = req.body;
        const oders = await myMd.oderModel.find({ status: "Confirm",username:username });
        console.log("Oder1 : " + oders);
        res.json(oders);
    } catch (error) {
        console.log("Đã có lỗi xảy ra khi lấy danh sách oder1 " + error);
    }
}
exports.getPreparingGoods = async (req, res) => {
    try {
        const {username} = req.body;
        const oders = await myMd.oderModel.find({ status: "preparing goods",username:username });
        console.log("Oder2 : " + oders);
        res.json(oders);
    } catch (error) {
        console.log("Đã có lỗi xảy ra khi lấy danh sách oder2 " + error);
    }
}

exports.getAreDelivering = async (req, res) => {
    try {
        const {username} = req.body;
        const oders = await myMd.oderModel.find({ status: "are delivering" ,username:username});
        console.log("Oder3 : " + oders);
        res.json(oders);
    } catch (error) {
        console.log("Đã có lỗi xảy ra khi lấy danh sách oder3 " + error);
    }
}
exports.getDelived = async (req, res) => {
    try {
        const {username} = req.body;
        const oders = await myMd.oderModel.find({ status: "delivered",username:username });
        console.log("Oder4 : " + oders);
        res.json(oders);
    } catch (error) {
        console.log("Đã có lỗi xảy ra khi lấy danh sách oder4 " + error);
    }
}

exports.mostBoughtProduct = async (req,res) => {
    try {
        const mostBoughtProduct = await myMd.oderModel.aggregate([
            {
                $match:{status:"delivered"}
            },
            {
                $unwind:"$items"
            },{
                $group:{
                    _id:"$items._id",
                    totalQuantity:{$sum:"$items.quantity"}
                }
            },{
                $sort:{totalQuantity : -1}
            },{
                $limit:10
            }
        ]);

        const products = 

        res.json(mostBoughtProduct);
    } catch (error) {
        console.log("Đã có lỗi : "+error);
    }
}