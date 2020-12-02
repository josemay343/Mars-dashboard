let store = Immutable.Map({
    user: Immutable.Map({ name: "Udacity Reviewer" }),
    data: '',
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
})
// add our markup to the page
const root = document.getElementById('root')

const render = (root)=> {
    root.innerHTML = App()
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root)
    setupEvents();
})

// create content
const App = () => {
    return `
        <header></header>
        <main>
            ${Greeting(store.getIn(['user', 'name']))}
            <div class='navbar sticky-top'>
                <button class='btn btn-primary' id="apodBtn">Astronomy Picture Of The Day</button>
                <button class='btn btn-primary' id="curiosityBtn">Curiosity Rover</button>
                <button class='btn btn-primary' id="oportunityBtn">Opportunity Rover</button>
                <button class='btn btn-primary' id="spiritBtn">Spirit Rover</button>
            </div>
            <section>
                <div class='content'>
                    ${(getContent()) ? getContent() : 'Loading...'}
                </div>
            </section>
        </main>
        <footer></footer>
    `
}

// Add the greeting message
const Greeting = (name) => `<br><h1 class='text-light'>Welcome to the Mars Dashboard, ${name}!</h1><br>`;

// Adds the event listeners for each navigation button or others
const setupEvents = ()=> {
    // Sets the click event to go back to the top of the page
    const goToTop = ()=> window.scrollTo(0,0);
    // Gets the rover immutable list
    let rovers = store.get('rovers')
    // Gets all the buttons
    let apodBtn = document.querySelector('#apodBtn');
    let curiosityBtn = document.querySelector('#curiosityBtn');
    let oportunityBtn = document.querySelector('#oportunityBtn');
    let spiritBtn = document.querySelector('#spiritBtn');
    // Adds the click event
    apodBtn.addEventListener('click', ()=> {
        setState('apod');
        goToTop();
    });
    curiosityBtn.addEventListener('click', ()=> {
        setState(rovers.get(0));
        goToTop();
    });
    oportunityBtn.addEventListener('click', ()=> {
        setState(rovers.get(1));
        goToTop();
    });
    spiritBtn.addEventListener('click', ()=> {
        setState(rovers.get(2));
        goToTop();
    });
}

// updates the store with data from onclick event
const getState = (data) => {
    store = Object.assign(store, data)
    renderContent(store);
}
// renders content to app
const renderContent = (state)=> {
    // Renders the content acording to the data in the current state
    let data = state.data.data;
    let content = document.querySelector('.content')
    content.innerHTML = ''
    // If the data is apod return the image of the day
    if (data && !data.latest_photos) {
        let apodImage = document.createElement('div')
        apodImage.innerHTML = ImageOfTheDay(data)
        content.appendChild(apodImage)
    }
    // If the data is for a rover return the latest photos 
    if (data.latest_photos) {
        let roverData = document.createElement('div')
        roverData.innerHTML = getRoverData(data)
        content.appendChild(roverData)

    }
}
// Here is getting the content for final display
// If there is no content then getContent is set to 'apod'
const getContent = (store)=> {
    if (!store) {
        setState('apod');
    }
}
// ------------------------------------------------------  COMPONENTS

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // check if the photo is not available for the given date
    if (!apod || apod.code === 404) return `<p>${(apod) ? apod.msg : null} for the Astronomy Picture of the day. Please try again later</p>`
    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <br>
            <div class='text-light'>
                <h1>Astronomy Image of the day</h1>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                <img src="${apod.url}" class="img-fluid" alt="Responsive image"/>
                <p><br>${apod.explanation}</p>
            </div>
        `)
    }
}
// Renders the rover data requested from the click event 
const getRoverData = (data)=> {
    let rover = data.latest_photos[0].rover
    let roverPhotos = data.latest_photos
    return `
        <div class='list-group'>
            <ul class='list-group-item bg-dark text-light'>
                <h5> Rover name: ${rover.name} </h5>
                <h5> Launch date: ${rover.launch_date} </h5>
                <h5> Landing date: ${rover.landing_date} </h5>
                <h5> Status: ${rover.status} </h5>
            </ul>
        </div>
        <div class='list-group'> 
            <ul class='list-group-item bg-dark text-light'>
                <h2>Most Recent Photos from: ${data.latest_photos[0].earth_date}</h2><br>
                ${roverPhotoSrc(roverPhotos)}
            </ul>
        </div>
    `
}
// creates a new array for the photo img src and camera information
const roverPhotoSrc = (roverPhotos)=> {
    return roverPhotoArray = roverPhotos.map(photo => {
        return `<div>
                    <img src='${photo.img_src}' class="img-fluid" alt="Responsive image"/>
                    <h5>Image taken from: ${photo.camera.full_name}</h5><br><br>
                </div>
            `
    }).join('')
}
// ------------------------------------------------------  API CALLS

// sets the state of the content
const setState = (state)=> {
    fetch(`/${state}`)
    .then(res => res.json())
    .then(data => getState({data}))
}

