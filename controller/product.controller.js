const myMd = require('../model/product');
const fs = require('fs');
const path = require('path');


exports.addCat = async (req, res, next) => {
    try {
        const {category} = req.body;
        let image = "";
        if(req.file != null){
            const destinationPath = path.join(__dirname,"../public/templates");
            const temFilePath = req.file.path;
            const originalName = req.file.originalname;

            fs.renameSync(temFilePath,path.join(destinationPath,originalName));
            
            image = "/templates/" + originalName;
        }
        if(category){
            console.log("Danh mục đã tồn tại");
            
        }        
        const newCategory = new myMd.categoryModel({category,imageCat:image});
        
        await newCategory.save();
        console.log("Thêm danh mục thành công " +newCategory);
    } catch (error) {
        console.log("Lỗi thêm danh mục :" +error);
    }
    res.redirect("/listproducts");
};



exports.getProduct = async(req,res,next) => {
    try {
        const products = await myMd.prodcuctModel.find();
        const cats = await myMd.categoryModel.find();
        console.log("Danh sách cat :" +cats);
        console.log("Danh sách sản phẩm : " +products);
        res.render("../views/product/product.ejs",{products:products,cats:cats});
    } catch (error) {
        console.log("Đã có lỗi khi lấy danh sách người dùng");
    }
};


exports.addProduct = async(req, res, next) => {
    try {
        const {productname,price,description,category} = req.body;

        let image = "";
        if(req.file != null){
            const destinationPath = path.join(__dirname,"../public/templates");
            const temFilePath = req.file.path;
            const originalName = req.file.originalname;

            fs.renameSync(temFilePath,path.join(destinationPath,originalName));
            
            image = "templates/" + originalName;
        }
        const newProduct = new myMd.prodcuctModel({
            productname,
            price,
            imageproduct:image,
            description,
            category,
        });

        await newProduct.save();
        console.log("Thêm thành công: "+newProduct);
    } catch (error) {
        console.log("Đã có lỗi sảy ra khi thêm sản phẩm mới : " +error);
    }     
    

    res.redirect("/listproducts");
};

exports.deleteProduct = async (req,res) => {
    const idP = req.params.idP;
    try {
        await myMd.prodcuctModel.deleteOne({_id:idP});
        console.log("Xóa thành công");
        res.redirect("/listproducts");
    } catch (error) {
        console.log("Xóa sản phẩm lỗi : "+error);
    }
};

exports.findProduct = async(req,res) => {
    try {
        const productname = req.body.productname;
        const searchCondition = {};
        if(productname){
            searchCondition.productname = productname;
        }

        const product = await myMd.prodcuctModel.find(searchCondition);
        res.status(200).json(product);
        console.log("Kết quả tìm kiếm : " +product);
    } catch (error) {
        console.log("Đã có lỗi khi xử lý yêu cầu tìm kiếm của bạn " ,error);
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { productname, price, description, category } = req.body;
        const productId = req.body.productId; // Lấy productId từ req.params

        let image = "";
        if (req.file != null) {
            const destinationPath = path.join(__dirname, "templates");
            const temFilePath = req.file.path;
            const originalName = req.file.originalname;

            fs.renameSync(temFilePath, path.join(destinationPath, originalName));

            image = "../public/templates/" + originalName;
        }

        // const updatedFields = {
        //     productname,
        //     price,
        //     description,
        //     category,
        //     imageproduct:image,
        // };

        const product =  await myMd.prodcuctModel.findById(productId);
        console.log("product ==== " +product);
        product.productname = productname;
        product.price = price;
        product.imageproduct = imageproduct;
        product.description = description;
        product.category = category;

        await product.save();

        console.log("Sửa sản phẩm thành công: ");
        res.redirect("/listproducts");
    } catch (error) {
        console.log("Đã có lỗi khi sửa sản phẩm: ", error);
        res.status(500).json({ error: "Đã có lỗi khi sửa sản phẩm" });
    }
};

