<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Login extends Controller_Template {
	public $template = 'login';

	public function action_index()
	{
		if ($_POST['submit'] == 'Login')
		{
			if ($_POST['pass'] == 'maili')
			{
				setcookie("walkthrough_observer_Users_id", $_POST['user'], 0);
				$this->request->redirect('reports_walkthrough');
			}
		}

		$this->template->user_list = $this->getUserList();
	}

	public function getUserList()
	{
		$db = Database::instance();
		$sql = "SELECT u.id, u.Employees_id, e.Persons_id, p.first_name, p.last_name
						FROM Users AS u
						LEFT OUTER JOIN Employees AS e ON (u.Employees_id = e.id)
						LEFT OUTER JOIN Persons AS p ON (e.Persons_id = p.id)
						WHERE e.bargin_unit >= 5
						ORDER BY p.last_name, p.first_name";
		$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
		$user_list = $ret->as_array();

		return $user_list;
	}
}
