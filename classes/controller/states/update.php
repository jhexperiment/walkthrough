<?php defined('SYSPATH') or die('No direct script access.');

class Controller_States_Update extends Controller_Template {
	public $template = 'states/update';

	public function action_index()
	{
		$handle = curl_init();
		curl_setopt($handle, CURLOPT_URL, "http://www.usps.com/ncsc/lookups/abbr_state.txt");
		curl_setopt($handle, CURLOPT_VERBOSE, 0);
		curl_setopt($handle, CURLOPT_HEADER, 0);
		curl_setopt($handle, CURLOPT_RETURNTRANSFER, 1);
		
		$page_content = curl_exec($handle);
		if(! curl_errno($handle))
		{
			$info = curl_getinfo($handle);
			$lines = explode("\n", $page_content);
			$state_list = array();
			foreach ($lines as $line)
			{
				if (preg_match('/([A-Z]+([\s]{1}[A-Z]+)*)[\s]+([A-Z]{2})/', $line, $match))
				{
					$state = array();
					$state['name'] = $match[1];
					$state['abbreviation'] = $match[3];
					$ret = DB::insert('States')
						->columns(array_keys($state))
						->values(array_values($state))
						->execute();
					$state['id'] = $ret[0];
					$state_list[] = $state;
				}
			}



		}
		else
		{
			//echo 'Curl error: ' . curl_error($tuCurl);
		}

		$this->template->output = print_r($state_list, true);
	}
}
