window.onload = function() {
    
    if (!(window.File && window.FileReader)) {
		document.getElementById('out').innerHTML = '<span class="error">Fatal Error with API</span>';
		return;
	}

    function readBundles(saveXML, playerSave) {
        bundlesInfo = $(saveXML).find("locations > GameLocation[" + playerSave.ns_prefix + "\\:type='CommunityCenter']");
        $(bundlesInfo).find('bundles > item').each(function() {
            bundleNum = $(this).find('key > int').text();
            $(this).find('ArrayOfBoolean > boolean').each(function () {
                var i = 1;
				if ($(this).text() === 'true') {
					playerSave.Bundles[bundleNum][i].completed = true;
				}
				i++;
			});
        });
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
            playerSave.name = $(saveXML).find('player > name').text();
            playerSave.farmName = $(saveXML).find('player > farmName').html();
            playerSave.year = Number($(saveXML).find('year').text());

            //TODO: fix this make it nicer
            output += '<h3>Summary</h3>\n';
            output += '<span class="result">Hello, ' + playerSave.name + ' of ' + playerSave.farmName+ ' farm!</span><br />\n';
            
            // check player is in the first year
            if (playerSave.year > 1) output += '<span class="result"> Your save is not in its first year. We recommend a different checklist.</span><br />\n';

            var objects = {
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
                178: "Hay",
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
                262: "Wheat",
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
                388: "Wood",
                390: "Stone",
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
                586: "Nautilus Shell",
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
                709: "Hardwood",
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
                767: "Bat Wing",
                768: "Solar Essence",
                769: "Void Essence"
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
                {needed: 4},
                {id: 24, completed: false},
                {id:188, completed: false},
                {id: 190, completed: false},
                {id:192, completed: false}
            ] // Spring Crops

            playerSave.Bundles[1] = [
                {needed: 4},
                {id: 256, completed: false},
                {id: 260, completed: false},
                {id: 258, completed: false},
                {id: 254, completed: false}
            ] // Summer Crops

            playerSave.Bundles[2] = [
                {needed: 4},
                {id: 270, completed: false},
                {id: 272, completed: false},
                {id: 276, completed: false},
                {id: 280, completed: false}
            ] // Fall Crops

            playerSave.Bundles[3] = [
                {needed: 3},
                {id: 24, completed: false},
                {id: 254, completed: false},
                {id: 276, completed: false},
                {id: 270, completed: false}
            ] // Quality Crops

            playerSave.Bundles[4] = [
                {needed: 5},
                {id: 186, completed: false},
                {id: 182, completed: false},
                {id: 174, completed: false},
                {id: 438, completed: false},
                {id: 440, completed: false}
            ] // Animal

            playerSave.Bundles[5] = [
                {needed: 6},
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
                {needed: 4},
                {id: 145, completed: false},
                {id: 143, completed: false},
                {id: 706, completed: false},
                {id: 699, completed: false}
            ] // River Fish

            playerSave.Bundles[7] = [
                {needed: 4},
                {id: 136, completed: false},
                {id: 142, completed: false},
                {id: 700, completed: false},
                {id: 698, completed: false}
            ] // Lake Fish

            playerSave.Bundles[8] = [
                {needed: 4},
                {id: 131, completed: false},
                {id: 130, completed: false},
                {id: 150, completed: false},
                {id: 701, completed: false}
            ] // Ocean Fish

            playerSave.Bundles[9] = [
                {needed: 3},
                {id: 140, completed: false},
                {id: 132, completed: false}, 
                {id: 148, completed: false}
            ] // Night Fishing

            playerSave.Bundles[10] = [
                {needed: 4},
                {id: 128, completed: false},
                {id: 156, completed: false},
                {id: 164, completed: false},
                {id: 734, completed: false}
            ] // Specialty Fish

            playerSave.Bundles[11] = [
                {needed: 5},
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
                {needed: 4},
                {id: 16, completed: false},
                {id: 18, completed: false}, 
                {id: 20, completed: false},
                {id: 22, completed: false}
            ] // Spring Foraging

            playerSave.Bundles[14] = [
                {needed: 3},
                {id: 396, completed: false},
                {id: 398, completed: false},
                {id: 402, completed: false}
            ] // Summer Foraging

            playerSave.Bundles[15] = [
                {needed: 4},
                {id: 404, completed: false},
                {id: 406, completed: false},
                {id: 408, completed: false},
                {id: 410, completed: false}
            ] // Fall Foraging

            playerSave.Bundles[16] = [
                {needed: 4},
                {id: 412, completed: false},
                {id: 414, completed: false},
                {id: 416, completed: false},
                {id: 418, completed: false}
            ] // Winter Foraging

            playerSave.Bundles[17] = [
                {needed: 4},
                {id: 388, completed: false},
                {id: 388, completed: false},
                {id: 390, completed: false},
                {id: 709, completed: false}
            ] // Construction

            playerSave.Bundles[19] = [
                {needed: 5},
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
                {needed: 3},
                {id: 334, completed: false},
                {id: 335, completed: false},
                {id: 336, completed: false}
            ] // Blacksmith's

            playerSave.Bundles[21] = [
                {needed: 4},
                {id: 80, completed: false},
                {id: 86, completed: false},
                {id: 84, completed: false},
                {id: 82, completed: false}
            ] // Geologist's

            playerSave.Bundles[22] = [
                {needed: 2},
                {id: 766, completed: false},
                {id: 767, completed: false},
                {id: 768, completed: false},
                {id: 769, completed: false}
            ] // Adventurer's

            playerSave.Bundles[23] = [
                {needed: 1},
                {id: -1, completed: false}
            ] // 2,500g

            playerSave.Bundles[24] = [
                {needed: 1},
                {id: -1, completed: false}
            ] // 5,000g

            playerSave.Bundles[25] = [
                {needed: 1},
                {id: -1, completed: false}
            ] // 10,000g

            playerSave.Bundles[26] = [
                {needed: 1},
                {id: -1, completed: false}
            ] // 25,000g

            playerSave.Bundles[31] = [
                {needed: 6},
                {id: 724, completed: false},
                {id: 259, completed: false},
                {id: 430, completed: false},
                {id: 376, completed: false},
                {id: 228, completed: false},
                {id: 194, completed: false}
            ] // Chef's

            playerSave.Bundles[32] = [
                {needed: 4},
                {id: 422, completed: false},
                {id: 392, completed: false},
                {id: 702, completed: false},
                {id: 536, completed: false}
            ] // Field Research

            playerSave.Bundles[33] = [
                {needed: 4},
                {id: 725, completed: false},
                {id: 348, completed: false},
                {id: 446, completed: false},
                {id: 637, completed: false}
            ] // Enchanter's

            playerSave.Bundles[34] = [
                {needed: 6},
                {id: 420, completed: false},
                {id: 397, completed: false},
                {id: 421, completed: false},
                {id: 444, completed: false},
                {id: 62, completed: false},
                {id: 266, completed: false}
            ]// Dye

            playerSave.Bundles[35] = [
                {needed: 3},
                {id: 262, completed: false},
                {id: 178, completed: false},
                {id: 613, completed: false}
            ] // Fodder

            playerSave.Bundles[36] = [
                {needed: 5},
                {id: 348, completed: false},
                {id: 807, completed: false},
                {id: 74, completed: false},
                {id: 454, completed: false},
                {id: 795, completed: false},
                {id: 445, completed: false}
            ] // Abandoned Joja Mart (not used, but needed for easy parsing)

            readBundles(saveXML, playerSave);

            // TODO: present data by season, state whether player is on track based on playerSave.season
            if (playerSave.season === "spring") {
                if (!playerSave.Bundles[0][1].completed) output += '<span class="spring">You need, ' + objects[16] +'</span><br />\n';
            }

            // TODO: check if player is using remixed bundles (not supported with checklist)
            // TODO: parse bundle data
            document.getElementById('out').innerHTML = output;
        };
        saveRead.readAsText(file);
        document.getElementById('out').innerHTML = output;
    }
    document.getElementById('file_select').addEventListener('change', fileprocess, false);
}