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










