const { default: mongoose } = require('mongoose');
const db = require('./db');

const orderChema = new db.mongoose.Schema({
    userId: { type: String },
    total: { type: Number },
    orderDate: { type: Date, default: Date.now() },
    address: { type: String },
    status: { type: String },
});

let orderModel = db.mongoose.model('orderModel', orderChema);

const orderDetailChema = new db.mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "orderModel" },
    product_id: { type: String },
    quantity: { type: Number },
    price: { type: Number },
});

let orderDetailModel = db.mongoose.model('orderDetailModel', orderDetailChema);

module.exports = { orderModel, orderDetailModel };