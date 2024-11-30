const { response } = require('express');
const myMdO = require('../model/oders');

exports.getTotalRevenueByMonth = async (req, res) => {
    try {
        const totalRevenueByMonth = await myMdO.oderModel.aggregate([
            {
                $match: { 
                    status: "delivered"
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$oderDate" }, // Nhóm theo tháng
                        year: { $year: "$oderDate" } // và năm
                    },
                    total: { $sum: "$total" } // Tính tổng doanh thu
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // Sắp xếp theo năm và tháng
            }
        ]);

        // Nếu bạn muốn trả về kết quả trong phản hồi HTTP
        res.json(totalRevenueByMonth);
    } catch (error) {
        console.log("Đã xảy ra lỗi: " + error);
        res.status(500).json({ error: "Đã xảy ra lỗi khi lấy tổng doanh thu theo tháng." });
    }
};


exports.getTotal = async (req, res) => {
    try {
        const startDate = req.body.startDate; // Ngày bắt đầu
        const endDate = req.body.endDate; // Ngày kết thúc

        const totalRevenue = await myMdO.oderModel.aggregate([
            {
                $match: { 
                    status: "delivered",
                    oderDate: { $gte: new Date(startDate), $lte: new Date(endDate) } // Lọc theo ngày bắt đầu và ngày kết thúc
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$total" }
                }
            }
        ]);

        const total = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
        console.log(`Tổng doanh thu từ ${startDate} đến ${endDate}: ${total}`);

        res.render('../views/statistical/revenue.ejs',{total:total,startDate:startDate,endDate:endDate});

    } catch (error) {
        console.log("Đã xảy ra lỗi : " + error);
    }
}


exports.mostBoughtProduct = async (req,res) => {
    try {
        const mostBoughtProduct = await myMdO.oderModel.aggregate([
            {
                $match:{status:"delivered"}
            },
            {
                $unwind:"$items"
            },{
                $group:{
                    _id:"$items.productname",
                    totalQuantity:{$sum:"$items.quantity"}
                }
            },{
                $sort:{totalQuantity : -1}
            },{
                $limit:10
            }
        ]);
        console.log(mostBoughtProduct);
        res.render('../views/statistical/top10.ejs',{mostBoughtProduct:mostBoughtProduct});
    } catch (error) {
        console.log("Đã có lỗi : "+error);
    }
}
