<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Reports_Walkthrough extends Controller_Template {
	public $template = 'text';

	public function action_index()
	{
		if (empty($_COOKIE["walkthrough_observer_Users_id"]))
		{
			$this->request->redirect('/');
		}


		switch ($_REQUEST['action'])
		{
			case 'update':
				switch ($_POST['type'])
				{
					case 'start_time':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->setStartTime($_POST);
						break;

					

				}
			case 'get':
				switch ($_GET['type'])
				{
					case 'observer':
						unset($_GET['action'], $_GET['type']);
						$this->template->output = $this->getObserver($_GET);
						break;
					
				}
			case 'get_list':
				switch ($_GET['type'])
				{
					case 'walkthrough_list':
						$this->template->output = $this->getWalkthroughList($_GET);
						break;
					
				}
				break;

			default:
				$this->template = new View('reports/walkthrough');
				break;
		}
	}

	private function getWalkthroughList($info)
	{
		$walkthrough_list = array();

		$from_date_sql = '';
		if (! empty($info['from_date_timestamp']))
		{
			$from_date_timestamp = $info['from_date_timestamp'];
			$from_date_sql = "AND w.create_timestamp > $from_date_timestamp";
			unset($info['from_date_timestamp']);
		}

		if (! empty($info['Observer_Users_id']))
		{
			$db = Database::instance();
			$sql = "SELECT w.*,
										CONCAT(o_p.first_name, ' ', o_p.last_name) AS observer_name,
										CONCAT(t_p.first_name, ' ', t_p.last_name) AS teacher_name,
										g.level AS grade_level,
										s.name AS subject_name,
										tm.name AS thinking_map_name
							FROM Walkthroughs AS w
							LEFT OUTER JOIN Users AS o_u ON (w.Observer_Users_id = o_u.id)
							LEFT OUTER JOIN Employees AS o_e ON (o_u.Employees_id = o_e.id)
							LEFT OUTER JOIN Persons AS o_p ON (o_e.Persons_id = o_p.id)
							LEFT OUTER JOIN Users AS t_u ON (w.Teacher_Users_id = t_u.id)
							LEFT OUTER JOIN Employees AS t_e ON (t_u.Employees_id = t_e.id)
							LEFT OUTER JOIN Persons AS t_p ON (t_e.Persons_id = t_p.id)
							LEFT OUTER JOIN Grades AS g ON (w.Grades_id = g.id)
							LEFT OUTER JOIN WalkthroughSubjects AS s ON (w.WalkthroughSubjects_id = s.id)
							LEFT OUTER JOIN WalkthroughThinkingMaps AS tm ON (w.WalkthroughThinkingMaps_id = tm.id)
							WHERE w.Observer_Users_id = {$info['Observer_Users_id']}
							$from_date_sql
							ORDER BY w.start_timestamp DESC";
			$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
			$walkthrough_list = $ret->as_array();

			foreach ($walkthrough_list as &$walkthrough_info)
			{

				$ret = DB::select()
					->from('WalkthroughTimers')
					->where('Walkthroughs_id', '=', $walkthrough_info['id'])
					->execute('default');
				$walkthrough_info['timer_list'] = $ret->as_array();

				$sql = "SELECT *
								FROM WalkthroughCounters
								WHERE Walkthroughs_id = {$walkthrough_info['id']}";
				$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
				$walkthrough_info['counter_list'] = $ret->as_array();
				

				$sql = "SELECT ol.*
								FROM WalkthroughOptionListOptionAnswers AS oloa
								JOIN WalkthroughOptionListOptions AS olo ON (oloa.WalkthroughOptionListOptions_id = olo.id)
								JOIN WalkthroughOptionLists AS ol ON (olo.WalkthroughOptionLists_id = ol.id)
								WHERE Walkthroughs_id = {$walkthrough_info['id']}
								GROUP BY ol.id";
				$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
				$walkthrough_info['checkbox_list'] = $ret->as_array();

				foreach ($walkthrough_info['checkbox_list'] AS &$checkbox_list_info)
				{
					$sql = "SELECT olo.id, olo.name, oloa.checked,
												olo.WalkthroughOptionLists_id,
												oloa.WalkthroughOptionListOptions_id,
												oloa.Walkthroughs_id,
												oloa.id AS WalkthroughOptionListOptionAnswers_id
									FROM WalkthroughOptionListOptions AS olo
									JOIN WalkthroughOptionListOptionAnswers AS oloa ON (oloa.WalkthroughOptionListOptions_id = olo.id)
									WHERE olo.WalkthroughOptionLists_id = {$checkbox_list_info['id']}
									AND oloa.Walkthroughs_id = {$walkthrough_info['id']}";
					$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
					$checkbox_list_info['option_list'] = $ret->as_array();

				}
			}
		}
		//return print_r($walkthrough_list);
		return json_encode($walkthrough_list);
	}

} 
