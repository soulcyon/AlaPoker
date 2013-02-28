<?php

class Hands {
	
	private static $suits = array("C" => 0, "D" => 1, "H" => 2, "S" => 3);
	
	private static $ranks = array("2" => 0, "3" => 1, "4" => 2, "5" => 3, "6" => 4, "7" => 5, "8" => 6, "9" => 7, 
		"T" => 8, "J" => 9, "Q" => 10, "K" => 11, "A" => 12);

	public static function parse($hands_str, $cards_str) {

		if(strlen($hands_str) == 0 && strlen($cards_str) == 0) 
			return NULL;

		if(strlen($cards_str) > 0) {
			$cards = explode(" ", $cards_str);
		}

		if(strlen($hands_str) > 0) {
			
			$temp_cards = explode(" ", $hands_str);
			$cards = array(array());

			for($i = 0; $i < count($temp_cards); $i++)
				$cards[$i / 2][$i % 2] = $temp_cards[$i];
		}

		return $cards;
	}

	public static function mask_cards($hands, $cards) {
		
		if(count($hands) == 0 && count($cards) == 0) 
			return NULL;

		if(count($cards) > 0) {
			$cards_mask = 0;
			for($i = 0; $i < count($cards); $i++) {
				$card = Hands::$ranks[$cards[$i]{0}] + 13 * Hands::$suits[$cards[$i]{1}];
				$cards_mask |= 1 << $card;
			}
			return $cards_mask;
		}

		if(strlen($hands) > 0) {
			$hands_mask = array();
			for($i = 0; $i < count($hands); $i++) {
				$cards = 0;
				for($j = 0; $j < count($hands[$i]); $j++) {
					$card = Hands::$ranks[$hands[$i]{0}] + 13 * Hands::$hands[$cards[$i]{1}];
					$hands_mask[$i] |= 1 << $card;
				}
			}
			return $hands_mask;
		}
	}
}

// test harness

$hands = Hands::parse("QH QC JH JC", "");
$dead = Hands::parse("", "AH AC AH");
var_dump($hands);
var_dump($dead);

$handMask = Hands::mask_cards($hands, "");
$deadMask = Hands::mask_cards("", $dead);
var_dump($handMask);
var_dump($deadMask);

?>