$(document).ready(function()
{
	thisPage.init();

	$(window).load(function()
	{
		
	});
});

var tableControls = {
	'init': function() {
		$("#page-controls #checkbox_control .ui-icon-triangle-1-s").click(tableControls.dropdownMenuClick);
		$("#page-controls #checkbox_control input").attr("checked", false);
		$("#page-controls #checkbox_control input").click(tableControls.checkboxClick);
		$("#page-controls #new_walkthrough").click(tableControls.newWalkthroughClick);
		$("#page-controls #export_walkthrough").click(tableControls.exportCsvWalkthroughClick);
		$("#page-controls #delete_walkthrough").click(tableControls.deleteWalkthroughClick);
		$("#page-controls #print_walkthrough").click(tableControls.printWalkthroughClick);
		
	},
	'dropdownMenuClick': function() {
		var offset = $("#checkbox_control").offset();
		$("#select_popup").css('top', offset.top + 18);
		$("#select_popup").css('left', offset.left);
		$("#select_popup").slideDown(500, function(){});
	},
	'checkboxClick': function() {
		$(".walkthrough_row #checkbox input").attr("checked", $(this).attr("checked"));
	},
	'exportCsvWalkthroughClick': function() {

		var selected_walkthrough_rows = $(".walkthrough_row #checkbox input:checked");

		var full_checkbox_group_list = {};
		var full_counter_list = {};
		var full_timer_list = {};

		$.each(selected_walkthrough_rows, function() {
			var walkthrough_row = $(this).parent("#checkbox").parent(".walkthrough_row");
			var info = walkthrough_row.data("info");

			$.each(info.checkbox_list, function() {
				full_checkbox_group_list[this.label] = this.label;
			});

			$.each(info.counter_list, function() {
				full_counter_list[this.label] = this.label;
			});

			$.each(info.timer_list, function() {
				full_timer_list[this.label] = this.label;
			});
		});

		var checkbox_group_list = [];
		var counter_list = [];
		var timer_list = [];
		$.each(full_checkbox_group_list, function(index) {
			checkbox_group_list.push(full_checkbox_group_list[index]);
		});
		$.each(full_counter_list, function(index) {
			counter_list.push(full_counter_list[index]);
		});
		$.each(full_timer_list, function(index) {
			timer_list.push(full_timer_list[index]);
		});


		var header_info = [
			'id',
			'observer_name',
			'teacher_name',
			'create_time',
			'start_time',
			'end_time',
			'duration',
			'grade_level',
			'subject_name',
			'thinking_map_name',
			'notes',
			'comments'
		];
		
		var header_string = '"' 
											+ header_info.concat(checkbox_group_list, counter_list, timer_list).join('","')
											+ '"' + "\n";

		var export_string = '';

		$.each(selected_walkthrough_rows, function(){
			var walkthrough_row = $(this).parent("#checkbox").parent(".walkthrough_row");
			var info = walkthrough_row.data("info");
			var notes = util.isEmpty(info.notes) ? null : info.notes.replace("\n", ' ');
			var comments = util.isEmpty(info.comments) ? null : info.comments.replace("\n", ' ');
			var duration = thisPage.calculateDuration(info.start_timestamp, info.end_timestamp);

			var create_timestamp = info.create_timestamp == null ? '' :
														$.PHPDate('M d, h:i a', new Date(info.create_timestamp * 1000));
			var start_timestamp = info.start_timestamp == null ? '' :
														$.PHPDate('M d, h:i a', new Date(info.start_timestamp * 1000))
			var end_timestamp = info.end_timestamp == null ? '' :
														$.PHPDate('M d, h:i a', new Date(info.end_timestamp * 1000))
			
			var export_info = [
				info.id,
				info.observer_name,
				info.teacher_name,
				create_timestamp,
				start_timestamp,
				end_timestamp,
				duration,
				info.grade_level,
				info.subject_name,
				info.thinking_map_name,
				notes,
				comments
			];
			export_string += '"' + export_info.join('","') + '"';
			$.each(checkbox_group_list, function() {
				var label = this.toString();
				var value = 0;

				$.each(info.checkbox_list, function() {
					if (this.label == label) {
						$.each(this.option_list, function() {

							if (this.checked == "1") {
								value++;
							}

						});
						return false;
					}
				});
				export_string += ',' + value;
			});
			

			$.each(counter_list, function() {
				var label = this.toString();
				var value = 0;
				$.each(info.counter_list, function() {
					if (this.label == label) {
						value = this.val == null ? 0 : this.val;
						return false;
					}
				});
				export_string += ',' + value;
			});

			$.each(timer_list, function() {
				var label = this.toString();
				var value = 0;
				$.each(info.timer_list, function() {
					if (this.label == label) {
						value = this.seconds == null ? 0 : Math.floor(this.seconds / 60);
						return false;
					}
				});
				export_string += ',' + value;
			});


			export_string += "\n";
		});

		if ((! util.isEmpty(selected_walkthrough_rows))) {
			$("#container").append('<form id="exportform" action="/export-csv.php" method="post" target="_blank"><input type="hidden" id="exportdata" name="exportdata" /></form>');
			$("#exportdata").val(header_string + export_string);
			$("#exportform").submit().remove();
		}

		$("#checkbox_control input").attr("checked", false);
		
	},

	'newWalkthroughClick': function() {
		window.location = "/index.php/forms_main?walkthrough_id=0";
	},
	'deleteWalkthroughClick': function() {
		var answer = confirm('Are you sure you want to delete these Walk Throughs?');
		if (answer) {
			var id_list = new Array();
			var selected_walkthrough_rows = $(".walkthrough_row #checkbox input:checked");
			$.each(selected_walkthrough_rows, function(){
				var walkthrough_row = $(this).parent("#checkbox").parent(".walkthrough_row");
				var info = walkthrough_row.data("info");
				id_list.push(info.id);
				walkthrough_row.remove();
			});

			if ((! util.isEmpty(id_list))) {
				postData('forms_main', 'delete_walkthrough', {'Walkthroughs_id': id_list}, function() {

				});
			}

			$("#checkbox_control input").attr("checked", false);
		}
	},
	'printWalkthroughClick': function() {
		var selected_walkthrough_rows = $(".walkthrough_row #checkbox input:checked");
		var walkthrough_list = [];
		$.each(selected_walkthrough_rows, function(){
			var walkthrough_row = $(this).parent("#checkbox").parent(".walkthrough_row");
			var info = walkthrough_row.data("info");
			walkthrough_list.push(info);
		});

		if ((! util.isEmpty(selected_walkthrough_rows))) {
			var post_info = {
				'walkthrough_list': walkthrough_list
			}
			postData('/print-preview.php', '', post_info, function(response_text) {
				var new_window = window.open('_new', 'printpreview');
				new_window.document.open();
				new_window.document.write(response_text);
				new_window.document.close();
			});
		}
		$("#checkbox_control input").attr("checked", false);
	}
}

var dateRangeDialog = {
	'init': function() {
		$("#date_range_dialog").dialog({
			'title': 'Select Date',
			'autoOpen': false,
			'modal': true,
			'width': "auto",
			'resizable': false,
			'closeOnEscape': true,
			'buttons': {
				'cancel': function() {
					$(this).dialog('close');
				},
				'select': function() {
					var start_timestamp = $("#date_range_dialog #dialog_start_time").datetimepicker('getDate')/1000;
					var end_timestamp = $("#date_range_dialog #dialog_end_time").datetimepicker('getDate')/1000;
					$.each($(".walkthrough_row"), function() {
						var info = $(this).data("info");
						
						if (! util.isEmpty(info.start_timestamp)) {
							if (start_timestamp <= info.start_timestamp && info.start_timestamp <= end_timestamp) {
								$(this).children("#checkbox").children("input").attr("checked", true);
							}
						}
					});
					$(this).dialog('close');
				}
			}
		});

		$("#date_range_dialog #dialog_start_time").datepicker();
		$("#date_range_dialog #dialog_end_time").datepicker();
	}
}

var selectPopup = {
	'init': function() {
		$("#select_popup").hide();
		$("#select_popup #today").click(selectPopup.selectToday);
		$("#select_popup #incomplete").click(selectPopup.selectIncomplete);
		$("#select_popup #date_range").click(selectPopup.selectDateRange);
	},
	'selectDateRange': function() {
		$("#date_range_dialog").dialog('open');
	},
	'selectIncomplete': function() {
		$(".walkthrough_row #checkbox input").attr("checked", false);
		
		$.each($(".walkthrough_row"), function() {
			var info = $(this).data("info");
			var now = new Date();
			if (util.isEmpty(info.end_timestamp)) {

				$(this).children("#checkbox").children("input").attr("checked", true);
			}
		});

		$("#checkbox_control input").attr("checked", true);
	},
	'selectToday': function() {
		$(".walkthrough_row #checkbox input").attr("checked", false);

		$.each($(".walkthrough_row"), function() {
			var info = $(this).data("info");
			var now = new Date();
			var start_time = new Date(info.start_timestamp * 1000);
			if (now.getMonth() == start_time.getMonth() &&
					now.getDay() == start_time.getDay() &&
					now.getFullYear() == start_time.getFullYear()) {

				$(this).children("#checkbox").children("input").attr("checked", true);
			}
		});

		$("#checkbox_control input").attr("checked", true);
	}
};


// Page
var thisPage =
{
	'init': function()
	{
		$("body").click(function() {
			$("#select_popup").hide();
		});
		
		dateRangeDialog.init();
		selectPopup.init();
		tableControls.init();
		this.loadWalkthroughList();
		
	},
	'walkthroughRowCheckboxClick': function() {
		$("#page-controls #checkbox_control input").attr("checked", true);
	},
	'calculateDuration': function(start_timestamp, end_timestamp)
	{
		var duration = 0;
		var duration_string = 'incomplete';
		if (! util.isEmpty(end_timestamp))
		{
			duration = parseInt(end_timestamp) - parseInt(start_timestamp)
			duration /= 60;
			duration_string = Math.ceil(duration) + ' m';
		}

		if (duration > 60)
		{
			var hours = Math.floor(duration / 60);
			var mins = duration - (hours * 60);
			duration_string = hours + ' h ' + Math.ceil(mins) + ' m';
		}

		return duration_string;
	},
	'loadPdfView': function()
	{
		var Observer_Users_id = $.cookie('walkthrough_observer_Users_id');
		var post_info =
		{
			'Observer_Users_id':Observer_Users_id
		};

		var html = '<div id="walkthrough_info_controls">'
						 +		'<input id="print_all" type="button" value="Print All" class="ui-corner-all ui-button ui-state-default ui-button-text-only"> '
						 + '</div>';
		var html_dom = $(html);
		html_dom.children('#print_all').click(function()
		{
			$("#container").jqprint();
		});

		$("#container").append(html_dom);

		getDataList('reports_walkthrough', 'walkthrough_list', post_info, function(response_text)
		{
			var walkthrough_list = eval(response_text);
			
			$.each(walkthrough_list, function(index)
			{
				var walkthrough_info = this;

				

				var duration_string = thisPage.calculateDuration(walkthrough_info.start_timestamp, walkthrough_info.end_timestamp);
				
				var start_timestamp = (util.isEmpty(walkthrough_info.start_timestamp)) ?
														'' : $.PHPDate('h:i a', new Date(walkthrough_info.start_timestamp * 1000));
				var end_timestamp = (util.isEmpty(walkthrough_info.end_timestamp)) ?
														'' : $.PHPDate('h:i a', new Date(walkthrough_info.end_timestamp * 1000));
				var create_time = new Date(walkthrough_info.create_timestamp * 1000);
				var create_date = new Date(create_time.getFullYear(), create_time.getMonth(), create_time.getDay());
				var date = $.PHPDate('M d Y', create_date);

				var teacher_name = (util.isEmpty(walkthrough_info.teacher_name)) ? '' : walkthrough_info.teacher_name;
				var observer_name = (util.isEmpty(walkthrough_info.observer_name)) ? '' : walkthrough_info.observer_name;
				var grade_level = (util.isEmpty(walkthrough_info.grade_level)) ? '' : walkthrough_info.grade_level;
				var subject_name = (util.isEmpty(walkthrough_info.subject_name)) ? '' : walkthrough_info.subject_name;
				var thinking_map_name = (util.isEmpty(walkthrough_info.thinking_map_name)) ? '' : walkthrough_info.thinking_map_name;
				var buddybuzz = (util.isEmpty(walkthrough_info.buddybuzz)) ? 0 : walkthrough_info.buddybuzz;
				var choral_response = (util.isEmpty(walkthrough_info.choral_response)) ? 0 : walkthrough_info.choral_response;
				var call_outs = (util.isEmpty(walkthrough_info.call_outs)) ? 0 : walkthrough_info.call_outs;
				var notes_full = (util.isEmpty(walkthrough_info.notes)) ? '' : walkthrough_info.notes;
				var max_length = 25;
				var notes_brief = notes_full.substr(0, max_length);
				notes_brief += (notes_full.length > max_length) ? '...' : '';
				var comments_full = (util.isEmpty(walkthrough_info.comments)) ? '' : walkthrough_info.comments
				var comments_brief = comments_full.substr(0, max_length);
				comments_brief += (comments_full.length > max_length) ? '...' : '';

				var walkthrough_info_container_html =
										'<div id="walkthrough_info_container" class="ui-widget-content">'
								 +		'<div id="print_button" class="data_point">'
								 +			'<div class="input">'
								 +				'<input type="button" value="Print One" class="ui-corner-all ui-button ui-state-default ui-button-text-only">'
								 +			'</div>'
								 +		'</div><br>'

								 +		'<div id="teacher" class="data_point">'
								 +			'<div class="label">Teacher:</div>'
								 +			'<div class="text">' + teacher_name + '</div>'
								 +		'</div><br>'

								 +		'<div id="title">Classroom Walkthrough Report</div><br>'

								 +		'<div id="date" class="data_point">'
								 +			'<div class="label">Date:</div>'
								 +			'<div class="text">' + date + '</div>'
								 +		'</div><br>'
								 +		'<div id="observer" class="data_point">'
								 +			'<div class="label">Observered By:</div>'
								 +			'<div class="text">' + observer_name + '</div>'
								 +		'</div><br>'
							 
								 +		'<div id="start_timestamp" class="data_point">'
								 +			'<div class="label">Time:</div>'
								 +			'<div class="text">' + start_timestamp + '</div>'
								 +		'</div>'
								 +		'<div id="end_timestamp" class="data_point">'
								 +			'<div class="label">to</div>'
								 +			'<div class="text">' + end_timestamp + '</div>'
								 +		'</div>'
								 +		'<div id="duration" class="data_point">'
								 +			'<div class="label">for</div>'
								 +			'<div class="text">' + duration_string + '</div>'
								 +		'</div><br>'
								 +		'<div id="subject" class="data_point">'
								 +			'<div class="label">Subject:</div>'
								 +			'<div class="text">' + subject_name + '</div>'
								 +		'</div><br>'

								 +		'<div id="choral_response" class="data_point">'
								 +			'<div class="label">Choral:</div>'
								 +			'<div class="text">' + choral_response + '</div>'
								 +		'</div>'
								 +		'<div id="buddybuzz" class="data_point">'
								 +			'<div class="label">BuddyBuzz:</div>'
								 +			'<div class="text">' + buddybuzz + '</div>'
								 +		'</div>'
								 +		'<div id="call_outs" class="data_point">'
								 +			'<div class="label">Call Outs:</div>'
								 +			'<div class="text">' + call_outs + '</div>'
								 +		'</div><br>'
							 
								 +		'<div id="checkbox_lists"></div><br>'
								 +		'<div id="comments" class="data_point">'
								 +			'<div class="label">Comments:</div><br>'
								 +			'<div class="text">' + comments_full + '</div>'
								 +		'</div>'
								 
								 + '</div>';

				var walkthrough_info_container_dom = $(walkthrough_info_container_html);
				walkthrough_info_container_dom.children('#print_button').children('.input').children('input').click(function()
				{
					$(this).parent('.input').parent('#print_button').parent('#walkthrough_info_container').jqprint();
				});

				$.each(walkthrough_info.checkbox_list, function(index)
				{
					var checkbox_list_info = this;
					var checkbox_container = '<div class="checkbox_container">'
																 +		'<div class="header">'
																 +			'<div class="title">' + checkbox_list_info.label + '</div>'
																 +		'</div>'
																 +		'<div class="checkbox_list"></div>'
																 + '</div>';
					var checkbox_container_dom = $(checkbox_container);

					$.each(checkbox_list_info.option_list, function(index)
					{
						var checked = (this.checked == '1') ? 'checked="checked"' : '';
						var html = '<div class="data">'
										 +		'<div class="input">'
											 +			'<input name="' + this.id + '" type="checkbox" ' + checked + ' disabled="disabled"	>'
										 +		'</div>'
										 +		'<div class="label">'
										 +			this.name
										 +		'</div>'
										 + '</div><br>';
						var html_dom = $(html);

						checkbox_container_dom.children('.checkbox_list').append(html_dom);
					});

					walkthrough_info_container_dom.children("#checkbox_lists").append(checkbox_container_dom);
				});

				



				$("#container").append(walkthrough_info_container_dom);

				
				
			});
			
		});
	},
	'loadWalkthroughList': function(from_date_timestamp)
	{
		from_date_timestamp = (util.isEmpty(from_date_timestamp)) ? '' : from_date_timestamp;

		var Observer_Users_id = $.cookie('walkthrough_observer_Users_id');
		var post_info =
		{
			'Observer_Users_id':Observer_Users_id,
			'from_date_timestamp': from_date_timestamp
		};
		getDataList('reports_walkthrough', 'walkthrough_list', post_info, function(response_text)
		{
			var walkthrough_list = eval(response_text);

			var table_html = '<div id="walkthrough_table" class="ui-widget-content">'
										 +		'<table>'
										 +			'<tr class="header">'
										 +				'<th id="checkbox" class="ui-state-default"></th>'
										 +				'<th id="teacher" class="ui-state-default">Teacher</th>'
										 +				'<th id="start_time" class="ui-state-default">Start Time</th>'
										 +				'<th id="duration" class="ui-state-default">Duration</th>'
										 //+				'<th id="grade" class="ui-state-default">Grade</th>'
										 +				'<th id="subject" class="ui-state-default">Subject</th>'
										 //+				'<th id="thinking_map" class="ui-state-default">Thinking Map</th>'
										 //+				'<th id="buddybuzz" class="ui-state-default">Buddybuzz</th>'
										 //+				'<th id="choral_response" class="ui-state-default">Choral</th>'
										 //+				'<th id="call_outs" class="ui-state-default">Call Outs</th>'
										 +				'<th id="notes" class="ui-state-default">Notes</th>'
										 +				'<th id="comments" class="ui-state-default">Comments</th>'
										 //+				'<th id="checkbox_list" class="ui-state-default">Checkbox Lists</th>'
										 +				'<th id="walkthrough_id" class="ui-state-default">ID</th>'
										 +			'</tr>'
										 +		'</table>'
										 +	'</div>';
			var table_html_dom = $(table_html);

			$.each(walkthrough_list, function(index)
			{
				var walkthrough_info = this;

				var duration_string = thisPage.calculateDuration(walkthrough_info.start_timestamp, walkthrough_info.end_timestamp);
				
				var start_timestamp = (util.isEmpty(walkthrough_info.start_timestamp))
														? ''
														: $.PHPDate('M d, h:i a', new Date(walkthrough_info.start_timestamp * 1000));
				var teacher_name = (util.isEmpty(walkthrough_info.teacher_name)) ? '' : walkthrough_info.teacher_name;
				var grade_level = (util.isEmpty(walkthrough_info.grade_level)) ? '' : walkthrough_info.grade_level;
				var subject_name = (util.isEmpty(walkthrough_info.subject_name)) ? '' : walkthrough_info.subject_name;
				var thinking_map_name = (util.isEmpty(walkthrough_info.thinking_map_name)) ? '' : walkthrough_info.thinking_map_name;
				var buddybuzz = (util.isEmpty(walkthrough_info.buddybuzz)) ? 0 : walkthrough_info.buddybuzz;
				var choral_response = (util.isEmpty(walkthrough_info.choral_response)) ? 0 : walkthrough_info.choral_response;
				var call_outs = (util.isEmpty(walkthrough_info.call_outs)) ? 0 : walkthrough_info.call_outs;
				var notes_full = (util.isEmpty(walkthrough_info.notes)) ? '' : walkthrough_info.notes;
				var max_length = 25;
				var notes_brief = notes_full.substr(0, max_length);
				notes_brief += (notes_full.length > max_length) ? '...' : '';
				var comments_full = (util.isEmpty(walkthrough_info.comments)) ? '' : walkthrough_info.comments
				var comments_brief = comments_full.substr(0, max_length);
				comments_brief += (comments_full.length > max_length) ? '...' : '';

				var checkbox_view_html = '<a href="#">'
															 +		'view &nbsp;'
															 +		'<div class="ui-state-default ui-corner-all">'
															 +			'<span class="ui-icon ui-icon-zoomin"></span>'
															 +		'</div>'
															 + '</a>'
				var checkbox_list = util.isEmpty(walkthrough_info.checkbox_list) ? '' : checkbox_view_html

				var html = '<tr class="walkthrough_row">'
								 +		'<td id="checkbox"><input type="checkbox"></td>'
								 +		'<td id="teacher">'  +				teacher_name	 +		'</td>'
								 +		'<td id="start_time">' +	start_timestamp +		'</td>'
								 +		'<td id="duration">' +				duration_string +		'</td>'
								 //+		'<td id="grade">' 	 +				grade_level		 +		'</td>'
								 +		'<td id="subject">'  +				subject_name	 +		'</td>'
								 //+		'<td id="thinking_map">' +				thinking_map_name +		'</td>'
								 //+		'<td id="buddybuzz">' +				buddybuzz +		'</td>'
								 //+		'<td id="choral_response">'  +				choral_response +		'</td>'
								 //+		'<td id="call_outs">' +				call_outs +		'</td>'
								 +		'<td id="notes" title="' + notes_full + '">'  +				notes_brief +		'</td>'
								 +		'<td id="comments" title="' + comments_full + '">'  +				comments_brief +		'</td>'
								 //+		'<td id="checkbox_list">'  +				checkbox_list +		'</td>'
								 +		'<td id="walkthrough_id">' +	walkthrough_info.id +		'</td>'
								 + '</tr>';
				var html_dom = $(html);
				html_dom.data('info', walkthrough_info);
				
				html_dom.children("#checkbox").children("input").click(thisPage.walkthroughRowCheckboxClick);

				table_html_dom.children('table').append(html_dom);
			});

			$("#container").append(table_html_dom);

			$("#container").resizable(
			{
				'enabled': true,
				'ghost': true,
				helper: 'ui-state-highlight',
				handles: 'se, s, e',
				alsoResize: '#walkthrough_table',
				minWidth: 1000
			});

			$("#walkthrough_table tr").doubletap(
				function(event) {
						var walkthrough_id = $("tr:hover").children("#walkthrough_id").html();
						window.location = "/index.php/forms_main?walkthrough_id=" + walkthrough_id;
				},
				function(event) {
						
				},
				400
			);

			
		});
	}
};

