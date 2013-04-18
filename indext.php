<?php
ini_set("pokenum.iterations", 100000);
$i = 100;
$t = microtime(true);
$kinds = array("2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A");
$suits = array("C", "D", "H", "S");
while($i--){
	$deck = buildDeck();
	pokenum(PN_TEXAS, array(array($deck[0], $deck[2]), array($deck[1], $deck[3])));
}
function buildDeck(){
	global $suits, $kinds;
	$deck = array();
	for($s = 0; $s < count($suits); $s++)
		for($k = 0; $k < count($kinds); $k++)
			$deck[$s * count($kinds) + $k] = $kinds[$k] . $suits[$s];
	shuffle($deck);
	return $deck;
}
var_dump("1000 Hands in " . (microtime(true) - $t) . "s");

?>