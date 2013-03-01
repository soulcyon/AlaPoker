<?php
/**
 * A la poker odds calculation
 *
 * @author     Sashank Tadepalli <dijjit@gmail.com>
 * @author     Mihir Sanghavi <mihir.h.sanghavi@gmail.com>
 * @copyright  2013 A la poker
 * @license    All rights reserved
 */

/**
 * Required library files
 */
require_once("Tables.php");
require_once("Hands.php");
require_once("Evaluate.php");
require_once("Yield.php");

class AlaPoker {
    // Players
    private $players = 2;

	// Array of masks, each player
	private $hands = array();

	// Board cards mask
	private $board = 0;

	// Dead cards mask
	private $deads = 0;

	// Resulting arrays
	private $wins = array();
	private $ties = array();
	private $losses = array();
	private $totalHands = 0;

	/**
	 * Constructor will accept formatted strings and parse them into masks for future calculation.
	 */
	public function __construct($hands, $board, $deads) {
		$this->hands = Hands::parse($hands, true);
		$this->board = Hands::parse($board);
		$this->deads = Hands::parse($deads);
        $this->players = count($this->hands);
		for($i = 0;$i < $this->players; $i++){
			$this->deads |= $this->hands[$i];
		}
	}

	public function getOdds() {
		foreach (Yield::get(intval($this->board), intval($this->deads), 5) as $boardhand)
        {
            // Evaluate all hands and determine the best hand
            $bestpocket = Evaluate::evaluate7($this->hands[0] | $boardhand, 7);
            $pockethands[0] = $bestpocket;
            $bestcount = 1;
            for ($i = 1; $i < $this->players; $i++)
            {
                $pockethands[$i] = Evaluate::evaluate7($this->hands[$i] | $boardhand, 7);
                if ($pockethands[$i] > $bestpocket)
                {
                    $bestpocket = $pockethands[$i];
                    $bestcount = 1;
                }
                else if ($pockethands[$i] == $bestpocket)
                {
                    $bestcount++;
                }
            }

            // Calculate wins, ties and losses for each pocket + board combination.
            for ($i = 0; $i < $this->players; $i++)
            {   
                if(!isset($this->wins[$i])) {
                    $this->wins[$i] = 0;
                }

                if(!isset($this->ties[$i])) {
                    $this->ties[$i] = 0;
                }

                if(!isset($this->losses[$i])) {
                    $this->losses[$i] = 0;
                }

                if ($pockethands[$i] == $bestpocket)
                {
                    if ($bestcount > 1)
                    {
                        $this->ties[$i]++;
                    }
                    else
                    {
                        $this->wins[$i]++;
                    }
                }
                else if ($pockethands[$i] < $bestpocket)
                {
                    $this->losses[$i]++;
                }
            }

            $this->totalHands++;
        }

        // Odds of winning as a percentage for each player
        $odds = array();
        if ($this->totalHands != 0)
        {   
            for ($i = 0; $i < $this->players; $i++) {
                $odds[$i] = ($this->wins[$i] + $this->ties[$i] / 2.0) / $this->totalHands;
            }
        }
        return $odds;
	}
}
?>