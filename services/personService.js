const { generateString } = require('./generateString')
const { Person } = require('../entity/person')

var generatePerson = function(nbPerson) {

    var tabPersons = []

    for (let i = 0; i < nbPerson; i++) {
        
        var randomFirstName = generateString()
        var randomLastName = generateString()
        var currentPerson = new Person(randomFirstName,randomLastName)
        tabPersons.push(currentPerson)
    }

    return tabPersons

}

const generateRelations = function(allPersons) {
    
    
    var nbRelationMax = 3;

    var tableauRelation = [];
    allPersons.forEach(person => {
        var idAllreadyUsed = []
        var nbRelationsCourantes = Math.floor(Math.random() * (nbRelationMax + 1)); 
        

        for (let i = 0; i < nbRelationsCourantes; i++) {

            var randomPerson = allPersons[Math.floor(Math.random()*allPersons.length)];

            while (idAllreadyUsed.includes(randomPerson.id)) {
                randomPerson = allPersons[Math.floor(Math.random()*allPersons.length)];
            }

            idAllreadyUsed.push(randomPerson.id)

            tableauRelation.push({
                "person_following_id" : person.id,
                "person_followed_id" : randomPerson.id
            })
        }
    });
    return tableauRelation
}

module.exports = {
    generatePerson,
    generateRelations
}