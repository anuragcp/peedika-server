

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('category', [{
            category_id: 1,
            category_name: 'Grocery',
            image: 'grocery.jpg'
        },{
            category_id: 2,
            category_name: 'Vegetables & Fruits',
            image: 'vegnfruits.jpg'
        },{
            category_id: 3,
            category_name: 'Bakery & Beverages',
            image: 'bakenbeverage.jpg'
        },{
            category_id: 4,
            category_name: 'Household',
            image: 'household.jpg'
        },{
            category_id: 5,
            category_name: 'Health & Beauty',
            image: 'healthnbeauty.jpg'
        },{
            category_id: 6,
            category_name: 'Moms & Babies',
            image: 'momnbaby.jpg'
        },{
            category_id: 7,
            category_name: 'Pet Food',
            image: 'petfood.jpg'
        },{
            category_id: 8,
            category_name: 'Stationery',
            image: 'stationery.jpg'
        }],{});
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('category', null, {});
    }
};