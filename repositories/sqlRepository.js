
const { Sequelize, json } = require('sequelize');
const sequelize = new Sequelize(process.env.MYSQL_DATABASE_ADRESS,{
    logging: false
});

const { Person } = require('../entity/person')
const { generatePerson, generateRelations } = require('../services/personService')
const { generateProductsRelations, generateProducts } = require('../services/productService')

const DefineStructure = async function() {

    var sqlPerson = `
        CREATE TABLE IF NOT EXISTS person (
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            firstName VARCHAR(8) NOT NULL,
            lastName VARCHAR(8) NOT NULL
        ) ENGINE InnoDB;
    `

    var sqlRelationships = `
        CREATE TABLE IF NOT EXISTS relationship (
            person_following_id INT NOT NULL,
            person_followed_id INT NOT NULL,
            CONSTRAINT fk_person_following_id FOREIGN KEY (person_following_id) REFERENCES person(id),
            CONSTRAINT fk_person_followed_id FOREIGN KEY (person_followed_id) REFERENCES person(id),
            CONSTRAINT pk_relationship PRIMARY KEY (person_following_id,person_followed_id)
        )ENGINE InnoDB;
    `

    var sqlProduct = `
        CREATE TABLE IF NOT EXISTS product (
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            productName VARCHAR(8) NOT NULL
        )ENGINE InnoDB;
    `

    var sqlPurchase = `
        CREATE TABLE IF NOT EXISTS purchase (
            person_id INT NOT NULL,
            product_id INT NOT NULL,
            CONSTRAINT fk_person_id FOREIGN KEY (person_id) REFERENCES person(id),
            CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES product(id),
            CONSTRAINT pk_purchase PRIMARY KEY (person_id,product_id)
        )ENGINE InnoDB;
    `

    try {
        var start = +new Date();
        await sequelize.query(sqlPerson)
        await sequelize.query(sqlRelationships)
        await sequelize.query(sqlProduct)
        await sequelize.query(sqlPurchase)
        var end = +new Date();
        return {
            "status" : 200,
            "data" : "Toutes les tables ont été correctements ajoutées",
            "time" : (end - start) / 1000
        }
    } catch (error) {
        throw {
            "status" : 409,
            "data" : error,
            "time" : null
        }
    }
}



const insertPerson = async function(nbPerson) {
    
    var batchSize = 500;

    var tabPerson = generatePerson(nbPerson);
    var dureeInsertionPersonnes = 0;
    var dureeInsertionRelations = 0;

    if (nbPerson <= 20 ) {
        return {
            "status" : 409,
            "data" : "Vous devez inserer plus de 20 personnes",
            "time" : null   
        }
    }

    

    var batch = 0;
    while ((batchSize * (batch+1)) < tabPerson.length) {
        
        var sql = `
        INSERT INTO person  (firstName,lastname)
        VALUES `

        for (let i = (batch * batchSize); i < ((batch+1)*batchSize)-1; i++) {
            sql += `("`+tabPerson[i].firstName+`","`+tabPerson[i].lastName+`"),`        
        }
        sql += `("`+tabPerson[((batch+1)*batchSize)-1].firstName+`","`+tabPerson[((batch+1)*batchSize)-1].lastName+`");`
    
        try {
            var start = +new Date();
            await sequelize.query(sql)
            var end = +new Date();
            dureeInsertionPersonnes += (end - start) / 1000;
    
    
        } catch (error) {
            throw {
                "status" : 409,
                "data" : error,
                "time" : null
            }
        }
        batch++
    }


    sql = `
    INSERT INTO person  (firstName,lastname)
    VALUES `
    for (let i = (batch * batchSize); i < tabPerson.length-1; i++) {
        sql += `("`+tabPerson[i].firstName+`","`+tabPerson[i].lastName+`"),`        
    }
    sql += `("`+tabPerson[tabPerson.length-1].firstName+`","`+tabPerson[tabPerson.length-1].lastName+`");`

    try {
        start = +new Date();
        await sequelize.query(sql)
        end = +new Date();
        dureeInsertionPersonnes += (end - start) / 1000;


    } catch (error) {
        throw {
            "status" : 409,
            "data" : error,
            "time" : null
        }
    }

    tabPerson = null

    sql = `SELECT * FROM person`

    var allPersons = null;

    var queryReturn = await sequelize.query(sql).catch(function(error) {
        return {
            "status" : 409,
            "data" : error.parent.sqlMessage,
            "time" : null
        }
    });
    
    if (queryReturn.status == 409) {
        return {
            "status" : 409,
            "data" : queryReturn.data,
            "time" : null   
        }
    }
    
    allPersons = queryReturn[0];
    var tabRelations = generateRelations(allPersons)

    allPersons = null

    batch = 0;
    while ((batchSize * (batch+1)) < tabRelations.length) {
        sql = `INSERT INTO relationship
                VALUES `

        for (let i = (batch * batchSize); i < ((batch+1)*batchSize)-1; i++) {
            sql += `(`+tabRelations[i].person_following_id+`,`+tabRelations[i].person_followed_id+`),`        
        }
        sql += `(`+tabRelations[((batch+1)*batchSize)-1].person_following_id+`,`+tabRelations[((batch+1)*batchSize)-1].person_followed_id+`);`
        
        try {
            start = +new Date();
            
            queryReturn = await sequelize.query(sql).catch(function(error) {
                return {
                    "status" : 409,
                    "data" : error.parent.sqlMessage,
                    "time" : null
                }
            });

            end = +new Date();
            
            if (queryReturn.status == 409) {
                return {
                    "status" : 409,
                    "data" : queryReturn.data,
                    "time" : null   
                }
            }

            
            dureeInsertionRelations += (end - start) / 1000;


        } catch (error) {
            throw {
                "status" : 409,
                "data" : error,
                "time" : null
            }
        }
        batch++
    }



    sql = `INSERT INTO relationship
    VALUES `

    for (let i = (batch * batchSize); i < tabRelations.length-1; i++) {
        sql += `(`+tabRelations[i].person_following_id+`,`+tabRelations[i].person_followed_id+`),`        
    }
    sql += `(`+tabRelations[tabRelations.length-1].person_following_id+`,`+tabRelations[tabRelations.length-1].person_followed_id+`);`

    try {
        start = +new Date();

        queryReturn = await sequelize.query(sql).catch(function(error) {
            return {
                "status" : 409,
                "data" : error.parent.sqlMessage,
                "time" : null
            }
        });

        end = +new Date();

        if (queryReturn.status == 409) {
            return {
                "status" : 409,
                "data" : queryReturn.data,
                "time" : null   
            }
        }


        dureeInsertionRelations += (end - start) / 1000;


    } catch (error) {
        throw {
            "status" : 409,
            "data" : error,
            "time" : null
        }
    }

    return {
        "status" : 200,
        "data" : "Les "+nbPerson+" personnes ont été crées en base de données SQL ainsi que leurs relations",
        "time" : {
            "persons" : dureeInsertionPersonnes,
            "relations" : dureeInsertionRelations
        }
    }
}

const insertProducts = async function(nbProducts) {

    if (nbProducts <= 5) {
        return {
            "status" : 409,
            "data" : "Vous devez insérer plus de 5 produits car une personne doit pouvoir être liée à 5 produits différents",
            "time" : null
        }
    } 

    var dureeInsertionProducts = 0
    var dureeInsertionRelations =0

    var batchSize = 500

    var sql = ` SELECT * FROM person
    `
    var queryReturn = await sequelize.query(sql).catch(function(error) {
        return {
            "status" : 409,
            "data" : error.parent.sqlMessage,
            "time" : null
        }
    });
    
    if (queryReturn.status == 409) {
        return {
            "status" : 409,
            "data" : queryReturn.data,
            "time" : null   
        }
    }

    if (queryReturn[0].length == 0) {
        return {
            "status" : 409,
            "data" : "Vous devez avoir des personnes dans la base pour pouvoir ajouter des produits",
            "time" : null
        }
    }

    var personsTab = queryReturn[0]


    // INjection de produit
    if (nbProducts === 0) {
        return {
            "status" : 409,
            "data" : "Vous devez injecter un nombre de produit suppérieur à 0",
            "time" : null
        }
    }

    var productsTab = generateProducts(nbProducts)


    var batch = 0;
    while ((batchSize * (batch+1)) < productsTab.length) {
        sql = ` INSERT INTO product(productName) 
                VALUES `

        for (let i = (batch * batchSize); i < ((batch+1)*batchSize)-1; i++) {
            sql += `("`+productsTab[i].productName+`"),`        
        }
        sql += `("`+productsTab[((batch+1)*batchSize)-1].productName+`");` 

        var start = +new Date();
        queryReturn = await sequelize.query(sql).catch(function(error) {
            return {
                "status" : 409,
                "data" : error.parent.sqlMessage,
                "time" : null
            }
        });
        var end = +new Date();
        dureeInsertionProducts += (end - start) / 1000;
        
        if (queryReturn.status == 409) {
            return {
                "status" : 409,
                "data" : queryReturn.data,
                "time" : null   
            }
        }
        batch++
    }

    sql = ` INSERT INTO product(productName) 
    VALUES `

    for (let i = (batch * batchSize); i < productsTab.length-1; i++) {
        sql += `("`+productsTab[i].productName+`"),`        
    }
    sql += `("`+productsTab[productsTab.length-1].productName+`");` 
    start = +new Date();
    queryReturn = await sequelize.query(sql).catch(function(error) {
        return {
            "status" : 409,
            "data" : error.parent.sqlMessage,
            "time" : null
        }
    });
    end = +new Date();
    dureeInsertionProducts += (end - start) / 1000;

    if (queryReturn.status == 409) {
        return {
            "status" : 409,
            "data" : queryReturn.data,
            "time" : null   
        }
    }


    //Insertion des dépendances
    sql = ` SELECT * FROM product`
    
    queryReturn = await sequelize.query(sql).catch(function(error) {
        return {
            "status" : 409,
            "data" : error.parent.sqlMessage,
            "time" : null
        }
    });
    
    if (queryReturn.status == 409) {
        return {
            "status" : 409,
            "data" : queryReturn.data,
            "time" : null   
        }
    }

    var relationTab = generateProductsRelations(personsTab,queryReturn[0])

    batch = 0
    while ((batchSize * (batch+1)) < relationTab.length) {
        sql = ` INSERT INTO purchase 
        VALUES `

        for (let i = (batch * batchSize); i < ((batch+1)*batchSize)-1; i++) {
            sql += `(`+relationTab[i].person_id+`,`+relationTab[i].product_id+`),`        
        }
        sql += `(`+relationTab[((batch+1)*batchSize)-1].person_id+`,`+relationTab[((batch+1)*batchSize)-1].product_id+`);` 

        start = +new Date();
        queryReturn = await sequelize.query(sql).catch(function(error) {
            return {
                "status" : 409,
                "data" : error.parent.sqlMessage,
                "time" : null
            }
        });
        end = +new Date();
        dureeInsertionRelations += (end - start) / 1000

        if (queryReturn.status == 409) {
            return {
                "status" : 409,
                "data" : queryReturn.data,
                "time" : null   
            }
        }
        batch++;
    }

    sql = ` INSERT INTO purchase 
        VALUES `

    for (let i = (batch * batchSize); i < relationTab.length-1; i++) {
        sql += `(`+relationTab[i].person_id+`,`+relationTab[i].product_id+`),`        
    }
    sql += `(`+relationTab[relationTab.length-1].person_id+`,`+relationTab[relationTab.length-1].product_id+`);` 

    start = +new Date();
    queryReturn = await sequelize.query(sql).catch(function(error) {
        return {
            "status" : 409,
            "data" : error.parent.sqlMessage,
            "time" : null
        }
    });
    end = +new Date();
    dureeInsertionRelations += (end - start) / 1000

    if (queryReturn.status == 409) {
        return {
            "status" : 409,
            "data" : queryReturn.data,
            "time" : null   
        }
    }

    return {
        "status" : 201,
        "data" : "Les "+nbProducts+" produits ont été crées ainsi que leurs relations",
        "time" : {
            "products" : dureeInsertionProducts,
            "relations" : dureeInsertionRelations
        }
    }


}

const cleanBDD = async function() {
    var sqlPerson = "DELETE FROM person"
    var sqlProduct = "DELETE FROM product"
    var sqlPurchase = "TRUNCATE TABLE purchase"
    var sqlRelationship = "TRUNCATE TABLE relationship"

    try {
        var start = +new Date();
        
        var queryReturn = await sequelize.query(sqlPurchase).catch(function(error) {
            return {
                "status" : 409,
                "data" : error.parent.sqlMessage,
                "time" : null
            }
        });
        
        if (queryReturn.status == 409) {
            return {
                "status" : 409,
                "data" : queryReturn.data,
                "time" : null   
            }
        }

        queryReturn = await sequelize.query(sqlRelationship).catch(function(error) {
            return {
                "status" : 409,
                "data" : error.parent.sqlMessage,
                "time" : null
            }
        });

        if (queryReturn.status == 409) {
            
            return {
                "status" : 409,
                "data" : queryReturn.data,
                "time" : null
            }
        }

        queryReturn = await sequelize.query(sqlPerson).catch(function(error) {
            return {
                "status" : 409,
                "data" : error.parent.sqlMessage,
                "time" : null
            }
        });

        if (queryReturn.status == 409) {
            return {
                "status" : 409,
                "data" : queryReturn.data,
                "time" : null
            }
        }

        queryReturn = await sequelize.query(sqlProduct).catch(function(error) {
            return {
                "status" : 409,
                "data" : error.parent.sqlMessage,
                "time" : null
            }
        });

        if (queryReturn.status == 409) {
            return {
                "status" : 409,
                "data" : queryReturn.data,
                "time" : null
            }
        }
        var end = +new Date();
        return {
            "status" : 200,
            "data" : "Toutes les tables ont été vidées",
            "time" : (end - start) / 1000
        }
    } catch (error) {
        throw {
            "status" : 409,
            "data" : error,
            "time" : null
        }
    }

}

const insertLastNameIndex = async function() {

    var sql = `CREATE INDEX lastNameIndex ON person (lastName);`

    var start = +new Date();
    var queryReturn = await sequelize.query(sql).catch(function(error) {
        return {
            "status" : 409,
            "data" : error.parent.sqlMessage,
            "time" : null
        }
    });
    var end = +new Date();

    if (queryReturn.status == 409) {
        return {
            "status" : 409,
            "data" : queryReturn.data,
            "time" : null
        }
    }
    else {
        return {
            "status" : 201,
            "data" : "L'index sur le nom a été crée",
            "time" : (end - start) / 1000
        }
    }
}

const insertFirstNameIndex = async function() {
    var sql = `CREATE INDEX firstNameIndex ON person (firstName);`

    var start = +new Date();
    var queryReturn = await sequelize.query(sql).catch(function(error) {
        return {
            "status" : 409,
            "data" : error.parent.sqlMessage,
            "time" : null
        }
    });
    var end = +new Date();

    if (queryReturn.status == 409) {
        return {
            "status" : 409,
            "data" : queryReturn.data,
            "time" : null
        }
    }
    else {
        return {
            "status" : 201,
            "data" : "L'index sur le prénom a été crée",
            "time" : (end - start) / 1000
        }
    }
}

const insertProductNameIndex = async function() {
    var sql = `CREATE INDEX productNameIndex ON product (productname);`

    var start = +new Date();
    var queryReturn = await sequelize.query(sql).catch(function(error) {
        return {
            "status" : 409,
            "data" : error.parent.sqlMessage,
            "time" : null
        }
    });
    var end = +new Date();

    if (queryReturn.status == 409) {
        return {
            "status" : 409,
            "data" : queryReturn.data,
            "time" : null
        }
    }
    else {
        return {
            "status" : 201,
            "data" : "L'index sur le nom de produit a été crée",
            "time" : (end - start) / 1000
        }
    }
}

const insertRelationIndex = async function() {
    var sql = `CREATE INDEX relationIndex ON relationship (person_following_id,person_followed_id);`

    var start = +new Date();
    var queryReturn = await sequelize.query(sql).catch(function(error) {
        return {
            "status" : 409,
            "data" : error.parent.sqlMessage,
            "time" : null
        }
    });
    var end = +new Date();

    if (queryReturn.status == 409) {
        return {
            "status" : 409,
            "data" : queryReturn.data,
            "time" : null
        }
    }
    else {
        return {
            "status" : 201,
            "data" : "L'index sur l'id de la table relationship a été crée",
            "time" : (end - start) / 1000
        }
    }
}

const deleteLastNameIndex = async function() {
    var sql = `DROP INDEX lastNameIndex ON person;`

    var start = +new Date();
    var queryReturn = await sequelize.query(sql).catch(function(error) {
        return {
            "status" : 409,
            "data" : error.parent.sqlMessage,
            "time" : null
        }
    });
    var end = +new Date();

    if (queryReturn.status == 409) {
        return {
            "status" : 409,
            "data" : queryReturn.data,
            "time" : null
        }
    }
    else {
        return {
            "status" : 200,
            "data" : "L'index sur le nom a été supprimé",
            "time" : (end - start) / 1000
        }
    }
}

const deleteFirstNameIndex = async function() {
    var sql = `DROP INDEX firstNameIndex ON person;`

    var start = +new Date();
    var queryReturn = await sequelize.query(sql).catch(function(error) {
        return {
            "status" : 409,
            "data" : error.parent.sqlMessage,
            "time" : null
        }
    });
    var end = +new Date();

    if (queryReturn.status == 409) {
        return {
            "status" : 409,
            "data" : queryReturn.data,
            "time" : null
        }
    }
    else {
        return {
            "status" : 200,
            "data" : "L'index sur le prénom a été supprimé",
            "time" : (end - start) / 1000
        }
    }
}

const deleteProductNameIndex = async function() {
    var sql = `DROP INDEX productNameIndex ON product;`

    var start = +new Date();
    var queryReturn = await sequelize.query(sql).catch(function(error) {
        return {
            "status" : 409,
            "data" : error.parent.sqlMessage,
            "time" : null
        }
    });
    var end = +new Date();

    if (queryReturn.status == 409) {
        return {
            "status" : 409,
            "data" : queryReturn.data,
            "time" : null
        }
    }
    else {
        return {
            "status" : 200,
            "data" : "L'index sur le nom de produit a été supprimé",
            "time" : (end - start) / 1000
        }
    }
}

const deleteRelationIndex = async function() {
    var sql = `DROP INDEX relationIndex ON relationship;`

    var start = +new Date();
    var queryReturn = await sequelize.query(sql).catch(function(error) {
        return {
            "status" : 409,
            "data" : error.parent.sqlMessage,
            "time" : null
        }
    });
    var end = +new Date();

    if (queryReturn.status == 409) {
        return {
            "status" : 409,
            "data" : queryReturn.data,
            "time" : null
        }
    }
    else {
        return {
            "status" : 200,
            "data" : "L'index sur l'ide de la table relationship a été supprimé",
            "time" : (end - start) / 1000
        }
    }
}

const GetRandomPerson = async function() {

    var sql = `SELECT firstName, lastName 
                FROM person
                order by rand() limit 1`;
                
    
    var queryReturn = await sequelize.query(sql).catch(function(error) {
        return {
            "status" : 409,
            "data" : error.parent.sqlMessage
        }
    });


    if (queryReturn.status == 409) {
        return {
            "status" : 409,
            "data" : queryReturn.data
        }
    }
    else {
        return {
            "status" : 200,
            "data" : JSON.parse(JSON.stringify(queryReturn[0]))[0]
        }
    }
}


const GetRandomProduct = async function() {

    var sql = `SELECT productName
                FROM product
                order by rand() limit 1`;
                
    
    var queryReturn = await sequelize.query(sql).catch(function(error) {
        return {
            "status" : 409,
            "data" : error.parent.sqlMessage
        }
    });


    if (queryReturn.status == 409) {
        return {
            "status" : 409,
            "data" : queryReturn.data
        }
    }
    else {
        return {
            "status" : 200,
            "data" : JSON.parse(JSON.stringify(queryReturn[0]))[0]
        }
    }
}


const GetProductsByPersonAndRelationship = async function(firstName,lastName,profondeur) {
    
    var sql = `SELECT PR.productName, COUNT(PU.person_id) AS "nb_person" 
                FROM product PR
                JOIN purchase PU ON PR.id=PU.product_id
                JOIN person PE ON PE.id=PU.person_id
                WHERE (PE.firstname="`+firstName+`" AND PE.lastName="`+lastName+`")`

    if (profondeur > 0) {
        sql += ` OR PU.person_id IN`
    }

    for (let i = 2; i <= profondeur; i++) {
        sql += `
        (SELECT person_following_id
            FROM relationship
            WHERE person_followed_id IN
        
        `        
    }      
    
    if(profondeur > 0) {
        sql += `
            (SELECT person_following_id
                FROM relationship RE
                JOIN person PE1 ON PE1.id = RE.person_following_id
                WHERE PE1.firstname="`+firstName+`" AND PE1.lastName="`+lastName+`")
        `
    }
    
    for (let i = 2; i <= profondeur; i++) {
        sql += `)`        
    }
    
    sql += `
        GROUP BY PR.id;
    `

    var start = +new Date();
    var queryReturn = await sequelize.query(sql).catch(function(error) {
        return {
            "status" : 409,
            "data" : error.parent.sqlMessage,
            "time" : null
        }
    });
    var end = +new Date();

    if (queryReturn.status == 409) {
        return {
            "status" : 409,
            "data" : queryReturn.data,
            "time" : null
        }
    }
    else {
        return {
            "status" : 200,
            "data" : JSON.stringify(queryReturn[0]),
            "time" : (end - start) / 1000
        }
    }
}

const GetProductPopularityForPersonAndRelationship = async function(firstName,lastName,productName,profondeur) {
    
    var sql = `SELECT PR.productName, COUNT(PU.person_id) AS "nb_person" 
                FROM product PR
                JOIN purchase PU ON PR.id=PU.product_id
                JOIN person PE ON PE.id=PU.person_id
                WHERE (PE.firstname="`+firstName+`" AND PE.lastName="`+lastName+`" AND PR.productName="`+productName+`")`

    if (profondeur != 0) {

        sql += `OR PU.person_id IN`

        for (let i = 2; i <= profondeur; i++) {
            sql += `
            (SELECT person_following_id
                FROM relationship
                WHERE person_followed_id IN
            
            `        
        }      
        
        sql += `
            (SELECT person_following_id
                FROM relationship RE
                JOIN person PE1 ON PE1.id = RE.person_following_id
                WHERE PE1.firstname="`+firstName+`" AND PE1.lastName="`+lastName+`" AND PR.productName="`+productName+`")
        `
        
        for (let i = 2; i <= profondeur; i++) {
            sql += `)`        
        }
    }
    
    sql += `
        GROUP BY PR.id;
    `

    var start = +new Date();
    var queryReturn = await sequelize.query(sql).catch(function(error) {
        return {
            "status" : 409,
            "data" : error.parent.sqlMessage,
            "time" : null
        }
    });
    var end = +new Date();

    if (queryReturn.status == 409) {
        return {
            "status" : 409,
            "data" : queryReturn.data,
            "time" : null
        }
    }
    else {
        return {
            "status" : 200,
            "data" : JSON.stringify(queryReturn[0]),
            "time" : (end - start) / 1000
        }
    }
}

const getProductVirality = async function(productName,profondeur) {
    
    var sql = ""

    
    sql = `
    SELECT PR.productName, COUNT(PU.person_id) AS 'nb_person'
    FROM product PR
    JOIN purchase PU ON PU.product_id=PR.id
    WHERE PR.productName="`+productName+`"
    `
    if (profondeur != 0) {

        sql += ` AND PU.person_id IN `

        for (let i = 2; i <= profondeur; i++) {
            sql += `
                (SELECT RE.person_following_id
                FROM relationship RE
                JOIN purchase PU1 ON PU1.person_id=RE.person_followed_id
                JOIN product PR1 ON PR1.id=PU1.product_id
                WHERE PR1.productName="`+productName+`" AND RE.person_followed_id IN
            `            
        }
        sql += `
                (SELECT RE.person_following_id
                FROM relationship RE
                JOIN purchase PU1 ON PU1.person_id=RE.person_followed_id
                JOIN product PR1 ON PR1.id=PU1.product_id
                WHERE PR1.productName="`+productName+`")
            ` 
        
        for (let j = 2; j <= profondeur; j++) {
            sql += ")"                
        }

        sql += "GROUP BY PR.productName;"

    }

   

    var start = +new Date();
    var queryReturn = await sequelize.query(sql).catch(function(error) {
        return {
            "status" : 409,
            "data" : error.parent.sqlMessage,
            "time" : null
        }
    });
    var end = +new Date();

    if (queryReturn.status == 409) {
        return {
            "status" : 409,
            "data" : queryReturn.data,
            "time" : null
        }
    }
    else {
        return {
            "status" : 200,
            "data" : JSON.stringify(queryReturn[0]),
            "time" : (end - start) / 1000
        }
    }
}

module.exports = {
    DefineStructure,
    insertPerson,
    cleanBDD,
    insertProducts,
    insertLastNameIndex,
    insertFirstNameIndex,
    insertProductNameIndex,
    insertRelationIndex,
    deleteLastNameIndex,
    deleteFirstNameIndex,
    deleteProductNameIndex,
    deleteRelationIndex,
    GetProductsByPersonAndRelationship,
    GetProductPopularityForPersonAndRelationship,
    getProductVirality,
    GetRandomPerson,
    GetRandomProduct
}