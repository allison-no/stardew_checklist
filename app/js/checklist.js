window.onload = function() {
    
    if (!(window.File && window.FileReader)) {
		document.getElementById('out').innerHTML = '<span class="error">Fatal Error with API</span>';
		return;
	}

    function cap(string){
        return string[0].toUpperCase() + string.slice(1).toLowerCase();
    }

    function readBundles(saveXML, playerSave) {
        var j = 0;
        var i;
        $(saveXML).find('bundles > item').each(function() {
            bundleNum = $(this).find('key > int').text();
            i = 1;
            $(this).find('ArrayOfBoolean > boolean').each(function () {
				if ($(this).text() === 'true' && i <= playerSave.Bundles[bundleNum][0].options) {
					playerSave.Bundles[bundleNum][i].completed = true;
                    j++;
				}
                i++;
			});
            if (j === playerSave.Bundles[bundleNum][0].options) j = playerSave.Bundles[bundleNum][0].needed;
            playerSave.Bundles[bundleNum][0].have = j;
            playerSave.totalDonated += j;
            j = 0;
        });
    }

    function readBuildings(saveXML, playerSave) {
        var type = "";
        $(saveXML).find("[" + playerSave.xsiOrp3 + "\\:type='Farm'] Building").each( function() {
            type = ($(this).find('buildingType')).text();
            if (type === "Coop" || type === "Big Coop" || type === "Deluxe Coop") {
                if (playerSave.buildings["coop"] === 0) playerSave.buildings["coop"] = playerSave.buildings[type];
                else if (type === "Deluxe Coop") playerSave.buildings["coop"] = playerSave.buildings[type];
                else if (type === "Big Coop" && playerSave.buildings["coop"] === 1) playerSave.buildings["coop"] = playerSave.buildings[type];;
            }
            else if (type === "Barn" || type === "Big Barn" || type === "Deluxe Barn") {
                if (playerSave.buildings["barn"] === 0) playerSave.buildings["barn"] = playerSave.buildings[type];
                else if (type === "Deluxe Barn") playerSave.buildings["barn"] = playerSave.buildings[type];
                else if (type === "Big Barn" && playerSave.buildings["barn"] === 1) playerSave.buildings["barn"] = playerSave.buildings[type];
            }
        });
    }

    function sum(playerSave) {
        output = "";
        output += '<div class="summary" id="sum">';
        output += '<h2>Summary</h2>';
        output += '<p>Hello, ' + cap(playerSave.name) + ' of ' + cap(playerSave.farmName) + ' farm!'
        output += '<br>Day ' + playerSave.day + ' of ' + cap(playerSave.season) +'</p>'
        output += '<img src="./app/images/' +playerSave.season + '.png" class = "img"">'
        output += '<p style="font-size: 15px; margin-bottom: 5px">Community Center Progress:</p>'
        var percent = Math.round((playerSave.totalDonated * 100) / 110);
        output += '<div class="bar_block">';
        output += '<div id="progress_bar"> <div id ="bar" style="width:' + percent + '%"></div> </div></div>';
        output += '<div class = "percentage">' + percent + '%</div>';
        output += '</div>';
        return output;
    }

    function springCard(playerSave, heading) {
        output = "";
        output += '<h2>' + heading + '</h2> <p>Farming and Foraging:</p> <div id="grid">';
        for (let i = 0; i < 9; ++i) { //TODO: add links to wiki
            output += '<div class="box">'
            var index = playerSave.springFarm[i];
            output += '<img src="./app/images/' + index.id + '_img.png"';
            if (playerSave.Bundles[index.bundle][index.ex].completed == false) {
                output += 'class = "not_done">'
                output += '<br>' + playerSave.objects[index.id] + '</div>';
            }
            else {
                output += 'class = "done">';
                output += '<br><p>' + playerSave.objects[index.id] + '</p></div>';
            }
            
        }
        output += '</div>';

        output += '<p>Fishing:</p><div id="grid">';
        for (let i = 0; i < 6; ++i) { 
            output += '<div class="box">'
            var index = playerSave.springFish[i];
            output += '<img src="./app/images/' + index.id + '_img.png"';
            if (playerSave.Bundles[index.bundle][index.ex].completed == false) {
                output += 'class = "not_done">'
                output += '<br>' + playerSave.objects[index.id] + '</div>';
            }
            else {
                output += 'class = "done">';
                output += '<br><p>' + playerSave.objects[index.id] + '</p></div>';
            }
        }
        output += '</div>';

        output += '<p>Other:</p> <div id = "grid">';
        // axe
        if (playerSave.axe == 0) {
            output += '<div class="box"> <img src="./app/images/axe1_img.png" class = "not_done"> <br>';
            output += playerSave.objects['axe1'] + '</div>';
        }
        else {
            output += '<div class="box"> <img src="./app/images/axe1_img.png" class = "done"> <br>';
            output += '<p>' +playerSave.objects['axe1'] + '</p></div>';
        }
        // pickaxe
        if (playerSave.pickaxe == 0) {
            output += '<div class="box"> <img src="./app/images/pickaxe1_img.png" class = "not_done"> <br>';
            output += playerSave.objects['pickaxe1'] + '</div>';
        }
        else {
            output += '<div class="box"> <img src="./app/images/pickaxe1_img.png" class = "done"> <br>';
            output += '<p>' + playerSave.objects['pickaxe1'] + '</p></div>';
        }
        // coop
        if (playerSave.buildings["coop"] == 0) {
            output += '<div class="box"> <img src="./app/images/coop1_img.png" class = "not_done"> <br>';
            output += playerSave.objects['coop1'] + '</div>';
        }
        else {
            output += '<div class="box"> <img src="./app/images/coop1_img.png" class = "done"> <br>';
            output += '<p>' + playerSave.objects['coop1'] + '</p></div>';
        }
        // barn
        if (playerSave.buildings["barn"] == 0) {
            output += '<div class="box"> <img src="./app/images/barn1_img.png" class = "not_done"> <br>';
            output += playerSave.objects['barn1'] + '</div>';
        }
        else {
            output += '<div class="box"> <img src="./app/images/barn1_img.png" class = "done"> <br>';
            output += '<p>' + playerSave.objects['barn1'] + '</p></div>';
        }
        output += '</div>';
        return output;
    }

    function summerCard(playerSave, heading, full) {
        output = "";
        output += '<h2>' + heading + '</h2> <p>Farming and Foraging:</p> <div id="grid">';
        for (let i = 0; i < 12; ++i) {//12
            output += '<div class="box">'
            var index = playerSave.summerFarm[i];
            output += '<img src="./app/images/' + index.id + '_img.png"';
            if (playerSave.Bundles[index.bundle][index.ex].completed == false) {
                output += 'class = "not_done">'
                output += '<br>' + playerSave.objects[index.id] + '</div>';
            }
            else {
                output += 'class = "done">';
                output += '<br><p>' + playerSave.objects[index.id] + '</p></div>';
            }
        }
        output += '</div>';

        output += '<p>Fishing:</p><div id="grid">';
        for (let i = 0; i < 7; ++i) { //7
            var index = playerSave.summerFish[i];
            if (index.first || (!index.first && playerSave.Bundles[index.bundle][index.ex].completed == false && !full)) {
                output += '<div class="box">'
                output += '<img src="./app/images/' + index.id + '_img.png"';
                if (playerSave.Bundles[index.bundle][index.ex].completed == false) {
                    output += 'class = "not_done">'
                    output += '<br>' + playerSave.objects[index.id] + '</div>';
                }
                else {
                    output += 'class = "done">';
                    output += '<br><p>' + playerSave.objects[index.id] + '</p></div>';
                }
            }
        }
        output += '</div>';

        output += '<p>Other:</p> <div id = "grid">';
        // axe
        if (full && playerSave.axe < 2) {
            output += '<div class="box"> <img src="./app/images/axe2_img.png" class = "not_done"> <br>';
            output += playerSave.objects['axe2'] + '</div>';
        }
        else if (playerSave.axe < 2) {
            output += '<div class="box"> <img src="./app/images/axe'+ (playerSave.axe + 1) +'_img.png" class = "not_done"> <br>';
            output += playerSave.objects['axe' + (playerSave.axe + 1)] + '</div>';
        }
        else {
            output += '<div class="box"> <img src="./app/images/axe2_img.png" class = "done"> <br>';
            output += '<p>' + playerSave.objects['axe2'] + '</p></div>';
        }
        // pickaxe
        if (full && playerSave.pickaxe < 2) {
            output += '<div class="box"> <img src="./app/images/pickaxe2_img.png" class = "not_done"> <br>';
            output += playerSave.objects['pickaxe2'] + '</div>';
        }
        else if (playerSave.pickaxe < 2) {
            output += '<div class="box"> <img src="./app/images/pickaxe'+ (playerSave.pickaxe + 1) +'_img.png" class = "not_done"> <br>';
            output += playerSave.objects['pickaxe' + (playerSave.pickaxe + 1) ] + '</div>';
        }
        else {
            output += '<div class="box"> <img src="./app/images/pickaxe2_img.png" class = "done"> <br>';
            output += '<p>' + playerSave.objects['pickaxe2'] + '</p></div>';
        }
        // coop
        if (full && playerSave.buildings["coop"] < 2) {
            output += '<div class="box"> <img src="./app/images/coop2_img.png" class = "not_done"> <br>';
            output += playerSave.objects['coop2'] + '</div>';
        }
        else if (playerSave.buildings["coop"] < 2) {
            output += '<div class="box"> <img src="./app/images/coop' + (playerSave.buildings["coop"] + 1) + '_img.png" class = "not_done"> <br>';
            output += playerSave.objects['coop' + (playerSave.buildings["coop"] + 1)] + '</div>';
        }
        else {
            output += '<div class="box"> <img src="./app/images/coop2_img.png" class = "done"> <br>';
            output +='<p>' + playerSave.objects['coop2'] + '</p></div>';
        }
        // barn
        if (full && playerSave.buildings["barn"] < 2) {
            output += '<div class="box"> <img src="./app/images/barn2_img.png" class = "not_done"> <br>';
            output += playerSave.objects['barn2'] + '</div>';
        }
        else if (playerSave.buildings["barn"] < 2) {
            output += '<div class="box"> <img src="./app/images/barn' + (playerSave.buildings["barn"] + 1) + '_img.png" class = "not_done"> <br>';
            output += playerSave.objects['barn' + (playerSave.buildings["barn"] + 1)] + '</div>';
        }
        else {
            output += '<div class="box"> <img src="./app/images/barn2_img.png" class = "done"> <br>';
            output += '<p>'+ playerSave.objects['barn2'] + '</p></div>';
        }
        output += '</div>';
        return output;
    }

    function fallCard(playerSave, heading, full) {
        output = "";
        output += '<h2>' + heading + '</h2> <p>Farming and Foraging:</p> <div id="grid">';

        for (let i = 0; i < 12; ++i) {
            output += '<div class="box">'
            var index = playerSave.fallFarm[i];
            output += '<img src="./app/images/' + index.id + '_img.png"';
            if (playerSave.Bundles[index.bundle][index.ex].completed == false) {
                output += 'class = "not_done">'
                if (index.id == 613) output += '<br>' + playerSave.objects[index.id] + 's x3 </div>';
                else output += '<br>' + playerSave.objects[index.id] + '</div>';
            }
            else {
                output += 'class = "done">';
                if (index.id == 613) output += '<br><p>' + playerSave.objects[index.id] + 's x3</p></div>';
                else output += '<br><p>' + playerSave.objects[index.id] + '</p></div>';
            }   
        }
        output += '</div>';

        output += '<p>Fishing:</p><div id="grid">';
        for (let i = 0; i < 9; ++i) {
            var index = playerSave.fallFish[i];
            if (index.first || (!index.first && playerSave.Bundles[index.bundle][index.ex].completed == false && !full)) {
                output += '<div class="box">'
                output += '<img src="./app/images/' + index.id + '_img.png"';
                if (playerSave.Bundles[index.bundle][index.ex].completed == false) {
                    output += 'class = "not_done">'
                    output += '<br>' + playerSave.objects[index.id] + '</div>';
                }
                else {
                    output += 'class = "done">';
                    output += '<br><p>' + playerSave.objects[index.id] + '</p></div>';
                }
            }
        }
        output += '</div>';

        output += '<p>Other:</p> <div id = "grid">';
        // axe
        if (!full && playerSave.axe < 2) {
            output += '<div class="box"> <img src="./app/images/axe'+ (playerSave.axe + 1) +'_img.png" class = "not_done"> <br>';
            output += playerSave.objects['axe' + (playerSave.axe + 1)] + '</div>';
        }
        // pickaxe
        if (full && playerSave.pickaxe < 3) {
            output += '<div class="box"> <img src="./app/images/pickaxe3_img.png" class = "not_done"> <br>';
            output += playerSave.objects['pickaxe3'] + '</div>';
        }
        else if (playerSave.pickaxe < 3) {
            output += '<div class="box"> <img src="./app/images/pickaxe'+ (playerSave.pickaxe + 1) +'_img.png" class = "not_done"> <br>';
            output += playerSave.objects['pickaxe' + (playerSave.pickaxe + 1) ] + '</div>';
        }
        else {
            output += '<div class="box"> <img src="./app/images/pickaxe3_img.png" class = "done"> <br>';
            output += '<p>' + playerSave.objects['pickaxe3'] + '</p></div>';
        }
        // coop
        if (!full && playerSave.buildings["coop"] < 2) {
            output += '<div class="box"> <img src="./app/images/coop' + (playerSave.buildings["coop"] + 1) + '_img.png" class = "not_done"> <br>';
            output += playerSave.objects['coop' + (playerSave.buildings["coop"] + 1)] + '</div>';
        }
        // barn
        if (full && playerSave.buildings["barn"] < 3) {
            output += '<div class="box"> <img src="./app/images/barn3_img.png" class = "not_done"> <br>';
            output += playerSave.objects['barn3'] + '</div>';
        }
        else if (playerSave.buildings["barn"] < 3) {
            output += '<div class="box"> <img src="./app/images/barn' + (playerSave.buildings["barn"] + 1) + '_img.png" class = "not_done"> <br>';
            output += playerSave.objects['barn' + (playerSave.buildings["barn"] + 1)] + '</div>';
        }
        else {
            output += '<div class="box"> <img src="./app/images/barn3_img.png" class = "done"> <br>';
            output += '<p>' + playerSave.objects['barn3'] + '</p></div>';
        }
        output += '</div>';
        return output;
    }

    function winterCard(playerSave, heading, full) {
        output = "";
        output += '<h2>' + heading + '</h2> <p>Farming and Foraging:</p> <div id="grid">';
        for (let i = 0; i < 6; ++i) {
            output += '<div class="box">'
            var index = playerSave.winterFarm[i];
            output += '<img src="./app/images/' + index.id + '_img.png"';
            if (playerSave.Bundles[index.bundle][index.ex].completed == false) {
                output += 'class = "not_done">'
                output += '<br>' + playerSave.objects[index.id] + '</div>';
            }
            else {
                output += 'class = "done">';
                output += '<br><p>' + playerSave.objects[index.id] + '</p></div>';
            }
        }
        output += '</div>';

        output += '<p>Fishing:</p><div id="grid">';
        var count = 0;
        for (let i = 0; i < 5; ++i) {
            var index = playerSave.winterFish[i];
            if (index.first || (!index.first && playerSave.Bundles[index.bundle][index.ex].completed == false && !full)) {
                count++;
                output += '<div class="box">'
                output += '<img src="./app/images/' + index.id + '_img.png"';
                if (playerSave.Bundles[index.bundle][index.ex].completed == false) {
                    output += 'class = "not_done">'
                    output += '<br>' + playerSave.objects[index.id] + '</div>';
                }
                else {
                    output += 'class = "done">';
                    output += '<br><p>' + playerSave.objects[index.id] + '</p></div>';
                }
            }
        }
        if (count == 0) {
            output += '<p>None :( </p>'
        }
        output += '</div>';

        output += '<p>Other:</p> <div id = "grid">';
        // axe
        if (!full && playerSave.axe < 2) {
            output += '<div class="box"> <img src="./app/images/axe'+ (playerSave.axe + 1) +'_img.png" class = "not_done"> <br>';
            output += playerSave.objects['axe' + (playerSave.axe + 1)] + '</div>';
        }
        // pickaxe
        if (full && playerSave.pickaxe < 4) {
            output += '<div class="box"> <img src="./app/images/pickaxe4_img.png" class = "not_done"> <br>';
            output += playerSave.objects['pickaxe4'] + '</div>';
        }
        else if (playerSave.pickaxe < 4) {
            output += '<div class="box"> <img src="./app/images/pickaxe'+ (playerSave.pickaxe + 1) +'_img.png" class = "not_done"> <br>';
            output += playerSave.objects['pickaxe' + (playerSave.pickaxe + 1)] + '</div>';
        }
        else {
            output += '<div class="box"> <img src="./app/images/pickaxe4_img.png" class = "done"> <br>';
            output += '<p>' + playerSave.objects['pickaxe4'] + '</p></div>';
        }
        // coop
        if (full && playerSave.buildings["coop"] < 3) {
            output += '<div class="box"> <img src="./app/images/coop3_img.png" class = "not_done"> <br>';
            output += playerSave.objects['coop3'] + '</div>';
        }
        else if (playerSave.buildings["coop"] < 3) {
            output += '<div class="box"> <img src="./app/images/coop' + (playerSave.buildings["coop"] + 1) + '_img.png" class = "not_done"> <br>';
            output += playerSave.objects['coop' + (playerSave.buildings["coop"] + 1)] + '</div>';
        }
        else {
            output += '<div class="box"> <img src="./app/images/coop3_img.png" class = "done"> <br>';
            output += '<p>' + playerSave.objects['coop3'] + '</p></div>';
        }
        // barn
        if (!full && playerSave.buildings["barn"] < 3) {
            output += '<div class="box"> <img src="./app/images/barn' + (playerSave.buildings["barn"] + 1) + '_img.png" class = "not_done"> <br>';
            output += playerSave.objects['barn' + (playerSave.buildings["barn"] + 1)] + '</div>';
        }
        output += '</div>';
        return output;
    }

    function anytimeCard(playerSave) {
        output = "";
        output += '<h2>Anytime:</h2> <p>Mining:</p> <div id="grid">';
        for (let i = 0; i < 13; ++i) {
            output += '<div class="box">'
            var index = playerSave.mine[i];
            output += '<img src="./app/images/' + index.id + '_img.png"';
            if (playerSave.Bundles[index.bundle][index.ex].completed == false) {
                output += 'class = "not_done">'
                output += '<br>' + playerSave.objects[index.id] + '</div>';
            }
            else {
                output += 'class = "done">';
                output += '<br><p>' + playerSave.objects[index.id] + '</p></div>';
            }
        }
        output += '</div>';

        output += '<p>Crab Pot:</p> <div id="grid">';
        for (let i = 0; i < 5; ++i) {
            output += '<div class="box">'
            var index = playerSave.crab[i];
            output += '<img src="./app/images/' + index.id + '_img.png"';
            if (playerSave.Bundles[index.bundle][index.ex].completed == false) {
                output += 'class = "not_done">'
                output += '<br>' + playerSave.objects[index.id] + '</div>';
            }
            else {
                output += 'class = "done">';
                output += '<br><p>' + playerSave.objects[index.id] + '</p></div>';
            }
        }
        output += '</div>';

        output += '<p>Fishing:</p> <div id="grid">';
        for (let i = 0; i < 7; ++i) {
            output += '<div class="box">'
            var index = playerSave.anytimeFish[i];
            output += '<img src="./app/images/' + index.id + '_img.png"';
            if (playerSave.Bundles[index.bundle][index.ex].completed == false) {
                output += 'class = "not_done">'
                output += '<br>' + playerSave.objects[index.id] + '</div>';
            }
            else {
                output += 'class = "done">';
                output += '<br><p>' + playerSave.objects[index.id] + '</p></div>';
            }
        }
        output += '</div>';

        output += '<p>Foraging:</p> <div id="grid">';
        for (let i = 0; i < 7; ++i) {
            output += '<div class="box">'
            var index = playerSave.exotic[i];
            output += '<img src="./app/images/' + index.id + '_img.png"';
            if (playerSave.Bundles[index.bundle][index.ex].completed == false) {
                output += 'class = "not_done">'
                output += '<br>' + playerSave.objects[index.id] + '</div>';
            }
            else {
                output += 'class = "done">';
                output += '<br><p>' + playerSave.objects[index.id] + '</p></div>';
            }
        }
        output += '</div>';

        output += '<p>Construction:</p> <div id="grid">';
        for (let i = 0; i < 4; ++i) {
            output += '<div class="box">'
            var index = playerSave.construction[i];
            output += '<img src="./app/images/' + index.id + '_img.png"';
            if (playerSave.Bundles[index.bundle][index.ex].completed == false) {
                output += 'class = "not_done">'
                output += '<br>' + playerSave.objects[index.id] + '</div>';
            }
            else {
                output += 'class = "done">';
                output += '<br><p>' + playerSave.objects[index.id] + '</p></div>';
            }
        }
        output += '</div>';

        output += '<p>Animal Products:</p> <div id="grid">';
        for (let i = 0; i < 7; ++i) {
            output += '<div class="box">'
            var index = playerSave.animals[i];
            output += '<img src="./app/images/' + index.id + '_img.png"';
            if (playerSave.Bundles[index.bundle][index.ex].completed == false) {
                output += 'class = "not_done">'
                output += '<br>' + playerSave.objects[index.id] + '</div>';
            }
            else {
                output += 'class = "done">';
                output += '<br><p>' + playerSave.objects[index.id] + '</p></div>';
            }
        }
        output += '</div>';

        output += '<p>Artisan:</p> <div id="grid">';
        for (let i = 0; i < 6; ++i) {
            output += '<div class="box">'
            var index = playerSave.artisan[i];
            output += '<img src="./app/images/' + index.id + '_img.png"';
            if (playerSave.Bundles[index.bundle][index.ex].completed == false) {
                output += 'class = "not_done">'
                output += '<br>' + playerSave.objects[index.id] + '</div>';
            }
            else {
                output += 'class = "done">';
                output += '<br><p>' + playerSave.objects[index.id] + '</p></div>';
            }
        }
        output += '</div>';

        output += '<p>Bulletin Board:</p> <div id="grid">';
        if(playerSave.house < 1) {
            output += '<div class="box"> <img src="./app/images/909_img.png" class = "not_done">'
            output += '<br>' + playerSave.objects[909] + '</div>';
        }
        else {
            output += '<div class="box"> <img src="./app/images/909_img.png" class = "done">'
            output += '<br><p>' + playerSave.objects[909] + '</p></div>';
        }
        for (let i = 0; i < 5; ++i) {
            output += '<div class="box">'
            var index = playerSave.bulletin[i];
            output += '<img src="./app/images/' + index.id + '_img.png"';
            if (playerSave.Bundles[index.bundle][index.ex].completed == false) {
                output += 'class = "not_done">'
                output += '<br>' + playerSave.objects[index.id] + '</div>';
            }
            else {
                output += 'class = "done">';
                output += '<br><p>' + playerSave.objects[index.id] + '</p></div>';
            }
        }
        output += '</div>';

        output += '<p>Vault:</p> <div id="grid">';
        for (let i = 0; i < 4; ++i) {
            output += '<div class="box">'
            var index = playerSave.vault[i];
            output += '<img src="./app/images/' + index.id + '_img.png"';
            if (playerSave.Bundles[index.bundle][index.ex].completed == false) {
                output += 'class = "not_done">'
                output += '<br>' + playerSave.objects[index.id] + '</div>';
            }
            else {
                output += 'class = "done">';
                output += '<br><p>' + playerSave.objects[index.id] + '</p></div>';
            }
        }
        output += '</div>';
        return output;
    }

    function fileprocess(evt) {
		var file = evt.target.files[0];
		var saveRead = new FileReader();
        var output = "";

		saveRead.onload = function(e) {
            var output = document.getElementById('out').innerHTML;
            
            // parsing XML file using https://api.jquery.com/jQuery.parseXML/
            var saveXML = $.parseXML(e.target.result);

            var playerSave = {};

            // parse for simple player data
            playerSave.season = $(saveXML).find('currentSeason').html();
            playerSave.day = $(saveXML).find('dayOfMonth').html();
            playerSave.name = $(saveXML).find('player > name').text();
            playerSave.farmName = $(saveXML).find('player > farmName').html();
            playerSave.year = Number($(saveXML).find('year').text());
            playerSave.xsiOrp3 = ($(saveXML).find('SaveGame[xmlns\\:xsi]').length > 0) ? 'xsi': 'p3';
            playerSave.pickaxe = Number($(saveXML).find("Item[" + playerSave.xsiOrp3 + "\\:type='Pickaxe'] > upgradeLevel").text());
            playerSave.axe = Number($(saveXML).find("Item[" + playerSave.xsiOrp3 + "\\:type='Axe'] > upgradeLevel").text());
            playerSave.house = Number($(saveXML).find('player > houseUpgradeLevel').text());
            playerSave.totalDonated = 0;
            playerSave.buildings = {
                "barn" : 0,
                "coop": 0,
                "Barn": 1,
                "Big Barn": 2,
                "Deluxe Barn": 3,
                "Coop": 1,
                "Big Coop": 2,
                "Deluxe Coop": 3
            }

            // all objects needed for checklist, indexed using in-game indices (until 900)
            playerSave.objects = {
                "barn1": "Barn",
                "barn2": "Big Barn",
                "barn3": "Deluxe Barn",
                "coop1": "Coop",
                "coop2": "Big Coop",
                "coop3": "Deluxe Coop",
                "axe1": "Copper Axe",
                "axe2": "Steel Axe",
                "pickaxe1": "Copper Pickaxe",
                "pickaxe2": "Steel Pickaxe",
                "pickaxe3": "Gold Pickaxe",
                "pickaxe4": "Irdium Pickaxe",
                16: "Wild Horseradish",
                18: "Daffodil",
                20: "Leek",
                22: "Dandelion",
                24: "Parsnip",
                62: "Aquamarine",
                78: "Cave Carrot",
                80: "Quartz",
                82: "Fire Quartz",
                84: 'Frozen Tear',
                86: "Earth Crystal",
                88: "Coconut",
                90: "Cactus Fruit",
                128: "Pufferfish",
                130: "Tuna",
                131: "Sardine",
                132: "Bream",
                136: "Largemouth Bass",
                140: "Walleye",
                142: "Carp",
                143: "Catfish",
                145: "Sunfish",
                148: "Eel",
                150: "Red Snapper",
                156: "Ghostfish",
                164: "Sandfish",
                174: "Large Egg (White)",
                178: "Hay x10",
                182: "Large Egg (Brown)",
                186: "Large Milk",
                188: "Green Bean",
                190: "Cauliflower",
                192: "Potato",
                194: "Fried Egg",
                228: "Maki Roll",
                254: "Melon",
                256: "Tomato",
                257: "Morel",
                258: "Blueberry",
                259: "Fiddlehead Fern",
                260: "Hot Pepper",
                262: "Wheat x10",
                266: "Red Cabbage",
                270: "Corn",
                272: "Eggplant",
                276: "Pumpkin",
                280: "Yam",
                334: "Copper Bar",
                335: "Iron Bar",
                336: "Gold Bar",
                340: "Honey",
                344: "Jelly",
                348: "Wine",
                372: "Clam",
                376: "Poppy",
                388: "Wood x99",
                390: "Stone x99",
                392: "Nautilus Shell",
                398: "Grape",
                396: "Spice Berry",
                397: "Sea Urchin",
                402: "Sweet Pea",
                404: "Common Mushroom",
                406: "Wild Plum",
                408: "Hazelnut",
                410: "Blackberry",
                412: "Winter Root",
                414: "Crystal Fruit",
                416: "Snow Yam",
                418: "Crocus",
                420: "Red Mushroom",
                421: "Sunflower",
                422: "Purple Mushroom",
                424: "Cheese",
                426: "Goat Cheese",
                428: "Cloth",
                430: "Truffle",
                432: "Truffle Oil",
                438: "Large Goat Milk",
                440: "Wool",
                442: "Duck Egg",
                444: "Duck Feather",
                446: "Rabbit's Foot",
                536: "Frozen Geode",
                613: "Apple",
                634: "Apricot",
                635: "Orange",
                636: "Peach",
                637: "Pomegranate",
                638: "Cherry",
                698: "Sturgeon",
                699: "Tiger Trout",
                700: "Bullhead",
                701: "Tilapia",
                702: "Chub",
                706: "Shad",
                709: "Hardwood x10",
                715: "Lobster",
                716: "Crayfish",
                717: "Crab",
                718: "Cockle",
                719: "Mussel",
                720: "Shrimp",
                721: "Snail",
                722: "Periwinkle",
                723: "Oyster",
                724: "Maple Syrup",
                725: "Oak Resin",
                726: "Pine Tar",
                734: "Woodskip",
                766: "Slime",
                767: "Bat Wings x10",
                768: "Solar Essence",
                769: "Void Essence",
                900: "Gold Quality Parsnips x5",
                901: "Gold Quality Melons x5",
                902: "Gold Quality Corn x5",
                909: "Kitchen Upgrade",
                910: "2,500g",
                911: "5,000g",
                912: "10,000g",
                913: "25,000g"
            }

            playerSave.Bundles = {
                0: "Spring Crops",
                1: "Summer Crops",
                2: "Fall Crops",
                3: "Quality Crops",
                4: "Animal",
                5: "Artisan",
                6: "River Fish",
                7: "Lake Fish",
                8: "Ocean Fish",
                9: "Night Fishing",
                10: "Specialty Fish",
                11: "Crab Pot",
                13: "Spring Foraging",
                14: "Summer Foraging",
                15: "Fall Foraging",
                16: "Winter Foraging",
                17: "Construction",
                19: "Exotic Foraging",
                20: "Blacksmith's",
                21: "Geologist's",
                22: "Adventurer's",
                23: "2,500g",
                24: "5,000g",
                25: "10,000g",
                26: "25,000g",
                31: "Chef's",
                32: "Field Research",
                33: "Enchanter's",
                34: "Dye",
                35: "Fodder"
            }

            
            // info on each bundle, bundle numbers assigned by save file default
            playerSave.Bundles[0] = [
                {needed: 4, have: 0, options: 4},
                {id: 24, completed: false},
                {id: 188, completed: false},
                {id: 190, completed: false},
                {id: 192, completed: false}
            ] // Spring Crops

            playerSave.Bundles[1] = [
                {needed: 4, have: 0, options: 4},
                {id: 256, completed: false},
                {id: 260, completed: false},
                {id: 258, completed: false},
                {id: 254, completed: false}
            ] // Summer Crops

            playerSave.Bundles[2] = [
                {needed: 4, have: 0, options: 4},
                {id: 270, completed: false},
                {id: 272, completed: false},
                {id: 276, completed: false},
                {id: 280, completed: false}
            ] // Fall Crops

            playerSave.Bundles[3] = [
                {needed: 3, have: 0, options: 4},
                {id: 24, completed: false},
                {id: 254, completed: false},
                {id: 276, completed: false},
                {id: 270, completed: false}
            ] // Quality Crops

            playerSave.Bundles[4] = [
                {needed: 5, have: 0, options: 6},
                {id: 186, completed: false},
                {id: 182, completed: false},
                {id: 174, completed: false},
                {id: 438, completed: false},
                {id: 440, completed: false},
                {id: 442, completed: false}
            ] // Animal

            playerSave.Bundles[5] = [
                {needed: 6, have: 0, options: 12},
                {id: 432, completed: false},
                {id: 428, completed: false},
                {id: 426, completed: false},
                {id: 424, completed: false},
                {id: 340, completed: false},
                {id: 344, completed: false},
                {id: 613, completed: false},
                {id: 634, completed: false},
                {id: 635, completed: false},
                {id: 636, completed: false},
                {id: 637, completed: false},
                {id: 638, completed: false}
            ] // Artisan

            playerSave.Bundles[6] = [
                {needed: 4, have: 0, options: 4},
                {id: 145, completed: false},
                {id: 143, completed: false},
                {id: 706, completed: false},
                {id: 699, completed: false}
            ] // River Fish

            playerSave.Bundles[7] = [
                {needed: 4, have: 0, options: 4},
                {id: 136, completed: false},
                {id: 142, completed: false},
                {id: 700, completed: false},
                {id: 698, completed: false}
            ] // Lake Fish

            playerSave.Bundles[8] = [
                {needed: 4, have: 0, options: 4},
                {id: 131, completed: false},
                {id: 130, completed: false},
                {id: 150, completed: false},
                {id: 701, completed: false}
            ] // Ocean Fish

            playerSave.Bundles[9] = [
                {needed: 3, have: 0, options: 3},
                {id: 140, completed: false},
                {id: 132, completed: false}, 
                {id: 148, completed: false}
            ] // Night Fishing

            playerSave.Bundles[10] = [
                {needed: 4, have: 0, options: 4},
                {id: 128, completed: false},
                {id: 156, completed: false},
                {id: 164, completed: false},
                {id: 734, completed: false}
            ] // Specialty Fish

            playerSave.Bundles[11] = [
                {needed: 5, have: 0, options: 10},
                {id: 715, completed: false},
                {id: 716, completed: false},
                {id: 717, completed: false},
                {id: 718, completed: false},
                {id: 719, completed: false},
                {id: 720, completed: false},
                {id: 721, completed: false},
                {id: 722, completed: false},
                {id: 723, completed: false},
                {id: 372, completed: false}
            ] // Crab Pot

            playerSave.Bundles[13] = [
                {needed: 4, have: 0, options: 4},
                {id: 16, completed: false},
                {id: 18, completed: false}, 
                {id: 20, completed: false},
                {id: 22, completed: false}
            ] // Spring Foraging

            playerSave.Bundles[14] = [
                {needed: 3, have: 0, options: 3},
                {id: 396, completed: false},
                {id: 398, completed: false},
                {id: 402, completed: false}
            ] // Summer Foraging

            playerSave.Bundles[15] = [
                {needed: 4, have: 0, options: 4},
                {id: 404, completed: false},
                {id: 406, completed: false},
                {id: 408, completed: false},
                {id: 410, completed: false}
            ] // Fall Foraging

            playerSave.Bundles[16] = [
                {needed: 4, have: 0, options: 4},
                {id: 412, completed: false},
                {id: 414, completed: false},
                {id: 416, completed: false},
                {id: 418, completed: false}
            ] // Winter Foraging

            playerSave.Bundles[17] = [
                {needed: 4, have: 0, options: 4},
                {id: 388, completed: false},
                {id: 388, completed: false},
                {id: 390, completed: false},
                {id: 709, completed: false}
            ] // Construction

            playerSave.Bundles[19] = [
                {needed: 5, have: 0, options: 9},
                {id: 88, completed: false},
                {id: 90, completed: false},
                {id: 78, completed: false},
                {id: 420, completed: false},
                {id: 422, completed: false},
                {id: 724, completed: false},
                {id: 725, completed: false},
                {id: 726, completed: false},
                {id: 257, completed: false}
            ] // Exotic Foraging

            playerSave.Bundles[20] = [
                {needed: 3, have: 0, options: 3},
                {id: 334, completed: false},
                {id: 335, completed: false},
                {id: 336, completed: false}
            ] // Blacksmith's

            playerSave.Bundles[21] = [
                {needed: 4, have: 0, options: 4},
                {id: 80, completed: false},
                {id: 86, completed: false},
                {id: 84, completed: false},
                {id: 82, completed: false}
            ] // Geologist's

            playerSave.Bundles[22] = [
                {needed: 2, have: 0, options: 4},
                {id: 766, completed: false},
                {id: 767, completed: false},
                {id: 768, completed: false},
                {id: 769, completed: false}
            ] // Adventurer's

            playerSave.Bundles[23] = [
                {needed: 1, have: 0, options: 1},
                {id: -1, completed: false}
            ] // 2,500g

            playerSave.Bundles[24] = [
                {needed: 1, have: 0, options: 1},
                {id: -1, completed: false}
            ] // 5,000g

            playerSave.Bundles[25] = [
                {needed: 1, have: 0, options: 1},
                {id: -1, completed: false}
            ] // 10,000g

            playerSave.Bundles[26] = [
                {needed: 1, have: 0, options: 1},
                {id: -1, completed: false}
            ] // 25,000g

            playerSave.Bundles[31] = [
                {needed: 6, have: 0, options: 6},
                {id: 724, completed: false},
                {id: 259, completed: false},
                {id: 430, completed: false},
                {id: 376, completed: false},
                {id: 228, completed: false},
                {id: 194, completed: false}
            ] // Chef's

            playerSave.Bundles[32] = [
                {needed: 4, have: 0, options: 4},
                {id: 422, completed: false},
                {id: 392, completed: false},
                {id: 702, completed: false},
                {id: 536, completed: false}
            ] // Field Research

            playerSave.Bundles[33] = [
                {needed: 4, have: 0, options: 4},
                {id: 725, completed: false},
                {id: 348, completed: false},
                {id: 446, completed: false},
                {id: 637, completed: false}
            ] // Enchanter's

            playerSave.Bundles[34] = [
                {needed: 6, have: 0, options: 6},
                {id: 420, completed: false},
                {id: 397, completed: false},
                {id: 421, completed: false},
                {id: 444, completed: false},
                {id: 62, completed: false},
                {id: 266, completed: false}
            ]// Dye

            playerSave.Bundles[35] = [
                {needed: 3, have: 0, options: 3},
                {id: 262, completed: false},
                {id: 178, completed: false},
                {id: 613, completed: false}
            ] // Fodder

            playerSave.Bundles[36] = [
                {needed: 5, have: 0, options: 6},
                {id: 348, completed: false},
                {id: 807, completed: false},
                {id: 74, completed: false},
                {id: 454, completed: false},
                {id: 795, completed: false},
                {id: 445, completed: false}
            ] // Abandoned Joja Mart (not used, but needed for easy parsing)

            playerSave.springFarm = [
                {id: 24, bundle: 0, ex: 1, first: true},
                {id: 192, bundle: 0, ex: 4, first: true},
                {id: 190, bundle: 0, ex: 3, first: true},
                {id: 188, bundle: 0, ex: 2, first: true},
                {id: 16, bundle: 13, ex: 1, first: true},
                {id: 18, bundle: 13, ex: 2, first: true},
                {id: 20, bundle: 13, ex: 3, first: true},
                {id: 22, bundle: 13, ex: 4, first: true},
                {id: 900, bundle: 3, ex: 1, first: true},
            ]

            playerSave.springFish = [
                {id: 143, bundle: 6, ex: 2, first: true},
                {id: 148, bundle: 9, ex: 3, first: true},
                {id: 142, bundle: 7, ex: 2, first: true},
                {id: 131, bundle: 8, ex: 1, first: true},
                {id: 706, bundle: 6, ex: 3, first: true},
                {id: 145, bundle: 6, ex: 1, first: true}
            ]

            playerSave.summerFarm = [
                {id: 260, bundle: 1, ex: 2, first: true},
                {id: 254, bundle: 1, ex: 4, first: true},
                {id: 256, bundle: 1, ex: 1, first: true},
                {id: 258, bundle: 1, ex: 3, first: true},
                {id: 398, bundle: 14, ex: 2, first: true},
                {id: 396, bundle: 14, ex: 1, first: true},
                {id: 402, bundle: 14, ex: 3, first: true},
                {id: 259, bundle: 31, ex: 2, first: true},
                {id: 421, bundle: 34, ex: 3, first: true},
                {id: 376, bundle: 31, ex: 4, first: true},
                {id: 262, bundle: 35, ex: 1, first: true},
                {id: 901, bundle: 3, ex: 2, first: true}
            ]

            playerSave.summerFish = [
                {id: 128, bundle: 10, ex: 1, first: true},
                {id: 150, bundle: 8, ex: 3, first: true},
                {id: 698, bundle: 7, ex: 4, first: true},
                {id: 701, bundle: 8, ex: 4, first: true},
                {id: 130, bundle: 8, ex: 2, first: true},
                {id: 706, bundle: 6, ex: 3, first: false},
                {id: 145, bundle: 6, ex: 1, first: false}
            ]

            playerSave.fallFarm = [
                {id: 276, bundle: 2, ex: 3, first: true},
                {id: 280, bundle: 2, ex: 4, first: true},
                {id: 270, bundle: 2, ex: 1, first: true},
                {id: 272, bundle: 2, ex: 2, first: true},
                {id: 404, bundle: 15, ex: 1, first: true},
                {id: 408, bundle: 15, ex: 3, first: true},
                {id: 406, bundle: 15, ex: 2, first: true},
                {id: 410, bundle: 15, ex: 4, first: true},
                {id: 430, bundle: 15, ex: 4, first: true},
                {id: 637, bundle: 33, ex: 4, first: true},
                {id: 613, bundle: 35, ex: 3, first: true},
                {id: 902, bundle: 31, ex: 3, first: true},
            ]

            playerSave.fallFish = [
                {id: 699, bundle: 6, ex: 4, first: true},
                {id: 140, bundle: 9, ex: 1, first: true},
                {id: 143, bundle: 6, ex: 2, first: false},
                {id: 706, bundle: 6, ex: 3, first: false},
                {id: 142, bundle: 7, ex: 2, first: false},
                {id: 131, bundle: 8, ex: 1, first: false},
                {id: 150, bundle: 8, ex: 3, first: false},
                {id: 701, bundle: 8, ex: 4, first: false},
                {id: 148, bundle: 9, ex: 3, first: false}
            ]

            playerSave.winterFarm = [
                {id: 414, bundle: 16, ex: 2, first: true},
                {id: 416, bundle: 16, ex: 3, first: true},
                {id: 392, bundle: 32, ex: 2, first: true},
                {id: 412, bundle: 16, ex: 1, first: true},
                {id: 418, bundle: 16, ex: 4, first: true},
                {id: 266, bundle: 34, ex: 6, first: true}
            ]

            playerSave.winterFish = [
                {id: 699, bundle: 6, ex: 4, first: false},
                {id: 698, bundle: 7, ex: 4, first: false},
                {id: 131, bundle: 8, ex: 1, first: false},
                {id: 130, bundle: 8, ex: 2, first: false},
                {id: 140, bundle: 9, ex: 1, first: false}
            ]

            playerSave.mine = [
                {id: 334, bundle: 20, ex: 1, first: true},
                {id: 335, bundle: 20, ex: 2, first: true},
                {id: 336, bundle: 20, ex: 3, first: true},
                {id: 84, bundle: 21, ex: 3, first: true},
                {id: 86, bundle: 21, ex: 2, first: true},
                {id: 80, bundle: 21, ex: 1, first: true},
                {id: 536, bundle: 32, ex: 4, first: true},
                {id: 62, bundle: 34, ex: 5, first: true},
                {id: 82, bundle: 21, ex: 4, first: true},
                {id: 767, bundle: 22, ex: 2, first: true},
                {id: 768, bundle: 22, ex: 3, first: true},
                {id: 422, bundle: 19, ex: 5, first: true},
                {id: 420, bundle: 19, ex: 4, first: true}
            ]

            playerSave.crab = [
                {id: 718, bundle: 11, ex: 4, first: true},
                {id: 719, bundle: 11, ex: 5, first: true},
                {id: 723, bundle: 11, ex: 9, first: true},
                {id: 372, bundle: 11, ex: 10, first: true},
                {id: 722, bundle: 11, ex: 8, first: true}
            ]

            playerSave.anytimeFish = [
                {id: 132, bundle: 9, ex: 2, first: true},
                {id: 136, bundle: 7, ex: 1, first: true},
                {id: 700, bundle: 7, ex: 3, first: true},
                {id: 702, bundle: 32, ex: 3, first: true},
                {id: 156, bundle: 10, ex: 2, first: true},
                {id: 164, bundle: 10, ex: 3, first: true},
                {id: 734, bundle: 10, ex: 4, first: true}
            ]

            playerSave.exotic = [
                {id: 725, bundle: 19, ex: 7, first: true},
                {id: 725, bundle: 33, ex: 1, first: true},
                {id: 726, bundle: 19, ex: 8, first: true},
                {id: 724, bundle: 19, ex: 6, first: true},
                {id: 724, bundle: 31, ex: 1, first: true},
                {id: 88, bundle: 19, ex: 1, first: true},
                {id: 78, bundle: 19, ex: 3, first: true}
            ]

            playerSave.construction = [
                {id: 388, bundle: 17, ex: 1, first: true},
                {id: 388, bundle: 17, ex: 2, first: true},
                {id: 390, bundle: 17, ex: 3, first: true},
                {id: 709, bundle: 17, ex: 4, first: true}
            ]

            playerSave.animals = [
                {id: 174, bundle: 4, ex: 3, first: true},
                {id: 182, bundle: 4, ex: 2, first: true},
                {id: 186, bundle: 4, ex: 1, first: true},
                {id: 442, bundle: 19, ex: 5, first: true},
                {id: 440, bundle: 4, ex: 5, first: true},
                {id: 438, bundle: 4, ex: 4, first: true},
                {id: 444, bundle: 34, ex: 4, first: true}
            ]

            playerSave.artisan = [
                {id: 340, bundle: 5, ex: 5, first: true},
                {id: 344, bundle: 5, ex: 6, first: true},
                {id: 424, bundle: 5, ex: 4, first: true},
                {id: 428, bundle: 5, ex: 2, first: true},
                {id: 613, bundle: 5, ex: 7, first: true},
                {id: 637, bundle: 5, ex: 8, first: true}
            ]

            playerSave.bulletin = [
                {id: 228, bundle: 31, ex: 5, first: true},
                {id: 194, bundle: 31, ex: 6, first: true},
                {id: 178, bundle: 35, ex: 2, first: true},
                {id: 348, bundle: 33, ex: 2, first: true},
                {id: 397, bundle: 34, ex: 2, first: true}
            ]

            playerSave.vault = [
                {id: 910, bundle: 23, ex: 1, first: true},
                {id: 911, bundle: 24, ex: 1, first: true},
                {id: 912, bundle: 25, ex: 1, first: true},
                {id: 913, bundle: 26, ex: 1, first: true}
            ]

            readBundles(saveXML, playerSave);
            readBuildings(saveXML, playerSave);
            if (playerSave.Bundles[36][0].have > 0) playerSave.totalDonated -= playerSave.Bundles[36][0].have; // adjusting for The Missing Bundle

            output += sum(playerSave);
            // TODO: present data by season, state whether player is on track based on playerSave.season
            if (playerSave.season === "spring") {
                output += '<div class = "season" id="this_month">' + springCard(playerSave, "This Month:", false) + '</div>';
                output += '<div class = "season" id="next">' + summerCard(playerSave, "Next Month:", true) + '</div>';
            }
            else if (playerSave.season === "summer") {
                output += '<div class = "season" id="this_month">' + summerCard(playerSave, "This Month:", false) + '</div>';
                output += '<div class = "season" id="next">' + fallCard(playerSave, "Next Month:", true) + '</div>';
            }
            else if (playerSave.season === "fall") {
                output += '<div class = "season" id="this_month">' + fallCard(playerSave, "This Month:", false) + '</div>';
                output += '<div class = "season" id="next">' + winterCard(playerSave, "Next Month:", true) + '</div>';
            }
            else if (playerSave.season === "winter") {     
                output += '<div class = "season" id="this_month">' + winterCard(playerSave, "This Month:", false) + '</div>';
                output += '<div class = "season" id="next">' + springCard(playerSave, "Next Month:", true) + '</div>';
            }

            output += '<div class = "season" id="anytime">' + anytimeCard(playerSave) + '</div>';
            output += '<div class = "season" id="check"> <h2 class = "full">Full Checklist:</h2>';
            output += springCard(playerSave, "Spring:", true) + summerCard(playerSave, "Summer:", true) + fallCard(playerSave, "Fall:", true) + winterCard(playerSave, "Winter:", true);
            output += '</div>';
            // TODO: check if player is using remixed bundles (not supported with checklist)
            // TODO: parse bundle data
            document.getElementById('out').innerHTML = output;
        };
        saveRead.readAsText(file);
        document.getElementById('out').innerHTML = output;
    }
    document.getElementById('file_select').addEventListener('change', fileprocess, false);
}