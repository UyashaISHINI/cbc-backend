import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export function createProduct(req, res) {
    // Check if the user is an admin
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Access denied. Please login as an administrator to add products."
        });
        return;
    }

    // Validate product data from the request body
    const newProductData = req.body;

    if (!newProductData || !newProductData.productName || !newProductData.price) {
        res.status(400).json({
            message: "Invalid product data. Please provide a name and price."
        });
        return;
    }

    // Create a new product instance
    const product = new Product(newProductData);

    product
        .save()
        .then(() => {
            res.status(201).json({
                message: "Product created successfully",
                product,
            });
        })
        .catch((error) => {
            console.error("Error saving product:", error);
            res.status(500).json({
                message: "Failed to create product. Please try again.",
                error: error.message || error,
            });
        });
}


export function getProducts(req, res) {
    Product.find({}).then((products) => {
        res.json(products)
    })
}

export function deleteProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Please login as administrator to delete products"
        })
        return
    }
    const productId = req.params.productId

    Product.deleteOne(
        { productId: productId }
    ).then(() => {
        res.json({
            message: "Product deleted"
        })
    }).catch((error) => {
        res.status(403).json({
            message: error
        })
    })
}

export function updateProduct(req,res){
    if(!isAdmin(req)){
        res.status(404).json({
            message:"Please login as administrator to update products"
        })
        return
    }
        const productId = req.params.productId
        const newProductData = req.body

        Product.updateOne(
            { productId: productId },newProductData
        ).then(() => {
            res.json({
                message: "Product updated"
            })
        }).catch((error) => {
            res.status(403).json({
                message: error
            })
        })
    
}
export async function getProductById(req,res) {
    try{
        const productId = res.params.productId
    
        const product = await Product.findOne({productId : productId})
        res.json(product)
    }catch(e){
        res.status(500).json({
            e
        })
    }
}