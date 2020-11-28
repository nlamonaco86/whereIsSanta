let mongoose = require("mongoose");
let db = require("../models");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/santaDb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Santa's starting location is the North Pole, but you can change it to anywhere else if you'd like him to start from there.
const santasLocation = [{
  x: 90.0000,
  y: 135.0000,
  location: "Santa's Workshop - North Pole",
  visited: false,
  message: "Santa is currently at the North Pole, preparing for the Big Night."
}];

// All of the stops on Santa's route. They will be sorted via algorithm according to the "Traveling Salesman" problem
// before being inserted into the database, you can add any location to the array if Santa missed a spot. This way, no
// attention needs to be given to the order of the route, it can be expanded anytime, and will always make sense.
let routeSeeds = [
  {
    x: 43.04431683454695,
    y: 131.86475972806497,
    location: "Vladivostok, Russia",
    visited: false,
    message: ""
  },
  {
    x: 36.1081139584175,
    y: 139.59403584224248,
    location: "Tokyo, Japan",
    visited: false,
    message: ""
  },
  {
    x: 37.96712235854281,
    y: 126.8938387099994,
    location: "Seoul, South Korea",
    visited: false,
    message: ""
  },
  {
    x: 40.36384826827743,
    y: 116.54115589540714,
    location: "Beijing, China",
    visited: false,
    message: ""
  },
  {
    x: 31.85374058508823,
    y: 121.17161461959614,
    location: "Shanghai",
    visited: false,
    message: ""
  },
  {
    x: 25.52599630035424,
    y: 121.74369209692028,
    location: "Taipei, Taiwan",
    visited: false,
    message: ""
  },
  {
    x: 22.050269193562272,
    y: 114.66191635434095,
    location: "Hong Kong",
    visited: false,
    message: ""
  },
  {
    x: 15.271508928719626,
    y: 120.92614902585234,
    location: "Manila, Phillipines",
    visited: false,
    message: ""
  },
  {
    x: 13.259078525091699,
    y: 144.55105208955015,
    location: "Guam",
    visited: false,
    message: ""
  },
  {
    x: -14.203161267132815,
    y: -170.7460441095688,
    location: "American Samoa",
    visited: false,
    message: ""
  },
  {
    x: -43.2529743071811,
    y: 172.73345251040178,
    location: "Christchurch, New Zealand",
    visited: false,
    message: ""
  },
  {
    x: -27.261110821216807,
    y: 152.8240428345888,
    location: "Brisbane, Australia",
    visited: false,
    message: ""
  },
  {
    x: -33.658838722786,
    y: 151.25530962586333,
    location: "Sydney, Australia",
    visited: false,
    message: ""
  },
  {
    x: -31.491350652971487,
    y: 115.72939881253106,
    location: "Perth, Australia",
    visited: false,
    message: ""
  },
  {
    x: -6.16472388250325,
    y: 106.87034854436307,
    location: "Jakarta, Indonesia",
    visited: false,
    message: ""
  },
  {
    x: 4.5250123348106,
    y: 114.63214008574718,
    location: "Brunei, Borneo",
    visited: false,
    message: ""
  },
  {
    x: 1.0555528766280486,
    y: 103.87547569924908,
    location: "Singapore",
    visited: false,
    message: ""
  },
  {
    x: 2.8007556370269735,
    y: 101.9218838049697,
    location: "Kuala Lumpur, Malaysia",
    visited: false,
    message: ""
  },
  {
    x: 11.868253989822065,
    y: 104.55662789267294,
    location: "Phnom Pen, Cambodia",
    visited: false,
    message: ""
  },
  {
    x: 11.364669380850744,
    y: 106.41286261185232,
    location: "Ho Chi Mihn City, Vietnam",
    visited: false,
    message: ""
  },
  {
    x: 14.18529530522888,
    y: 100.59402196665955,
    location: "Bangkok, Thailand",
    visited: false,
    message: ""
  },
  {
    x: 23.783271511892877,
    y: 90.41576329578403,
    location: "Dhaka, Bangladesh",
    visited: false,
    message: ""
  },
  {
    x: 27.583411867131662,
    y: 85.07188544230941,
    location: "Kathmandu, Nepal",
    visited: false,
    message: ""
  },
  {
    x: 22.324593393126474,
    y: 88.54543220429542,
    location: "Kolkata, India",
    visited: false,
    message: ""
  },
  {
    x: 19.721876484469426,
    y: 73.02541394997857,
    location: "Mumbai, India",
    visited: false,
    message: ""
  },
  {
    x: 28.504021203531586,
    y: 77.04901072569149,
    location: "New Dehli, India",
    visited: false,
    message: ""
  },
  {
    x: 31.512066164513733,
    y: 74.00339577969817,
    location: "Lahore, Pakistan",
    visited: false,
    message: ""
  },
  {
    x: 41.295926932195385,
    y: 69.23953419304733,
    location: "Tashkent, Uzbekistan",
    visited: false,
    message: ""
  },
  {
    x: 35.81821343251561,
    y: 51.40472411502601,
    location: "Tehran, Iran",
    visited: false,
    message: ""
  },
  {
    x: 25.903093048379095,
    y: 55.30943960218752,
    location: "Dubai, UAE",
    visited: false,
    message: ""
  },
  {
    x: 9.373065836043208,
    y: 38.498199095447205,
    location: "Addis Ababa, Ethiopia",
    visited: false,
    message: ""
  },
  {
    x: -0.984727106710998,
    y: 36.871153349621835,
    location: "Nairobi, Kenya",
    visited: false,
    message: ""
  },
  {
    x: -18.87869976718758,
    y: 47.437876102187396,
    location: "Antananarivo, Madagascar",
    visited: false,
    message: ""
  },
  {
    x: -33.56958610122128,
    y: 18.59470630995634,
    location: "Cape Town, South Africa",
    visited: false,
    message: ""
  },
  {
    x: 6.791397489228659,
    y: 3.7372392112493187,
    location: "Lagos, Nigeria",
    visited: false,
    message: ""
  },
  {
    x: 6.453381359870313,
    y: -10.855802314785285,
    location: "Monrovia, Liberia",
    visited: false,
    message: ""
  },
  {
    x: 30.43113491100319,
    y: 31.090890780111017,
    location: "Cairo, Egypt",
    visited: false,
    message: ""
  },
  {
    x: 31.774029653293347,
    y: 34.97654208634274,
    location: "Jerusalem, Israel",
    visited: false,
    message: ""
  },
  {
    x: 33.86101202157325,
    y: 35.4918599287775,
    location: "Beirut, Lebanon",
    visited: false,
    message: ""
  },
  {
    x: 35.18278813296195,
    y: 33.33450361323735,
    location: "Nikosia, Cyprus",
    visited: false,
    message: ""
  },
  {
    x: 41.1578859937797,
    y: 29.07259805128814,
    location: "Istanbul, Turkey",
    visited: false,
    message: ""
  },
  {
    x: 38.82416032259228,
    y: 23.574882510354993,
    location: "Athens, Greece",
    visited: false,
    message: ""
  },
  {
    x: 44.52128742426793,
    y: 25.67806407875841,
    location: "Bucharest, Romania",
    visited: false,
    message: ""
  },
  {
    x: 43.42111126968787,
    y: 23.415234790915186,
    location: "Sofia, Bulgaria",
    visited: false,
    message: ""
  },
  {
    x: 50.86874398748364,
    y: 30.719117955286382,
    location: "Kyiv, Ukraine",
    visited: false,
    message: ""
  },
  {
    x: 49.31392876629556,
    y: 45.093630318844994,
    location: "Volgograd, Russia",
    visited: false,
    message: ""
  },
  {
    x: 56.108305283763734,
    y: 37.62388178840951,
    location: "Moscow, Russia",
    visited: false,
    message: ""
  },
  {
    x: 60.06976128556692,
    y: 30.280086737029613,
    location: "St. Petersburg, Russia",
    visited: false,
    message: ""
  },
  {
    x: 60.32762750497689,
    y: 25.2910955120176,
    location: "Helsinki, Finland",
    visited: false,
    message: ""
  },
  {
    x: 59.54792329343817,
    y: 17.667916920329837,
    location: "Stockholm, Sweden",
    visited: false,
    message: ""
  },
  {
    x: 60.20886411688399,
    y: 10.68332919483826,
    location: "Oslo, Norway",
    visited: false,
    message: ""
  },
  {
    x: 55.68311608878743,
    y: 12.559189898256,
    location: "Copenhagen, Denmark",
    visited: false,
    message: ""
  },
  {
    x: 52.71977966460101,
    y: 13.2776046607317,
    location: "Berlin, Germany",
    visited: false,
    message: ""
  },
  {
    x: 52.58916547206155,
    y: 21.141053420343525,
    location: "Warsaw, Poland",
    visited: false,
    message: ""
  },
  {
    x: 54.483996310167335,
    y: 27.196270260730152,
    location: "Minsk, Belarus",
    visited: false,
    message: ""
  },
  {
    x: 47.815001009780055,
    y: 19.185391617222447,
    location: "Budapest, Hungary",
    visited: false,
    message: ""
  },
  {
    x: 45.90924635529337,
    y: 15.959184211965967,
    location: "Zagreb, Croatia",
    visited: false,
    message: ""
  },
  {
    x: 38.26769691670429,
    y: 13.245185919573167,
    location: "Palermo, Sicily",
    visited: false,
    message: ""
  },
  {
    x: 41.8650874741482,
    y: 12.977005741474446,
    location: "Rome, Italy",
    visited: false,
    message: ""
  },
  {
    x: 47.42513226375897,
    y: 8.54955400289827,
    location: "Zurich, Switzerland",
    visited: false,
    message: ""
  },
  {
    x: 40.6052816534365,
    y: -3.7343037944091986,
    location: "Madrid, Spain",
    visited: false,
    message: ""
  },
  {
    x: 31.52772387169895,
    y: -8.061880344212828,
    location: "Marrakesh, Morocco",
    visited: false,
    message: ""
  },
  {
    x: 29.134821433609268,
    y: -15.52847677954643,
    location: "Canary Islands, Spain",
    visited: false,
    message: ""
  },
  {
    x: 38.782028572553436,
    y: -8.849980552923856,
    location: "Lisbon, Portugal",
    visited: false,
    message: ""
  },
  {
    x: 48.95809143675577,
    y: 2.285448331768997,
    location: "Paris, France",
    visited: false,
    message: ""
  },
  {
    x: 52.48699842998364,
    y: 4.863519988878733,
    location: "Amsterdam, The Netherlands",
    visited: false,
    message: ""
  },
  {
    x: 51.64665922074764,
    y: -0.20904738133093875,
    location: "London, England",
    visited: false,
    message: ""
  },
  {
    x: 53.668231656946034,
    y: -2.576621994718619,
    location: "Manchester, England",
    visited: false,
    message: ""
  },
  {
    x: 55.84356670875604,
    y: -4.220196493044607,
    location: "Glasgow, Scotland",
    visited: false,
    message: ""
  },
  {
    x: 53.39490630400429,
    y: -6.51513255480665,
    location: "Dublin, Ireland",
    visited: false,
    message: ""
  },
  {
    x: 62.21068444653889,
    y: -7.075225059527707,
    location: "Faroe Islands",
    visited: false,
    message: ""
  },

  {
    x: 64.21109074633046,
    y: -21.804233832885824,
    location: "Reykjavik, Iceland",
    visited: false,
    message: ""
  },
  {
    x: 61.15660377993617,
    y: -45.426855212580364,
    location: "Narsarsuaq, Greenland",
    visited: false,
    message: ""
  },
  {
    x: 44.68466365555826,
    y: -63.58115624407311,
    location: "Dartmouth, Canada",
    visited: false,
    message: ""
  },
  {
    x: 45.561473116742526,
    y: -73.47694393596612,
    location: "Montreal, Canada",
    visited: false,
    message: ""
  },
  {
    x: 42.32976208285344,
    y: -70.82011470177655,
    location: "Boston, Massachusetts USA",
    visited: false,
    message: ""
  },
  {
    x: 40.86587812845335,
    y: -73.9585913312983,
    location: "New York City",
    visited: false,
    message: ""
  },
  {
    x: 43.773756342995156,
    y: -79.27090035613799,
    location: "Toronto, Canada",
    visited: false,
    message: ""
  },
  {
    x: 42.111648187242665,
    y: -87.6100247961395,
    location: "Chicago, Illinois USA",
    visited: false,
    message: ""
  },
  {
    x: 36.35612690283897,
    y: -86.66218483190323,
    location: "Nashville, Tennessee USA",
    visited: false,
    message: ""
  },
  {
    x: 33.87504258433799,
    y: -84.17117434876832,
    location: "Atlanta, Georgia USA",
    visited: false,
    message: ""
  },
  {
    x: 26.27628666425568,
    y: -80.41518900792252,
    location: "Miami, Florida USA",
    visited: false,
    message: ""
  },
  {
    x: 23.487982172690685,
    y: -82.69880731179038,
    location: "Havana, Cuba",
    visited: false,
    message: ""
  },
  {
    x: 18.021850223846506,
    y: -76.82187611492805,
    location: "Kingston, Jamaica",
    visited: false,
    message: ""
  },
  {
    x: 18.446158218963514,
    y: -72.3844084331694,
    location: "Port-Au-Prince, Haiti",
    visited: false,
    message: ""
  },
  {
    x: 18.698804634924983,
    y: -66.3959510231781,
    location: "San Juan, Puerto Rico",
    visited: false,
    message: ""
  },
  {
    x: 10.660473403877251,
    y: -61.51039350763581,
    location: "Port of Spain, Trinidad & Tobago",
    visited: false,
    message: ""
  },
  {
    x: 6.928467969592893,
    y: -58.11237921651535,
    location: "Georgetown, Guyana",
    visited: false,
    message: ""
  },
  {
    x: -22.71092249557303,
    y: -43.1961067556703,
    location: "Rio De Janeiro, Brazil",
    visited: false,
    message: ""
  },
  {
    x: -22.782870186096922,
    y: -43.149923744511014,
    location: "Sao Paolo, Brazil",
    visited: false,
    message: ""
  },
  {
    x: -34.740006425752,
    y: -56.24794940296488,
    location: "Montevideo, Uruguay",
    visited: false,
    message: ""
  },
  {
    x: -34.46885272727236,
    y: -58.52260946638704,
    location: "Buenos Aires, Argentina",
    visited: false,
    message: ""
  },
  {
    x: -33.10450747599879,
    y: -70.49918248607428,
    location: "Santiago, Chile",
    visited: false,
    message: ""
  },
  {
    x: -16.308015652465265,
    y: -67.76724402130799,
    location: "La Paz, Bolivia",
    visited: false,
    message: ""
  },
  {
    x: -11.750869758140915,
    y: -76.5268747478517,
    location: "Lima, Peru",
    visited: false,
    message: ""
  },
  {
    x: 0.1810000943115747,
    y: -78.70839197301147,
    location: "Quito, Ecuador",
    visited: false,
    message: ""
  },
  {
    x: 4.873764643335821,
    y: -73.77480683964524,
    location: "Bogota, Colombia",
    visited: false,
    message: ""
  },
  {
    x: 9.30223511339619,
    y: -79.5138752392063,
    location: "Panama City, Panama",
    visited: false,
    message: ""
  },
  {
    x: 9.434691782175324,
    y: -83.91047148082689,
    location: "San Jose, Costa Rica",
    visited: false,
    message: ""
  },
  {
    x: 14.326476086168588,
    y: -87.10829836529982,
    location: "Tegucigalpa, Honduras",
    visited: false,
    message: ""
  },
  {
    x: 21.443731229023125,
    y: -86.77001657337608,
    location: "Cancun, Mexico",
    visited: false,
    message: ""
  },
  {
    x: 19.622282181986026,
    y: -99.07501673118074,
    location: "Mexico City, Mexico",
    visited: false,
    message: ""
  },
  {
    x: 29.998755919550522,
    y: -95.25061788662396,
    location: "Houston, Texas USA",
    visited: false,
    message: ""
  },
  {
    x: 39.945314482276416,
    y: -105.23099318932883,
    location: "Denver, Colorado USA",
    visited: false,
    message: ""
  },
  {
    x: 36.33829627411525,
    y: -115.0411651431361,
    location: "Las Vegas, Nevada USA",
    visited: false,
    message: ""
  },
  {
    x: 34.19804930187821,
    y: -118.17027169230782,
    location: "Los Angeles, California USA",
    visited: false,
    message: ""
  },
  {
    x: 38.055976727875574,
    y: -121.82794355658349,
    location: "San Francisco, California USA",
    visited: false,
    message: ""
  },
  {
    x: 45.64799144173353,
    y: -122.6947906255983,
    location: "Portland, Oregon USA",
    visited: false,
    message: ""
  },
  {
    x: 49.48308688967021,
    y: -122.99078719353153,
    location: "Vancouver, Canada",
    visited: false,
    message: ""
  },
  {
    x: 61.40947146861083,
    y: -149.66274185738683,
    location: "Anchorage, Alaska USA",
    visited: false,
    message: ""
  },
  {
    x: 21.793996703349585,
    y: -158.30686886560306,
    location: "Honolulu, Hawaii USA",
    visited: false,
    message: ""
  },
];

// Traveling Salesman Problem Solver Function goes here. 
// For now, the seed data is manually arranged. 

let factSeeds = [
  {
    fact: "Santa Claus has many different outfits, and wears them in different places so children all over the world can recognize him."
  },
  {
    fact: "Since many homes do not have a fireplace, Santa's elves invented a magic fireplace, which fits in his pocket and allows him to visit any home."
  },
  {
    fact: "According to the US CDC, Santa Claus is completely immune to Covid-19"
  },
  {
    fact: "Santa's sleigh travels at 650 miles per second, 3,000 times the speed of sound! The fastest man-made vehicle on earth, the Ulysses space probe, moves at only 27.4 miles per second."
  },
  {
    fact: "Santa eats roughly 336,150,386 cookies and drinks a little less than a million glasses of milk each year on his trip, enough to fill an olympic swimming pool nine times over."
  },
  {
    fact: "Santa will deliver gifts to 1.6 billion children this year, wrapped with 1.5 million miles of 100% recycled paper and worth over $459 billion."
  },
  {
    fact: "Santa Claus and Mrs. Claus have been married for over 130 years - since 1889 - Katherine Lee Bates' widely-circulated 1889 poem Goody Santa Claus on a Sleigh Ride first announced the good news."
  },
  {
    fact: "If writing to Santa, In Canada the correct postal code is H0H 0H0. The head elf personally responds to each and every letter."
  },
  {
    fact: "Rudolph was added to Santa’s reindeer team on one Christmas Eve during a bad snowstorm.  Santa’s 8 reindeer could not see to fly through the storm.  Rudolph with his glowing red nose lit the way for Santa’s sleigh."
  },
  {
    fact: "Santa's Workshop is a fully mechanized production and distribution facility, equipped with the latest manufacturing technology, and overseen by the elves with Santa and Mrs. Claus as executives."
  },
];

let sortedSeeds = routeSeeds
// Clear out any existing data, and populate the database for Santa
db.Route.deleteMany({})
  .then(() => db.Route.collection.insertMany(sortedSeeds))
  .then(data => {
    console.log("Santa will be visiting " + data.result.n + " cities across the world tonight!");
  })
  .catch(err => {
    console.error(err);
  });
db.Location.deleteMany({})
  .then(() => db.Location.collection.insertMany(santasLocation))
  .then(data => {
    console.log(data.result.n + " possible location for Santa has been entered!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
db.SantaFact.deleteMany({})
  .then(() => db.SantaFact.collection.insertMany(factSeeds))
  .then(data => {
    console.log("Santa will be visiting " + data.result.n + " cities across the world tonight!");
  })
  .catch(err => {
    console.error(err);
  });
