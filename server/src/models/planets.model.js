const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = require('./planet.mongo');

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          await savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const countPlanetFound = (await getAllPlanets()).length;
        console.log(countPlanetFound);
        resolve();
      });
  });
}

async function getAllPlanets() {
  const result = await planets.find({},{
    '_id':0,
    '__v':0
  });
 
  return result;
}

async function savePlanet(planet) {
  try {
    const result = await planets.updateOne(
      { keplerName: planet.kepler_name },
      { keplerName: planet.kepler_name },
      { upsert: true }
    );
   
    return result;
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
