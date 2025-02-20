import {planets} from "./planets.js"
function displayPlanetInfo(planet)
{
    console.log(planet.name);
    const textbox = document.querySelector(".planetInfo");
    textbox.querySelector("#planetName").textContent = planet.name;
    textbox.querySelector("#oneStar").textContent = planet.preload.toString().replace(/(?<=\d)(?=(\d{3})+(?!\d))/g, ",");
    textbox.querySelector("#twoStar").textContent = planet.twoStar.toString().replace(/(?<=\d)(?=(\d{3})+(?!\d))/g, ",");
    textbox.querySelector("#threeStar").textContent = planet.star.toString().replace(/(?<=\d)(?=(\d{3})+(?!\d))/g, ",");
    textbox.style.top = (parseFloat(window.getComputedStyle(document.querySelector(`#${planet.name.replace(/\s/g, '-')}`)).getPropertyValue("top").replace("px", "")) + 37) + "px";
    textbox.style.left = (parseFloat(window.getComputedStyle(document.querySelector(`#${planet.name.replace(/\s/g, '-')}`)).getPropertyValue("left").replace("px", "")) + 37) +"px";
    if(planet.side === "neutral")
    {
        textbox.querySelector("#planetName").style.color = "#3aac2d";
    } else if (planet.side === "light")
    {
        textbox.querySelector("#planetName").style.color = "#48b0fa";
    } else if(planet.side === "dark") {
        textbox.querySelector("#planetName").style.color = "#dd1e2d";
    } else {
        textbox.querySelector("#planetName").style.color = "#ffa02b";
    }
    textbox.style.height = textbox.scrollHeight + "px";
}

function createLines(images, side)
{
    let topValues = []
    let leftValues = [];
    let lines = [];
    images.forEach(image => {
        const imageProperties = window.getComputedStyle(image);
        topValues.push(parseFloat(imageProperties.getPropertyValue("top").replace("px", "")) + parseFloat(imageProperties.getPropertyValue("height").replace("px", ""))/2 +"px");
        leftValues.push(parseFloat(imageProperties.getPropertyValue("left")) + parseFloat(imageProperties.getPropertyValue("height").replace("px", ""))/2 +"px");
    });
    for(let i = 0; i<topValues.length-1; i++)
    {
        lines.push(`<line x1="${leftValues[i]}" y1="${topValues[i]}" x2="${leftValues[i+1]}" y2="${topValues[i+1]}" class="${side}"></line>`);
    }
    document.querySelector(".lines").innerHTML += lines.join("\n");
}
function makeAllLines() {
    const svg = document.querySelector((".lines"));
    svg.innerHTML = "";
    createLines([...document.querySelectorAll(".map-planets img")].filter(image => {
        const planetName = image.id.replace(/-/g, " ");
        console.log(planetName);
        const planet = planets.find(p => p.name === planetName);// Find the planet by name
        return planet && planet.side === "dark";
    }), "dark");
    createLines([...document.querySelectorAll(".map-planets img")].filter(image => {
        const planetName = image.id.replace(/-/g, " ");
        console.log(planetName);
        const planet = planets.find(p => p.name === planetName);// Find the planet by name
        return planet && planet.side === "light";
    }), "light");
    createLines([...document.querySelectorAll(".map-planets img")].filter(image => {
        const planetName = image.id.replace(/-/g, " ");
        console.log(planetName);
        const planet = planets.find(p => p.name === planetName);// Find the planet by name
        return planet && planet.side === "neutral";
    }), "neutral");
    createLines([document.querySelector("#Mandalore"), document.querySelector("#Tatooine")], "bonus");
    createLines([document.querySelector("#Bracca"), document.querySelector("#Zeffo")], "bonus");
}


makeAllLines();
document.querySelectorAll(".map-planets img").forEach(image => {
    image.addEventListener("mouseover", function() {
        const planetId = image.id;
        const planet = planets.find(p => p.name.replaceAll(/\s/g, '-') === planetId);

        if (planet) {
            displayPlanetInfo(planet);
        }
    });
});
document.querySelectorAll(".map-planets img").forEach(image => {image.addEventListener("mouseout", function() {
    const textbox = document.querySelector(".planetInfo");
    textbox.style.height = 0 + "px";
})})

document.querySelector(".planetInfo").addEventListener("mouseover", function() {
    const textbox = document.querySelector(".planetInfo");
    textbox.style.height = textbox.scrollHeight + "px";
});

document.querySelector(".planetInfo").addEventListener("mouseout",function() {
    const textbox = document.querySelector(".planetInfo");
    textbox.style.height = 0 + "px";
});

window.addEventListener("resize", makeAllLines);