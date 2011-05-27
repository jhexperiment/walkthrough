<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Forms_Main extends Controller_Template {
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

					case 'new_walkthrough':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->createNewWalkthrough($_POST);
						break;
					case 'delete_walkthrough':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->deleteWalkthrough($_POST);
						break;
					case 'update_walkthrough':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->updateWalkthrough($_POST);
						break;

					case 'new_checkbox_group':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->createNewCheckboxGroup($_POST);
						break;
					case 'add_checkbox_group':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->addCheckboxGroup($_POST);
						break;
					case 'delete_checkbox_group':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->deleteCheckboxGroup($_POST);
						break;
					case 'update_checkbox_group':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->updateCheckboxGroup($_POST);
						break;
					case 'remove_checkbox_group':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->removeCheckboxGroup($_POST);
						break;

					case 'delete_counter':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->deleteCounter($_POST);
						break;
					case 'delete_timer':
						unset($_POST['action'], $_POST['type']);
						$this->template->output = $this->deleteTimer($_POST);
						break;

					

				}
			case 'get':
				switch ($_GET['type'])
				{
					case 'observer':
						unset($_GET['action'], $_GET['type']);
						$this->template->output = $this->getObserver($_GET);
						break;
					case 'walkthrough':
						unset($_GET['action'], $_GET['type']);
						$this->template->output = $this->getWalkthrough($_GET);
						break;
					case 'checkboxlist':
						unset($_GET['action'], $_GET['type']);
						$this->template->output = $this->getCheckboxList($_GET);
						break;
					case 'new_counter':
						unset($_GET['action'], $_GET['type']);
						$this->template->output = $this->createNewCounter($_GET);
						break;
					case 'new_timer':
						unset($_GET['action'], $_GET['type']);
						$this->template->output = $this->createNewTimer($_GET);
						break;

					case 'createCheckboxListOption':
						unset($_GET['action'], $_GET['type']);
						$this->template->output = $this->createCheckboxListOption($_GET);
						break;

				}
			case 'get_list':
				switch ($_GET['type'])
				{
					case 'walkthrough_list':
						$this->template->output = $this->getWalkthroughList($_GET);
						break;
					case 'teacher_list':
						$this->template->output = $this->getTeacherList();
						break;
					case 'grade_list':
						$this->template->output = $this->getGradeList();
						break;
					case 'subject_list':
						$this->template->output = $this->getSubjectList();
						break;
					case 'thinkingmap_list':
						$this->template->output = $this->getThinkingMapList();
						break;
					case 'checkbox_group_list':
						$this->template->output = $this->getCheckboxList();
						break;
				}
				break;

			default:
				$this->template = new View('forms/main');
				break;
		}
	}

	public function deleteCounter($info)
	{
		$ret = DB::delete('WalkthroughCounters')
							->where('id', '=', $info['WalkthroughCounters_id'])
							->execute();
		return true;
	}

	public function createNewCounter($info)
	{
		$ret = DB::insert('WalkthroughCounters')
						->columns(array('label', 'val', 'Walkthroughs_id'))
						->values(array('', null, $info['Walkthroughs_id']))
						->execute();
		$WalkthoughCounters_id = $ret[0];
		return $WalkthoughCounters_id;
	}

	public function createNewTimer($info) {
		$ret = DB::insert('WalkthroughTimers')
						->columns(array('label', 'seconds', 'Walkthroughs_id'))
						->values(array('', 0, $info['Walkthroughs_id']))
						->execute();
		$WalkthoughTimers_id = $ret[0];
		return $WalkthoughTimers_id;
	}

	public function deleteTimer($info) {
		$ret = DB::delete('WalkthroughTimers')
							->where('id', '=', $info['WalkthroughTimers_id'])
							->execute();
		return true;
	}

	// Walkthroughs
	public function updateWalkthrough($info)
	{
		
		$id = $info['id'];
		$checkbox_group_list = $info['checkbox_group_list'];
		$counter_list = $info['counter_list'];
		$timer_list = $info['timer_list'];
		unset ($info['id'], $info['checkbox_group_list'], $info['counter_list'], $info['timer_list']);

		DB::update('Walkthroughs')
				->set($info)
				->where('id', '=', $id)
				->execute();
		
		if (! empty($checkbox_group_list)) {
			foreach($checkbox_group_list as &$checkbox_group) {
				foreach ($checkbox_group['checkbox_list'] as &$checkbox) {
					switch($checkbox_group['action']) {
						case 'add':
							DB::insert('WalkthroughOptionListOptionAnswers')
								->columns(array('checked', 'Walkthroughs_id', 'WalkthroughOptionListOptions_id'))
								->values(array($checkbox['checked'], $checkbox_group['Walkthroughs_id'], $checkbox['id']))
								->execute();
							break;

						case 'update':
							DB::update('WalkthroughOptionListOptionAnswers')
								->set(array('checked' => $checkbox['checked']))
								->where('id', '=', $checkbox['WalkthroughOptionListOptionAnswers_id'])
								->execute();
						default:
							break;
					}
				}
			}
		}
		
		// update counters
		if(! empty($counter_list))
		{
			foreach($counter_list as $counter_info)
			{
				DB::update('WalkthroughCounters')
					->set(array('label' => $counter_info['label'],
									 'val' => $counter_info['val']))
					->where('id', '=', $counter_info['id'])
					->execute();
			}
		}
		
		//update timers
		if(! empty($timer_list))
		{
			foreach($timer_list as $timer_info)
			{
				DB::update('WalkthroughTimers')
					->set(array('label' => $timer_info['label'],
									 'seconds' => $timer_info['seconds']))
					->where('id', '=', $timer_info['id'])
					->execute();
			}
		}

		$info['id'] = $id;
		$info["checkbox_group_list"] = $checkbox_group_list;
		$info["counter_list"] = $counter_list;
		$info['timer_list'] = $timer_list;
		return print_r($info,true);
	}
	public function deleteWalkthrough($info)
	{
		$Walkthroughs_id = $info['Walkthroughs_id'];
		
		if (! empty($Walkthroughs_id))
		{

			if (is_array($Walkthroughs_id))
				{$id_list = $Walkthroughs_id;}
			else if (is_numeric($Walkthroughs_id))
				{$id_list = array($Walkthroughs_id);}

			DB::delete('WalkthroughCounters')
					->where('Walkthroughs_id', 'IN', $id_list)
					->execute();
			DB::delete('WalkthroughOptionListOptionAnswers')
					->where('Walkthroughs_id', 'IN', $id_list)
					->execute();
			DB::delete('Walkthrough_WalkthroughOptionLists')
					->where('Walkthroughs_id', 'IN', $id_list)
					->execute();
			DB::delete('Walkthroughs')
					->where('id', 'IN', $id_list)
					->execute();
		}
		return true;
	}
	public function getWalkthrough($info)
	{
		//return print_r($info, true);
		$db = Database::instance();
		$sql = "SELECT *
						FROM Walkthroughs
						WHERE id = {$info['id']}";
		$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
		$ret = $ret->as_array();

		$walkthrough_info = $ret[0];
		
		$ret = DB::select()
					->from('WalkthroughTimers')
					->where('Walkthroughs_id', '=', $info['id'])
					->execute('default');
		$walkthrough_info['timer_list'] = $ret->as_array();
		
		
		$sql = "SELECT ol.*
						FROM WalkthroughOptionListOptionAnswers AS oloa
						JOIN WalkthroughOptionListOptions AS olo ON (oloa.WalkthroughOptionListOptions_id = olo.id)
						JOIN WalkthroughOptionLists AS ol ON (olo.WalkthroughOptionLists_id = ol.id)
						WHERE Walkthroughs_id = {$info['id']}
						GROUP BY ol.id";
		$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
		$walkthrough_info['checkbox_group_list'] = $ret->as_array();

		foreach ($walkthrough_info['checkbox_group_list'] AS &$checkbox_group_info)
		{
			$sql = "SELECT olo.id, olo.name, oloa.checked,
										olo.WalkthroughOptionLists_id,
										oloa.WalkthroughOptionListOptions_id,
										oloa.Walkthroughs_id,
										oloa.id AS WalkthroughOptionListOptionAnswers_id
							FROM WalkthroughOptionListOptions AS olo
							JOIN WalkthroughOptionListOptionAnswers AS oloa ON (oloa.WalkthroughOptionListOptions_id = olo.id)
							WHERE olo.WalkthroughOptionLists_id = {$checkbox_group_info['id']}
							AND oloa.Walkthroughs_id = {$walkthrough_info['id']}";
			$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
			$checkbox_group_info['checkbox_list'] = $ret->as_array();

		}
		
		
		$sql = "SELECT id, label, val
						FROM WalkthroughCounters
						WHERE Walkthroughs_id = {$info['id']}";
		$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
		$walkthrough_info['counter_list'] = $ret->as_array();

		return json_encode($walkthrough_info);
	}
	public function getWalkthroughList($info)
	{
		$walkthrough_list = array();
		if (! empty($info['Observer_Users_id']))
		{
			$db = Database::instance();
			$sql = "SELECT w.*, p.first_name AS Teacher_First_Name, p.last_name AS Teacher_Last_Name
							FROM Walkthroughs AS w
							LEFT OUTER JOIN Users AS u ON (w.Teacher_Users_id = u.id)
							LEFT OUTER JOIN Employees AS e ON (u.Employees_id = e.id)
							LEFT OUTER JOIN Persons AS p ON (e.Persons_id = p.id)
							WHERE w.Observer_Users_id = {$info['Observer_Users_id']}
							ORDER BY w.create_timestamp DESC";
			$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
			$walkthrough_list = $ret->as_array();
		}
		return json_encode($walkthrough_list);
	}
	private function createNewWalkthrough($info)
	{
		$ret = DB::insert('Walkthroughs')
						->columns(array('Observer_Users_id', 'create_timestamp'))
						->values(array($info['Observer_Users_id'], time()))
						->execute();
		$Walkthoughs_id = $ret[0];
		return $Walkthoughs_id;
	}


	// CheckboxList
	private function removeCheckboxGroup($checkbox_group)
	{
		//return print_r($info, true);

		foreach ($checkbox_group['checkbox_list'] as &$option)
		{
			$ret = DB::delete('WalkthroughOptionListOptionAnswers')
						->where('id', '=', $option['WalkthroughOptionListOptionAnswers_id'])
						->execute();
		}

		return print_r($checkbox_group, true);
	}
	private function addCheckboxGroup($info)
	{
		foreach ($info['checkbox_group'] as &$option)
		{
			$ret = DB::insert('WalkthroughOptionListOptionAnswers')
						->columns(array('WalkthroughOptionListOptions_id', 'Walkthroughs_id'))
						->values(array($option['id'], $info['Walkthroughs_id']))
						->execute();
			$option['WalkthroughOptionListOptionAnswers_id'] = $ret[0];
			$option['checked'] = 0;
		}

		return json_encode($info);
	}
	private function createNewCheckboxGroup($info)
	{
		if (empty($info))
		{
			$info['label'] = '';
			$info['checkbox_list'] = array();
		}

		$checkbox_list = $info['checkbox_list'];
		unset($info['checkbox_list']);

		$ret = DB::insert('WalkthroughOptionLists')
						->columns(array('label'))
						->values(array($info['label']))
						->execute();
		$info['id'] = $ret[0];

		foreach ($checkbox_list as &$checkbox)
		{
			$ret = DB::insert('WalkthroughOptionListOptions')
							->columns(array('name', 'WalkthroughOptionLists_id'))
							->values(array($checkbox['name'], $info['id']))
							->execute();
			$checkbox['id'] = $ret[0];
		}
		$info['checkbox_list'] = $checkbox_list;

		return json_encode($info);
	}
	private function updateCheckboxGroup($info)
	{
		$checkbox_list = $info['checkbox_list'];
		unset($info['checkbox_list']);

		DB::update('WalkthroughOptionLists')
			->set(array('label' => $info['label']))
			->where('id', '=', $info['WalkthroughOptionLists_id'])
			->execute();

		if (! empty($checkbox_list)) {
			foreach ($checkbox_list as &$checkbox_info) {
				$checkbox_info['WalkthroughOptionLists_id'] = $info['WalkthroughOptionLists_id'];
				$checkbox_info['Walkthroughs_id'] = $info['Walkthroughs_id'];
				switch ($checkbox_info['action']) {
					case 'delete':
						$this->deleteCheckbox($checkbox_info);
						break;
					case 'add':
						$info['WalkthroughOptionListOptions_id'] = $this->addCheckbox($checkbox_info);
						break;
					case 'update':
						$this->updateCheckbox($checkbox_info);
					default:
						break;
				}
			}
		}

		$info['checkbox_list'] = $checkbox_list;
		return print_r($info, true);
	}

	public function getCheckboxList($info = null) {
		$where = '';
		if (!empty($info['id']))
			{$where = "WHERE id = {$info['id']}";}

		$db = Database::instance();
		$sql = "SELECT *
						FROM WalkthroughOptionLists
						$where";

		$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
		$checkbox_group_list = $ret->as_array();

		foreach ($checkbox_group_list as &$checkbox_group) {
			$sql = "SELECT *
							FROM WalkthroughOptionListOptions	as options
							WHERE WalkthroughOptionLists_id = {$checkbox_group['id']}";
			$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
			$checkbox_list = $ret->as_array();
			$checkbox_group['checkbox_list'] = $checkbox_list;
		}

		return json_encode($checkbox_group_list);
	}
	private function updateCheckbox($info)
	{
		DB::update('WalkthroughOptionListOptions')
			->set(array('name' => $info['name']))
			->where('id', '=', $info['id'])
			->execute();
	}
	private function addCheckbox($info)
	{
		//return print_r($info, true);
		$ret = DB::insert('WalkthroughOptionListOptions')
					->columns(array('WalkthroughOptionLists_id', 'name'))
					->values(array($info['WalkthroughOptionLists_id'], $info['name']))
					->execute();
		$WalkthroughOptionListOptions_id = $ret[0];

		$db = Database::instance();
		$sql = "INSERT INTO WalkthroughOptionListOptionAnswers
							(WalkthroughOptionListOptions_id, Walkthroughs_id)
						SELECT $WalkthroughOptionListOptions_id, oloa.Walkthroughs_id
						FROM WalkthroughOptionLists AS ol
						JOIN WalkthroughOptionListOptions AS olo ON (olo.WalkthroughOptionLists_id = ol.id)
						JOIN WalkthroughOptionListOptionAnswers AS oloa ON (oloa.WalkthroughOptionListOptions_id = olo.id)
						WHERE ol.id = {$info['WalkthroughOptionLists_id']}
						GROUP BY oloa.Walkthroughs_id";
		$ret = $db->query(DATABASE::INSERT, $sql, FALSE);

		return $WalkthroughOptionListOptions_id;
	}
	private function deleteCheckbox($info)
	{
		$db = Database::instance();
		$sql = "DELETE FROM WalkthroughOptionListOptionAnswers
						WHERE WalkthroughOptionListOptions_id = {$info['id']}";
		$ret = $db->query(DATABASE::DELETE, $sql, FALSE);

		$sql = "DELETE FROM WalkthroughOptionListOptions
						WHERE id = {$info['id']}";
		$ret = $db->query(DATABASE::DELETE, $sql, FALSE);

	}



	private function deleteCheckboxGroup($info)
	{
		//return print_r($info,true);
		$db = Database::instance();
		$sql = "DELETE FROM WalkthroughOptionListOptionAnswers
						WHERE WalkthroughOptionListOptions_id IN
							(SELECT	id
							 FROM	WalkthroughOptionListOptions
							 WHERE WalkthroughOptionLists_id = {$info['WalkthroughOptionLists_id']})";
		$ret = $db->query(DATABASE::DELETE, $sql, FALSE);

		$sql = "DELETE FROM WalkthroughOptionListOptions
						WHERE WalkthroughOptionLists_id = {$info['WalkthroughOptionLists_id']}";
		$ret = $db->query(DATABASE::DELETE, $sql, FALSE);

		$sql = "DELETE FROM WalkthroughOptionLists
						WHERE id = {$info['WalkthroughOptionLists_id']}";
		$ret = $db->query(DATABASE::DELETE, $sql, FALSE);

	}
	
	
	
	
	public function getTeacherList()
	{
		$db = Database::instance();
		$sql = "SELECT e.id, e.Persons_id, p.first_name, p.last_name,
										u.id AS Users_id
						FROM Employees AS e
						LEFT OUTER JOIN Persons AS p ON (e.Persons_id = p.id)
						LEFT OUTER JOIN Users AS u ON (u.Employees_id = e.id)
						WHERE e.bargin_unit >= 5
						ORDER BY p.last_name, p.first_name";
		$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
		$teacher_list = $ret->as_array();

		return json_encode($teacher_list);
	}

	public function getGradeList()
	{
		$db = Database::instance();
		$sql = "SELECT *
						FROM Grades";
		$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
		$teacher_list = $ret->as_array();

		return json_encode($teacher_list);
	}

	public function getSubjectList()
	{
		$db = Database::instance();
		$sql = "SELECT *
						FROM WalkthroughSubjects";
		$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
		$teacher_list = $ret->as_array();

		return json_encode($teacher_list);
	}

	public function getThinkingMapList()
	{
		$db = Database::instance();
		$sql = "SELECT *
						FROM WalkthroughThinkingMaps";
		$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
		$teacher_list = $ret->as_array();

		return json_encode($teacher_list);
	}

	public function getObserver($info)
	{
		$db = Database::instance();
		$sql = "SELECT u.id, u.Employees_id, e.Persons_id, p.first_name, p.last_name
						FROM Users AS u
						LEFT OUTER JOIN Employees AS e ON (u.Employees_id = e.id)
						LEFT OUTER JOIN Persons AS p ON (e.Persons_id = p.id)
						WHERE u.id = {$info['id']}
						LIMIT 1";
		$ret = $db->query(DATABASE::SELECT, $sql, FALSE);
		$observer_info = $ret->as_array();

		return json_encode($observer_info[0]);
	}

	public function setStartTime($info)
	{

		$start_time_info = getdate(time());


		return json_encode($start_time_info);
	}

} 
