const myMd = require('../model/order');

exports.addOrder = async(req,res) => {
    try {
        const {userId,total,address,order_detail} = req.body;

        const order = new myMd.orderModel({
            userId,
            total,
            address,
            orderDate:Date.now(),
            status:'Confirm',
        });

        const saveOrder = await order.save();

        for(const detail of order_detail){
            const orderDetail = new myMd.orderDetailModel({
                order_id:saveOrder._id,
                product_id:detail.product_id,
                quantity:detail.quantity,
                price:detail.price,
            });

            await orderDetail.save();
            
        }
        console.log(saveOrder);
        res.status(201).json({ message: 'Đặt hàng thành công', order: saveOrder });
        
    } catch (error) {
        console.log("Đã có lỗi khi thêm đơn hàng");
    }
}