const cartService = require('../services/cart')

/**
 * This function fetches cart items from database, filters those products to include only those marked
 * to be included in data, sets quantity of each product, calculates and sets aggregate
 * listed price, actual price, and amount saved of each product,
 * corresponding to quantity and returns back as array of products. 
 * @param cartId {cart id} 
 * @param data {array }
 * @returns array of products
 */
exports.filterProductsAndCalculatePrice = async ( cartId, data ) => {

        //get items in user's cart
        let dbProducts = await cartService.getCartItems(cartId)
        //format the data
        dbProducts = dbProducts.products.map(product => product.productId)   

        //get only elements included for checkout and if quantity is more than 0
        const cartProducts = Object.entries(data)
            .filter ( product => product[1][0] > 0 && product[1][1] == 'on' )       

        //extract ids to check which are included
        //the id is the first index  eg. ['id', [quantity, included(bool)]]                                                          
        const cartProductIds = cartProducts.map( product => product[0])

        //initialize array
        let finalProducts = []

        dbProducts.forEach( (dbProduct, index) => {
            if( cartProductIds.includes( dbProduct._id.toString())){    //check if included at checkout
                dbProduct._doc.quantity = cartProducts[index][1][0]     //set quantity
                dbProduct._doc.rPrice = dbProduct._doc.price * dbProduct._doc.quantity      //retail price
                dbProduct._doc.sPrice = dbProduct._doc.sellingPrice * dbProduct._doc.quantity   //selling price
                dbProduct._doc.saved = dbProduct._doc.rPrice - dbProduct._doc.sPrice    //amount saved
                finalProducts.push(dbProduct._doc)
            }
        })

        return finalProducts

}

/**
 * 
 * @param finalProducts { array of products with at least totals, listed price, actual price already calculated for quantity of each product}  
 * @returns sums of { listed total, actual total, listed - actual total} of all products
 */
exports.calculateTotals = (finalProducts) => {
    let total = 0
    let sellingTotal = 0

    finalProducts.forEach(product => {
        total += product.rPrice
        sellingTotal += product.sPrice
    })

    const saved = total - sellingTotal

    return { total, sellingTotal, saved }
}