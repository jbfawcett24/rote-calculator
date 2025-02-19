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

function orderTemplate(planets, phaseNum, orders)
{
    return `<details class="order">
                        <summary>Phase ${phaseNum}</summary>
                        <section class="planets">
                            <h3 class = "dark">${planets[0].name}</h3>
                            <p>${orders[0]}</p>
                            <h3 class = "neutral">${planets[1].name}</h3>
                            <p>${orders[1]}</p>
                            <h3 class = "light">${planets[2].name}</h3>
                            <p>${orders[2]}</p>
                        </section>
                        <h3>Missions</h3>
                        <p>No missions are required this phase</p>
                        <h3>Deployment Guide</h3>
                        <p>Deploy Mustafar to 3 stars, then preload Corellia to 100 Mil, then Coruscant</p>
                    </details>`
}
function planetOrder(planetsList)
{
    let outOfGP = false;
    let orders = [];
    for(let i = 0; i < planetsList.length; i++) {
        //console.log(planetsList[i].stars);
        if(planetsList[i].stars === 1)
        {
            orders.push("⭐ 1 star");
            //console.log("it is one star");
            totalStars ++;
        } else if(planetsList[i].stars === 2)
        {
            orders.push("⭐⭐ 2 stars");
            totalStars += 2;
        } else if (planetsList[i].completed === true) {
            orders.push("⭐⭐⭐ 3 stars");
            totalStars += 3;
        } else if (planetsList[i].preloaded === true) {
            orders.push("Preload to " + planetsList[i].preload);
        } else {
            if(!outOfGP) {
                orders.push(planetsList[i].deployed);
                outOfGP = true;
            }
            else {
                orders.push(0);
            }
        }
    }
    return orders;
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
    document.querySelector('button').classList.add("hide");
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
        phasePlanets = sortPhasePlanets(phasePlanets);
        const orders = planetOrder(phasePlanets);
        const html = orderTemplate(phasePlanets, phaseNum, orders);
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
        singlePhasePlanets[0].deployed = parseInt(document.querySelector("#darksideGP").value);
        singlePhasePlanets[1].deployed = parseInt(document.querySelector("#neutralGP").value);
        singlePhasePlanets[2].deployed = parseInt(document.querySelector("#lightsideGP").value);
        singlePhasePlanets.sort((a, b) => b.deployed - a.deployed);
        console.log(singlePhasePlanets[0].name);
        calculate(singlePhase);
    } else {
        calculate(1);
    }
}

document.querySelector("#calculate").addEventListener("click", submitData);
document.querySelector("#switch").addEventListener("click", switchMode);

//MAP script

