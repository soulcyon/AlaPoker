<?php

class Hands {
	
	private static $suits = array("C" => 0, "D" => 1, "H" => 2, "S" => 3);
	
	private static $ranks = array("2" => 0, "3" => 1, "4" => 2, "5" => 3, "6" => 4, "7" => 5, "8" => 6, "9" => 7, 
		"T" => 8, "J" => 9, "Q" => 10, "K" => 11, "A" => 12);

	public static function parse($pockets_str, $cards_str) {

		if(strlen($pockets_str) == 0 && strlen($cards_str) == 0) 
			return NULL;

		if(strlen($cards_str) > 0) {
			$cards = explode(" ", $cards_str);
		}

		if(strlen($pockets_str) > 0) {
			
			$temp_cards = explode(" ", $pockets_str);
			$cards = array(array());

			for($i = 0; $i < count($temp_cards); $i++)
				$cards[$i / 2][$i % 2] = $temp_cards[$i];
		}

		return $cards;
	}

	public static function mask_cards($cards_str) {
		
		$hand_mask = 0;
		
		for($i = 0; $i < count($cards); $i++) {
			$card = Hands::$ranks[$cards[$i]{0}] + 13 * Hands::$suits[$cards[$i]{1}];
			$hand_mask |= 1 << $card;
		}

		return $hand_mask;
	}
}

// test harness
$pocket = Hands::parse("QH QC JH JC", "");
$dead = Hands::parse("", "AH AC AH");
var_dump($pocket);
var_dump($dead);

?>