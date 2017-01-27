// custom config

function getParameter(val)
{
	var regex = new RegExp('[\\?&#]' + val + '=([^&#]*)');
	var para = regex.exec(document.location.search);

	return para ? decodeURIComponent(para[1]) : null;
}

function HotkeyObj()
{
	var _this = this;
	
	this.key = null;
	this.alt = false;
	this.ctrl = false;
	this.shift = false;
}

var hotkey_toggle = new HotkeyObj();
var hotkey_reset = new HotkeyObj();

var count_down = null;
var count_down_expire = true;

function getCustomConfig()
{
	// default toggle hotkey ctrl+1
	hotkey_toggle.key = getParameter('hotkey_toggle') || '31';
	hotkey_toggle.alt = getParameter('hotkey_toggle_alt') === 'true';
	hotkey_toggle.ctrl = (getParameter('hotkey_toggle_ctrl') || 'true') === 'true';
	hotkey_toggle.shift = getParameter('hotkey_toggle_shift') === 'true';

	// default reset hotkey alt+1
	hotkey_reset.key = getParameter('hotkey_reset') || '31';
	hotkey_reset.alt = (getParameter('hotkey_reset_alt') || 'true') === 'true';
	hotkey_reset.ctrl = getParameter('hotkey_reset_ctrl') === 'true';
	hotkey_reset.shift = getParameter('hotkey_reset_shift') === 'true';

	// text
	var text_font = getParameter('text_font') || 'Tahoma,Geneva,sans-serif';
	var text_weight = getParameter('text_weight') || 'bold';
	var text_size = getParameter('text_size') || '50';
	var text_color = '#' + (getParameter('text_color') || '000000');
	var text_decimal = (getParameter('text_decimal') || 'true') === 'true';
	var text_decimal_size = getParameter('text_decimal_size') || '30';

	var timer_style = $('<style>').attr({id: 'timer-style'}).html
	(
		'.timer' +
		'{' +
			'font-family:' + text_font + ';' +
			'font-weight:' + text_weight + ';' +
			'font-size:' + text_size + 'px;' +
			'color:' + text_color + ';' +
		'}' +
		'#timer-decimal.timer' +
		'{' +
			'font-size:' + text_decimal_size + 'px;' +
		'}'
	);
	$('head').append(timer_style);
	
	$('.decimal').toggleClass('hide', !text_decimal);

	// count down
	count_down = getParameter('count_down');

	if(count_down !== null)
	{
		count_down = parseInt(count_down);
		if(isNaN(count_down))
			count_down = null;
		else
		{
			timer_heap = count_down * 1000;
			displayTimer(timer_heap);
		}
	}
	
	if(count_down === null)
		displayTimer(0);
	
	count_down_expire = (getParameter('count_down_expire') || 'true') === 'true';
}

// timer

var timer_heap = 0;
var timer_start = 0;
var timer_toggle = false;

var requestAnimFrame = (function()
{
	return (
	window.requestAnimationFrame		||
	window.webkitRequestAnimationFrame	||
	window.mozRequestAnimationFrame		||
	window.oRequestAnimationFrame		||
	window.msRequestAnimationFrame		||
	function(callback) { setTimeout(callback, 1000 / 60); }
	);
	
})();

function toggleTimer()
{
	timer_toggle = !timer_toggle;
	if(timer_toggle)
	{
		timer_start = Date.now();
		updateTimer();
	}
	else
		updateTimer(false)
}

function resetTimer()
{
	timer_heap = (count_down || 0) * 1000;
	timer_start = Date.now();
	
	displayTimer(timer_heap);
}

function updateTimer(toggle)
{
	var time_now = Date.now();
	
	var timer = (count_down === null) ? timer_heap + (time_now - timer_start) : timer_heap - (time_now - timer_start);

	if(toggle === false)
		timer_heap = timer;
	else if(!timer_toggle)
		return;

	displayTimer(timer);
	
	if(timer_toggle)
		requestAnimFrame(updateTimer);
}

function displayTimer(t)
{
	var sign = '';
	if(t < 0)
	{
		if(!count_down_expire)
		{
			sign = '-';
			t *= -1;
		}
		else
			t = 0;
	}
	
	var ms = t % 1000;
	t = (t - ms) / 1000;
	var sec = t % 60;
	t = (t - sec) / 60;
	var min = t % 60;
	t = (t - min) / 60;
	var hr = t % 24;
	var day = (t - hr) / 24;
	
	var decimal = Math.floor(ms / 10);
	
	$('#timer').text(
		sign +
		(day > 0 ? day + 'D' : '') +
		(hr > 0 ? (hr < 10 ? '0' + hr : hr) + ':' : '') +
		(min < 10 ? '0' + min : min) + ':' +
		(sec < 10 ? '0' + sec : sec)
	);
	
	$('#timer-decimal').text(decimal < 10 ? '0' + decimal : decimal);
}

// KeystrokeClient events

KeystrokeClient.onConnect = function()
{
	$('#disconnect-screen').addClass('connected');
};

KeystrokeClient.onDisconnect = function()
{
	$('#disconnect-screen').removeClass('connected');
};

var test_key =
{
	'2d': '60', // num 0
	'23': '61', // num 1
	'28': '62', // num 2
	'22': '63', // num 3
	'25': '64', // num 4
	'0c': '65', // num 5
	'27': '66', // num 6
	'24': '67', // num 7
	'26': '68', // num 8
	'21': '69', // num 9
	'2e': '6e', // num .

	'60': '2d', // num 0
	'61': '23', // num 1
	'62': '28', // num 2
	'63': '22', // num 3
	'64': '25', // num 4
	'65': '0c', // num 5
	'66': '27', // num 6
	'67': '24', // num 7
	'68': '26', // num 8
	'69': '21', // num 9
	'6e': '2e', // num .
	
	test: function(key, key_code)
	{
		return (key === key_code || (this.hasOwnProperty(key_code) && key === this[key_code]));
	},
}

KeystrokeClient.onKeyDown = function(key_code, modifier)
{
	if(test_key.test(hotkey_toggle.key, key_code) && KeystrokeClient.testModifierKeys(hotkey_toggle.alt, hotkey_toggle.ctrl, hotkey_toggle.shift))
		toggleTimer();

	if(test_key.test(hotkey_reset.key, key_code) && KeystrokeClient.testModifierKeys(hotkey_reset.alt, hotkey_reset.ctrl, hotkey_reset.shift))
		resetTimer();
};

KeystrokeClient.onKeyUp = function(key_code, modifier)
{
};

window.onload = function(e)
{
	getCustomConfig();
	KeystrokeClient.start(host_ip, host_port);
};