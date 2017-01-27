var default_val =
{
	hotkey_toggle: '31',
	hotkey_toggle_alt: 'false',
	hotkey_toggle_ctrl: 'true',
	hotkey_toggle_shift: 'false',

	hotkey_reset: '31',
	hotkey_reset_alt: 'true',
	hotkey_reset_ctrl: 'false',
	hotkey_reset_shift: 'false',
	
	text_font: 'Tahoma,Geneva,sans-serif',
	text_weight: 'bold',
	text_size: '50',
	text_color: '000000',
	text_decimal: 'true',
	text_decimal_size: '30',
	
	count_down: null,
	count_down_expire: 'false',
};

$('.text-input').on('change', function(e)
{
	var text_font = $('#text-font').val() || default_val.text_font;
	var text_weight = $('#text-bold').prop('checked') ? 'bold' : 'normal';
	var text_size = $('#text-size').val() || default_val.text_size;
	var text_color = $('#text-color').val() || '#' + default_val.text_color;
	var text_decimal = $('#text-decimal').prop('checked');
	var text_decimal_size = $('#text-decimal-size').val() || default_val.text_decimal_size;
	
	var timer_style = $('#timer-style');
	if(timer_style.length === 0)
	{
		timer_style = $('<style>').attr({id: 'timer-style'});
		$('head').append(timer_style);
	}
	
	timer_style.html
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
	
	$('.decimal').toggleClass('hide', !text_decimal);
});

function onKeyUp(e)
{
	var key_code = e.keyCode;

	switch(true)
	{
	case (key_code >= 0x10 && key_code <= 0x12): // shift, ctrl, alt
		return;

	case (key_code >= 0x21 && key_code <= 0x2f):
		if(key_code === 0x2c || e.location !== KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) // print screen
			key_code += 0x100;
		break;
		
	case (key_code === 0x6f): // num /
	case (key_code === 0x90): // num lock
	case (key_code === 0xd && e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD): // enter
	case (key_code >= 0x5b && key_code <= 0x5d): // win, app
		key_code += 0x100;
		break;
	}
	
	e.target.value = (key_code < 0x10) ? '0' + key_code.toString(16) : key_code.toString(16);
}

$('#toggle-key')[0].onkeyup = onKeyUp;
$('#reset-key')[0].onkeyup = onKeyUp;

$('#toggle-key,#reset-key').on('input', function(e)
{
	e.target.value = '';
});

$('#generate-file-btn').on('click', function(e)
{
	var count_down =
		(parseInt($('#count-down-hour').val()) || 0) * 3600 +
		(parseInt($('#count-down-min').val()) || 0) * 60 +
		(parseInt($('#count-down-sec').val()) || 0);
	
	var val =
	{
		hotkey_toggle: $('#toggle-key').val() || default_val.hotkey_toggle,
		hotkey_toggle_alt: ($('#toggle-key').val() !== '' ? ($('#toggle-key-alt').prop('checked') ? 'true' : 'false') : default_val.hotkey_toggle_alt),
		hotkey_toggle_ctrl: ($('#toggle-key').val() !== '' ? ($('#toggle-key-ctrl').prop('checked') ? 'true' : 'false') : default_val.hotkey_toggle_ctrl),
		hotkey_toggle_shift: ($('#toggle-key').val() !== '' ? ($('#toggle-key-shift').prop('checked') ? 'true' : 'false') : default_val.hotkey_toggle_shift),

		hotkey_reset: $('#reset-key').val() || default_val.hotkey_reset,
		hotkey_reset_alt: ($('#reset-key').val() !== '' ? ($('#reset-key-alt').prop('checked') ? 'true' : 'false') : default_val.hotkey_reset_alt),
		hotkey_reset_ctrl: ($('#reset-key').val() !== '' ? ($('#reset-key-ctrl').prop('checked') ? 'true' : 'false') : default_val.hotkey_reset_ctrl),
		hotkey_reset_shift: ($('#reset-key').val() !== '' ? ($('#reset-key-shift').prop('checked') ? 'true' : 'false') : default_val.hotkey_reset_shift),
		
		text_font: $('#text-font').val() || default_val.text_font,
		text_weight: $('#text-bold').prop('checked') ? 'bold' : 'normal',
		text_size: $('#text-size').val() || default_val.text_size,
		text_color: ($('#text-color').val() || default_val.text_color).replace(/^#/, ''),
		text_decimal: $('#text-decimal').prop('checked') ? 'true' : 'false',
		text_decimal_size: $('#text-decimal-size').val() || default_val.text_decimal_size,
		
		count_down: ($('#count-down').prop('checked') && count_down > 0) ? count_down : default_val.count_down,
		count_down_expire: ($('#count-down').prop('checked') && count_down > 0) ? ($('#count-down-expire').prop('checked') ? 'true' : 'false') : default_val.count_down_expire,
	};

	var query = [];
	
	for(var prop in default_val)
	{
		if(val.hasOwnProperty(prop) && val[prop] !== default_val[prop])
			query.push(prop + '=' + encodeURIComponent(val[prop]));
	}

	var query_str = '';
	
	if(query.length)
		query_str = '?' + query.join('&');

	var content =
		'<!DOCTYPE html><html><head>\r\n' +
			'\t<meta http-equiv=\'refresh\' content=\'0; url=index.html' + query_str + '\'>\r\n' +
		'</head></html>';
	
	saveToFile('timer.html', content);
});

function saveToFile(filename, data)
{
	if(window.navigator.msSaveOrOpenBlob)
		window.navigator.msSaveOrOpenBlob(new Blob([data]), filename);
	else
	{
		var link = document.createElement('a');
		link.href = window.URL.createObjectURL(new Blob([data], {type: 'text/css'}));
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}

window.onload = function()
{
	$('.text-input').trigger('change');
};