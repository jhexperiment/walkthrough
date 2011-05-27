$(document).ready(function()
{
	thisPage.init();	 
	
	$(window).load(function()
	{
		
	});
});

var checkboxGroupDialogButtons = {
	'_name': 'walkthrough',
	'delete': function()
	{
		var answer = confirm('Are you sure you want to delete the "'
													+ $(this).data("obj_ref").info().label
													+ '" checkbox list.');
		if (answer) {
			var info = $(this).data("obj_ref").info();


			postData('forms_main', 'delete_checkbox_group', info, function() {
				window.location.reload();
			});
			$(this).dialog('close');
		}
		
	},
	'close': function()
	{
		$(this).dialog('close');
	},
	'cancel': function()
	{
		$(this).dialog('close');
	},
	'add': function()
	{
		var info = $(this).data("obj_ref").info();
		if ($(this).data("obj_ref").add(info))
		{
			$(this).dialog('close');
			thisPage.loadCheckboxGroupList($("#checkbox_controls select"));
		}
	},
	'save': function()
	{
		var info = $(this).data("obj_ref").info();
		
		if ($(this).data("obj_ref").save($.extend({}, info)))
			{ $(this).dialog('close'); }
	}
};


var checkboxGroupDialog = {
	'_name': 'walkthrough',
	'_title': 'Checkbox Group',
	'_buttons': checkboxGroupDialogButtons,
	'init': function()
  {
		var this_dialog_css_id = "#" + this._name + "_dialog";

		var add_checkbox_button_dom = $(this_dialog_css_id + ' #controls #add_checkbox_button');
		add_checkbox_button_dom.data('appendToDom', $(this_dialog_css_id + ' #checkbox_list'));
		add_checkbox_button_dom.click(function() {
			var info = {
				'action': 'add'				
			};
			checkboxGroupDialog.printCheckbox(info);
		});

		
		var this_dialog_dom = $(this_dialog_css_id);
		this_dialog_dom.data("obj_ref", this);
		this_dialog_dom.dialog({
			'autoOpen': false,
			'modal': true,
			'width': "auto",
			'resizable': false,
			'closeOnEscape': true
		});
  },
	'createCheckboxOptionDom': function(info) {
		var id = ! util.isEmpty(info.id) ? '' + info.id : '';
		var name = ! util.isEmpty(info.name) ? info.name : '';

		var html = '<div class="data">'
							 +		'<input type="hidden" id="option_id" value="' + id + '">'
							 +		'<div class="input">'
							 +			'<input type="checkbox" disabled="disabled">'
							 +		'</div>'
							 +		'<div class="label">'
							 +			'<input type="text" required="required" value="' + name +'">'
							 +		'</div>'
							 +		'<div class="delete_button ui-state-error ui-corner-all" title="Remove">'
							 +			'<span class="ui-icon ui-icon-circle-close"></span>'
							 +		'</div>'
							 + '</div><br>';
						 
		var option_dom = $(html);
		option_dom.data('info', info);

		option_dom.children('.delete_button').click(function() {
			$(this).parent('.data').next('br').remove();
			$(this).parent('.data').hide();
			$(this).parent('.data').data('info').action = 'delete';
		});

		return option_dom;
	},
	'printCheckbox': function(info) {
		$("#walkthrough_dialog #checkbox_list").append(this.createCheckboxOptionDom(info))
	},
	'close': function() {
		return function()
		{
			
			$(".validation_error_box").remove();
			$(".pullout_image_list").remove();
		};
	},
	'drag':function (event, ui)
	{
		$(".validation_error_box").remove();
		$(".pullout_image_list").remove();
	},
  'open': function(type, info)
  {
		// Clear valdiation box
		$(".validation_error_box").remove();

		// prepare dialog buttons
		var dialog_buttons = $.extend(true, {}, this._buttons);
		delete dialog_buttons._name;


		// show-hide dialog buttons
		var open_event = null;
		switch (type)
		{
			case 'New':
			open_event = function(event, ui)
			{
				$('.ui-dialog-buttonset button:contains(add)').show();
				$('.ui-dialog-buttonset button:contains(cancel)').show();
				$('.ui-dialog-buttonset button:contains(close)').hide();
				$('.ui-dialog-buttonset button:contains(save)').hide();
				$('.ui-dialog-buttonset button:contains(delete)').hide();
			};
			break;

			case 'Edit':
			open_event = function(event, ui)
			{
				$('.ui-dialog-buttonset button:contains(cancel)').show();
				$('.ui-dialog-buttonset button:contains(add)').hide();
				$('.ui-dialog-buttonset button:contains(close)').hide();
				$('.ui-dialog-buttonset button:contains(save)').show();
				$('.ui-dialog-buttonset button:contains(delete)').show();
			};
			break;
		}

		// set dialog options
		var options =
		{
			'buttons': dialog_buttons,
			'close': this.close(),
			'drag': this.drag,
			'title': type + " " + this._title,
			'open' : open_event
		};

		// display dialog
		var dialog_dom = $("#" + this._name + "_dialog");
		dialog_dom.dialog(options);
		dialog_dom.dialog('open');

		// clear dialog
		$("#walkthrough_dialog #label .input input").val('');
		$("#walkthrough_dialog #checkbox_list").empty();

		// hide all tooltips
		$(".tooltip").hide();

		// New checkboxGroups will have no info
		if (! util.isEmpty(info))
		{
			// Edit chekboxGroups. Load checkboxGroup info into dialog
			$("#walkthrough_dialog #WalkthroughOptionLists_id").val(info.id);
			$("#walkthrough_dialog #label .input input").val(info.label);
			if (! util.isEmpty(info.checkbox_list)) {
				$.each(info.checkbox_list, function() {
					var checkbox_info = $(this)[0];
					checkbox_info.action = 'update';
					checkboxGroupDialog.printCheckbox(checkbox_info);
				});
			}
		}
  },
  'add': function(info)
  {
		var post_info = $.extend(true, {}, info);

		delete post_info['icon'];
		delete post_info['id'];
		if (this.validate())
		{
			postData('forms_main', 'new_checkbox_group', post_info, function(response_text)
			{
				
			});
			return true;
		}
		else
		{
			setTimeout('$("#' + this._name + '_dialog").data("obj_ref")._validation_show_errors()', 750);
			return false;
		}
  },
  'save': function(info)
  {
		var update_callback = function(dialog_name)
		{
			return function()
			{
				window.location.reload();
				/*
				$("#checkbox_controls select option[value='" + info.WalkthroughOptionLists_id + "']").html(info.label);
				$.each($(".checkbox_group"), function() {
					if ($(this).data("info").id == info.WalkthroughOptionLists_id) {
						$(this).children(".header").children(".title").html(info.label);
						return false;
					}
				});
				*/
			};
		}

		if (this.validate()) {
			postData('forms_main', 'update_checkbox_group', info, update_callback(this._name));
			return true;
		} else {
			return false;
		}

  },
  'remove': function(info)
  {
		var answer = confirm("Deleting this checkbox group list will remove them from all walkthroughs, do you want to continue?");
		if (answer) {
			$("#" + this._name + "_panel ." + this._name + "_icon input[value='" + info['id'] + "']").parent().remove();
			postData('config', 'delete_' + this._name, info, function(response_text) {
				//$("#checkbox_controls select option[value='" + info.id + "']").remove();
				//window.location.reload();
			});
		}
  },
	'info': function()
	{
		var info = {};
		var dialog_css_id = '#' + this._name + '_dialog';

		info.WalkthroughOptionLists_id = $("#walkthrough_dialog #WalkthroughOptionLists_id").val();
		
		info.label = $(dialog_css_id + ' #label .input input').val();

		var checkbox_list = {};
		$.each($(dialog_css_id + ' #checkbox_list .data'), function(index)
		{
			var checkbox_info = $(this).data('info');
			checkbox_info.name = $(this).children('.label').children('input').val();
			checkbox_list[index] = checkbox_info;
		});

		info.checkbox_list = checkbox_list;
		return info;
	},
	'_validation_error_list': null,
	'_validation_show_errors': function ()
	{
		$.each(this._validation_error_list, function(key, element)
		{
			var msg = util.isEmpty(element.val()) ? 'Required.' : element.attr('not_valid_msg');

			var data_point_dom = $('body');
			var html = '<div class="validation_error_box">'
							 +		msg
							 + '</div>';
			var html_dom = $(html);
			var left = element.offset().left + element.width() + parseInt(element.css('margin-left'));
					//left += parseInt(element.css('padding-left')) + parseInt(element.css('padding-right'));
			html_dom.css('left', left);
			html_dom.css('top', element.offset().top);
			html_dom.css('z-index', 2000);

			data_point_dom.append(html_dom);
			html_dom.hide();
			html_dom.animate(
			{
				'width': 'toggle'
			},
			500,
			'linear');

		});
	},
	'validate': function()
	{
		$(".validation_error_box").remove();

		var dialog_css_id = '#' + this._name + '_dialog';

		var required_list = {};

		//var checkbox_label_dom_list = $()
		$.each($(dialog_css_id + " input[type='text']"), function(index)
		{
			if ($(this).attr("required") == 'required')
				{required_list[index] = $(this);}
		});

		this._validation_error_list = {};

		var dialog_obj_ref = this;
		$.each(required_list, function(key, element)
		{
			var value = element.val();

			if (util.isEmpty(value))
				{dialog_obj_ref._validation_error_list[key] = element;}
			else
			{
				var pattern = element.attr("pattern");
				if (! util.isEmpty(pattern))
				{
					var regex = new RegExp(pattern);
					if (! regex.test(value))
						{dialog_obj_ref._validation_error_list[key] = element;}
				}
			}
		});

		if (util.isEmpty(this._validation_error_list))
		{
			return true;
		}
		else
		{
			this._validation_show_errors();
			return false;
		}
	}
};

var timePickerDialog = {
	'_name': 'timepicker',
	'init': function()
  {
		var this_dialog_css_id = "#" + this._name + "_dialog";
		var this_dialog_dom = $(this_dialog_css_id);

		this_dialog_dom.data("obj_ref", this);


		$("#observation_time .input input").datetimepicker({
			ampm: true
		});
  },
	'open': function()
	{
		

	}
}


var checkboxGroupObj = {
	'addButtonClick': function() {
		var checkbox_group_info = $('#checkbox_controls #header select option:selected').data('info');

		if (util.isEmpty(checkbox_group_info))
			{$("#checkbox_controls select").focus();}
		else if (! checkboxGroupObj.checkboxGroupExistOnScreen(checkbox_group_info)) {
			checkbox_group_info.action = 'add';
			checkboxGroupObj.printToScreen(checkbox_group_info);
		}
	},
	'editButtonClick': function() {
		var id = $("#checkbox_controls select").val();
		if (! util.isEmpty(id)) {

			getData('forms_main', 'checkboxlist', { 'id': id }, function(response_text) {

				var info = eval(response_text)[0];
				checkboxGroupDialog.open('Edit', info);

			});

		}
		else {
			$("#checkbox_controls select").focus();
		}
	},
	'newButtonClick': function() {
		checkboxGroupDialog.open('New');
	},
	'createCheckboxGroupDom': function(info) {
		var html = '<div class="checkbox_group">'
						 +		'<div class="header">'
						 +			'<div class="title">' + info.label + '</div>'
						 +			'<div class="close_icon ui-state-default ui-corner-all">'
						 +				'<span class="ui-icon ui-icon-close"></span>'
						 +			'</div>'
						 +		'</div>'
						 +		'<div class="checkbox_list"></div>'
						 + '</div>';
		var dom = $(html);

		var close_icon_dom = dom.children('.header').children('.close_icon');
		close_icon_dom.hoverIntent(thisPage.buttonHoverOn, thisPage.buttonHoverOff);
		close_icon_dom.mousedown(thisPage.buttonMouseDown);
		close_icon_dom.mouseup(thisPage.buttonMouseUp);
		close_icon_dom.click(function() {
			var info = $(this).parent('.header').parent('.checkbox_group').data('info');
			postData('forms_main', 'remove_checkbox_group', info, function(response_text){});
			$(this).parent('.header').parent('.checkbox_group').remove();
		});

		this.createCheckboxListDom(info.checkbox_list, dom)


		dom.data('info', info);

		return dom;
	},
	'createCheckboxListDom': function(checkbox_list, container_dom) {

		if (util.isEmpty(container_dom)){
			container_dom = $('<div id="container"></div>')
		}

		if (! util.isEmpty(checkbox_list)) {
			$.each(checkbox_list, function(index)
			{
				var checked = (this.checked == '1') ? 'checked="checked"' : '';
				var html = '<div class="data">'
								 +		'<div class="input">'
									 +			'<input name="' + this.id + '" type="checkbox" ' + checked + '>'
								 +		'</div>'
								 +		'<div class="label">'
								 +			this.name
								 +		'</div>'
								 + '</div><br>';
				var checkbox_group_dom = $(html);
				checkbox_group_dom.children('.input').children('input').click(function()
				{
					var checkbox_group = $(this).parent('.input').parent('.data')
																					.parent('.checkbox_group').data('info');

					var checkbox_dom = $(this);
					$.each(checkbox_group.checkbox_list, function(index)
					{
						var checkbox_info = this;
						var selected_checkbox_id = parseInt(checkbox_dom.attr('name'));
						var cur_checkbox_id = parseInt(checkbox_info.id);
						if (selected_checkbox_id == cur_checkbox_id)
						{
							checkbox_info.checked = checkbox_dom.attr('checked') ? 1 : 0;
							return false;
						}
					});
				});

				container_dom.append(checkbox_group_dom);
			});
		}

		return container_dom;
	},
	'printToScreen': function(info) {
		
		info['Walkthroughs_id'] = parseInt($("#walkthrough_id").val());
		
		var checkbox_group_dom = this.createCheckboxGroupDom(info);

		$("#container #col3 #content").append(checkbox_group_dom);

		
	},
	'checkboxGroupExistOnScreen': function(info)
	{
		var exists = false;
		$.each($(".checkbox_group"), function(index)
		{
			var checkbox_list_info = $(this).data('info');

			if (checkbox_list_info.id == info.id)
			{
				exists = true;
				return false;
			}
		});

		return exists;
	},
	'getCheckboxGroupInfo': function() {
		var checkbox_group_list = [];
		$.each($(".checkbox_group"), function(index) {
			checkbox_group_list.push($(this).data('info'));
		});

		var info = {
			'Walkthroughs_id': $("#walkthrough_id").val(),
			'checkbox_group_list': checkbox_group_list
		};

		return info;
	}
};

// Page
var thisPage = {
	'init': function()
	{
		checkboxGroupDialog.init();
		timePickerDialog.init();

		$("#start_time .input input").click(function()
			{ timePickerDialog.open(); });

		var widget_list = $(".ui-button");
		widget_list.hoverIntent(thisPage.buttonHoverOn, thisPage.buttonHoverOff);
		widget_list.mousedown(thisPage.buttonMouseDown);
		widget_list.mouseup(thisPage.buttonMouseUp);

		
		$("#add_button").click(checkboxGroupObj.addButtonClick);
		$("#new_button").click(checkboxGroupObj.newButtonClick);
		$("#edit_button").click(checkboxGroupObj.editButtonClick);

		$("#new_counter").click(thisPage.newCounterClick);

		$("#new_timer").click(thisPage.newTimerClick);

		var count_dom = $(".inc_dec_widget #count");
		count_dom.keyup(thisPage.inc_dec_widget_Keypress);

		thisPage.loadTeachers($('#teacher .input select'));
		thisPage.loadGrades($('#grade .input select'));
		thisPage.loadSubjects($('#subject .input select'));
		thisPage.loadThinkingMaps($('#thinking_map .input select'));
		thisPage.loadCheckboxGroupList($('#checkbox_controls #header select'));
		thisPage.loadObserver($('#observer .text'));

		//$('#start_time .input input').click(thisPage.startTimeClick);

		$("#col1, #col2, #col3, #col4, #container br").hide();

		var load_prev_dom = $("#col5 #controls #load");
		load_prev_dom.click(thisPage.loadWalkthrough);
		
		var new_save_dom = $("#col5 #controls #new_save");
		new_save_dom.val('New');
		new_save_dom.unbind('click');
		new_save_dom.click(thisPage.createNewWalkthrough);

		var delete_dom = $("#col5 #controls #delete");
		delete_dom.hide();
		delete_dom.unbind('click');
		delete_dom.click(thisPage.deleteWalkthrough);

		var sign_out_dom = $("#sign_out_header a");
		sign_out_dom.click(thisPage.signOut);

		// walkthrough select box
		$("#col5 #controls #load, #col5 #controls #walkthrough_list").hide();
		var Observer_Users_id = $.cookie('walkthrough_observer_Users_id');
		getDataList('forms_main', 'walkthrough_list', {'Observer_Users_id':Observer_Users_id}, function(response_text) {
			var walkthrough_list = eval(response_text);

			var walkthrough_list_dom = $("#col5 #controls #walkthrough_list");
			if (! util.isEmpty(walkthrough_list)) {
				$("#col5 #controls #load, #col5 #controls #walkthrough_list").show();
				$.each(walkthrough_list, function(index) {
					var create_time = new Date(this.create_timestamp * 1000);
					var teacher_name = (this.Teacher_Users_id == null) ? 'Unknown' : this.Teacher_First_Name + ' ' + this.Teacher_Last_Name;
					var html = '<option value="' + this.id + '">' 
									 +		teacher_name + ' - ' + $.PHPDate('M d, h:i a', create_time)
									 + '</option>';
					walkthrough_list_dom.append(html);
				});
			}

			var walkthrough_id = $("#walkthrough_id").val();

			if (walkthrough_id === "0")
				{$("#controls #new_save").click();}
			else if (! util.isEmpty(walkthrough_id)) {
				$("#walkthrough_list option[value='" + walkthrough_id + "']").attr("selected", "selected");
				$("#controls #load").click();
			}
		});
	},
	'getWalkthroughInfo': function()
	{
		var start_timestamp = $("#start_time").datetimepicker('getDate')/1000;
		var end_timestamp = $("#end_time").datetimepicker('getDate')/1000;
		
		var info =
		{
			'id': parseInt($("#walkthrough_id").val()),
			'start_timestamp': start_timestamp,
			'end_timestamp': end_timestamp,
			//'choral_response': parseInt($("#choral #count").val()),
			//'buddybuzz': parseInt($("#buddybuzz #count").val()),
			//'call_outs': parseInt($("#call_outs #count").val()),
			'notes': $("#notes textarea").val(),
			'comments': $("#comments textarea").val(),
			'WalkthroughSubjects_id': parseInt($("#subject select option:selected").val()),
			'WalkthroughThinkingMaps_id': parseInt($("#thinking_map select option:selected").val()),
			'Grades_id': parseInt($("#grade select option:selected").val()),
			'Teacher_Users_id': parseInt($("#teacher select option:selected").val())
		}

		
		info['checkbox_group_list'] = checkboxGroupObj.getCheckboxGroupInfo().checkbox_group_list;

		var counter_list = new Array();
		$.each($(".counter_item"), function(index)
		{
			var counter_info = $(this).data('info');
			counter_info.label = $(this).children(".label").children("input").val();
			counter_info.val = parseInt($(this).children(".inc_dec_widget").children("#count").val());
			counter_list.push(counter_info);
		});

		info['counter_list'] = counter_list;

		var timer_list = new Array();
		$.each($(".timer_item"), function(index)
		{
			var timer_info = $(this).data('info');
			timer_info.label = $(this).children(".label").children("input").val();
			//timer_info.seconds = parseInt($(this).children(".count").children("input").val());
			timer_list.push(timer_info);
		});

		info['timer_list'] = timer_list;




		return info;
	},
	'showContent': function()
	{
		$("#col1, #col2, #col3, #col4, #container br").show();
		$("#col5 #controls #load, #col5 #controls #walkthrough_list").hide();
		$("#col5 #controls #delete").show();

		$("#col5 #controls .label").html('');
		var new_save_dom = $("#col5 #controls #new_save");
		new_save_dom.val('Save');
		new_save_dom.unbind('click');
		new_save_dom.click(thisPage.saveWalkthrough);
	},
	'loadWalkthrough': function()
	{
		$("#col5 #controls .label").html('Loading...');
		var Walkthroughs_id = parseInt($("#walkthrough_list option:selected").val());
		getData('forms_main', 'walkthrough', {'id':Walkthroughs_id}, function(response_text)
		{
			var walkthrough_info = eval( '(' + response_text + ')' );

			thisPage.showContent();

			
			$("#walkthrough_id").html(walkthrough_info.id);
			$("#notes textarea").val(walkthrough_info.notes)
			$("#comments textarea").val(walkthrough_info.comments);

			var startDate = new Date();
			if (! util.isEmpty(walkthrough_info.start_timestamp))
			{
				startDate = new Date(walkthrough_info.start_timestamp * 1000);
			}
			$("#observation_time #start_time").datetimepicker('setDate', startDate);

			if (! util.isEmpty(walkthrough_info.end_timestamp))
				{ $("#observation_time #end_time").datetimepicker('setDate', new Date(walkthrough_info.end_timestamp * 1000)); }
			else
				{ $("#observation_time #end_time").val(''); }

			
			$("#subject select option[value='" + walkthrough_info.WalkthroughSubjects_id + "']").attr('selected', 'selected');
			$("#thinking_map select option[value='" + walkthrough_info.WalkthroughThinkingMaps_id + "']").attr('selected', 'selected');
			$("#grade select option[value='" + walkthrough_info.Grades_id + "']").attr('selected', 'selected');
			$("#teacher select option[value='" + walkthrough_info.Teacher_Users_id + "']").attr('selected', 'selected');

			$.each(walkthrough_info.checkbox_group_list, function(index) {
				var checkbox_group = this;
				checkbox_group.action = 'update';
				if (! checkboxGroupObj.checkboxGroupExistOnScreen(checkbox_group)) { 
					checkboxGroupObj.printToScreen(checkbox_group); 
				}
			});

			$.each(walkthrough_info.counter_list, function(index) {
				this.count = parseInt(this.count);
				thisPage.generateCounter(this);
			});

			$.each(walkthrough_info.timer_list, function(index) {
				this.seconds = parseInt(this.seconds);
				thisPage.generateTimer(this);
			});

			thisPage.autoSave();
		});
	},
	'createNewWalkthrough': function()
	{
		$("#col5 #controls .label").html('Creating...');
		var Observer_Users_id = $.cookie('walkthrough_observer_Users_id');
		postData('forms_main', 'new_walkthrough', {'Observer_Users_id':Observer_Users_id}, function(response_text)
		{
			var walkthrough_id = response_text;
			$("#walkthrough_id").val(walkthrough_id);

			thisPage.showContent();
			
			$("#notes .input textarea").val('');
			$("#comments .input textarea").val('');

			$("#observation_time #start_time").datetimepicker('setDate', new Date());

			thisPage.newCounterClick('Choral Response');
			thisPage.newCounterClick('BuddyBuzz');
			thisPage.newCounterClick('Call Outs');

			thisPage.autoSave();
		});
	},
	'deleteWalkthrough': function()
	{
		var answer = confirm("Are you sure you want to delete this Walkthrough?");

		if (answer)
		{
			$("#col5 #controls .label").html('Deleting...');

			var Walkthroughs_id = parseInt($("#walkthrough_id").val());

			postData('forms_main', 'delete_walkthrough', {'Walkthroughs_id':Walkthroughs_id}, function(response_text)
			{
				window.location = "reports_walkthrough";
				/*
				$("#col5 #controls .label").html('');
				$("#col5 #controls #walkthrough_list option[value=" + Walkthroughs_id + "]").remove();

				
				var new_save_dom = $("#col5 #controls #new_save");
				new_save_dom.val('New');
				new_save_dom.unbind('click');
				new_save_dom.click(thisPage.createNewWalkthrough);
			 
				$("#col1, #col2, #col3, #col4, #container br").hide();
				$("#col5 #controls #load, #col5 #controls #walkthrough_list").show();
				$("#col5 #controls #delete").hide();
				*/

			});
		}
		
	},
	'saveWalkthrough': function()
	{
		var info = thisPage.getWalkthroughInfo();
		$.each(info, function(key, value)
		{
			if (util.isEmpty(value) || value === 0)
			{
				delete info[key];
			}
			
		});

		var tmp_info = $.extend({}, info);
		delete tmp_info.id;
		delete tmp_info.checkbox_list
		delete tmp_info.counter_list;
		if (! util.isEmpty(tmp_info))
		{
			postData('forms_main', 'update_walkthrough', info, function()
			{
				$.each($(".checkbox_group"), function() {
					var checkbox_group_dom = $(this);
					var checkbox_group_info = checkbox_group_dom.data('info');

					checkbox_group_info.action = 'update';

					$.each(checkbox_group_info.checkbox_list, function() {
						this.action = 'update';
					});

					checkbox_group_dom.data('info', checkbox_group_info);
				});
			});
		}

		
	},
	'resumeTimeClick': function()
	{
		$(this).val('Stop');
		$(this).removeClass('ui-state-highlight');
		$(this).addClass('ui-state-error');

		var timestamp = Math.round(new Date().getTime() / 1000);

		postData('forms_main', 'start_time', {'id': 135}, function(response_text)
		{
			var stop_time_info = eval('(' + response_text + ')');
			var text_dom = $("#start_time .text");
			var start_time_info = text_dom.data('start_time_info');
			text_dom.data('stop_time_info', stop_time_info);

			var duration = stop_time_info[0] - start_time_info[0];
			text_dom.append(' - ' + duration + ' secs');
			$('#start_time .input input').click(thisPage.stopTimeClick);
		});
	},
	'stopTimeClick': function()
	{
		$(this).val('Resume');
		$(this).removeClass('ui-state-error');
		$(this).addClass('ui-state-highlight');
		$(this).hide();


		var timestamp = new Date();

		var text_dom = $("#start_time .text");

		var duration = (timestamp.getTime() - text_dom.data('start_time').getTime()) / 1000;
		duration = Math.round(duration / 60);
		text_dom.append(' - ' + duration + ' mins');
		
		text_dom.data('end_time', timestamp);


		var button_dom = $('#start_time .input input');
		button_dom.unbind('click');
		button_dom.click(thisPage.resumeTimeClick);
	},
	'startTimeClick': function()
	{
		$(this).val('Stop');
		$(this).addClass('ui-state-error');
		

		//var timestamp = Math.round(new Date().getTime() / 1000);
		var timestamp = new Date();

		var text_dom = $("#start_time .text");

		text_dom.html($.PHPDate("h:i a", timestamp));
		text_dom.data('start_time', timestamp);
		var button_dom = $('#start_time .input input');
		button_dom.unbind('click');
		button_dom.click(thisPage.stopTimeClick);
	},
	'loadObserver': function(text_dom)
	{
		text_dom.html('Loading...');
		var observer_Users_id = $.cookie('walkthrough_observer_Users_id');
		getData('forms_main', 'observer', {'id': observer_Users_id}, function(response_text)
		{
			var observer_info = eval('(' + response_text + ')');
			text_dom.data('info', observer_info);
			text_dom.html(observer_info.first_name + ' ' + observer_info.last_name);
		});
	},
	'loadCheckboxGroupList': function(select_dom)
	{
		select_dom.html('<option>Loading...</option>');
		getDataList('forms_main', 'checkbox_group_list', {}, function(response_text)
		{
			var checkbox_group_list = eval(response_text);
			$.each(checkbox_group_list, function(index)
			{
				var checkbox_group_info = this;
				var html = '<option value="' + checkbox_group_info.id + '">' + checkbox_group_info.label + '</options>';
				var html_dom = $(html);
				html_dom.data('info', checkbox_group_info);
				select_dom.append(html_dom);
			});
			$(select_dom.children()[0]).html('');
		});
	},
	'loadThinkingMaps': function(select_dom)
	{
		select_dom.html('<option>Loading...</option>');
		getDataList('forms_main', 'thinkingmap_list', {}, function(response_text)
		{
			var thinkingmap_list = eval(response_text);
			$.each(thinkingmap_list, function(index)
			{
				var thinkingmap_info = this;
				var html = '<option value="' + thinkingmap_info.id + '">' + thinkingmap_info.name + '</options>';
				var html_dom = $(html);
				html_dom.data('info', thinkingmap_info);
				select_dom.append(html_dom);
			});
			$(select_dom.children()[0]).html('');
		});
	},
	'loadSubjects': function(select_dom)
	{
		select_dom.html('<option>Loading...</option>');
		getDataList('forms_main', 'subject_list', {}, function(response_text)
		{
			var subject_list = eval(response_text);
			$.each(subject_list, function(index)
			{
				var subject_info = this;
				var html = '<option value="' + subject_info.id + '">' + subject_info.name + '</options>';
				var html_dom = $(html);
				html_dom.data('info', subject_info);
				select_dom.append(html_dom);
			});
			$(select_dom.children()[0]).html('');
		});
	},
	'loadGrades': function(select_dom)
	{
		select_dom.html('<option>Loading...</option>');
		getDataList('forms_main', 'grade_list', {}, function(response_text)
		{
			var grade_list = eval(response_text);
			$.each(grade_list, function(index)
			{
				var grade_info = this;
				var html = '<option value="' + grade_info.id + '">' + grade_info.level + '</options>';
				var html_dom = $(html);
				html_dom.data('info', grade_info);
				select_dom.append(html_dom);
			});
			$(select_dom.children()[0]).html('');
		});
	},
	'loadTeachers': function(select_dom)
	{
		select_dom.html('<option>Loading...</option>');
		getDataList('forms_main', 'teacher_list', {}, function(response_text)
		{
			var teacher_list = eval(response_text);
			$.each(teacher_list, function(index)
			{
				var teacher_info = this;
				var html = '<option value="' + teacher_info.id + '">' + teacher_info.first_name + ' ' + teacher_info.last_name + '</options>';
				var html_dom = $(html);
				html_dom.data('info', teacher_info);
				select_dom.append(html_dom);
			});
			$(select_dom.children()[0]).html('');
		});
	},
	'errorHighlight': function(element)
	{
		var data_point_dom = $('body');

		var html = '<div class="error_highlight">'
						 + '</div>';
		var html_dom = $(html);
		var element_height = element.height();
		var highlight_height = element_height * 2;
		var element_top = element.offset().top;
		var height_diff = highlight_height - element_height;
		var highlight_top = element_top - (height_diff / 2);

		var element_width = element.width();
		var highlight_width = element_width * 1.5;
		var element_left = element.offset().left;
		var width_diff = highlight_width - element_width;
		var highlight_left = element_left - (width_diff / 4);

		element.css('z-index', 1000);

		html_dom.css(
		{
			'height': highlight_height,
			'width': highlight_width,
			'left': highlight_left,
			'top': highlight_top,
			'z-index': 999
		});

		data_point_dom.append(html_dom);
	},

	'newCounterClick': function(label)
	{
		getData('forms_main', 'new_counter', {'Walkthroughs_id': $("#walkthrough_id").val()}, function(response_text)
		{
			var info =
			{
				'id': parseInt(response_text),
				'label': util.isEmpty(label) || typeof(label) == 'object' ? '' : label,
				'value': ''
			}
			thisPage.generateCounter(info);
		});

	},
	
	'generateCounter': function(info)
	{
		if (util.isEmpty(info))
		{
			info =
			{
				'id': null,
				'label': '',
				'value': ''
			}
		}

		
		if (util.isEmpty(info.val))
			{info.val = 0;}
			
		var html =	'<div class="counter_item" title="">' +
									'<div class="delete_button ui-state-error ui-corner-all" title="Remove">' +
										'<span class="ui-icon ui-icon-circle-close"></span>' +
									'</div>' +
									'<div class="label">' +
										'<input type="text" value="' + info.label + '">' +
									'</div>' +
									'<div class="inc_dec_widget input">' +
										'<div id="decrement" class="ui-state-default ui-corner-all">' +
											'<span class="ui-icon ui-icon-minus"></span>' +
										'</div>' +
										'<input id="count" type="text" value="' + info.val + '">' +
										'<div id="increment" class="ui-state-default ui-corner-all">' +
											'<span class="ui-icon ui-icon-plus"></span>' +
										'</div>' +
									'</div>' +
								'</div><br>';
		var html_dom = $(html);
		html_dom.data('info', info);

		var delete_button_dom = html_dom.children(".delete_button");
		delete_button_dom.click(function()
		{
			var counter_item = $(this).parent(".counter_item");
			var info = counter_item.data("info");
			postData('forms_main', 'delete_counter', {'WalkthroughCounters_id': info.id}, function(response_text)
			{
				counter_item.next("br").remove();
				counter_item.remove();
			});
			
		});

		var decrement_dom_list = html_dom.children(".inc_dec_widget").children("#decrement");
		decrement_dom_list.hoverIntent(thisPage.buttonHoverOn, thisPage.buttonHoverOff);
		decrement_dom_list.mousedown(thisPage.buttonMouseDown);
		decrement_dom_list.mouseup(thisPage.buttonMouseUp);
		decrement_dom_list.click(thisPage.inc_dec_widget_decrement);

		var increment_dom_list = html_dom.children(".inc_dec_widget").children("#increment");
		increment_dom_list.hoverIntent(thisPage.buttonHoverOn, thisPage.buttonHoverOff);
		increment_dom_list.mousedown(thisPage.buttonMouseDown);
		increment_dom_list.mouseup(thisPage.buttonMouseUp);
		increment_dom_list.click(thisPage.inc_dec_widget_increment);

		$("#counters .counter_list").append(html_dom);
		
	},
	
	'inc_dec_widget_Keypress': function(event)
	{
		 //if the letter is not digit then display error and don't type anything
		if( event.which!=38 && event.which!=40 && event.which!=8 && event.which!=0 && (event.which<48 || event.which>57))
		{
			event.preventDefault();
			return false;
		}
		else if (event.which == 38)
		{
			event.preventDefault();
			$(this).parent().children("#increment").click()
		}
		else if (event.which == 40)
		{
			event.preventDefault();
			$(this).parent().children("#decrement").click()
		}
	},
	'inc_dec_widget_decrement': function()
	{
		var count_dom = $(this).parent('.inc_dec_widget').children('#count');
		var count = parseInt(count_dom.val());
		if (isNaN(count))
			{count = 0;}
		count_dom.val(--count);
	},
	'inc_dec_widget_increment': function()
	{
		var count_dom = $(this).parent('.inc_dec_widget').children('#count');
		var count = parseInt(count_dom.val());
		if (isNaN(count))
			{count = 0;}
		count_dom.val(++count);
	},
	'buttonHoverOn': function()
	{
		$(this).addClass('ui-state-hover');
	},
	'buttonHoverOff': function()
	{
		$(this).removeClass('ui-state-active');
		$(this).removeClass('ui-state-hover');
	},
	'buttonMouseDown': function()
	{
		$(this).addClass('ui-state-active');
	},
	'buttonMouseUp': function()
	{
		$(this).removeClass('ui-state-active');
		$(this).removeClass('ui-state-hover');
	},
	'autoSave': function()
	{
		$("#container #new_save").click();
		setTimeout('thisPage.autoSave()', 15000);
	},
	'signOut': function()
	{
		$.cookie('walkthrough_observer_Users_id',null);
	},
	'newTimerClick': function() {
		getData('forms_main', 'new_timer', {'Walkthroughs_id': $("#walkthrough_id").val()}, function(response_text)
		{
			var info = {
				'id': parseInt(response_text),
				'label': '',
				'count': 0,
				'seconds': 0,
				'timerId': null
			}
		thisPage.generateTimer(info);
		});
		
	},
	'generateTimer': function(info) {

		var html =	'<div class="timer_item" title="">' +
									'<div class="delete_button ui-state-error ui-corner-all" title="Remove">' +
										'<span class="ui-icon ui-icon-circle-close"></span>' +
									'</div>' +
									'<div class="label">' +
										'<input type="text" value="' + info.label + '">' +
									'</div>' +
									'<div class="count">' +
										'<input id="count" type="text" value="' + Math.floor(info.seconds / 60) + '">' +
										'<span>mins<span>' +
									'</div>' +
									'<div class="button">' +
										'<input id="start_stop" type="button" value="Start" class="ui-corner-all ui-button ui-state-default ui-button-text-only">' +
									'</div>' +
									'<div class="image" style="display:none;">' +
										'<img src="/images/loader.gif">' +
									'</div>' + 
								'</div><br>';
		var html_dom = $(html);
		html_dom.data('info', info);

		var delete_button_dom = html_dom.children(".delete_button");
		delete_button_dom.click(function() {
			var timer_item = $(this).parent(".timer_item");
			var info = timer_item.data("info");
			postData('forms_main', 'delete_timer', {'WalkthroughTimers_id': info.id}, function(response_text) {
				timer_item.next("br").remove();
				timer_item.remove();
			});

		});

		var start_stop_dom = html_dom.children(".button").children("#start_stop");
		start_stop_dom.click(function() {

			var info = $(this).parent(".button").parent(".timer_item").data("info");

			if ($(this).val() == "Start") {
				$(".timer_item .button #start_stop").val("Start");
				$(".timer_item .image").hide();
				$(this).val("Stop");
				$(this).parent(".button").next("div").show();
				
				$.each($(".timer_item"), function() {
					$(this).children(".button").children("#start_stop").removeClass("ui-state-error");
					$(this).children(".button").children("#start_stop").addClass("ui-state-default");

					var info = $(this).data("info");
					clearInterval(info.timerId);
				});

				info.timerId = setInterval("thisPage.incrementTimer(" + info.id + ")", 1000);
				
				$(this).parent(".button").parent(".timer_item").data("info", info);

				$(this).removeClass("ui-state-default");
				$(this).addClass("ui-state-error");
			}
			else {
				$(this).val("Start");
				$(this).parent(".button").next("div").hide();

				clearInterval(info.timerId);
				$(this).removeClass("ui-state-error");
				$(this).addClass("ui-state-default");
			}
			
			
		});


		$("#timers .timer_list").append(html_dom);
	},
	
	'incrementTimer': function(id) {
		$.each($(".timer_item"), function() {
			var info = $(this).data("info");
			if (info.id == id) {
				info.seconds += 1;


				$(this).data("info", info);
				$(this).children(".count").children("input").val(Math.floor(info.seconds / 60));
				//$(this).children(".count").children("input").val(info.seconds);
				return false;
			}
		});
	}

};

