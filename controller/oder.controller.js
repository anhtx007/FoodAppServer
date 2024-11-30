const myMd = require('../model/oders');
const status = {
    "Confirm" : 0,
    "preparing goods":1,
    "are delivering":2,
    "delivered":3
};
var msg = "";


exports.addOder = async (req, res) => {
    try {
        const {username,total,address,items} = req.body;
        
        if(!Array.isArray(items)){
            console.log("Item is not an array");
        }
        const newItems = items.map(item => ({
            productname:item.productname,
            quantity:item.quantity,
            price:item.price,
        }));
        const newOrder = new myMd.oderModel({
            username,
            total,
            oderDate:Date.now(),
            address,
            items:newItems,
            status:"Confirm",
        });

        await newOrder.save();
        console.log(newOrder);
        console.log("Đơn hàng đã được đặt thành công");
        
    } catch (error) {
        console.log("Đã xảy ra lỗi khi tạo đơn hàng :" + error);
    }
};

exports.getOder = async (req, res) => {
    try {
        const status = req.params.status;
        const oders = await myMd.oderModel.find({status:"Confirm"});
        console.log("Oder : " + oders);
        res.render('../views/order/oders.ejs', { oders: oders });
    } catch (error) {
        console.log("Đã có lỗi xảy ra khi lấy danh sách oder " + error);
    }
}
exports.getPreparingGoods = async (req,res) => {
    try {
        const status = req.params.status;
        const oders = await myMd.oderModel.find({status:"preparing goods"});
        console.log("Oder : " + oders);
        res.render('../views/order/preparing.ejs', { oders: oders });
    } catch (error) {
        console.log("Đã có lỗi xảy ra khi lấy danh sách oder " + error);
    } 
}

exports.getAreDelivering = async (req,res) => {
    try {
        const status = req.params.status;
        const oders = await myMd.oderModel.find({status:"are delivering"});
        console.log("Oder : " + oders);
        res.render('../views/order/delivering.ejs', { oders: oders });
    } catch (error) {
        console.log("Đã có lỗi xảy ra khi lấy danh sách oder " + error);
    } 
}
exports.getDelived = async (req,res) => {
    try {
        const status = req.params.status;
        const oders = await myMd.oderModel.find({status:"delivered"}).sort({oderDate:1});
        console.log("Oder : " + oders);
        res.render('../views/order/delived.ejs', { oders: oders });
    } catch (error) {
        console.log("Đã có lỗi xảy ra khi lấy danh sách oder " + error);
    } 
}
exports.updateStatus = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await myMd.oderModel.findById(orderId);

        if (!order) {
            console.log("Order not found");
            return res.status(404).json({ error: "Order not found" });
        }

        let newStatus;
        switch (order.status) {
            case "Confirm":
                newStatus = "preparing goods";
                res.redirect("/getPreparing");
                break;
            case "preparing goods":
                newStatus = "are delivering";
                res.redirect("/getAreDelivering");
                break;
            case "are delivering":
                newStatus = "delivered";
                res.redirect("/getDelived");
                break;
            default:
                console.log("Invalid order status");
                return res.status(400).json({ error: "Invalid order status" });
        }

        order.status = newStatus;
        await order.save();
        
    } catch (error) {
        console.log("Error updating order status:", error);
    }
};



exports.deleteOrder = async (req,res) => {
    const idOrder = req.params.idOrder;
    try {
        await myMd.oderModel.deleteOne({_id:idOrder});
        console.log("Xóa đơn hàng thành công hàng");
        msg = "Đơn hàng đã bị từ chối";
        res.redirect('/getOrder');
    } catch (error) {
        console.log("Đã xảy ra lỗi khi xóa đơn hàng :" +error);
    }
}

exports.getTotalByMonth = async (req,res) => {
    try {
        const totalsByMonth = await myMd.oderModel.aggregate([
            {
                $group:{
                    _id:{
                        month:{$month:"$orderDate"},
                        year:{$year:"$orderDate"},
                    },
                    total:{$sum:"$total"}
                }
            },
            {
                $sort:{"_id.year":1,"_id.month":1}
            }
        ]);

        res.render('../views/statistical/statistical.ejs',{totalsByMonth:totalsByMonth});
    } catch (error) {
        
    }
};
