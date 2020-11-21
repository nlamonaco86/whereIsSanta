const db = [
    {
        x: 40.453033312279594,
        y: -80.01332493117893,
        location: "Pittsburgh, PA USA",
        visited: false,
        message: ""
    },
    {
        x: 37.960399257552496,
        y: -122.11610193570196,
        location: "San Francisco, CA USA",
        visited: false,
        message: ""
    },
    {
        x: 53.4506181740751,
        y: -6.236225314609783,
        location: "Dublin, Ireland",
        visited: false,
        message: ""
    },
    {
        x: 35.21115245205097,
        y: -90.16451283089317,
        location: "Memphis, TN USA",
        visited: false,
        message: ""
    },
    {
        x: 22.006006673093523,
        y: -157.31149415244397,
        location: "Honolulu, HI USA",
        visited: false,
        message: ""
    },
    {
        x: 41.908803749658276,
        y: -87.64648290810564,
        location: "Chicago, IL USA",
        visited: false,
        message: ""
    },
    {
        x: 39.809208378724435,
        y: -104.89541823217208,
        location: "Denver, CO USA",
        visited: false,
        message: ""
    },
]

const santasLocation = {
    x: 40.71194499119388,
    y: -73.99693894907112,
    location: "New York, NY USA",
    visited: false,
    message: "Home"
}

// credit to Amit Diwan @ https://www.tutorialspoint.com/sort-array-of-points-by-ascending-distance-from-a-given-point-javascript
// const coordinates =
//     [{ x: 2, y: 6 }, { x: 14, y: 10 }, { x: 7, y: 10 }, { x: 11, y: 6 }, { x: 6, y: 2 }];
const distance = (coord1, coord2) => {
    const x = coord2.x - coord1.x;
    const y = coord2.y - coord1.y;
    return Math.sqrt((x * x) + (y * y));
};
const sortByDistance = (coordinates, point) => {
    const sorter = (a, b) => distance(a, point) - distance(b, point);
    coordinates.sort(sorter);
};
sortByDistance(db, { x: santasLocation.x, y: santasLocation.y });
console.log(db);


// filter places visited or not
// const filterArr = db.filter(x => x.visited === false)

// Sort by X/Y coordinates, return nearest to farthest
// // compare sum of current x/y and sum of the x/y of the element being compared
// console.log(db.sort((db, santasLocation) => (santasLocation.x + santasLocation.y) - (db.x + db.y) ) );

// filter AND sort all in one shot
// the math here isn't quite correct, though...
// const santasRoute = db.filter(x => x.visited === false).sort((db, santasLocation) => (santasLocation.x + santasLocation.y) - (db.x + db.y));

// console.log(santasRoute)