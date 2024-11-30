const express = require('express');
const router = express.Router();
const userApi = require('../api/user.api');
const productAppi = require('../api/product.api');
const oApi = require('../api/test');
const orderApi = require('../api/order.api');
const productController = require('../controller/product.controller');
const userController = require('../controller/user.controller');
const oderCotroller = require('../controller/oder.controller');
const userMiddleware = require('../middleware/login.middleware');
const statisticalControll = require('../controller/statistical.controller');
const multer = require('multer');
var upload = multer({ dest: 'templates/' });

// const upload = multer({
//     storage:multer.diskStorage({
//         destination:(req,file,cb) => {
//             cb(null,'upload/');
//         },
//         filename:(req,file,cb) => {
//             const uniqueSuffix = Date.now() + '-' + uuid.v4();
//             cb(null,uniqueSuffix + '-' + file.originalname);
//         },
//     })
// });

const initRouter = (app) => {
    //userApi.
    router.post('/api/register', userApi.register);
    router.post('/api/login', userApi.login);
    router.get('/api/getInfo', userApi.getInfomation);
    router.post('/addAddress', userApi.addAddress);
    router.post('/getAddress', userApi.getAddress);
    router.post('/addToWithList', userApi.addToWithList);
    router.post('/getWithList', userApi.getWithList);
    router.post('/addToCart', userApi.addCart);
    router.post('/getCart', userApi.getCart);
    router.post('/updateCart',userApi.upDateCart);
    router.post('/ChangePass',userApi.ChangePassword);


    //
    router.post('/order',oApi.addOrder);

    //user routes
    router.get('/home', userController.handelHello);
    router.post('/api/addproducts', productAppi.addProduct);
    router.post('/register', userController.register);
    router.get('/register', userController.register);
    router.get('/', userController.login);
    router.post('/', userController.login);
    router.get('/listU', userController.getAllUser);
    router.post('/deleteU/:idU', userController.deleteUser);



    //controller product
    router.get('/listproducts', productController.getProduct);
    router.post('/addProduct', upload.single('imageproduct'), productController.addProduct);
    router.post('/deleteproduct/:idP', productController.deleteProduct);
    router.post('/addCat', upload.single("imageCat"), productController.addCat);
    // router.get('/getCat',productController.getCat);
    router.get('/findProduct', productController.findProduct);
    router.post("/editProduct",productController.updateProduct);


    //product api
    router.post('/findProduct', productAppi.findProduct);
    router.get('/getInfoProduct', productAppi.getInfoProdut);
    router.get('/getProduct', productAppi.getProduct);
    router.get('/getCat', productAppi.getCat);
    router.post('/getProByCat', productAppi.getProductByCat);

    //oder
    router.post('/addOrder', oderCotroller.addOder);
    router.get('/getOrder', oderCotroller.getOder);

    router.get('/getPreparing', oderCotroller.getPreparingGoods);
    router.get('/getAreDelivering', oderCotroller.getAreDelivering);
    router.get('/getDelived', oderCotroller.getDelived);
    router.post('/updateStatus/:orderId', oderCotroller.updateStatus);
    router.post('/deleteOrder/:idOrder', oderCotroller.deleteOrder);
    router.post('/api/addOrder', orderApi.addOder);
    


    //THỐNG KÊ
    router.get('/top10', statisticalControll.mostBoughtProduct);
    router.get('/revenue',statisticalControll.getTotalRevenueByMonth);
    router.post('/totalRevenue',statisticalControll.getTotal);
    router.get('/totalRevenue',statisticalControll.getTotal);


    //orders api
    router.post('/getConfirm', orderApi.getOder);
    router.post('/getgetPreparingGoods', orderApi.getPreparingGoods);
    router.post('/getAreDelivering', orderApi.getAreDelivering);
    router.post('/getDelived', orderApi.getDelived);
    router.get('/mostBoughtProduct', orderApi.mostBoughtProduct);
    router.get('/getAllOrder', orderApi.getAllOder);
    return app.use('/', router);
}

module.exports = initRouter;