const express = require('express');
const router = express.Router();
const userApi = require('../api/user.api');
const productAppi = require('../api/product.api');

//
const productController = require('../controller/product.controller');
const userController = require('../controller/user.controller');

 //user routes
 router.get('/home', userController.handelHello);
 router.post('/api/addproducts', productAppi.addProduct);
 router.post('/register', userController.register);
 router.get('/register', userController.register);
 router.get('/', userController.login);
 router.post('/', userController.login);
 router.get('/listU', userController.getAllUser);
 router.post('/deleteU/:idU', userController.deleteUser);


 HEAD
//controller product
router.get('/listproducts', productController.getProduct);
router.post('/addProduct', upload.single('imageproduct'), productController.addProduct);
router.post('/deleteproduct/:idP', productController.deleteProduct);
router.post('/addCat', upload.single("imageCat"), productController.addCat);


  //product api
  router.post('/findProduct', productAppi.findProduct);
  router.get('/getInfoProduct', productAppi.getInfoProdut);
  router.get('/getProduct', productAppi.getProduct);
  router.get('/getCat', productAppi.getCat);
  router.post('/getProByCat', productAppi.getProductByCat);







