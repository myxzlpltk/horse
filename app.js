var App = {
	startColor: 'black',
	temp: {},
	origin: [0,0],
	destination: [7,7],
	moves: [
		[-1,-2],
		[+1,-2],
		[+2,-1],
		[+2,+1],
		[+1,+2],
		[-1,+2],
		[-2,+1],
		[-2,-1]
	],
	fastestWay: Infinity,
	timeout: 100
};

(function($){

	'use strict';

	App.initializeBoard = function(){
		__initializeBoard();
	};
	App.startGame = function(){
		__startGame();
	};

	function __simulate(){
		App.origin = [0,0];
		App.destination = [3,3];

		__startAlgorithm(App.origin, App.destination);
	}

	$(document).ready(function() {
		App.initializeBoard();

		App.startGame();
	});

	function __initializeBoard(){
		$('#app').empty();
		App.fastestWay = Infinity;
		App.board = $('<div class="board"></div>').appendTo('#app');

		var max = 8*8;
		for(var i=0;i<max;i++){
			var spot = $('<div><div>').appendTo(App.board);
			spot.addClass(
				getSpotClass(i)
			);
		}

		$('#status').empty();
		$('#count').html('-');
	}

	App.temp.colorNow = App.startColor;
	function getSpotClass(i){
		if(i%8!=0){
			if(App.temp.colorNow == 'black'){
				App.temp.colorNow = 'white';
			}
			else{
				App.temp.colorNow = 'black';
			}
		}

		return App.temp.colorNow;
	}

	function __startGame(){
		App.board.addClass('selection');

		__chooseOrigin();
	}

	function __chooseOrigin(){
		$('#status').text('Pilih Sumber');

		App.board.children('div').on('click', function(event){
			event.preventDefault();

			App.origin = getPosition(this);
			$(this).addClass('origin');

			App.board.children('div').off('click');
			__chooseDestination();
		});
	}

	function __chooseDestination(){
		$('#status').text('Pilih Tujuan');

		App.board.children('div').on('click', function(event){
			event.preventDefault();

			var position = getPosition(this);

			if(App.origin.join() != position.join()){
				App.destination = position;
				$(this).addClass('destination');

				App.board.children('div').off('click');

				setTimeout(function(){
					__startAlgorithm(App.origin, App.destination);
				}, App.timeout);
			}
			else{
				alert('Tidak diperbolehkan');
			}
		});
	}

	function getPosition(el){
		var i = $(el).index();

		var x = (i%8);
		var y = Math.floor(i/8);

		return [x,y];
	}

	function getPossibleMoves(current, moved){
		var moves = App.moves;
		var possible = [];

		for(var i=0;i<moves.length;i++){
			var x = current[0] + moves[i][0];
			var y = current[1] + moves[i][1];
			
			if( (x>=0 && x<=7) && (y>=0 && x <=7) && !contain([x,y], moved)){

				possible.push([x,y]);
			}

		}

		possible.sort(function(a,b){
			var destination = App.destination;

			var x1 = Math.abs(a[0]-destination[0]);
			var y1 = Math.abs(a[1]-destination[1]);
			var x2 = Math.abs(b[0]-destination[0]);
			var y2 = Math.abs(b[1]-destination[1]);

			return (x1+y1) - (x2+y2);
		});

		return possible;
	}

	function contain(neddle, haystack){
		haystack = Object.assign([], haystack);

		for(var i=0;i<haystack.length;i++){
			haystack[i] = haystack[i].join('');
		}

		return (haystack.includes(neddle.join('')));
	}

	function __startAlgorithm(origin, destination){
		App.board.removeClass('selection');
		$('#status').text('Menampilkan Hasil');
		$('#count').html('0');
		
		recursive(origin, [origin], destination);
	}

	function recursive(current, moved, destination){
		var moves = getPossibleMoves(current, moved);
		$('#count').html(parseInt($('#count').text())+1);
		$('#count').append(' proses');

		setTimeout(function(){
			for(var i=0;i<moves.length;i++){
				var temp = Object.assign([], moved);
				temp.push(moves[i]);

				if(!contain(destination, moves)){
					if((temp.length+1) < App.fastestWay){
						recursive(moves[i], temp, destination);
					}
				}
				else{
					if(contain(destination, temp)){
						showTrack(temp);
					}
				}
			}
		}, App.timeout);
	}

	function showTrack(result){
		if(App.fastestWay >= (result.length+1)){
			App.fastestWay = result.length+1;
		}

		var board = $('<div class="board"></div>').data('way', result.length+1).appendTo('#track');

		var max = 8*8;
		for(var i=0;i<max;i++){
			var spot = $('<div><div>').appendTo(board);
			spot.addClass(
				getSpotClass(i)
			);
		}

		for(var i=0;i<result.length;i++){
			var x = result[i][0];
			var y = result[i][1];

			var index = x + (y*8);

			board.children('div').eq(index).text(i+1);
		}

		$('#track').children('div').sort(function(a,b){
			a = parseInt($(a).data('way'));
			b = parseInt($(b).data('way'));

			return a-b;
		});
	}

	$('#reset').click(function(){
		$('#track').html('<p style="text-align: center;">Result</p>');

		App.initializeBoard();
		App.startGame();
	});

}(jQuery))