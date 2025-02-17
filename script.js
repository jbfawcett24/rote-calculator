let guildInfo =
    {
        GP: 0,
        undeployed: 0,
        preload: 0,
        bonusPlanets: []
    }

const planets = [
    {name: "Mustafar", preload: 116406250, star: 248333333, completed: false, preloaded: false, side: "dark", deployed: 0, twoStar: 186250000, stars: 0},
    {name: "Corellia", preload: 111718750, star: 238333333, completed: false, preloaded: false, side: "neutral", deployed: 0, twoStar: 178750000, stars: 0},
    {name: "Coruscant", preload: 116406250, star: 248333333, completed: false, preloaded: false, side: "light", deployed: 0, twoStar: 186250000, stars: 0},
    {name: "Geonosis", preload: 148125000, star: 316000000, completed: false, preloaded: false, side: "dark", deployed: 0, twoStar: 237000000, stars: 0},
    {name: "Felucia", preload: 148125000, star: 316000000, completed: false, preloaded: false, side: "neutral", deployed: 0, twoStar: 237000000, stars: 0},
    {name: "Bracca", preload: 142265625, star: 303500000, completed: false, preloaded: false, side: "light", deployed: 0, twoStar: 227625000, stars: 0},
    {name: "Zeffo", preload: 143589583, twoStar: 229743333, star: 287179167, completed: false, preloaded: false, side: "bonus", deployed: 0, stars: 0},
    {name: "Dathomir", preload: 158960938, star: 339116667, completed: false, preloaded: false, side: "dark", deployed: 0, twoStar: 254337500, stars: 0},
    {name: "Tatooine", preload: 190953125, star: 407366667, completed: false, preloaded: false, side: "neutral", deployed: 0, twoStar: 305525000, stars: 0},
    {name: "Kashyyyk", preload: 190953125, star: 407366667, completed: false, preloaded: false, side: "light", deployed: 0, twoStar: 305525000, stars: 0},
    {name: "Haven Medical Station", preload: 235143105, star: 500304479, completed: false, preloaded: false, side: "dark", deployed: 0, twoStar: 229743333, stars: 0},
    {name: "Kessel", preload: 235143105, twoStar: 400243583, star: 500304479, completed: false, preloaded: false, side: "neutral", deployed: 0, stars: 0},
    {name: "Lothal", preload: 246742558, twoStar: 419987333, star: 524984167, completed: false, preloaded: false, side: "light", deployed: 0, stars: 0},
    {name: "Malachor", preload: 341250768, twoStar: 620455942, star: 729948167, completed: false, preloaded: false, side: "dark", deployed: 0, stars: 0},
    {name: "Vandor", preload: 341250768, twoStar: 620455942, star: 729948167, completed: false, preloaded: false, side: "neutral", deployed: 0, stars: 0},
    {name: "Ring of Kafrene", preload: 341250768, twoStar: 620455942, star: 729948167, completed: false, preloaded: false, side: "light", deployed: 0, stars: 0},
    {name: "Death Star", preload: 582632425, twoStar: 1059331682, star: 1246272567, completed: false, preloaded: false, side: "dark", deployed: 0, stars: 0},
    {name: "Hoth", preload: 582632425, twoStar: 1059331682, star: 1246272567, completed: false, preloaded: false, side: "neutral", deployed: 0, stars: 0},
    {name: "Scarif", preload: 555710999, twoStar: 1010383635, star: 1188686629, completed: false, preloaded: false, side: "light", deployed: 0, stars: 0},
]


let totalStars = 0;

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
        console.log(planetsList[i].stars);
        if(planetsList[i].stars === 1)
        {
            orders.push("⭐ 1 star");
            console.log("it is one star");
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
    const bonusInfo = document.querySelectorAll("#bonusInfo input[type='checkbox']:checked");
    const selectedBonuses = Array.from(bonusInfo).map(checkbox => checkbox.name);
    console.log(selectedBonuses);
    guildInfo.GP = document.querySelector("#guildGP").valueAsNumber;
    guildInfo.undeployed = document.querySelector("#undeployed").valueAsNumber;
    guildInfo.preload = document.querySelector("#preload").valueAsNumber;
    for(let i = 0; i < planets.length; i++)
    {
        planets[i].preload -= guildInfo.preload;
    }
}
function calculate(e)
{
    e.preventDefault();
    document.querySelector('button').classList.add("hide");
    setGuildInfo();
    let phaseNum = 1;
    while (phaseNum <= 6) {
        let outOfGP = false;
        let availablePlanets = planets.filter(p => p.completed === false && ((p.side === "bonus" && guildInfo.bonusPlanets.includes(p.name)) || p.side !== "bonus"));
        let phasePlanets = [];
        let tempGuildGP = guildInfo.GP - guildInfo.undeployed;
        for (let i = 0; i < 3; i++) {
            if (!availablePlanets[i].preloaded && (availablePlanets[i].star-availablePlanets[i].deployed) <= tempGuildGP) {
                tempGuildGP -= (availablePlanets[i].star-availablePlanets[i].deployed);
                phasePlanets.push(availablePlanets[i]);
                phasePlanets[phasePlanets.length - 1].completed = true;
                phasePlanets[phasePlanets.length - 1].preloaded = true;
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
                            console.log(`Deployed: ${planets[j].deployed} Needed for one star: ${availablePlanets[i].preload + guildInfo.preload}`);
                            if(planets[j].deployed >= availablePlanets[i].twoStar) {
                                availablePlanets[i].stars = 2;
                            } else if(planets[j].deployed >= (availablePlanets[i].preload+guildInfo.preload)) {
                                console.log("should be one star");
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
}

document.querySelector("#calculate").addEventListener("click", calculate);
