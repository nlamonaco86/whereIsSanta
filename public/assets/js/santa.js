console.log("Happy Holidays!")
let userLocation
// Get the User's location on startup, if they consent
navigator.geolocation.getCurrentPosition((location) => {
  if (location.coords) {
    userLocation = location.coords
  }
});

// Call the API every 3 minutes and 40 seconds, and obtain Santa's latest location from his helpers worldwide.
const lotsOfCheer = setInterval(() => {
  fetch("/api/location/", { type: "GET" }).then((response) => {
    return response.json();
  }).then((response) => {
    console.log(response)
    let radius = 2
    document.getElementById("title").innerHTML = "BREAKING NEWS!"
    // Update the news ticker with Santa's current location
    document.getElementById("location").innerHTML = "Santa Claus has been sighted near " + response.location
    document.getElementById("coordinates").innerHTML = "Santa's most recent coordinates: " + response.x.toFixed(4) + "&deg;" + ", " + response.y.toFixed(4) + "&deg;"
    // if their location is available, compare it to Santa's current location
    // If the user is nearby to Santa, he will have to come back to their home later when they are asleep
    // "(x – h)2 + (y – k)2 = r2, where (h, k) represents the coordinates of the center of the circle, and r represents the radius of the circle"
    if (userLocation) {
      let distanceBetween = (userLocation.latitude - response.x) ** 2 + (userLocation.longitude - response.y) ** 2;
      radius *= radius;
      // 1 degree of Latitude/Longitude is ~69 miles - default radius is ~138 miles.
      if (distanceBetween <= radius) {
        // Santa is nearby and the user is awake; display a special message
        document.getElementById("message").innerHTML = "Santa Claus can only visit your home once everyone has gone to bed! If you're awake, he will have to return to your home later tonight. Don't forget the milk and cookies!"
      }
    }
    else { document.getElementById("message").innerHTML = response.message }
    // Can I use a grid and CSS to overlay points on a map? 
  })
},
  220000)

window.onload = () => {

  let niceList = document.getElementById("niceList")

  niceList.addEventListener('submit', (event) => {
    event.preventDefault();
    let userData = {
      email: document.getElementById("email").value,
      name: document.getElementById("name").value
    };

    if (!userData.email || !userData.name) {
      event.preventDefault();
      document.getElementById("error").innerHTML =
        `<div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Please enter a Name and E-Mail address!</strong>
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>`
    }
    else { sendToSanta(userData.email, userData.name) };
  });

  const sendToSanta = (email, name) => {
    let data = { email: email, name: name };
    console.log(data)
    // Send a letter to Santa via our API route, we'll need the first name and e-mail address. 
    fetch('api/letterToSanta', { 
      method: 'POST', 
      headers: {'Content-Type': 'application/json', },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        document.getElementById("error").innerHTML =
        `<div class="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Your letter is on its way to the North Pole!
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>`
      })
      .catch((error) => {
       document.getElementById("error").innerHTML =
          `<div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Uh-Oh! Something went wrong. The elves will fix it ASAP!
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>`
      });
  };
}


