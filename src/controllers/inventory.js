const Inventory = require('../helpers/inventory');

const IMAGE_BASE_URL = '/images/inventory/';
const CATEGORY_URL = '/images/category/';

/**
 * Add items to inventory
 */
const addItem = async (data, req, res, next) => {
    const item = req.body;

    // Append store_id and filename to item.
    item.store_id = req.params.store_id;
    item.image_path = req._filename;
    try {
        // Add item to inventory
        await Inventory.addItem(item);

        res.json({
            status: 'success',
            message: 'Item added to inventory.'
        });

    } catch(err) {
        next(err);
    }
}

module.exports.addItem = addItem;


/**
 * Edit an item in the inventory.
 */
const editItem = async (data, req, res, next) => {

    const item = req.body;

    // Append item_id and filename to item.
    item.item_id = req.params.item_id;
    item.image_path = req._filename;

    try {
        // Edit item
        await Inventory.editItem(item);

        res.json({
            status: 'success',
            message: 'Item Edited.'
        });

    } catch(err) {
        next(err);
    }

}

module.exports.editItem = editItem;


/**
 * Edit only the image of an item in the inventory.
 */
const editImage = async (data, req, res, next) => {

    try {
        // Append item_id and filename to item.
        const item = {
            item_id: req.params.item_id,
            image_path: req._filename,
        };

        // Edit image
        await Inventory.editImage(item);

        res.json({
            status: 'success',
            message: 'Item image updated.'
        });
        
    } catch(err) {
        next(err);
    }

}

module.exports.editImage = editImage;


/**
 * Delete an item from the inventory
 */
const deleteItem = async (data, req, res, next) => {

    const { item_id } = req.params;

    try {

        await Inventory.deleteItem(item_id);

        res.json({
            status: 'success',
            message: 'Item Deleted.'
        });

    } catch(err) {
        next(err);
    }

}

module.exports.deleteItem = deleteItem;


/**
 * Get details of a single item by its ID
 */
const getItemById = async (req, res, next) => {

    const { item_id } = req.params;

    try {

        const item = await Inventory.getItemById(item_id);

        res.json({
            status: 'success',
            data: {
                item,
                base_url: IMAGE_BASE_URL
            }
        });

    } catch(err) {
        next(err);
    }
}

module.exports.getItemById = getItemById;


/**
 * Search for Items in the inventory.
 *  - match item_name in inventory table.
 *  - match category_name in category table.
 *  - match sub_category_name in sub category table.
 *  - match brand_name in brands table.
 * 
 * @param {Object} req.query - Query Parameters
 * @param {String} req.query.search - Search String
 * @param {Number} req.query.page - Page number
 * @param {Number} req.query.per_page - Number of items
 * to be displayed in a page.
 */
const search = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 10;

    const offset = (page - 1 ) * per_page;

    // Object to be passed to search helper.
    const options = {
        search: req.query.search ? req.query.search : null,
        offset,
        limit: per_page
    };
    
    // Set scope of variable outside of try block.
    let result;

    try {

        result = await Inventory.searchItems(options);

    } catch(err) {
        next(err);
    }

    /***
     * =======================
     * Set Pagination data
     * =======================
     */


    // if current page is 1, prev_page = null
    const prev_page = (page > 1) ?
        `/api/inventory/items?search=${ options.search || '' }&` + 
        `page=${page - 1}&` +
        `per_page=${per_page}}` : null;


    // if current page is last page, next_page = null
    const next_page = page < Math.ceil(result.total/per_page) ?
        `/api/inventory/items?search=${ options.search || '' }&` +
        `page=${page + 1}&` +
        `per_page=${per_page}` : null


    // combine result with extra properties.
    Object.assign(result, {
        total_pages: Math.ceil(result.total/per_page),
        per_page: per_page,
        current_page: page,
        prev_page,
        next_page,
        base_url: IMAGE_BASE_URL
    });


    res.json({
        status: 'success',
        data: result
    });

}

module.exports.search = search;


/**
 * Get list of all categories and their IDs.
 */
const getCategories = async (req, res, next) => {
    
    try {

        // Get categories
        const categories = await Inventory.getCategories();

        res.json({
            status: 'success',
            data: {
                categories,
                count: categories.length,
                base_url: CATEGORY_URL
            }
        })

    } catch(err) {
        next(err);
    }

}

module.exports.getCategories = getCategories;


/**
 * Get list of all categories and their IDs.
 */
const getSubCategories = async (req, res, next) => {
    
    try {

        const { category_id } = req.params;
 
        // Get sub categories
        const sub_categories = await Inventory.getSubCategories(category_id);

        res.json({
            status: 'success',
            data: {
                sub_categories,
                count: sub_categories.length,
                base_url: CATEGORY_URL
            }
        })

    } catch(err) {
        next(err);
    }

}

module.exports.getSubCategories = getSubCategories;


/**
 * Get list of all categories and their IDs.
 */
const getSubSubCategories = async (req, res, next) => {
    
    try {

        const { sub_category_id } = req.params;
 
        // Get sub categories
        const sub_sub_categories = await Inventory.getSubSubCategories(sub_category_id);

        res.json({
            status: 'success',
            data: {
                sub_sub_categories,
                count: sub_sub_categories.length,
                base_url: CATEGORY_URL
            }
        })

    } catch(err) {
        next(err);
    }

}

module.exports.getSubSubCategories = getSubSubCategories;


/**
 * get all categories, sub categories and sub sub categories.
 */
const getAllCategories = async (req, res, next) => {
    
    try {
 
        const categories = await Inventory.getAllCategories();

        res.json({
            status: 'success',
            data: {
                categories,
                base_url: CATEGORY_URL
            }
        })

    } catch(err) {
        next(err);
    }

}

module.exports.getAllCategories = getAllCategories;


/**
 * Get list of all brands and their IDs.
 */
const getBrands = async (req, res, next) => {
    
    try {

        // Get brands
        const brands = await Inventory.getBrands();

        res.json({
            status: 'success',
            data: {
                brands
            }
        })

    } catch(err) {
        next(err);
    }

}

module.exports.getBrands = getBrands;


/**
 * 
 * @param {Object} req.query - Query Parameters.
 * @param {String} req.query.category_id - Level 1 Category ID.
 * @param {Number} req.query.sub_category_id - Level 2 Category ID.
 * @param {Number} req.query.sub_sub_category_id - Level 3 Category ID.
 * @param {Number} req.query.page - Page number.
 * @param {Number} req.query.per_page - Number of items to be displayed in a page.
 * @param {String} req.query.stock - String true or false, true selects outofstock products
 */
const getItemsByCategory = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 10;

    const offset = ( page - 1 ) * per_page;

    // Object to be passed to getItemsByCategory helper.
    const options = {
        category_id: req.query.category_id ? req.query.category_id : null,
        sub_category_id: req.query.sub_category_id ? req.query.sub_category_id : null,
        sub_sub_category_id: req.query.sub_sub_category_id ? req.query.sub_sub_category_id : null,
        stock: req.query.stock === 'true'? true : false,
        offset,
        limit: per_page
    };
    
    // Set scope of variable outside of try block.
    let result;

    try {

        result = await Inventory.getItemsByCategory(options);

    } catch(err) {
        next(err);
    }

    /***
     * =======================
     * Set Pagination data
     * =======================
     */


    // if current page is 1, prev_page = null
    const prev_page = (page > 1) ?
        `/api/inventory/items?search=${ options.search || '' }&` + 
        `brand=${ options.brand_id || '' }&` +
        `category=${options.category_id || '' }&` +
        `page=${page - 1}&` +
        `per_page=${per_page}}` : null;


    // if current page is last page, next_page = null
    const next_page = page < Math.ceil(result.total/per_page) ?
        `/api/inventory/items?search=${ options.search || '' }&` +
        `brand=${ options.brand_id || '' }&` +
        `category=${options.category_id || '' }&` +
        `page=${page + 1}&` +
        `per_page=${per_page}` : null


    // combine result with extra properties.
    Object.assign(result, {
        total_pages: Math.ceil(result.total/per_page),
        per_page: per_page,
        current_page: page,
        prev_page,
        next_page,
        base_url: IMAGE_BASE_URL
    });


    res.json({
        status: 'success',
        data: result
    });

}

module.exports.getItemsByCategory = getItemsByCategory;


/**
 * Get list of all items in the inventory.
 * 
 * @param {Object} req.query - Query Parameters.
 * @param {Number} req.query.page - Page number.
 * @param {Number} req.query.per_page - Number of items to be displayed in a page.
 * @param {String} req.query.stock - String true or false, true selects outofstock products
 */
const getAllItems = async (req, res, next) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const per_page = parseInt(req.query.per_page) || 10;

        const offset = ( page - 1 ) * per_page;

        // Object to be passed to getAllItems helper.
        const options = {
            stock: req.query.stock === 'true'? true : false,
            offset,
            limit: per_page
        };

        // Set scope of variable outside of try block.
        let result;

        try {

            result = await Inventory.getAllItems(options);

        } catch(err) {
            next(err);
        }

        /***
         * =======================
         * Set Pagination data
         * =======================
         */


        // if current page is 1, prev_page = null
        const prev_page = (page > 1) ?
            `/api/inventory/items/all?page=${page - 1}&` +
            `per_page=${per_page}}` : null;


        // if current page is last page, next_page = null
        const next_page = page < Math.ceil(result.total/per_page) ?
            `/api/inventory/items/all?page=${page + 1}&` +
            `per_page=${per_page}}` : null;

        // combine result with extra properties.
        Object.assign(result, {
            total_pages: Math.ceil(result.total/per_page),
            per_page: per_page,
            current_page: page,
            prev_page,
            next_page,
            base_url: IMAGE_BASE_URL
        });


        res.json({
            status: 'success',
            data: result
        });

    } catch(err) {
        next(err);
    }

}

module.exports.getAllItems = getAllItems;


/**
 * Suggest items
 *  
 * @param {Object} req.query - Query Parameters
 * @param {String} req.query.search - Search String
 */
const suggest = async (req, res, next) => {

    try {

        const search = req.query.search;

        const result = await Inventory.suggestItems(search);

        res.json({
            status: 'success',
            data: result
        });

    } catch(err) {
        next(err);
    }

}

module.exports.suggest = suggest;


/**
 * Get Items that has some offer applied.
 * 
 * @param {Object} req.params - Query Parameters
 * @param {Number} req.params.offer_id - Offer ID.
 * @param {Number} req.params.page - Page Number.
 * @param {Number} req.params.per_page - Number of items to be displayed per page.
 */
const getItemsByOfferID = async (req, res, next) => {

    try {

        const offer_id = req.query.offer_id;
        
        const page = parseInt(req.query.page) || 1;
        const per_page = parseInt(req.query.per_page) || 100;

        const offset = (page - 1 ) * per_page;

        const items = await Inventory.getItemsByOfferID({
            offer_id,
            offset,
            limit: per_page
        });

        // combine items with extra properties.
        Object.assign(items, {
            total_pages: Math.ceil(items.count/per_page),
            per_page: per_page,
            current_page: page,
            base_url: IMAGE_BASE_URL
        });

        res.json({
            status: 'success',
            data: items
        });

    } catch(err) {
        next(err);
    }

}

module.exports.getItemsByOfferID = getItemsByOfferID;


/**
 * Get random list of items in the inventory.
 * 
 * @param {Object} req.query - Query Parameters.
 * @param {Number} req.query.page - Page number.
 * @param {Number} req.query.per_page - Number of items to be displayed in a page.
 */
const getRandomItems = async (req, res, next) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const per_page = parseInt(req.query.per_page) || 20;

        const offset = ( page - 1 ) * per_page;

        // Object to be passed to getAllItems helper.
        const options = {
            offset,
            limit: per_page,
            random: true
        };

        const result = await Inventory.getAllItems(options);

        // combine result with extra properties.
        Object.assign(result, {
            total_pages: Math.ceil(result.total/per_page),
            per_page: per_page,
            base_url: IMAGE_BASE_URL
        });

        res.json({
            status: 'success',
            data: result
        });

    } catch(err) {
        next(err);
    }

}

module.exports.getRandomItems = getRandomItems;