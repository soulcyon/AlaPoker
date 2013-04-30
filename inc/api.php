<?php
class API {
	protected static function json($d){
		Header("Content-type: application/json");
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