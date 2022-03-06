var express = require("express");
const path = require("path");
var router = express.Router();
const SQLRepository = require("../repositories/sqlRepository");
const neo4jRepository = require("../repositories/neo4jRepository");

router.get("/", function (req, res, next) {
  res.redirect("/projet-nosql");
});

router.get("/projet-nosql", function (req, res) {
  res.sendFile(path.resolve("public/html/imt-projet-nosql.html"));
});

router.get("/test", function (req, res) {
  neo4jRepository.test();
});

router.delete("/sql/structure", async function (req, res) {
  var repoResponse = await SQLRepository.cleanBDD();

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

router.post("/sql/product/:nbProducts", async function (req,res) {
  var repoResponse = await SQLRepository.insertProducts(req.params.nbProducts);

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

router.post("/sql/person/:nbPerson", async function (req, res) {
  var repoResponse = await SQLRepository.insertPerson(req.params.nbPerson);

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

router.post("/sql/index/lastname", async function (req,res) {
  var repoResponse = await SQLRepository.insertLastNameIndex();

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

router.post("/sql/index/firstname", async function (req,res) {
  var repoResponse = await SQLRepository.insertFirstNameIndex();

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

router.post("/sql/index/productname", async function (req,res) {
  var repoResponse = await SQLRepository.insertProductNameIndex();

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

router.post("/sql/index/relation", async function (req,res) {
  var repoResponse = await SQLRepository.insertRelationIndex();

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

router.delete("/sql/index/lastname", async function (req,res) {
  var repoResponse = await SQLRepository.deleteLastNameIndex();

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

router.delete("/sql/index/firstname", async function (req,res) {
  var repoResponse = await SQLRepository.deleteFirstNameIndex();

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

router.delete("/sql/index/productname", async function (req,res) {
  var repoResponse = await SQLRepository.deleteProductNameIndex();

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

router.delete("/sql/index/relation", async function (req,res) {
  var repoResponse = await SQLRepository.deleteRelationIndex();

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
  var repoResponse = await SQLRepository.DefineStructure();

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

router.get("/get-person-sql/", async function (req, res) {
  var repoResponse = await SQLRepository.GetRandomPerson();
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

router.get("/get-product-sql/", async function (req, res) {
  var repoResponse = await SQLRepository.GetRandomProduct();
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

router.get("/sql/get-product-by-person/", async function (req, res) {
  var repoResponse = await SQLRepository.GetProductsByPersonAndRelationship(
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

router.get("/sql/get-product-virality/", async function (req, res) {
  var repoResponse = await SQLRepository.getProductVirality(
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

router.get("/sql/get-product-by-person-and-product", async function (req, res) {
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
