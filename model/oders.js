const mongoose  = require('mongoose');
const db = require('./db');

const oderSchema = new db.mongoose.Schema(
    {
        username: { type: String },
        total: { type: Number },
        oderDate: { type: Date },
        address:{ type:String},
        payment_method:{type:String},
        status: { type: String },
        items:[{
            productname:{type: String},
            quantity:{type: Number},
            price:{type: Number},
        }]
    }
);

// const OrderDetailChema = new db.mongoose.Schema({
//     orderId:{type:String},
//     productId:[{type:mongoose.Schema.Types.ObjectId,ref:'productModel'}],
//     quantity:{type:Number},
//     price:{type:Number},
// });

// let OrderDetailModel = db.mongoose.model('orderDetailModel',OrderDetailChema);
let oderModel = db.mongoose.model('oderModel', oderSchema);
module.exports = { oderModel }