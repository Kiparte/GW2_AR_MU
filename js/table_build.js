
/*function getJson() {
  fetch("../results/results2022_32.json")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  } .then(function (obj) {
    document.getElementById("test_json").innerHTML = obj[1]["idWorld"];
  } .catch(function(error) {
    console.error("Problem with json retrieving");
  })
  ) 
  );
}*/

async function loadDatas() {
  const response = await fetch('./results/results2022_32.json');

  const datas = await response.json();

  function mouseClick(e) {
    results.innerHTML="";
    let sk = e.target.skirmish;
    if (sk.toString() in datas) {
      ebg = document.createElement("div");
      ebg.innerHTML = "EBG : <ul> <li> Ratio : " + Math.round(datas[sk]["Center"]["skirmishRatio"] * 100)/100 + " </li> <li> Kills : " 
      + datas[sk]["Center"]["skirmishKills"] + " </li> <li> Deaths : " 
      + datas[sk]["Center"]["skirmishDeaths"] + " </li> </ul";
      results.appendChild(ebg);

      greenH = document.createElement("div");
      greenH.innerHTML = "Green Home : <ul> <li> Ratio : " + Math.round(datas[sk]["GreenHome"]["skirmishRatio"] * 100)/100 + " </li> <li> Kills : " 
      + datas[sk]["GreenHome"]["skirmishKills"] + " </li> <li> Deaths : " 
      + datas[sk]["GreenHome"]["skirmishDeaths"] + " </li> </ul";
      results.appendChild(greenH);

      blueH = document.createElement("div");
      blueH.innerHTML = "Blue Home : <ul> <li> Ratio : " + Math.round(datas[sk]["BlueHome"]["skirmishRatio"] * 100)/100 + " </li> <li> Kills : " 
      + datas[sk]["BlueHome"]["skirmishKills"] + " </li> <li> Deaths : " 
      + datas[sk]["BlueHome"]["skirmishDeaths"] + " </li> </ul";
      results.appendChild(blueH);

      redH = document.createElement("div");
      redH.innerHTML = "Red Home : <ul> <li> Ratio : " + Math.round(datas[sk]["RedHome"]["skirmishRatio"] * 100)/100 + " </li> <li> Kills : " 
      + datas[sk]["RedHome"]["skirmishKills"] + " </li> <li> Deaths : " 
      + datas[sk]["RedHome"]["skirmishDeaths"] + " </li> </ul";
      results.appendChild(redH);
    }
  }

  for(let i = 1 ; i <= 84 ; i++ ) {
    var color_premier ="none";
    var color_deuxieme ="none";
    if (i.toString() in datas) {
      if ("skirmishScore" in datas[i.toString()]) {
        for (const [key, value] of Object.entries(datas[i.toString()]["skirmishScore"])) {
          if (key == "1") {
            color_premier= value;
          }
          if (key == "2") {
            color_deuxieme= value;
          }
        }
      }
    }

    current = document.getElementById(i.toString());
    prems = document.createElement('td');
    prems.innerHTML="1";
    prems.classList.add("premier");
    prems.classList.add(color_premier);
    prems.skirmish=i.toString()
    current.appendChild(prems);
    //prems.addEventListener('click', mouseClick);

    deuz = document.createElement('td');
    deuz.innerHTML="2";
    deuz.classList.add("deuxieme");
    deuz.classList.add(color_deuxieme);
    deuz.skirmish=i.toString()
    current.appendChild(deuz);
    //prems.addEventListener('click', mouseClick);
  }

  for (let i = 1 ; i <= 84 ; i++) {
    current = document.getElementById(i.toString());
    current.skirmish=i.toString();
    current.addEventListener('click', mouseClick);
  }



}

for (let i = 0 ; i < 12 ; i++) {
    currentRow = document.getElementById("row" + i);
    for(let j  = 0 ; j < 9 ; j++) {
      if(j == 0) {
        currentRow.innerHTML = currentRow.innerHTML + "<th scope='row'>" + i*2  + "-" + ((i*2) + 2)  + " </td>"
      } else if ( (j==1 && i <= 9) || (j == 8 && i > 9) ) {
        currentRow.innerHTML = currentRow.innerHTML + "<td class = 'none'></td>"
      } else  
      {
        currentRow.innerHTML = currentRow.innerHTML + "<td id=" + (((i + 1) + ((j-1) * 12)) - 10)   + " class = 'skirmish'> </td>"
      }
        
    }
    
}

loadDatas()