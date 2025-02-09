let guildGp;
let undeployedGP;
let guildPreload;

const planets = [
    {name: "Mustafar", preload: 116406250, star: 248333333, completed: false, side: "dark"},
    {name: "Corellia", preload: , star: , completed: false, side: "neutral"}
]

function setGuildInfo()
{
    guildGp = Number(document.querySelector("#guild-gp").value);
    undeployedGP = Number(document.querySelector("#undeployed").value);
    guildPreload = Number(document.querySelector("#preload").value);
    for(let i = 0; i<planets.length; i++)
    {
        planets[i].preload -= guildPreload;
    }
}
function calculate()
{
    setGuildInfo();
    let phaseNum = 1;
    // while(phaseNum <= 6)
    // {

    // }
}

document.querySelector("#calculate").addEventListener("click", calculate);
