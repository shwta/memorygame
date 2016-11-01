//Intializing Game and required methods to play game
var Game = {
		init: function(reqTileValues, spiralArr, m, n, levelId) {
				// To count no:of moves
				this.count = 0;
				//Creating duplicate array of titlevalues and merging them
				this.tileValuesArray = $.merge(reqTileValues, reqTileValues);
				//Calling randomize function to shuffle the values
				this.gameValues = $(this.randomize(this.tileValuesArray));
				// Calling spiral function which returns the position of elements in spiral order.
				this.spiralArray = this.spiral(spiralArr, m, n);
				this.levelId = levelId;
				//intializing HTML for game;
				this.gameWrapperHTML(this.spiralArray, levelId);
				//Click event for each tile
				$(".tile").on("click", this.clickedTile);

				this.pause = false;
				this.select = null;

				//click event for restart button
				$(".reset").on("click", this.restart);

		},
		spiral: function(spiralArr, m, n) {
				var tr = 0; // Top-row
				var br = n - 1; // Bottom-row
				var fc = 0; // first-column
				var lc = m - 1; // last-column
				var dir = 0; // direction    0 => moving right   1 => moving down    2 => moving left    3 => moving up
				var i;
				var spiralArray = [];
				while (tr <= br && fc <= lc) {
						if (dir == 0) {
								for (i = fc; i <= lc; i++)
										spiralArray.push(spiralArr[tr][i]);
								tr++;
								dir = 1;
						} else if (dir == 1) {
								for (i = tr; i <= br; i++)
										spiralArray.push(spiralArr[i][lc]);
								lc--;
								dir = 2;
						} else if (dir == 2) {
								for (i = lc; i >= fc; i--)
										spiralArray.push(spiralArr[br][i]);
								br--;
								dir = 3;
						} else {
								for (i = br; i >= tr; i--)
										spiralArray.push(spiralArr[i][fc]);
								fc++;
								dir = 0;
						}

				}
				return spiralArray;
		},

		randomize: function(tileValuesArray) {
				var counter = tileValuesArray.length,
						temp, index;
				while (counter > 0) {
						index = Math.floor(Math.random() * counter); // Pick a random index
						counter--; // Decrement counter value by 1
						temp = tileValuesArray[counter]; // And swap the last element with it
						tileValuesArray[counter] = tileValuesArray[index];
						tileValuesArray[index] = temp;
				}
				return tileValuesArray;
		},
		clickedTile: function() {
				//check if  the tile is selected and match is found
				if (!Game.pause && !$(this).find(".tileContent").hasClass("matchFound") && !$(this).find(".tileContent").hasClass("selected")) {
						$(this).find(".tileContent").addClass("selected");
						if (!Game.select) {
								Game.select = $(this).attr("tileId");
						} else if (Game.select == $(this).attr("tileId") && !$(this).hasClass("selected")) {
								//Incrementing no:of moves
								Game.count += 1;
								$(".moves span").text(Game.count);
								$(".selected").addClass("matchFound");
								Game.select = null;
						} else {
								Game.select = null;
								Game.pause = true;
								Game.count += 1;
								$(".moves span").text(Game.count);
								setTimeout(function() {
										$(".selected").removeClass("selected");
										Game.pause = false;
								}, 500);
						}
						//checking, if the game is over
						if ($(".matchFound").length == $(".tile").length) {

								Game.winGame(Game.count);
						}
				}
		},
		winGame: function(count) {
				this.pause = true;
				setTimeout(function() {
						$(".modal-overlay").show();
						$(".gameOver").remove();
						$(".modal").fadeIn("slow");
						$(".modal").append("<div class='gameOver'><h2 class= 'winner'>Congratulations..<br>Game Over!!!</h2><p>You completed the Game in " + count + " moves<p></div>");
				}, 800);
				$('.modal-overlay').click(function() {
						$(this).hide();

				});
		},
		restart: function() {
				$(".moves span").text(0);
				Game.count = 0;
				Game.gameValues = $(Game.randomize(Game.tileValuesArray));
				Game.gameWrapperHTML(Game.spiralArray, Game.levelId);
				Game.gameTiles = $(".tile");
				Game.gameTiles.on("click", Game.clickedTile);
				Game.pause = false;
				Game.select = null;


		},
		gameWrapperHTML: function(spiralArray, levelId) {
				$(".tile").remove();
				for (var i = 0; i < this.spiralArray.length; i++) {
						$(".gameWrapper").append("<p></p")
				}
				Game.gameValues.each(function(key, value, that) {
						var cardNum = key + 1;
						var result = '<div class="tile" tileId="' + value.id + '"><div class="tileContent"><div class="in">"' + value.name + '" </div>\
					<div class="out">' + cardNum + '</div></div></div>';
						$('' + levelId + " .gameWrapper p:nth-child(" + spiralArray[key] + ")").replaceWith(result);
						$(".tile").delay(400 * key).animate({
								'opacity': '1.0'
						}, {
								duration: 500
						});
				});
		}

};


//values for the Tiles
var tileValues = [{
		name: "A",
		id: 1,
}, {
		name: "B",
		id: 2
}, {
		name: "C",
		id: 3
}, {
		name: "D",
		id: 4
}, {
		name: "E",

		id: 5
}, {
		name: "F",

		id: 6
}, {
		name: "G",

		id: 7
}, {
		name: "H",

		id: 8
}, {
		name: "I",

		id: 9
}, {
		name: "J",

		id: 10
}, {
		name: "K",

		id: 11
}, {
		name: "L",

		id: 12
}, {
		name: "M",

		id: 13
}, {
		name: "N",

		id: 14
}, {
		name: "O",
		id: 15
}, ];


//Click events for different levels of game

$("input").on("click", function(event) {
		if ($(this).attr("id") === "easy") {
				$("#game1").slideDown().siblings(".gamelevel").hide();
				$(".gameWrapper").css("padding-left", "120px");
				$(".moves span").text(0);
				var levelId = "#game1";
				//picking  the element from title values array according to the level of the game
				//level- easy has need 4 elements from the array. So, picking first four elements.
				var reqTileValues = tileValues.slice(0, 4);
				var spiralArr = [
						[1, 2, 3, 4],
						[5, 6, 7, 8]
				]
				var m = 4,
						n = 2;
				//Intializing the game
				Game.init(reqTileValues, spiralArr, m, n, levelId);
		}
		if ($(this).attr("id") === "medium") {
				$("#game2").slideDown().siblings(".gamelevel").hide();
				$(".gameWrapper").css("padding-left", "70px");
				$(".moves span").text(0);
				var levelId = "#game2";
				var reqTileValues = tileValues.slice(0, 10);
				var spiralArr = [
						[1, 2, 3, 4, 5],
						[6, 7, 8, 9, 10],
						[11, 12, 13, 14, 15],
						[16, 17, 18, 19, 20]
				];
				var m = 5,
						n = 4;
				Game.init(reqTileValues, spiralArr, m, n, levelId);
		}
		if ($(this).attr("id") === "hard") {
				$("#game3").slideDown().siblings(".gamelevel").hide();
				$(".gameWrapper").css("padding-left", "0px");
				$(".moves span").text(0);
				var levelId = "#game3";
				var reqTileValues = tileValues;
				var spiralArr = [
						[1, 2, 3, 4, 5, 6],
						[7, 8, 9, 10, 11, 12],
						[13, 14, 15, 16, 17, 18],
						[19, 20, 21, 22, 23, 24],
						[25, 26, 27, 28, 29, 30]
				];
				var m = 6,
						n = 5;
				Game.init(reqTileValues, spiralArr, m, n, levelId);

		}
});
