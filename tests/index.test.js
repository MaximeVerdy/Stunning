var app = require("../app") // Lien vers le serveur
var request = require("supertest") //  importe du module supertest

// NOTA BENE :le groupe de test suivant 'activités en BDD pour 1 utilisateur inscrit' 
// ne respecte pas totalement la processure normale TDD
// Dans le cadre de l'examen, le goupe TDD suivant a été découpé 
// de manière à illustrer les détails de la réflexion.
// C'est à dire qu'au lien de réécrire le même test à chaque fois qu'il passe (refactoring),
// l'étape de développement suivante a été mise dans le test d'après
// C'est le dernier test du groupe qui refactor l'ensemble

describe('activités en BDD pour 1 utilisateur inscrit', () => { // groupe de test
  test("succès de la requête sur la bonne route", async (done) => { // test 1
  await request(app).get("/historytest") // asynchronie de la requête
    .expect(200) // attendu : succès de la requête
  done()
  });

  test("envoyer les données si l'utisateur est inscrit", async (done) => { // test 2
    await request(app).get("/historytestb") // asynchronie de la requête
      .query({ "token" : "tokenTest"}) // paramètre de la requête avec champ et valeur
      .expect({
        token : "tokenTest"
      })
    done()
  });

  test("existance de données en BDD", async (done) => { // test 3
    await request(app).get("/historytest") // asynchronie de la requête
      .expect({
        activityExist : true // attendu :  qu'il y est des données en BDD
      })
    done()
  });

  test("existance de données en BDD pour 1 utilisateur précis", async (done) => { // test 4
    await request(app).get("/historytest") // asynchronie de la requête
      .query({ "token" : "tokenTest01"}) // paramètre de la requête avec champ et valeur
      .expect({
        activityExist : true // attendu :  qu'il y est des données en BDD
      })
    done()
  });

  test("les bonnes données correspondent au bon utilisateur", async (done) => { // test 5
    await request(app).get("/historytest2") // asynchronie de la requête
      .query({ "token" : "tokenTest"}) // paramètre de la requête avec champ et valeur
      .expect({
        activities: [
          {
            _id: '5ff37d7eacdb6b3ea0a9eb63',
            token: 'tokenTest',
            activityID: 'FJjpbKBTcT4LV6sbZc2Y',
            distance: 10,
            date: '2021-01-10T00:00:00.000Z',
            chronoH: 0,
            chronoM: 50,
            chronoS: 0,
            type: 'varié',
            __v: 0
          }
        ]
      })
    done()
  });

  test("envoyer les données si l'utisateur est inscrit", async (done) => { // test 6
    await request(app).get("/historytest3") // asynchronie de la requête
      .query({ "token" : "tokenTest"}) // paramètre de la requête avec champ et valeur
      .expect({
        activities: [
          {
            _id: '5ff37d7eacdb6b3ea0a9eb63',
            token: 'tokenTest',
            activityID: 'FJjpbKBTcT4LV6sbZc2Y',
            distance: 10,
            date: '2021-01-10T00:00:00.000Z',
            chronoH: 0,
            chronoM: 50,
            chronoS: 0,
            type: 'varié',
            __v: 0
          }
        ]
      })
    done()
  });

  test("envoi d'un message d'erreur en cas non inscription", async (done) => { // test 7
    await request(app).get("/historytest4") // asynchronie de la requête
      .query({ "token" : "tokenTest"}) // paramètre de la requête avec champ et valeur
      .expect({
        activities: [],
        error : [ 'Veuillez vous connecter' ]
      })
    done()
  });
})

test("suppression des documents en BDD", async (done) => { // test 8
  await request(app).delete("/historytest")
    .send({ "activityID" : "activityIDtest2"})
    .expect(200)
    .expect(
      { result : true }
  )
  done()
  });

test("écrire d'un document en BDD", async (done) => { // test 9
  await request(app).post("/saveactivitytest")
    .send({"tokenFromFront" : "tokenTest01",
            "distanceFromFront" : 100,
            "dateFromFront" : '2021-01-10T00:00:00.000Z',
            "chronoHFromFront" : 24,
            "chronoMFromFront" : 1,
            "chronoSFromFront" : 2,
            "typeFromFront" : "varié"
     })
    .expect(200)
    .expect( { 
      activities: [
              {
                _id: '5ff33915123d441b61d6f697',
                token: 'tokenTest01',
                activityID: 'FJjpbKBTVDauZVEFNj6YcT4LV6sbZc2Y',
                distance: 100,
                date: '2021-01-10T00:00:00.000Z',
                chronoH: 24,
                chronoM: 1,
                chronoS: 2,
                type: 'varié',
                __v: 0
              }
            ]
     })
            //  .toEqual({expect.objectContaining({ 
            //    _id: expect.any(String),
            //    token: 'tokenTest01',
            //    activityID: expect.any(String),
            //    distance: 100,
            //    date: '2021-01-10T00:00:00.000Z',
            //    chronoH: 24,
            //    chronoM: 1,
            //    chronoS: 2,
            //    type: 'varié',
            //    __v: 0
            //  })})
  done()
  });

test("affichages des données stats", async (done) => { // test 10
await request(app).get("/stats")
  .query({ "token" : "tokenTest01",
          "yearChosen" : 121,
          "monthChosen" : 1,
          "dataFormat" : "distance",
          "timeGap" : "mensuel"
         })

  .expect(200)
  .expect(
    {
      stats: [
        {
          'légende': 'fév',
          'varié': 0,
          'fractionné': 0,
          endurance: 0,
          'compétition': 0
        },
        {
          'légende': 'fév',
          'varié': 0,
          'fractionné': 0,
          endurance: 0,
          'compétition': 0
        },
        {
          'légende': 'fév',
          'varié': 0,
          'fractionné': 0,
          endurance: 0,
          'compétition': 0
        },
        {
          'légende': 'fév',
          'varié': 0,
          'fractionné': 0,
          endurance: 0,
          'compétition': 0
        },
        {
          'légende': 'fév',
          'varié': 0,
          'fractionné': 0,
          endurance: 0,
          'compétition': 0
        },
        {
          'légende': 'fév',
          'varié': 0,
          'fractionné': 0,
          endurance: 0,
          'compétition': 0
        },
        {
          'légende': 'fév',
          'varié': 0,
          'fractionné': 0,
          endurance: 0,
          'compétition': 0
        },
        {
          'légende': 'fév',
          'varié': 0,
          'fractionné': 0,
          endurance: 0,
          'compétition': 0
        },
        {
          'légende': 'fév',
          'varié': 0,
          'fractionné': 0,
          endurance: 0,
          'compétition': 0
        },
        {
          'légende': 'fév',
          'varié': 0,
          'fractionné': 0,
          endurance: 0,
          'compétition': 0
        },
        {
          'légende': 'fév',
          'varié': 0,
          'fractionné': 0,
          endurance: 0,
          'compétition': 0
        }
      ],
      error: [],
      noDocument: false
    }

)
done()
});

test("inscription d'un utilisateur", async (done) => { // test 11
await request(app).post("/sign-up-test")
  .send({ "emailFromFront" : "emailOK@gmail.com",
          "passwordFromFront" : "mdpOK#1111111111"
  })
  .expect(200)
  .expect(
    {"result":true}

)
done()
});

test("reconnexion d'un utilisateur", async (done) => { // test 12
  await request(app).post("/sign-in-test")
    .send({ "emailFromFront" : "emailOK@gmail.com",
            "passwordFromFront" : "mdpMauvais"
    })
    .expect(200)
    .expect(
      { error: [ 'Mot de passe incorrect' ] }  
  )
  done()
  });
  