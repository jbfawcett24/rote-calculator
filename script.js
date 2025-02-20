let guildInfo =
    {
        GP: 0,
        undeployed: 0,
        preload: 0,
        bonusPlanets: []
    }

import {planets} from "./planets.js";

let totalStars = 0;
let full = true;
let singlePhasePlanets = [];

function orderTemplate(planets, phaseNum, phaseOrder)
{
    return `<details class="order">
                        <summary>Phase ${phaseNum}</summary>
                        <section class="planets">
                            <h3 class = "dark">${planets[0].name}</h3>
                            <p>${planets[0].order}</p>
                            <h3 class = "neutral">${planets[1].name}</h3>
                            <p>${planets[1].order}</p>
                            <h3 class = "light">${planets[2].name}</h3>
                            <p>${planets[2].order}</p>
                        </section>
                        <h3>Missions</h3>
                        <p>${findMissions(planets)}</p>
                        <h3>Deployment Guide</h3>
                        <p>${phaseOrder}</p>
                    </details>`
}
function planetOrder(planetsList)
{
    let outOfGP = false;
    for(let i = 0; i < planetsList.length; i++) {
        //console.log(planetsList[i].stars);
        if(planetsList[i].stars === 1)
        {
            planetsList[i].order = "⭐ 1 star";
            //console.log("it is one star");
            totalStars ++;
        } else if(planetsList[i].stars === 2)
        {
            planetsList[i].order = "⭐⭐ 2 stars";
            totalStars += 2;
        } else if (planetsList[i].completed === true) {
            planetsList[i].order = "⭐⭐⭐ 3 stars";
            totalStars += 3;
        } else if (planetsList[i].preloaded === true) {
            planetsList[i].order = "Preload to " + planetsList[i].preload;
        } else {
            if(!outOfGP) {
                planetsList[i].order = planetsList[i].deployed;
                outOfGP = true;
            }
            else {
                planetsList[i].order = "0";
            }
        }
    }
    console.log(planetsList);
    return planetsList;
}
function createPhaseOrder(planets)
{
    let phaseOrders =  `Deploy in `;
    for(let i = 0; i<planets.length; i++)
    {
        let then = true;
        if(planets[i].completed === true)
        {
            phaseOrders+= `${planets[i].name} to 3 stars`;
        } else if(planets[i].preloaded === true)
        {
            phaseOrders += `${planets[i].name} to ${Math.trunc(planets[1].preload/1000000)} Mil`;
        } else {
            then = false
            if(planets[i].deployed > 0) {
                phaseOrders += `${planets[i].name}`;
                if (planets[i].stars > 0) {
                    phaseOrders += `to ${planets[i].stars} `;
                    if (planets[i].stars === 1) {
                        phaseOrders += `star`;
                    } else {
                        phaseOrders += "stars";
                    }
                }
            }
        }
        if(then === true)
        {
            phaseOrders += ", then "
        }
    }
    return phaseOrders;
}

function findMissions(planets)
{
    if(planets.some(planet => planet.name === "Tatooine"))
    {
        return "Do the Reva mission if possible"
    } else {
        return "No missions are required this phase";
    }
}
function sortPhasePlanets(planets)
{
    let tempPlanets = []
    for(let i = 0; i < planets.length; i++)
    {
        if(planets[i].side === "dark")
        {
            tempPlanets.push(planets[i]);
            break;
        }
    }
    for(let i = 0; i < planets.length; i++)
    {
        if(planets[i].side === "neutral")
        {
            tempPlanets.push(planets[i]);
            break;
        }
    }
    for(let i = 0; i < planets.length; i++)
    {
        if(planets[i].side === "light")
        {
            tempPlanets.push(planets[i]);
            break;
        }
    }
    return tempPlanets;
}
function setGuildInfo()
{
    //const bonusInfo = document.querySelectorAll("#bonusInfo input[type='checkbox']:checked");
    //const selectedBonuses = Array.from(bonusInfo).map(checkbox => checkbox.name);
    //console.log(selectedBonuses);
    guildInfo.GP = document.querySelector("#guildGP").valueAsNumber;
    guildInfo.undeployed = document.querySelector("#undeployed").valueAsNumber;
    guildInfo.preload = document.querySelector("#preload").valueAsNumber;
    for(let i = 0; i < planets.length; i++)
    {
        planets[i].preload -= guildInfo.preload;
    }
}
function calculate(singlePhase)
{
    //document.querySelector('button').classList.add("hide");
    document.querySelector(".orders").innerHTML = `<h1 class = "heading">TB Orders</h1>`;
    totalStars = 0;
    if(singlePhase === 1) {
        planets.forEach(planet => {
            planet.preloaded = false;
            planet.deployed = 0;
            planet.stars = 0;
            planet.completed = false;
        });
    }
    setGuildInfo();
    let phaseNum;
    let endPhase;
    if(full === true)
    {
        phaseNum = 1;
        endPhase = 6;
    } else {
        phaseNum = singlePhase;
        endPhase = singlePhase;
    }
    while (phaseNum <= endPhase) {
        let outOfGP = false;
        let availablePlanets;
        if(full === true)
        {
            availablePlanets = planets.filter(p => p.completed === false && ((p.side === "bonus" && guildInfo.bonusPlanets.includes(p.name)) || p.side !== "bonus"));
        } else {
            availablePlanets = singlePhasePlanets;
        }
        let phasePlanets = [];
        let tempGuildGP = guildInfo.GP - guildInfo.undeployed;
        for (let i = 0; i < 3; i++) {
            if (!availablePlanets[i].preloaded && (availablePlanets[i].star-availablePlanets[i].deployed) <= tempGuildGP) {
                tempGuildGP -= (availablePlanets[i].star-availablePlanets[i].deployed);
                console.log(availablePlanets[i].star-availablePlanets[i].deployed);
                console.log(tempGuildGP);
                phasePlanets.push(availablePlanets[i]);
                phasePlanets[phasePlanets.length - 1].completed = true;
                phasePlanets[phasePlanets.length - 1].preloaded = true;
                console.log(`${availablePlanets[i].name} is 3 starred`)
                for (let j = 0; j < planets.length; j++) {
                    if (planets[j].name === availablePlanets[i].name) {
                        planets[j].completed = true;
                        planets[j].preloaded = true;
                        break;
                    }
                }
            } else if (availablePlanets[i].preloaded && (availablePlanets[i].star - availablePlanets[i].preload) <= tempGuildGP) {
                tempGuildGP -= (availablePlanets[i].star - availablePlanets[i].preload);
                phasePlanets.push(availablePlanets[i]);
                phasePlanets[phasePlanets.length - 1].completed = true;
                for (let j = 0; j < planets.length; j++) {
                    if (planets[j].name === availablePlanets[i].name) {
                        planets[j].completed = true;
                        break;
                    }
                }
            } else if (!availablePlanets[i].preloaded && (availablePlanets[i].preload - availablePlanets[i].deployed) <= tempGuildGP) {
                if(phaseNum !== 6) {
                    tempGuildGP -= (availablePlanets[i].preload - availablePlanets[i].deployed);
                    phasePlanets.push(availablePlanets[i]);
                    phasePlanets[phasePlanets.length - 1].preloaded = true;
                    for (let j = 0; j < planets.length; j++) {
                        if (planets[j].name === availablePlanets[i].name) {
                            planets[j].preloaded = true;
                            planets[j].deployed = 0
                            break;
                        }
                    }
                } else {
                    phasePlanets.push(availablePlanets[i]);
                    for(let j = 0; j < planets.length; j++) {
                        if(planets[j].name === availablePlanets[i].name) {
                            planets[j].deployed = tempGuildGP;
                            //console.log(`Deployed: ${planets[j].deployed} Needed for one star: ${availablePlanets[i].preload + guildInfo.preload}`);
                            if(planets[j].deployed >= availablePlanets[i].twoStar) {
                                availablePlanets[i].stars = 2;
                            } else if(planets[j].deployed >= (availablePlanets[i].preload+guildInfo.preload)) {
                                //console.log("should be one star");
                                availablePlanets[i].stars = 1;
                            }
                            tempGuildGP = 0;
                        }
                    }
                }
            } else {
                if (!outOfGP) {
                    for (let j = 0; j < planets.length; j++) {
                        if(planets[j].name === availablePlanets[i].name) {
                            planets[j].deployed += tempGuildGP;
                            tempGuildGP = 0;
                            break;
                        }
                    }
                    outOfGP = true;
                }
                phasePlanets.push(availablePlanets[i]);
            }
        }
        const phaseOrders = createPhaseOrder(phasePlanets);
        phasePlanets = planetOrder(phasePlanets);
        phasePlanets = sortPhasePlanets(phasePlanets);
        const html = orderTemplate(phasePlanets, phaseNum, phaseOrders);
        document.querySelector('.heading').innerText = `TB Orders - ${totalStars} Stars`
        document.querySelector('.orders').innerHTML += html;
        phaseNum++;
    }
    planets.forEach(planet => planet.preload += guildInfo.preload);
}

function switchMode(e)
{
    e.preventDefault();
    document.querySelector(".singlePhase").classList.toggle("hide");
    document.querySelector("#bonusInfo").classList.toggle("hide");
    if(full === true) {
        document.querySelector("#switch").textContent = "Switch to Full Event Planning";
    } else {
        document.querySelector("#switch").textContent = "Switch to Single Phase Planning";
    }
    full = !full;
}

function submitData(e)
{
    e.preventDefault();
    let singlePhase = document.querySelector("#phaseNum").value;
    if(full === false) {
        singlePhasePlanets.push(planets.find(p => p.name === document.querySelector("#darkside").value));
        singlePhasePlanets.push(planets.find(p => p.name === document.querySelector("#neutral").value));
        singlePhasePlanets.push(planets.find(p => p.name === document.querySelector("#lightside").value));
        console.log(singlePhasePlanets[1]);
        console.log(document.querySelector("#neutralGP").value)
        singlePhasePlanets[0].deployed += parseInt(document.querySelector("#darksideGP").value);
        singlePhasePlanets[1].deployed += parseInt(document.querySelector("#neutralGP").value);
        singlePhasePlanets[2].deployed += parseInt(document.querySelector("#lightsideGP").value);
        singlePhasePlanets.sort((a, b) => b.deployed - a.deployed);
        console.log(singlePhasePlanets[0]);
        calculate(singlePhase);
    } else {
        calculate(1);
    }
}

document.querySelector("#calculate").addEventListener("click", submitData);
document.querySelector("#switch").addEventListener("click", switchMode);

//MAP script

