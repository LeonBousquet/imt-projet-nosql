const CARDS = {
  initialisation: "initCard",
  insertion: "insertCard",
  indexation: "indexCard",
  recherche: "researchCard",
};

let BDD ="sql";

let user = {
  userName : "",
  firstName : ""
};

let product = "";

document.getElementById("cleanBDDButton").textContent = "Vider la base de données " +BDD;

spinnerOff();


document.getElementById("bddSelected").onclick = function() {
  if(document.getElementById("bddSelected").checked) {
    BDD = "neo4j";
  } else {
    BDD = "sql";
  }
};

document.getElementById("bddSelected").onchange = function() {
  document.getElementById("cleanBDDButton").textContent = "Vider la base de données " +BDD;
  if(BDD == "neo4j") {
    document.getElementById("indexCard").hidden=true;
  } else {
    document.getElementById("indexCard").hidden=false;
  }
}

document.getElementById("insertButton").onclick = function() {
  var e = document.getElementById("entitySelect");
  if(e.options[e.selectedIndex].value == "personnes") {
    insertionPersonnes();
  } else {
    insertionProduits();
  }
};

function onclickButtonRandomUser() {
  if(BDD == "neo4j") {
    user = getRandomUserNeo4J();
  } else {
    user = getRandomUserSQL();
  }
}

function onclickButtonRandomProduct() {
  if(BDD == "neo4j") {
    product = getRandomProductNeo4J();
  } else {
    product = getRandomProductSQL();
  }
}

function writeUserInfos(data) {
  var champsFirstName = document.getElementsByClassName("randomUserFirstName");
  var champsLastName = document.getElementsByClassName("randomUserLastName");
  for (var i=0; i< champsFirstName.length; i++) {
    champsFirstName[i].textContent="Prénom : "+data.firstName;
    champsLastName[i].textContent="Nom : "+data.lastName;
    champsFirstName[i].setAttribute("value",data.firstName);
    champsLastName[i].setAttribute("value",data.lastName);
  }
}

function writeProduct(data) {
  var champsProductName = document.getElementsByClassName("randomProductName");
  for (var i=0; i< champsProductName.length; i++) {
    champsProductName[i].textContent="Nom du produit: "+data.productName;
    champsProductName[i].setAttribute("value",data.productName);
  }
}


function spinnerOn() {
  document.getElementById("divResultMessageText").textContent = ""
  document.getElementById("divResultTimmingText").textContent = ""
  document.getElementById("spinner").style.display = "block"
}

function spinnerOff() {
  document.getElementById("spinner").style.display = "none"
}

function writeResult(data, time) {
  var resultBloc = document.getElementById("resultBloc");

  var divResultMessageText = document.getElementById("divResultMessageText");
  divResultMessageText.innerHTML = data;

  var divResultTimmingText = document.getElementById("divResultTimmingText");
  divResultTimmingText.innerHTML = time + " s";
}

function firstRequestReadable(mySQLResponse) {

  mySQLResponse.data = JSON.parse(mySQLResponse.data)

  var mySQLResponseKeys = []

  if (mySQLResponse.data.length != 0) {
    mySQLResponseKeys = Object.keys(mySQLResponse.data[0])
  }
  else {
    mySQLResponse.data = "Aucun produit trouvé"
    return mySQLResponse
  }

  var stringResponse = "<ul>"

  for (let i = 0; i < mySQLResponse.data.length; i++) {
    stringResponse += "<li>"
    stringResponse += "["+i+"] "
    for (let j = 0; j < mySQLResponseKeys.length; j++) {
      stringResponse += mySQLResponseKeys[j]+" : "+mySQLResponse.data[i][mySQLResponseKeys[j]]+"  "   
    }
    stringResponse += "</li>" 
  }

  stringResponse += "</ul>"
  mySQLResponse.data = stringResponse
  return mySQLResponse

}

function secondRequestReadable(mySQLResponse, profondeur) {
  
  mySQLResponse.data = JSON.parse(mySQLResponse.data)

  var mySQLResponseKeys = []

  if (mySQLResponse.data.length != 0) {
    mySQLResponseKeys = Object.keys(mySQLResponse.data[0])
  }
  else {
    mySQLResponse.data = "Aucun produit trouvé"
    return mySQLResponse
  }

  var stringResponse = ""
  stringResponse += "Le produit "+mySQLResponse.data[0][mySQLResponseKeys[0]]+" a été commandé "+mySQLResponse.data[0][mySQLResponseKeys[1]]+" fois dans un cercle de followers à "+profondeur+" niveaux" 
  

  mySQLResponse.data = stringResponse
  return mySQLResponse
}

function thirdRequestReadable(mySQLResponse, profondeur, firstName, lastName) {
  
  mySQLResponse.data = JSON.parse(mySQLResponse.data)

  var mySQLResponseKeys = []

  if (mySQLResponse.data.length != 0) {
    mySQLResponseKeys = Object.keys(mySQLResponse.data[0])
  }
  else {
    mySQLResponse.data = "Aucun produit trouvé"
    return mySQLResponse
  }

  var stringResponse = ""
  stringResponse += "Le produit "+mySQLResponse.data[0][mySQLResponseKeys[0]]+" a été commandé "+mySQLResponse.data[0][mySQLResponseKeys[1]]+" fois dans le cercle de followers de la personne "+firstName+" "+lastName+" dans un rayon de "+profondeur+" personnes à partir de lui" 
  

  mySQLResponse.data = stringResponse
  return mySQLResponse
}

// ============================================================================================
//                              Fonction d'appel des routes
// ============================================================================================
async function getRandomUserSQL() {
  spinnerOn()
  var response = await axios.get("http://localhost:3000/get-person-mysql/")
    .then(function (response) {
      return writeUserInfos(response.data.data);
    })
    .catch(function (error) {
      // handle error
      throw error;
    });
  spinnerOff()
  return response;
}

async function getRandomUserNeo4J() {
  spinnerOn()
  var response = await axios.get("http://localhost:3000/get-person-neo4j/")
    .then(function (response) {
      return writeUserInfos(response.data.data.properties);
    })
    .catch(function (error) {
      // handle error
      throw error;
    });
  spinnerOff()
  return response;
}

async function getRandomProductSQL() {
  spinnerOn()
  var response = await axios
    .get("http://localhost:3000/get-product-mysql/")
    .then(function (response) {
      return writeProduct(response.data.data);
    })
    .catch(function (error) {
      // handle error
      throw error;
    });
  spinnerOff()
  return response;
}

async function getRandomProductNeo4J() {
  spinnerOn()
  var response = await axios
    .get("http://localhost:3000/get-product-neo4j/")
    .then(function (response) {
      return writeProduct(response.data.data.properties);
    })
    .catch(function (error) {
      // handle error
      throw error;
    });
  spinnerOff()
  return response;
}

async function generateMySQLSchema() {
  spinnerOn()
  var response = await axios
    .get("http://localhost:3000/inject")
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // handle error
      throw error;
    });
  spinnerOff()
  return response;
}

async function cleanMySQLBDD() {
  spinnerOn()
  var response = await axios
    .delete("/mysql/structure")
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      throw error;
    });
  spinnerOff()
  return response;
}

async function cleanNeo4jBDD() {
  spinnerOn()
  var response = await axios
    .delete("/delete-bdd-neo4j")
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      throw error;
    });

  spinnerOff()

  return response;
}

async function addPersonsToMySQL(nbPerson) {
  spinnerOn()
  var response = await axios
    .post("/mysql/person/" + nbPerson,{},{timeout: 0})
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error;
    });

    spinnerOff()
    if (response.time != null) {
      response.time = "Ajout des personnes : "+response.time.persons+" s     Ajout des relations : "+response.time.relations
    }

    return response;
}

async function addProductsToMySQL(nbProduct) {
  spinnerOn()
  var response = await axios
    .post("/mysql/product/"+nbProduct)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error;
    });
    spinnerOff()
    if (response.time != null) {
      response.time = "Ajout des produits : "+response.time.products+" s     Ajout des relations : "+response.time.relations
    }

    return response;
}

// --------------------------------------------------------------------------------------------
async function addPersonToNeo4j(nb) {
  spinnerOn()
  var response = await axios
    .get("http://localhost:3000/create-person-neo4j/" + nb)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // handle error
      throw error;
    });
  spinnerOff()
  return response;
}

// --------------------------------------------------------------------------------------------
async function addProductToNeo4j(nb) {
  spinnerOn()
  var response = await axios
    .get("http://localhost:3000/create-product-neo4j/" + nb)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // handle error
      throw error;
    });
  spinnerOff()
  return response;
}
// --------------------------------------------------------------------------------------------
async function getProductByPersonNeo4j(firstName, lastName, profondeur) {
  spinnerOn()
  var response = await axios
    .get("http://localhost:3000/get-product-by-person-neo4j/", {
      params: {
        firstName: firstName,
        lastName: lastName,
        profondeur: profondeur,
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // handle error
      throw error;
    });
  spinnerOff()
  return response;
}

async function getProductByPersonMySQL(firstName, lastName, profondeur) {
  spinnerOn()
  var response = await axios
    .get("http://localhost:3000/mysql/get-product-by-person/", {
      params: {
        firstName: firstName,
        lastName: lastName,
        profondeur: profondeur,
      },
    })
    .then(function (response) {
      return firstRequestReadable(response.data);
    })
    .catch(function (error) {
      // handle error
      throw error;
    });

  spinnerOff()
  return response;
}

// --------------------------------------------------------------------------------------------
async function getPersonWithProductNeo4J(productName, profondeur) {
  spinnerOn()
  var response = await axios
    .get("http://localhost:3000/get-person-with-product-neo4j/", {
      params: {
        productName: productName,
        profondeur: profondeur,
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // handle error
      throw error;
    });
  spinnerOff()
  return response;
}

async function getPersonWithProductMySQL(productName, profondeur) {
  spinnerOn()
  var response = await axios
    .get("http://localhost:3000/mysql/get-product-virality/", {
      params: {
        productName: productName,
        profondeur: profondeur,
      },
    })
    .then(function (response) {
      return secondRequestReadable(response.data, profondeur);
    })
    .catch(function (error) {
      // handle error
      throw error;
    });
  spinnerOff()
  return response;
}

// --------------------------------------------------------------------------------------------
async function getProductWithProductAndPersonNeo4j(
  firstName,
  lastName,
  productName,
  profondeur
) {
  spinnerOn()
  var response = await axios
    .get("http://localhost:3000/get-person-with-product-and-person-neo4j/", {
      params: {
        firstName: firstName,
        lastName: lastName,
        productName: productName,
        profondeur: profondeur,
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // handle error
      throw error;
    });
  spinnerOff()
  return response;
}

async function getProductWithProductAndPersonMySQL(
  firstName,
  lastName,
  productName,
  profondeur
) {
  spinnerOn()
  var response = await axios
    .get("http://localhost:3000/mysql/get-product-by-person-and-product", {
      params: {
        firstName: firstName,
        lastName: lastName,
        productName: productName,
        profondeur: profondeur,
      },
    })
    .then(function (response) {
      return thirdRequestReadable(response.data,profondeur,firstName,lastName);
    })
    .catch(function (error) {
      // handle error
      throw error;
    });
  spinnerOff()
  return response;
}

// --------------------------------------------------------------------------------------------
async function generateIndexOfLastName() {
    spinnerOn()
    var response = await axios
    .post("http://localhost:3000/mysql/index/lastname")
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // handle error
      throw error;
    });
  spinnerOff()
  return response;
}

async function generateIndexOfFirstName() {
  spinnerOn()
  
  var response = await axios
  .post("http://localhost:3000/mysql/index/firstname")
  .then(function (response) {
    return response.data;
  })
  .catch(function (error) {
    // handle error
    throw error;
  });
  
  spinnerOff()
  
  return response;
}

async function generateIndexOfProductName() {
  spinnerOn()

  var response = await axios
  .post("http://localhost:3000/mysql/index/productname")
  .then(function (response) {
    return response.data;
  })
  .catch(function (error) {
    // handle error
    throw error;
  });

  spinnerOff()

  return response;
}

async function generateIndexOfRelation() {

  spinnerOn()

  var response = await axios
  .post("http://localhost:3000/mysql/index/relation")
  .then(function (response) {
    return response.data;
  })
  .catch(function (error) {
    // handle error
    throw error;
  });

  spinnerOff()

  return response;
}

async function deleteIndexOfLastName() {

  spinnerOn()

  var response = await axios
  .delete("http://localhost:3000/mysql/index/lastname")
  .then(function (response) {
    return response.data;
  })
  .catch(function (error) {
    // handle error
    throw error;
  });

  spinnerOff()

  return response;
}

async function deleteIndexOfFirstName() {

  spinnerOn()

  var response = await axios
  .delete("http://localhost:3000/mysql/index/firstname")
  .then(function (response) {
    return response.data;
  })
  .catch(function (error) {
    // handle error
    throw error;
  });

  spinnerOff()

  return response;
}

async function deleteIndexOfProductName() {

  spinnerOn()

  var response = await axios
  .delete("http://localhost:3000/mysql/index/productname")
  .then(function (response) {
    return response.data;
  })
  .catch(function (error) {
    // handle error
    throw error;
  });

  spinnerOff()

  return response;
}

async function deleteIndexOfRelation() {

  spinnerOn()

  var response = await axios
  .delete("http://localhost:3000/mysql/index/relation")
  .then(function (response) {
    return response.data;
  })
  .catch(function (error) {
    // handle error
    throw error;
  });

  spinnerOff()

  return response;


}

// ============================================================================================
//                              Fonction des boutons du html
// ============================================================================================
// --------------------------------------------------------------------------------------------
async function structureInjection() {
  var formEl = document.forms.structureInjection;
  var formData = new FormData(formEl);
  var response = await generateMySQLSchema();

  if (response === null) {
    writeResult("Internal problem", "Internal problem");
    return null;
  }

  switch (response.status) {
    case 200:
      writeResult(response.data, response.time);
      break;
    case 409:
      writeResult(
        CARDS.initialisation,
        "Problème lors de l'injection en bdd",
        response.time
      );
      break;
    default:
      writeResult("Internal problem", "X");
      break;
  }
}

// --------------------------------------------------------------------------------------------
async function insertionPersonnes() {
  var formEl = document.forms.insertionPersonnes;
  var formData = new FormData(formEl);
  var e = document.getElementById("valueSelect");
  var number = e.options[e.selectedIndex].value;

  var response = null;
  switch (BDD) {
    case "sql":
      response = await addPersonsToMySQL(number);
      break;
    case "neo4j":
      response = await addPersonToNeo4j(number);
      break;
    default:
      break;
  }

  if (response === null) {
    writeResult("Internal problem", "Internal problem");
    return null;
  }

  switch (response.status) {
    case 200:
      writeResult(response.data, response.time);
      break;
    case 409:
      console.log("")
      writeResult(
        CARDS.insertion,
        response.data,
        response.time
      );
      break;
    default:
      writeResult("Internal problem", "X");
      break;
  }
}

// --------------------------------------------------------------------------------------------
async function insertionProduits() {
  var formEl = document.forms.insertionProduits;
  var formData = new FormData(formEl);
  var e = document.getElementById("valueSelect");
  var number = e.options[e.selectedIndex].value;

  var response = null;
  switch (BDD) {
    case "sql":
      response = await addProductsToMySQL(number);
      break;
    case "neo4j":
      response = await addProductToNeo4j(number);
      break;
    default:
      break;
  }

  if (response === null) {
    writeResult("Internal problem", "Internal problem");
    return null;
  }

  switch (response.status) {
    case 200:
      writeResult(response.data, response.time);
      break;
    case 201:
      writeResult(response.data, response.time);
      break;
    case 409:
      writeResult(
        response.data,
        response.time
      );
      break;
    default:
      writeResult("Internal problem", "X");
      break;
  }
}

// --------------------------------------------------------------------------------------------
async function formGetProductByPerson() {
  var formEl = document.forms.recherche;
  var formData = new FormData(formEl);
  var firstName = document.getElementById("randomUserFirstName1").getAttribute("value");
  var lastName = document.getElementById("randomUserLastName1").getAttribute("value");
  var profondeur = document.getElementById("inputDeepRequete1").value;

  var response = null;
  switch (BDD) {
    case "sql":
      response = await getProductByPersonMySQL(firstName, lastName, profondeur);
      break;
    case "neo4j":
      response = await getProductByPersonNeo4j(firstName, lastName, profondeur);
      break;
    default:
      break;
  }

  if (response === null) {
    writeResult("Internal problem", "Internal problem");
    return null;
  }

  switch (response.status) {
    case 200:
      writeResult(response.data, response.time);
      break;
    case 409:
      writeResult(
        "Problème lors de la recherche en BDD",
        response.time
      );
      break;
    default:
      writeResult("Internal problem", "X");
      break;
  }
}

async function cleanBDD() {
  var formEl = document.forms.cleanDataBase;
  var formData = new FormData(formEl);

  var response = null;
  switch (BDD) {
    case "sql":
      response = await cleanMySQLBDD();
      break;
    case "neo4j":
      response = await cleanNeo4jBDD();
      break;
    default:
      break;
  }

  if (response === null) {
    writeResult("Internal problem", "Internal problem");
    return null;
  }

  switch (response.status) {
    case 200:
      writeResult(response.data, response.time);
      break;
    case 409:
      console.log("test");
      writeResult(response.data, response.time);
      break;
    default:
      writeResult("Internal problem", "X");
      break;
  }
}

// --------------------------------------------------------------------------------------------
async function formGetPersonWithProduct() {
  var formEl = document.forms.recherche;
  var formData = new FormData(formEl);
  var productName = document.getElementById("randomProductName1").getAttribute("value");
  var profondeur = document.getElementById("inputDeepRequete3").value;

  var response = null;
  switch (BDD) {
    case "sql":
      response = await getPersonWithProductMySQL(productName, profondeur);
      break;
    case "neo4j":
      response = await getPersonWithProductNeo4J(productName, profondeur);
      break;
    default:
      break;
  }

  if (response === null) {
    writeResult("Internal problem", "Internal problem");
    return null;
  }

  switch (response.status) {
    case 200:
      writeResult(response.data, response.time);
      break;
    case 409:
      writeResult(
        "Problème lors de la recherche en BDD",
        response.time
      );
      break;
    default:
      writeResult("Internal problem", "X");
      break;
  }
}

// --------------------------------------------------------------------------------------------
async function formGetProductWithProductAndPerson() {
  var formEl = document.forms.recherche;
  var formData = new FormData(formEl);
  var firstName = document.getElementById("randomUserFirstName2").getAttribute("value");
  var lastName = document.getElementById("randomUserLastName2").getAttribute("value");
  var productName = document.getElementById("randomProductName2").getAttribute("value");
  var profondeur = document.getElementById("inputDeepRequete2").value;

  var response = null;
  switch (BDD) {
    case "sql":
      response = await getProductWithProductAndPersonMySQL(
        firstName,
        lastName,
        productName,
        profondeur
      );
      break;
    case "neo4j":
      response = await getProductWithProductAndPersonNeo4j(
        firstName,
        lastName,
        productName,
        profondeur
      );
      break;
    default:
      break;
  }

  if (response === null) {
    writeResult("Internal problem", "Internal problem");
    return null;
  }

  switch (response.status) {
    case 200:
      writeResult(response.data, response.time);
      break;
    case 409:
      writeResult(
        "Problème lors de la recherche en BDD",
        response.time
      );
      break;
    default:
      writeResult("Internal problem", "X");
      break;
  }
}

async function indexLastName() {
  var label = document.getElementById("switchPersonLastNameSQL")
  var response = null;
  
  if (label.checked) {
    response = await generateIndexOfLastName()
  }
  else {
    response = await deleteIndexOfLastName()
  }

  switch (response.status) {
    case 200:
      writeResult(response.data, response.time);
      break;
    case 201:
      writeResult(response.data, response.time);
      break;
    case 409:
      writeResult(response.data, response.time);
      break;
    default:
      writeResult( "Internal problem", "X");
      break;
  }

}

async function indexFirstName() {
  var label = document.getElementById("switchPersonFirstNameSQL")
  
  var response = null;
  if (label.checked) {
    response = await generateIndexOfFirstName()
  }
  else {
    response = await deleteIndexOfFirstName()
  }

  switch (response.status) {
    case 200:
      writeResult(response.data, response.time);
      break;
    case 201:
      writeResult(response.data, response.time);
      break;
    case 409:
      writeResult(response.data, response.time);
      break;
    default:
      writeResult("Internal problem", "X");
      break;
  }
}

async function indexProductName() {
  var label = document.getElementById("switchProductNameSQL")
  
  var response = null;
  if (label.checked) {
    response = await generateIndexOfProductName()
  }
  else {
    response = await deleteIndexOfProductName()
  }

  switch (response.status) {
    case 200:
      writeResult(response.data, response.time);
      break;
    case 201:
      writeResult(response.data, response.time);
      break;
    case 409:
      writeResult(response.data, response.time);
      break;
    default:
      writeResult("Internal problem", "X");
      break;
  }
}

async function indexRelationPerson() {
  var label = document.getElementById("switchRelationshipSQL")
  
  var response = null;
  if (label.checked) {
    response = await generateIndexOfRelation()
  }
  else {
    response = await deleteIndexOfRelation()
  }

  switch (response.status) {
    case 200:
      writeResult(response.data, response.time);
      break;
    case 201:
      writeResult(response.data, response.time);
      break;
    case 409:
      writeResult(response.data, response.time);
      break;
    default:
      writeResult("Internal problem", "X");
      break;
  }
}
