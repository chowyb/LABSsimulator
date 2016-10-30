$(document).ready(function() {
	// code copied from http://www.comp.nus.edu.sg/~stevenha/cs4234/miniproject.html
	var s, n;
	var bc = 0;

	function convert(ch) {
		if ('A' <= ch && ch <= 'Z') {
			return ch.charCodeAt(0) - 55;
		}
		else {
			return ch - '0';
		}
	}

	function reconvert(i) {
		if (i < 10) {
			return String.fromCharCode(i + 48);
		}
		else {
			return String.fromCharCode(i + 55);
		}
	}

	function C(k) {
	  var ret = 0;
	  for (var i = 0; i < n-k; i++)
	    ret += s[i]*s[i+k];
	  return ret;
	}

	function E() {
		var ret = 0;
		for (var k = 1; k <= n - 1; k++) {
			ret += C(k) * C(k);
		}
		return ret;
	}

	function F() {
		return n * n / 2 / E();
	}

	function process() {
		var rln = $('#rln').val();
		var curValue = 1;
		n = 0;
		for (var i = 0, j = 0; i < rln.length; i++) {
			var repeat = convert(rln[i]);
			n += repeat;
		}
		s = new Array(n);
		for (var i = 0, j = 0; i < rln.length; i++) {
			var repeat = convert(rln[i]);
			for (var k = 0; k < repeat; k++) {
				s[j++] = curValue;
			}
			curValue *= -1;
		}
		calculateAndOutput();
	}

	function calculateAndOutput() {
		$('#n').text(n);
		//$("#s").text(s);
		$('#e').text(E());
		$('#f').text(F().toFixed(2));
		for (var i = 0; i < s.length; i++) {
			showButton(i, s[i]);
		}
		for (var i = bc; i >= s.length; i--) {
			hideButton(i);
		}
	}

	function hideButton(index) {
		$('#button-' + index).hide(0);
	}

	function showButton(index, value) {
		if (index >= bc) {
			createNewButton();
		}
		$('#button-' + index).show(0);
		$('#button-text-' + index).html(value);
	}

	function createNewButton() {
		index = bc;
		button = '<span id="button-' + index + '" class="bit-span">' + index + '<div><button id="button-text-' + index + '" class="bit-button" type="button" data-id="' + index + '"></button></div></span>';
		$('#buttons').append(button);
		bc++;
	}

	function replaceRLN() {
		var rlnstr = '';
		if (s.length > 0) {
			var numbits = 1;
			var bit = s[0];
			for (var i = 1; i < s.length; i++) {
				if (s[i] == bit) {
					numbits++;
				}
				else {
					rlnstr += reconvert(numbits);
					bit = s[i];
					numbits = 1;
				}
			}
		}
		rlnstr += reconvert(numbits);
		$('#rln').val(rlnstr);
	}

	$('#rln').keyup(function() { 
		process(); 
	});

	$('body').mousewheel(function(event, delta) {
		$('#buttons')[0].scrollLeft -= (delta * 30);
		event.preventDefault();
	});

   $('body').on('click', '.bit-button', function(event) {
   		s[parseInt($(event.target).attr('data-id'))] *= -1;
   		calculateAndOutput();
   		replaceRLN();
   });

});