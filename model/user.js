const { default: mongoose, Schema } = require('mongoose');
const db = require('./db');

const userChema = new db.mongoose.Schema(
    {
        username: { type: String },
        email: { type: String },
        phone: { type: Number },
        password: { type: String },
        role:{type:String},
        cart: [{
            productId:{type:mongoose.Schema.Types.ObjectId,ref:"productModel"},
            price:{type:Number},
            quantity:{type:Number},
            total_order:{type:Number},
        }],
        wishlist:[{type: mongoose.Schema.Types.ObjectId, ref: 'productModel'}],
        address:[{type:String}],
        order:[{type:mongoose.Schema.Types.ObjectId,ref:"oderModel"}]
    }, {
    collection: 'users'
}
)

let userModel = db.mongoose.model('userModel', userChema);

module.exports = { userModel }