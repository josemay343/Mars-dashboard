let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    // roverManifest: '',
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod } = state

    return `
        <header></header>
        <main>
            ${Greeting(state.user.name)}
            <section>
                <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                ${ImageOfTheDay(apod)}
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (!apod.image) {
        return console.log('Data not available')
    } else if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}
const roverInfo = (rovers) => {
    return rovers[0]
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = async (state) => {
    let { apod } = state

    const data = await fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
        console.log(store)
    return data
    
}

// Rovers API call

const getRoverManifest = async (state) => {
    let { roverManifest } = state
    // let { rovers } = state
    rover = roverInfo(state.rovers)
    const data = await fetch(`http://localhost:3000/roverInfo/${rover}`)
        .then(res => res.json())
        .then(roverManifest => updateStore(store, { roverManifest }))
        console.log(store)
    return data
}

const getRoverPhotos = async (state) => {
    let { roverManifest } = state
    // let { rovers } = state
    rover = roverInfo(state.rovers)
    const data = await fetch(`http://localhost:3000/roverPhotos/${rover}`)
        .then(res => res.json())
        .then(photos => updateStore(store, { photos }))
        console.log(store)
    return data
}

getRoverManifest(store)
getRoverPhotos(store)