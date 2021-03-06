<?php
/**
 * Essential API for all sub classes
 *
 * @author     Sashank Tadepalli <dijjit@gmail.com>
 * @copyright  2013 A la poker
 * @license    All rights reserved
 */
class API {
	protected static function json($d, $code = 200){
		Header("Content-type: application/json");
		http_response_code($code);
		return json_encode($d);
	}
	protected static function hash($d){
		$str = keccak_hash($d);
		$i = 1000;

		while($i--){
			$str = self::transform(bin2hex(keccak_hash($str)));
		}
		return bin2hex($str);
	}
	private static function transform($test){
		$hold = array();
		for($i = 0;$i < strlen($test);$i++){
			if( is_numeric($test{$i}) ){
				$hold[$i] = $test{$i};
			} else if( count($hold) != 0 ){
				$first = strlen($test);
				$answer = 1;
				foreach ($hold as $key => $value) {
					if( $first > $key )
						$first = $key;
					$answer *= ($value + 1);
				}
				$test = substr_replace($test, $answer % 10, $first, count($hold));
				$hold = array();
			}
		}
		return $test;
	}
}