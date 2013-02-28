<?php
class Hands {
	private static $suits = array("C" => 0, "D" => 1, "H" => 2, "S" => 3);
	private static $ranks = array("2" => 0, "3" => 1, "4" => 2, "5" => 3, "6" => 4, "7" => 5, "8" => 6, "9" => 7, "T" => 8, "J" => 9, "Q" => 10, "K" => 11, "A" => 12);

	public static function parse($cards_str, $is_pockets = false){
		if(strlen($cards_str) == 0)
			return false;

		if( $is_pockets === false ){
			return self::mask_cards(explode(" ", $cards_str));
		}

		$temp_cards = explode(" ", $cards_str);
		$cards = array();
		if (count($temp_cards) % 2 == 1) {
			array_pop($temp_cards);
		}
		for($i = 0; $i < count($temp_cards); $i+=2){
			$cards[$i/2] = array();
			$cards[$i/2][] = $temp_cards[$i];
			$cards[$i/2][] = $temp_cards[$i + 1];
			$cards[$i/2] = self::mask_cards($cards[$i/2]);
		}
		return $cards;
	}
	private static function mask_cards($cards){
		$hand_mask = 0;
		for($i = 0; $i < count($cards); $i++) {
			$card = self::$ranks[$cards[$i]{0}] + 0xD * self::$suits[$cards[$i]{1}];
			$hand_mask |= 1 << $card;
		}
		return $hand_mask;
	}
}
?>