var express = require("express");
const path = require("path");
var router = express.Router();
const mySQLRepository = require("../repositories/mysqlRepository");
const neo4jRepository = require("../repositories/neo4jRepository");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.redirect("/projet-nosql");
});

router.get("/projet-nosql", function (req, res) {
  res.sendFile(path.resolve("public/html/social_network_analysis.html"));
});

router.get("/test", function (req, res) {
  neo4jRepository.test();
});

router.delete("/mysql/structure", async function (req, res) {
  var repoResponse = await mySQLRepository.cleanBDD();

  switch (repoResponse.status) {
    case 200:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(200).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
});

router.post("/mysql/product/:nbProducts", async function (req,res) {
  var repoResponse = await mySQLRepository.insertProducts(req.params.nbProducts);

  switch (repoResponse.status) {
    case 201:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(200).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
})

router.post("/mysql/person/:nbPerson", async function (req, res) {
  var repoResponse = await mySQLRepository.insertPerson(req.params.nbPerson);

  switch (repoResponse.status) {
    case 200:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(200).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
});

router.post("/mysql/index/lastname", async function (req,res) {
  var repoResponse = await mySQLRepository.insertLastNameIndex();

  switch (repoResponse.status) {
    case 201:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(200).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
})

router.post("/mysql/index/firstname", async function (req,res) {
  var repoResponse = await mySQLRepository.insertFirstNameIndex();

  switch (repoResponse.status) {
    case 201:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(200).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
})

router.post("/mysql/index/productname", async function (req,res) {
  var repoResponse = await mySQLRepository.insertProductNameIndex();

  switch (repoResponse.status) {
    case 201:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(200).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
})

router.post("/mysql/index/relation", async function (req,res) {
  var repoResponse = await mySQLRepository.insertRelationIndex();

  switch (repoResponse.status) {
    case 201:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(200).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
})

router.delete("/mysql/index/lastname", async function (req,res) {
  var repoResponse = await mySQLRepository.deleteLastNameIndex();

  switch (repoResponse.status) {
    case 200:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(200).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
})

router.delete("/mysql/index/firstname", async function (req,res) {
  var repoResponse = await mySQLRepository.deleteFirstNameIndex();

  switch (repoResponse.status) {
    case 200:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(200).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
})

router.delete("/mysql/index/productname", async function (req,res) {
  var repoResponse = await mySQLRepository.deleteProductNameIndex();

  switch (repoResponse.status) {
    case 200:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(200).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
})

router.delete("/mysql/index/relation", async function (req,res) {
  var repoResponse = await mySQLRepository.deleteRelationIndex();

  switch (repoResponse.status) {
    case 200:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(200).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
})


router.get("/create-person-neo4j/:variable", async function (req, res) {
  var repoResponse = await neo4jRepository.CreatePerson(req.params.variable);

  switch (repoResponse.status) {
    case 200:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(200).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
});

router.get("/create-product-neo4j/:variable", async function (req, res) {
  var repoResponse = await neo4jRepository.CreateProduct(req.params.variable);
  

  switch (repoResponse.status) {
    case 200:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(200).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
});

router.get("/inject", async function (req, res) {
  var repoResponse = await mySQLRepository.DefineStructure();

  switch (repoResponse.status) {
    case 200:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(200).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
});

router.get("/get-person-mysql/", async function (req, res) {
  var repoResponse = await mySQLRepository.GetRandomPerson();
  switch (repoResponse.status) {
    case 200:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(409).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
});

router.get("/get-product-mysql/", async function (req, res) {
  var repoResponse = await mySQLRepository.GetRandomProduct();
  switch (repoResponse.status) {
    case 200:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(409).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
});

router.get("/get-person-neo4j/", async function (req, res) {
  var repoResponse = await neo4jRepository.GetRandomPerson();
   switch (repoResponse.status) {
    case 200:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(409).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  } 
});

router.get("/get-product-neo4j/", async function (req, res) {
  var repoResponse = await neo4jRepository.GetRandomProduct();
   switch (repoResponse.status) {
    case 200:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(409).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  } 
});


router.get("/get-product-by-person-neo4j/", async function (req, res) {
  var repoResponse = await neo4jRepository.GetProductListeByPerson(
    req.query.firstName,
    req.query.lastName,
    req.query.profondeur
  );
  switch (repoResponse.status) {
    case 200:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(409).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
});

router.get("/mysql/get-product-by-person/", async function (req, res) {
  var repoResponse = await mySQLRepository.GetProductsByPersonAndRelationship(
    req.query.firstName,
    req.query.lastName,
    req.query.profondeur
  );
  switch (repoResponse.status) {
    case 200:
      res.send(repoResponse);
      break;
    case 409:
      res.send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
});

router.get("/mysql/get-product-virality/", async function (req, res) {
  var repoResponse = await mySQLRepository.getProductVirality(
    req.query.productName,
    req.query.profondeur
  );
  switch (repoResponse.status) {
    case 200:
      res.send(repoResponse);
      break;
    case 409:
      res.send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
});

router.get("/get-person-with-product-neo4j/", async function (req, res) {
  var repoResponse = await neo4jRepository.GetPersonListeWithPerson(
    req.query.productName,
    req.query.profondeur
  );
  switch (repoResponse.status) {
    case 200:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(409).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
});

router.get(
  "/get-person-with-product-and-person-neo4j/",
  async function (req, res) {
    var repoResponse = await neo4jRepository.GetProductListeWithProductAndPerson(
      req.query.firstName,
      req.query.lastName,
      req.query.productName,
      req.query.profondeur
    );
    switch (repoResponse.status) {
      case 200:
        res.status(200).send(repoResponse);
        break;
      case 409:
        res.status(409).send(repoResponse);
        break;
      default:
        res.status(500).send();
        break;
    }
  }
);

router.get("/mysql/get-product-by-person-and-product", async function (req, res) {
  var repoResponse = await mySQLRepository.GetProductPopularityForPersonAndRelationship(
    req.query.firstName,
    req.query.lastName,
    req.query.productName,
    req.query.profondeur
  );
  switch (repoResponse.status) {
    case 200:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(200).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
})

router.delete("/delete-bdd-neo4j", async function (req, res) {
  var repoResponse = await neo4jRepository.DeleteNoSQLBDD();
  switch (repoResponse.status) {
    case 200:
      res.status(200).send(repoResponse);
      break;
    case 409:
      res.status(200).send(repoResponse);
      break;
    default:
      res.status(500).send();
      break;
  }
});

module.exports = router;
