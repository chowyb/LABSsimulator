$(document).ready(function() {
	// code copied from http://www.comp.nus.edu.sg/~stevenha/cs4234/miniproject.html
	var s = [];
	var n;
	var bc = 0;
	var c;
	var cn;
	var e;
	var f;
	var en;
	var fn;

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

	function C() {
		c = [0];
		for (var i = 1; i <= n; i++) {
			c.push(Cinv(i));
		}
	}

	function Cinv(k) {
		var ret = 0;
		for (var i = 0; i < n-k; i++) {
			ret += s[i]*s[i+k];
		}
		return ret;
	}

	function E() {
		e = 0;
		for (var k = 1; k <= n - 1; k++) {
			e += c[k] * c[k];
		}
	}

	function F() {
		f = n * n / 2 / e;
	}

	function calculateAfter(index) {
		sn = [];
		for (var i = 0; i < s.length; i++) {
			sn.push(s[i]);
		}
		sn[index] *= -1;
		cn = [0];
		for (var i = 1; i <= n; i++) {
			cn.push(Cinvn(i));
		}
		En();
		Fn();
	}

	function Cinvn(k) {
		var ret = 0;
		for (var i = 0; i < n-k; i++) {
			ret += sn[i]*sn[i+k];
		}
		return ret;
	}

	function En() {
		en = 0;
		for (var k = 1; k <= n - 1; k++) {
			en += cn[k] * cn[k];
		}
	}

	function Fn() {
		fn = n * n / 2 / en;
	}

	function process() {
		var rln = $('#rln').val();
		var curValue = 1;
		if (s.length > 0) {
			curValue = s[0];
		}
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
		recreateSVG();
		calculateAndOutput();
	}

	function recreateSVG() {
		$('#svg-container').html('<svg id="svg-canvas" height="400" width="' + (25 * (n - 1)) + '"></svg>');
	}

	function calculateAndOutput() {
		C();
		E();
		F();
		redraw(false);
	}

	function redraw(usenew) {
		$('#n').text(n);
		$('#e').text(e);
		$('#f').text(f.toFixed(2));
		redrawButtons();
		redrawSVG(usenew);
		if (usenew) {
			$('#en').text('(' + en + ')');
			$('#fn').text('(' + fn.toFixed(2) + ')');
		}
		else {
			$('#en').text('');
			$('#fn').text('');
		}
	}

	function redrawButtons() {
		for (var i = 0; i < s.length; i++) {
			showButton(i, s[i]);
		}
		for (var i = bc; i >= s.length; i--) {
			hideButton(i);
		}
	}

	function redrawSVG(usenew) {
		var svghtml = '';
		for (var i = 1; i < c.length; i++) {
			var size = 200 * (c[i] / n);
			var y;
			if (c[i] > 0) {
				y = 200 - size;
			}
			else {
				y = 250;
			}
			if (size < 0) {
				size *= -1;
			}
			var x = -20 + (i * 25);
			svghtml += '<text x="' + x + '" y="225">' + i + '</text><rect x="' + x + '" y="' + y + '" width="15" height="' + size + '" style="fill:rgb(0, 0, 255)" />';
		}
		if (usenew) {
			for (var i = 1; i < cn.length; i++) {
				var size = 200 * (cn[i] / n);
				var y;
				if (cn[i] > 0) {
					y = 200 - size;
				}
				else {
					y = 250;
				}
				if (size < 0) {
					size *= -1;
				}
				var x = -20 + (i * 25);
				var colour = "255, 0, 0";
				if (Math.abs(c[i]) >= Math.abs(cn[i])) {
					colour = "0, 255, 0";
				}
				svghtml += '<rect x="' + x + '" y="' + y + '" width="15" height="' + size + '" style="fill:rgb(' + colour + ')" />';	
			}
		}
		$('#svg-canvas').html(svghtml);
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

	$('#buttons').mousewheel(function(event, delta) {
		$('#buttons')[0].scrollLeft -= (delta * 60);
		event.preventDefault();
	});

	$('#svg-container').mousewheel(function(event, delta) {
		$('#svg-container')[0].scrollLeft -= (delta * 60);
		event.preventDefault();
	});

	$('body').on('click', '.bit-button', function(event) {
		s[parseInt($(event.target).attr('data-id'))] *= -1;
		calculateAndOutput();
		replaceRLN();
	});

	$('body').on('mouseenter', '.bit-button', function(event) {
		calculateAfter(parseInt($(event.target).attr('data-id')));
		redraw(true);
	});

	$('body').on('mouseleave', '.bit-button', function(event) {
		redraw(false);
	})

});