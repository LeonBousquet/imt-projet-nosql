const { generateString } = require('./generateString')
const { Product } = require("../entity/product")


var generateProducts = function(nbProducts) {

    var tabProduct = []

    for (let i = 0; i < nbProducts; i++) {
        
        var randomProductName = generateString()
        var currentPerson = new Product(randomProductName)
        tabProduct.push(currentPerson)
    }

    return tabProduct

}

const generateProductsRelations = function(tabPersons,tabProducts) {

    var relationTab = [];

    var nbRelationsMax = 5

    tabPersons.forEach(person => {
        
        var idAllreadyUsed = []
        var nbRelationsCourantes = Math.floor(Math.random() * (nbRelationsMax + 1));
        
        for (let i = 0; i < nbRelationsCourantes; i++) {
            
            var randomProduct = tabProducts[Math.floor(Math.random()*tabProducts.length)];

            while (idAllreadyUsed.includes(randomProduct.id)) {
                randomProduct = tabProducts[Math.floor(Math.random()*tabProducts.length)];
            }

            idAllreadyUsed.push(randomProduct.id)

            relationTab.push({
                "person_id" : person.id,
                "product_id" : randomProduct.id
            })

        }


    });


    return relationTab;

}



module.exports = {
    generateProducts,
    generateProductsRelations
}