
const launchesDatabase = require('./launches.mongo');
const planets = require('./planet.mongo')
const Defaut_flight_number = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};
console.log(`${launch.flightNumber} ${launch.mission}`)
saveAllLaunches(launch);

function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

async function getLatestFlightNumber() {

  const launch = await launchesDatabase.findOne({}).sort('-flightNumber');
  if (!launch) {
    return Defaut_flight_number;
  }

  return launch.flightNumber;
}


async function getAllLaunches() {
  try {
    return await launchesDatabase.find({}, { '_id': 0, '__v': 0 });
  } catch (error) {
    console.error('Error fetching launches:', error);
    // Handle the error appropriately, e.g., return an error response.
  }
}

async function saveAllLaunches(launch) {
  try {
    await launchesDatabase.findOneAndUpdate(
      { flightNumber: launch.flightNumber },
      launch,
      { upsert: true }
    );
  } catch (error) {
    console.error('Error saving launch:', error);
    // Handle the error appropriately, e.g., return an error response.
  }
}


async function scheduleNewLaunch(launch) {
  const newFlightNumber = await getLatestFlightNumber() + 1

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['ZTM', 'NASA'],
    flightNumber: newFlightNumber
  })

  const planet = await planets.findOne({ keplerName: launch.target })

  if (!planet) {
    throw new Error('No matching planet was found')
  }

  await saveLaunch(newLaunch)
}

async function abortLaunchById(launchId) {
  const launch = await launchesDatabase.findOneAndUpdate({
    flightNumber: launchId
  }, {
    upcoming: false,
    success: false
  }, {
    new: true
  })

  return !launch.upcoming && !launch.success
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
