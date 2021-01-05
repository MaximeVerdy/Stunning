var app = require("../app")
var request = require("supertest")

describe("route des activités enregistrées en BDD", () => { 

test("des données en BDD existent pour utilisateur spécifique", async (done) => {
await request(app).get("/historytest")
  .query({ "token" : "tokenTest01"})
  .expect(200)
  .expect(
    { activities: [
      {
        _id: '5ff33915123d441b61d6f697',
        token: 'tokenTest01',
        activityID: 'FJjpbKBTVDauZVEFNj6YcT4LV6sbZc2Y',
        distance: 10,
        date: '2021-01-10T00:00:00.000Z',
        chronoH: 0,
        chronoM: 50,
        chronoS: 0,
        type: 'varié',
        __v: 0
      }
    ], 
      error: [] }
)
done()
});
}); 

test("quand utilisateur veut accéder aux données sans être correctement identifié", async (done) => {
  await request(app).get("/historytest")
    .query({ "token" : "tokenTestFaux"})
    .expect(200)
    .expect(
      { activities: [], 
        error: ['Veuillez vous connecter'] }
  )
  done()
  });

test("suppression des documents en BDD", async (done) => {
  await request(app).delete("/historytest")
    .send({ "activityID" : "activityIDtest2"})
    .expect(200)
    .expect(
      { result : true }
  )
  done()
  });

test("écrire d'un document en BDD", async (done) => {
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

test("affichages des données stats", async (done) => {
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



test("inscription d'un utilisateur", async (done) => {
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




test("reconnexion d'un utilisateur", async (done) => {
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
  