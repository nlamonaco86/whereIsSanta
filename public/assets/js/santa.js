console.log("Happy Holidays!")

let userLocation
// Get the User's location on startup, if they consent
navigator.geolocation.getCurrentPosition((location) => {
    if (location.coords) {
        userLocation = location.coords
    }
});

// Call the API periodically, and obtain Santa's latest location from his helpers worldwide.
const lotsOfCheer = setInterval(() => {
    fetch("/api/location/", { type: "GET" }).then((response) => {
        return response.json();
    }).then((response) => {
        let radius = 1
        document.getElementById("title").innerHTML = "BREAKING NEWS!"
        // Update the news ticker with Santa's current location
        document.getElementById("location").innerHTML = "Santa Claus has been sighted near " + response.location
        // if their location is available, compare it to Santa's current location
        // If the user is nearby to Santa, he will have to come back to their home later when they are asleep
        // "(x – h)2 + (y – k)2 = r2, where (h, k) represents the coordinates of the center of the circle, and r represents the radius of the circle"
        let distanceBetween = (userLocation.latitude - response.x) ** 2 + (userLocation.longitude - response.y) ** 2;
        radius *= radius;
        // 1 degree of Latitude/Longitude is ~69 miles
        if (distanceBetween <= radius) {
            // Santa is nearby and the user is awake; display a special message
            document.getElementById("message").innerHTML = "Santa Claus can only visit your home once everyone has gone to bed! He will have to return to your home later tonight. Don't forget the milk and cookies!"
        }
        else { document.getElementById("message").innerHTML = response.message }
        document.getElementById("coordinates").innerHTML = "Santa's most recent coordinates: " + response.x + "&deg;" + " " + response.y + "&deg;"
        // Can I use a grid and CSS to overlay points on a map? 
    })
},
    5000)

