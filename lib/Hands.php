<?php
class Hands {
	private static $C = 0;
	private static $D = 1;
	private static $H = 2;
	private static $S = 3;
	private static $ranks = array(
		"2" => 0,
		"3" => 1,
		"4" => 2,
		"5" => 3,
		"6" => 4,
		"7" => 5,
		"8" => 6,
		"9" => 7,
		"T" => 8,
		"J" => 9,
		"Q" => 10,
		"K" => 11,
		"A" => 12
	);

	public static function parse($str){
		if( strlen($str) == 0 ) return 0;
		$strs = explode(" ", $str);
		for($i = 0;$i < count($strs); $i++){
			
		}
	}
}
?>