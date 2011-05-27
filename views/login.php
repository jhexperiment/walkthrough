<html>
  <head>
    <link rel="stylesheet" href="/css/login.css" type="text/css">
		<link rel="stylesheet" href="/css/base/base.css" type="text/css">
		<link rel="stylesheet" href="/css/jquery/jquery-ui.css" type="text/css">
		
  </head>
 
  <body>
		<center>
			<div id="page_header" class="ui-state-default">Login</div>
			<div id="container" class="ui-widget-content">


				<form name="formLogin" method="POST" action="/index.php/login">
					<div id="logoBox">
						<img id="mainLogo" src="/images/maili_logo.png">
					</div>
					<div id="loginBox">
						<div id="user" class="data_point">
							<div class="label">User:</div>
							<div class="input">
								<select name="user">
									<option></option>
<?php
foreach ($user_list as $user)
{
	$first_name_first_letter = $user['first_name'][0];
	$first_name_rest = substr($user['first_name'], 1);
	$last_name_first_letter = $user['last_name'][0];
	$last_name_rest = substr($user['last_name'], (strlen($user['last_name']) - 1) * -1);

	$selected = ($user['id'] == intval($_POST['user'])) ? 'selected="selected"' : '';

?>
									<option value="<?php echo $user['id']; ?>" <?php echo $selected; ?>>
										<?php echo "{$user['first_name']} {$user['last_name']}"; ?>
									</option>
<?php
}
?>
								</select>
							</div>
						</div>
						<div id="pass" class="data_point">
							<div class="label">Pass:</div>
							<div class="input">
								<input type="password"name="pass">
							</div>
						</div>

						<div id="submit" class="data_point">
							<input type="submit" name="submit" value="Login" class="ui-corner-all ui-button ui-state-default ui-button-text-only">
						</div>
					</div>
				</form>
			</div>
		</center>
  </body>
  
</html>
