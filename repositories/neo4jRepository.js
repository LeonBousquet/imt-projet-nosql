const neo4j = require("neo4j-driver");
const services = require("../services/generateString");

const driver = neo4j.driver(
  "neo4j://" +
    process.env.NEO4J_DATABASE_ADRESS +
    ":" +
    process.env.NEO4J_DATABASE_ADRESS,
  neo4j.auth.basic(
    process.env.NEO4J_DATABASE_ID,
    process.env.NEO4J_DATABASE_PWD
  )
);
const session = driver.session();

const GetRandomPerson = async function () {
  const result = await session.run("MATCH (p:Person) RETURN p order by rand() limit 1");
  const singleRecord = result.records[0];
  const node = singleRecord.get(0);
  return {
    status: 200,
    data: node
  };
};

const GetRandomProduct = async function () {
  const result = await session.run("MATCH (p:Product) RETURN p order by rand() limit 1");
  const singleRecord = result.records[0];
  const node = singleRecord.get(0);
  return {
    status: 200,
    data: node
  };
};


/********  Ajouter un nb de personnes ********/
const CreatePerson = async function (nb) {
  var i, j;
  try {
    var start_create = +new Date();
    for (i = 0; i < nb / 1000; i++) {
      const transactionSession = driver.session();
      const writeTxPromise = await transactionSession.writeTransaction((tx) => {
        for (j = 0; j < 1000; j++) {
          tx.run(
            "CREATE (a:Person {firstName:$firstName, lastName:$lastName}) RETURN a",
            {
              firstName: services.generateString(),
              lastName: services.generateString(),
            }
          );
        }
      });
      transactionSession.close();
    }

    var end_create = +new Date();

    console.log("Start Relation");

    /* Ajout des relations */
    var start_relation = +new Date();
    var result = await session.run(
      ` MATCH (f:Person) WITH DISTINCT collect(f) as followers, range(0,20) as followersRange
        MATCH (i:Person) WITH i, apoc.coll.randomItems(followers, apoc.coll.randomItem(followersRange)) as followers
        FOREACH (follower in followers | CREATE (follower)-[:Relation]->(i))
        `
    );
    var end_relation = +new Date();
    var temps_creation = end_create - start_create;
    var temps_relation = end_relation - start_relation;
    var temps_total = temps_creation + temps_relation;
    return {
      status: 200,
      data: "Les " + nb + " personnes ont été correctements ajoutées",
      time:
        "Temps d'insertion des personnes : " +
        temps_creation / 1000 +
        "s / Temps d'ajout des relations : " +
        temps_relation / 1000 +
        "s / Temps total : " +
        temps_total / 1000,
    };
  } catch (error) {
    console.log(error);
    throw {
      status: 409,
      data: error,
      time: null,
    };
  }
};

/********  Ajouter un nb de produits ********/
const CreateProduct = async function (nb) {
  var i, j;
  try {
    // Vérification si il y a des personnes
    var result = await session.run("MATCH (p:Person) RETURN COUNT(p)");
    var singleRecord = result.records[0];
    var node = singleRecord.get(0);
    if (node.low == 0) {
      return {
        status: 200,
        data:
          "<b>[WARNING] Merci de saisir des personnes avant d'insérer des produits</b>",
        time: null,
      };
    }

    var start_create = +new Date();
    for (i = 0; i < nb / 100; i++) {
      const transactionSession = driver.session();
      const writeTxPromise = await transactionSession.writeTransaction((tx) => {
        for (j = 0; j < 100; j++) {
          tx.run("CREATE (a:Product {productName:$productName}) RETURN a", {
            productName: services.generateString(),
          });
        }
      });
      transactionSession.close();
    }
    var end_create = +new Date();

    console.log("Start Purchase");

    var start_relation = +new Date();
    var result = await session.run(
      ` WITH range(0,5) as ProductsRange
        MATCH (p:Product)
        WITH collect(p) as products, ProductsRange
        MATCH (i:Person)
        WITH i, apoc.coll.randomItems(products, apoc.coll.randomItem(ProductsRange)) as products
        FOREACH (product in products | CREATE (i)-[:Purchase]->(product))
      `
    );
    var end_relation = +new Date();

    console.log("Purchase ok");

    var temps_creation = end_create - start_create;
    var temps_relation = end_relation - start_relation;
    var temps_total = temps_creation + temps_relation;

    return {
      status: 200,
      data: "Les " + nb + " produits ont été correctements ajoutées",
      time:
        "Temps d'insertion des produits : " +
        temps_creation / 1000 +
        "s / Temps d'ajout des relations : " +
        temps_relation / 1000 +
        "s / Temps total : " +
        temps_total / 1000,
    };
  } 
  catch (error) {
    console.log(error);
    throw {
      status: 409,
      data: error,
      time: null,
    };
  }
};

/********  Requete 1 : Liste + nombre produit acheter par les personnes suivant un influenceur ********/
const GetProductListeByPerson = async function (
  firstName,
  lastName,
  profondeur
) {
  try {
    var start = +new Date();
    const result = await session.run(
      `
      MATCH (:Person{firstName:$firstName, lastName:$lastName})<-[:Relation *1..` +
        profondeur +
        `]-(p:Person)
      WITH DISTINCT p
      MATCH (p)-[:Purchase]->(n:Product)
      RETURN n.productName, COUNT(*)
    `,
      {
        firstName: firstName,
        lastName: lastName,
      }
    );

    var end = +new Date();
    const count = result.records[0].get(1);
    var listePerson = [],
      i;
    for (i = 0; i < result.records.length; i++) {
      listePerson.push("<li>" + result.records[i].get(0) + "</li>");
    }
    return {
      status: 200,
      data:
        "Nombre de produits :" +
        count +
        "<p>Liste des personnes :</p><ul>" +
        listePerson.join(" ") +
        "</ul>",
      time: (end - start) / 1000,
    };
  } catch (error) {
    console.log(error);
    throw {
      status: 409,
      data: error,
      time: null,
    };
  }
};

/********  Requete 2 : Obtenir la liste et le nombre des produits commandés par les cercles de followers d’un individu pour un produit spécifique ********/
const GetProductListeWithProductAndPerson = async function (
  firstName,
  lastName,
  productName,
  profondeur
) {
  try {
    var start = +new Date();
    const result = await session.run(
      `
      MATCH (:Person{firstName:$firstName,lastName:$lastName})<-[:Relation *1..` +
        profondeur +
        `]-(p:Person)
      WITH DISTINCT p
      MATCH (p)-[:Purchase]->(n:Product{productName:$productName})
      RETURN n.productName, COUNT(*), p.firstName, p.lastName
    `,
      {
        firstName: firstName,
        lastName: lastName,
        productName: productName,
      }
    );

    var end = +new Date();
    const count = result.records.length;
    var listePerson = [],
      i;
    for (i = 0; i < result.records.length; i++) {
      listePerson.push(
        "<li>" +
          result.records[i].get(2) +
          " " +
          result.records[i].get(3) +
          "</li>"
      );
    }
    return {
      status: 200,
      data:
        "Nombre de personnes ayant acheté le produit en fonction d'un influenceur :" +
        count +
        "<p>Liste des personnes :</p><ul>" +
        listePerson.join(" ") +
        "</ul>",

      time: (end - start) / 1000,
    };
  } catch (error) {
    console.log(error);
    throw {
      status: 409,
      data: error,
      time: null,
    };
  }
};

/********  Requete 3 : Pour un produit donnez, obtenir le nombre de personnes l’ayant commandé dans un cercle de followers ********/
const GetPersonListeWithPerson = async function (productName, profondeur) {
  try {
    var start = +new Date();
    const result = await session.run(
      `
      MATCH(:Product {productName:$productName})<-[:Purchase]-(:Person)<-[:Relation *1..` +
        profondeur +
        `]-(p:Person)
      WITH DISTINCT p
      MATCH (p)-[n:Purchase]->(:Product {productName:$productName})
      RETURN COUNT (n)
    `,
      {
        productName: productName,
      }
    );

    var end = +new Date();
    const count = result.records[0].get(0);
    return {
      status: 200,
      data: "Nombre de personnes ayant acheté le produit :" + count,
      time: (end - start) / 1000,
    };
  } catch (error) {
    console.log(error);
    throw {
      status: 409,
      data: error,
      time: null,
    };
  }
};

/********  Supprimer la bdd ********/
const DeleteNoSQLBDD = async function () {
  try {
    var start = +new Date();
    await session.run("MATCH (n) DETACH DELETE n");
    var end = +new Date();
    return {
      status: 200,
      data: "La base de donnée a bien été supprimée",
      time: (end - start) / 1000,
    };
  } catch (error) {
    throw {
      status: 409,
      data: error,
      time: null,
    };
  }
};

module.exports = {
  CreatePerson,
  CreateProduct,
  DeleteNoSQLBDD,
  GetProductListeByPerson,
  GetProductListeWithProductAndPerson,
  GetPersonListeWithPerson,
  GetRandomPerson,
  GetRandomProduct
};
