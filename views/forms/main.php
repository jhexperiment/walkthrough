<html>
  <head>
		<link rel="stylesheet" href="/css/inc.dec.widget.css" type="text/css">
    <link rel="stylesheet" href="/css/forms/main.css" type="text/css">
		<link rel="stylesheet" href="/css/base/base.css" type="text/css">
		<link rel="stylesheet" href="/css/jquery/jquery-ui.css" type="text/css">
		<link rel="stylesheet" href="/css/jquery/jquery-ui-timepicker-addon.css" type="text/css">
		<script type="text/javascript" src="/js/jquery/plugins/jquery.tools.min.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.form.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.stretch.js"></script>
		<script type="text/javascript" src="/js/jquery/jquery-ui.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/hoverIntent.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.date.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.cookie.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.disable.text.select.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery-ui-timepicker-addon.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.tinyscrollbar.min.js"></script>
		<script type="text/javascript" src="/js/common.js"></script>
		<script type="text/javascript" src="/js/forms/main.js"></script>
  </head>
 
  <body>
		<input type="hidden" id="walkthrough_id" value="<?php echo $_GET['walkthrough_id']; ?>">
		<center>
			<div id="left_button" class="header_button ui-state-default">
				<!--<a href="/index.php/forms_main">Forms</a>-->&nbsp;
			</div>
			<div id="page_header" class="ui-state-default">Walk Through Feedback</div>
			<div id="right_button" class="header_button ui-state-default">
				<a href="/index.php/reports_walkthrough">Walk Through List</a>
			</div>
			<div id="sign_out_header">
				<a href="/index.php">Sign Out</a>
			</div>
			<br>
			<div id="container" class="ui-widget-content">
				<div id="col1" class="column">
					<div id="observer">
						<div class="label">Observer:</div>
						<div class="text"></div>
					</div><br>
					<div id="teacher">
						<div class="label">Teacher:</div>
						<div class="input">
							<select></select>
						</div>
					</div><br>
					<div id="grade">
						<div class="label">Grade:</div>
						<div class="input">
							<select></select>
						</div>
					</div><br>
					<div id="subject">
						<div class="label">Subject:</div>
						<div class="input">
							<select></select>
						</div>
					</div><br>
					<div id="thinking_map">
						<div class="label">Thinking Map:</div>
						<div class="input">
							<select></select>
						</div>
					</div><br>
					<div id="timers">
						<div class="controls">
							<div class="label">Timers:</div>
							<input id="new_timer" type="button" value="New" class="ui-corner-all ui-button ui-state-default ui-button-text-only">
						</div><br>
						<div class="timer_list">
							
						</div>
					</div>
				</div>
				<div id="col2" class="column">
					<div id="observation_time">
						<div class="label">Observation Time:</div>
						<div class="input">
							<span>from</span> <input id="start_time" type="text" value="">
							<span>to</span> <input id="end_time" type="text" value="">
						</div>
						<div class="text"></div>
					</div><br>

					<div id="counters">
						<div class="controls">
							<div class="label">Checks for:</div>
							<input id="new_counter" type="button" value="New" class="ui-corner-all ui-button ui-state-default ui-button-text-only">
						</div><br>
						<div class="counter_list">
						
						</div><br>
											
					</div>
				</div>
				<br>
				<div id="col3">
					<div id="checkbox_controls">
						<div>Data on:</div>
						<div id="header">
							<select></select>
							<input id="add_button" type="button" value="Add" class="ui-corner-all ui-button ui-state-default ui-button-text-only">
							<input id="new_button" type="button" value="New" class="ui-corner-all ui-button ui-state-default ui-button-text-only">
							<input id="edit_button" type="button" value="Edit" class="ui-corner-all ui-button ui-state-default ui-button-text-only">
						</div>
					</div>
					<br>
					<div id="content"></div>
				</div>
				<br>
				<div id="col4">
					<div id="notes">
						<div class="label">Notes:</div>
						<br>
						<div class="input">
							<textarea></textarea>
						</div>
					</div><br>
					<div id="comments">
						<div class="label">Comments:</div>
						<br>
						<div class="input">
							<textarea></textarea>
						</div>
					</div><br>
				</div><br>
				<div id="col5">
					<div id="controls">
						<div class="label"></div>
						<select id="walkthrough_list"></select>
						<input id="load" type="button" value="Load Prev" class="ui-corner-all ui-button ui-state-default ui-button-text-only">
						<input id="delete" type="button" value="Delete" class="ui-corner-all ui-button ui-state-default ui-button-text-only">
						<input id="new_save" type="button" value="New" class="ui-corner-all ui-button ui-state-default ui-button-text-only">
					</div>
				</div>
			</div>
		</center>

		<div id="walkthrough_dialog" class="dialog">
			<input type="hidden" id="WalkthroughOptionLists_id">
			<div id="label">
				<div class="label">Label:</div>
				<div class="input">
					<input type="text" required="required">
				</div>
			</div>
			<br>
			<div id="controls">
				<div class="label">Checkbox List:</div>
				<div class="input">
					<input id="add_checkbox_button" type="button" value="Add Checkbox" class="ui-corner-all ui-button ui-state-default ui-button-text-only">
				</div>				
			</div>
			<div id="checkbox_list"></div>
		</div>

		<div id="timepicker_dialog">
			<div id="date_picker"></div>
		</div>
  </body>
</html>
