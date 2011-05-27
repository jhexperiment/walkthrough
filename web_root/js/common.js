function generateSessionTable(session_list)
{
	var html = '<table id="session_table">'
					 +		'<tr>'
					 +			'<th class="action_col">&nbsp;</th>'
					 +			'<th>ID</th>'
				   +			'<th>Hash</th>'
				   +			'<th>Pupil</th>'
				   +			'<th>Tutor</th>'
				   +			'<th>Current Question</th>'
				   +			'<th>Question Name</th>'
				   +			'<th>Question Text</th>'
				   +			'<th>Question Image</th>'
				   +			'<th>Lesson</th>'
				   +			'<th>Lesson Plan</th>'
				   +			'<th>Class</th>'
				   +		'</tr>';

	var session_list_count = session_list.length;
	for (var i = 0; i < session_list_count; i++)
	{
		var bg_color = i % 2 == 0 ? 'bg1' : 'bg2';
		html +=			'<tr id="sess_' + i + '" class="session_row ' + bg_color + '">'
					 +			'<td class="action_col">'+ '' + '</td>'
					 +			'<td id="id">'+ session_list[i].id + '</td>'
				   +			'<td id="hash">'+ session_list[i].hash + '</td>'
				   +			'<td id="pupil">'+ session_list[i].pupil + '</td>'
				   +			'<td id="tutor">'+ session_list[i].tutor + '</td>'
				   +			'<td id="progress_index">'+ session_list[i].progress_index + '</td>'
				   +			'<td id="question_name">'+ session_list[i].question_name + '</td>'
				   +			'<td id="question_text">'+ session_list[i].question_text + '</td>'
				   +			'<td id="question_image">'+ session_list[i].question_image + '</td>'
				   +			'<td id="lesson_name">'+ session_list[i].lesson_name + '</td>'
				   +			'<td id="lesson_plan_name">'+ session_list[i].lesson_plan_name + '</td>'
				   +			'<td id="class_name">'+ session_list[i].class_name + '</td>'
				   +		'</tr>';
	}
	html		+= '</table>';
	return html;

}

function generateSessionChooser(session_list)
{
	var html = '<div id="session_chooser">';
	var session_list_count = session_list.length;
	for (var i = 0; i < session_list_count; i++)
	{
		var pupil_url = '';
		var tutor_url = '';

		if (session_list[i].pupil_Images_id == null || session_list[i].pupil_Images_id == '')
			{pupil_url = '/images/pupil_default.gif';}

		if (session_list[i].tutor_Images_id == null || session_list[i].tutor_Images_id == '')
			{tutor_url = '/images/tutor_default.png';}

		html +=			'<div class="session_icon">'
					+				'<div class="session_tutor">'
					+					'<img src="' + tutor_url + '">' 
					+					'<div>' + session_list[i].tutor_name + '</div>'
					+				'</div>'
					+				'<div class="session_pupil">'
					+					'<img src="' + pupil_url + '">'
					+					'<div>' + session_list[i].pupil_name + '</div>'
					+				'</div>'
					+				'<div class="session_hash">'
					+					'<div class="label">Session:</div>'
					+					'<div class="value">' + session_list[i].hash + '</div>'
					+				'</div>'
					+				'<div class="session_open">'
					+					'<input type="button" name="sess_open_' + i + '" value="Open" '
					+							'class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only">'
					+				'</div>'

					+			'</div>'
	}
	html		+= '</div>';
	return html;

}

function getData(url, data_type, data, success_function)
{
	data['action'] = 'get';
	data['type'] = data_type;
	$.ajax(
	{
		'type':'GET',
		'url': url,
		'data': data,
		'success': success_function
	});
}

function getDataList(url, data_type, data, success_function)
{
	data['action'] = 'get_list';
	data['type'] = data_type;
	$.ajax(
	{
		'type':'GET',
		'url': url,
		'data': data,
		'success': success_function
	});
}

function postData(url, data_type, data, success_function)
{
	data['action'] = 'update';
	data['type'] = data_type;
	$.ajax(
	{
		'type':'POST',
		'url': url,
		'data': data,
		'success': success_function
	});
}


var util =
{
	'isEmpty': function(obj) 
	{
		var typeof_obj = typeof obj;
		var is_empty = false;

switch (typeof_obj)
		{
			case 'boolean':
				is_empty = (obj === false);
				break;

			case 'number':
				is_empty = isNaN(obj);
				break;

			case 'string':
				is_empty = (obj === "");
				break;

			case 'object':
				is_empty = ((obj instanceof Date && ! isNaN(Number(obj))))
								? false
								: $.isEmptyObject(obj);
				is_empty = is_empty || (obj != null && obj.length == 0);
				break;

			case 'undefined':
				is_empty = true;
				break;
		}

		return is_empty;
	}
}