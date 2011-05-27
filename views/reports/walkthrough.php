<meta name="viewport"
    content="user-scalable=no, width=device-width" />

<html>
  <head>
    <link rel="stylesheet" href="/css/reports/walkthrough.screen.css" type="text/css" media="screen">
		<link rel="stylesheet" href="/css/reports/walkthrough.print.css" type="text/css" media="print">
		<link rel="stylesheet" href="/css/reports/walkthrough.print.screen.css" type="text/css" media="screen, print">
		<link rel="stylesheet" href="/css/base/base.css" type="text/css">
		<link rel="stylesheet" href="/css/jquery/jquery-ui.css" type="text/css">
		<link rel="stylesheet" href="/css/jquery/jquery-ui-timepicker-addon.css" type="text/css">
		
		<script type="text/javascript" src="/js/jquery/plugins/jquery.tools.min.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.form.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.stretch.js"></script>
		<script type="text/javascript" src="/js/jquery/jquery-ui.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/hoverIntent.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.jqprint.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.date.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.cookie.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.disable.text.select.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery.doubletap.js"></script>
		<script type="text/javascript" src="/js/jquery/plugins/jquery-ui-timepicker-addon.js"></script>
		<script type="text/javascript" src="/js/common.js"></script>
		<script type="text/javascript" src="/js/reports/walkthrough.js"></script>

  </head>
 
  <body>
		<div id="sign_out_header">
			<a href="/index.php">Sign Out</a>
		</div>
		<br>
			
		<center>
			<div id="left_button" class="header_button ui-state-default">
				<!--<a href="/index.php/forms_main">Forms</a>-->&nbsp;
			</div>
			<div id="page_header" class="ui-state-default">Walk Through List</div>
			<div id="right_button" class="header_button ui-state-default">
				<div id="report_type" class="data_type">
					<div class="label">Report Type:</div>
					<div class="input">
						<select>
							<option value="all" selected="selected">All</option>
							<option value="today">Today</option>
							<option value="print_pdf">PDF Print</option>
						</select>
					</div>
				</div>
				&nbsp;
			</div>
			<br>
			<div id="container" class="ui-widget-content">
				<div id="page-controls" class="ui-corner-all">
					<div id="checkbox_control" class="ui-corner-all ui-border-all">
						<span><input type="checkbox"></span>
						<span class="ui-icon ui-icon-set-custom ui-icon-triangle-1-s"></span>
					</div>
					<div id="print_walkthrough" class="ui-corner-left ui-border-all">Print</div>
					<div id="export_walkthrough" class="ui-border-middle">Export</div>
					<div id="delete_walkthrough" class="ui-corner-right ui-border-all">Delete</div>

					<div id ="new_walkthrough" class="ui-corner-all ui-border-all">New</div>
				</div>
			</div>
		</center>

		<div id="date_range_dialog" class="dialog">
			<span>from</span> <input id="dialog_start_time" type="text" value="">
			<span>to</span> <input id="dialog_end_time" type="text" value="">
		</div>

		<div id="select_popup" class="ui-widget-content">
			<div id="today">Today</div>
			<div id="date_range">Pick Date</div>
			<div id="incomplete">Incomplete</div>
		</div>
  </body>
</html>
