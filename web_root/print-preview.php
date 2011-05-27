<?php
	unset($_POST['action'], $_POST['type']);
	$walkthrough_list = $_POST['walkthrough_list'];

?>
<html>
  <head>
		
		<script type="text/javascript">
window.onload = function() {
	window.print();
};
		</script>
		<link rel="stylesheet" href="/css/jquery/jquery-ui.css" type="text/css">
		<style type="text/css">
body {
	font-size: 16px;
}

.counter span,
.observer span,
.timestamp span,
.teacher span,
.grade span,
.subject span,
.thinkingmap span {
	text-decoration: underline;
}

.observer,
.timestamp{
	float: right;
}

.timestamp {
	margin: 0px 0px 0px 20px;
}

.timestamp span.to,
.timestamp span.from {
	display: inline-block;
	min-width: 110px;
}

.counter_list,
.timer_list{
	display: inline-block;
	margin: 20px 0px 0px 0px;
}

.counter_list td.label,
.timer_list td.label{
	padding: 0px 0px 0px 10px;
}

.counter_list td.val,
.timer_list td.val{
	width: 40px;
	text-align: right;
}

.checkbox_group_list {
	display: inline-block;
	margin: 20px 0px 0px 0px;
}

.checkbox_group {
	float: left;
	margin: 0px 10px 20px 10px;
	min-height: 150px;
	min-width: 150px;
}

.checkbox_group .header {
	
	text-decoration: underline;
}

.checkbox_group .checkbox span {
	float: left;
}

.notes,
.comments {
	clear: both;
	margin: 10px 0px 10px 0px;
}

.comments {
	page-break-after: always;
	margin: 10px 0px 60px 0px;
}

.comments .text,
.notes .text{
	margin: 0px 0px 0px 20px;
}

.ui-icon-empty {
	height: 16px;
	width: 16px;
	background-repeat: no-repeat;
	display: block;
	overflow: hidden;
	text-indent: -99999px;
}
</style>
  </head>

	
	<body>
<?php foreach ($walkthrough_list as &$walkthrough) {

				if ($walkthrough['teacher_name'] == 'null')
					{ $walkthrough['teacher_name'] = ''; }

				if ($walkthrough['grade_level'] == 'null')
					{ $walkthrough['grade_level'] = ''; }

				if ($walkthrough['subject_name'] == 'null')
					{ $walkthrough['subject_name'] = ''; }

				if ($walkthrough['thinking_map_name'] == 'null')
					{ $walkthrough['thinking_map_name'] = ''; }

				if ($walkthrough['notes'] == 'null')
					{ $walkthrough['notes'] = ''; }

				if ($walkthrough['comments'] == 'null')
					{ $walkthrough['comments'] = ''; }

?>
			<div class="walkthrough">
				<div class="teacher">Teacher: <span><?php echo $walkthrough['teacher_name']; ?></span></div>
				<div class="observer">Observed By: <span><?php echo $walkthrough['observer_name']; ?></span></div><br />
				<div class="timestamp">
					from <span class="from"><?php echo date('M d, h:i a', $walkthrough['start_timestamp']); ?></span>
					to <span class="to"><?php echo date('M d, h:i a', $walkthrough['end_timestamp']); ?></span>
				</div>
				<div class="grade">Grade: <span><?php echo $walkthrough['grade_level']; ?></span></div>
				<div class="subject">Subject: <span><?php echo $walkthrough['subject_name']; ?></span></div>
				<div class="thinkingmap">Thinking Map: <span><?php echo $walkthrough['thinking_map_name']; ?></span></div>

				<table class="counter_list">
					<tr><td colspan="2">Checks for:</td></tr>
	<?php foreach ($walkthrough['counter_list'] as $counter) {
					if ($counter['val'] == 'null')
						{ $counter['val'] = 0; }
	?>
					<tr>
						<td class="val"><?php echo $counter['val']; ?></td>
						<td class="label"><?php echo $counter['label']; ?></td>
					</tr>
	<?php } ?>
				</table>
				<br />

				<table class="timer_list">
					<tr><td colspan="2">Timers:</td></tr>
	<?php foreach ($walkthrough['timer_list'] as $timer) {
					if ($timer['seconds'] == 'null')
						{ $timer['seconds'] = 0; }
	?>
					<tr>
						<td class="val"><?php echo floor($timer['seconds'] / 60); ?></td>
						<td class="label"><?php echo $timer['label']; ?></td>
					</tr>
	<?php } ?>
				</table>
				<br />



				<div class="checkbox_group_list">
	<?php foreach ($walkthrough['checkbox_list'] as $checkbox_group) { ?>
					<div class="checkbox_group">
						<div class="header"><?php echo $checkbox_group['label']; ?></div>
		<?php foreach($checkbox_group['option_list'] as $checkbox) { ?>
						<div class="checkbox">
			<?php if ($checkbox['checked'] == "1") { ?>
							<span class="ui-icon ui-icon-check"></span>
							<span><?php echo $checkbox['name']?></span>
			<?php } else { ?>
							<span class="ui-icon-empty"></span>
							<span><?php echo $checkbox['name']?></span>
			<?php } ?>
						</div><br />
		<?php } ?>
					</div>
	<?php } ?>
				</div>
				<br />

				<div class="comments">
					<div>Comments:</div>
					<div class="text"> <?php echo $walkthrough['comments']; ?></div>
				</div>
			</div>
<?php }?>
		
	</body>
</html>