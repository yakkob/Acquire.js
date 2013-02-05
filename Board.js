// Board
// =====
// This file creates a "Board" module which can be imported
// into other node.js scripts and instantiated.
//
// See "Data Types.txt" for common data types.
//
// Example of code that might appear in acquire.js:
//
//	var Hotel = require('./Board.js');
//  var game = new Board();
//  ...
// 
var RuleChecker = require('./RuleChecker');
module.exports = function() {

	// Array of Tile
	var tiles = [];
	// Array of hotels
	var hotels = [];
	
	// [public] getTiles: (nothing) -> Array[Tile]
	// Returns a list of tiles
	this.getTiles = function() {
		return tiles;
	}
	
	// [public] hasTile: Tile -> Boolean
	// Does this board contain a tile?
	this.hasTile = function(tile) {
		var i = tiles.length;
		while (i--) {
			if (tiles[i].row == tile.row && tiles[i].column == tile.column) {
				return true;
			}
		}
		return false;
	}
	
	// [public] hasAnyTiles: Array[Tiles] -> Boolean
	// Does this contain at least one of the given tiles?
	this.hasAnyTiles = function(tiles) {
		for (var i in tiles) {
			if (!this.hasTile(tiles[i])) {
				return false;
			}
		}
		return true;
	}
	
	// [public] addTile: Tile -> (nothing)
	// Adds an unoccupied tile to the board.
	this.addTile = function(tile) {
		if (this.hasTile(tile)) {
			throw new Error("This tile already exists");
		}
		if (tile.column >= 1 && tile.column <= 12) {
			var hoteltiles = this.flattenHotelTiles();
			for (var h in hoteltiles) {
				if (RuleChecker.isDirectlyConnected(tile, hoteltiles[h])) {
					throw new Error("Singleton tile is connected to a hotel");
				}
			}
			tiles.push(tile);
		}
		else {
			throw new Error("Invalid column given");
		}
	}
	
	// [private] sortTiles: Array[Tile] -> Array[Tile]
	// Sort the tiles lexiographically
	var sortTiles = function(tiles) {
		tiles.sort(function(a, b) { // (anonymous): Tile, Tile -> Number
			return a.row.charCodeAt(0) - b.row.charCodeAt(0);
		});
		tiles.sort(function(a, b) { // (anonymous): Tile, Tile -> Number
			if (a.row == b.row) {
				return parseInt(a.column) - parseInt(b.column);
			}
			else {
				return 0;
			}
		});
		return tiles;
	}
	
	// [public] removeTile: Tile -> (nothing)
	// Removes a tile from the board
	this.removeTile = function(position) {
		if (!this.hasTile(position)){
			throw new Error("Tile not in Board");
		}
		for (var i in tiles) {
			if (tiles[i].row == position.row && tiles[i].column == position.column) {
				tiles.splice(i, 1);
			}
		}
	}
	
	// [public] removeTiles: Array[Tile] -> (nothing)
	// Remove a list of tiles from the board
	this.removeTiles = function(tiles) {
		for (var x in tiles) {
			this.removeTile(tiles[x]);
		}
	}
	
	// [public] hasHotel: Hotel -> Boolean
	// Does this hotel already exist?
	this.hasHotel = function(hotel) {
		var i = hotels.length;
		while (i--) {
			if (hotels[i].getName() == hotel.getName()) {
				return true;
			}
		}
		return false;
	}
	
	// [public] hasHotelName: String -> Boolean
	// Does this hotel already exist?
	this.hasHotelName = function(hotelName) {
		var i = hotels.length;
		while (i--) {
			if (hotels[i].getName() == hotelName) {
				return true;
			}
		}
		return false;
	}
	
	// [public] addHotel: Hotel -> (nothing)
	// Adds a hotel 
	this.addHotel = function(hotel) {
		if (this.hasHotel(hotel)) {
			throw new Error("This hotel is not available.");
		}
		hotels.push(hotel);
	}
	
	// [public] removeHotel: Hotel -> (nothing)
	// Removes a hotel
	this.removeHotel = function(hotel) {
		if (!this.hasHotel(hotel)) {
			throw new Error("This hotel does not exist");
		}
		for (var h in hotels) {
			if (hotels[h].getName() == hotel.getName()) {
				hotels.splice(h, 1);
			}
		}
	}
	
	// [public] flattenHotelTiles: (nothing) -> Array[Tile]
	// Gets the list of all tiles associated with all hotels.
	this.flattenHotelTiles = function() {
		var ourtiles = [];
		for (var i in hotels) {
			var hoteltiles = hotels[i].getTiles();
			for (var t in hoteltiles) {
				ourtiles.push(hoteltiles[t]);
			}
		}
		return ourtiles;
	}
		
	// [public] getHotels: (nothing) -> Array[Hotel]
	// Returns a list of in-play hotels
	this.getHotels = function() {
		return hotels;
	}
	
	// [public] hotelsHaveTile: Tile -> Boolean
	// Does any hotel on this board have the given tile?
	this.hotelsHaveTile = function(tile) {
		for (var h in hotels) {
			var tiles = hotels[h].getTiles();
			for (var t in tiles) {
				if (tiles[t].row == tile.row && tiles[t].column == tile.column) {
					return true;
				}
			}
		}
		return false;
	}
	
	// [public] generateXML: (nothing) -> String
	// Generates the XML representation of this board
	this.generateXML = function() {
		var xml = "<board>\r\n";
		
		tiles = sortTiles(tiles);
		for (var i in tiles) {
			xml += "<tile row=\"" + tiles[i].row + "\" column=\"" + tiles[i].column + "\" />\r\n";
		}
		
		for (var i in hotels) {
			var hotel = hotels[i];
			xml += "<hotel label=\"" + hotel.getName() + "\">\r\n";
			
			var hotelTiles = sortTiles(hotel.getTiles());
			for (var t in hotelTiles) {
				var tile = hotelTiles[t];
				xml += "<tile row=\"" + tile.row + "\" column=\"" + tile.column + "\" />\r\n";
			}
			
			xml += "</hotel>\r\n";
		}
		
		xml += "</board>";
		return xml;
	}
}