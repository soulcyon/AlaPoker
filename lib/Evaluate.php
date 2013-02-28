<?php
/**
 * Evalulate.php
 *
 * @author     Mihir Sanghavi <mihir.h.sanghavi@gmail.com>
 * @author     Sashank Tadepalli <dijjit@gmail.com>
 * @copyright  2013 A la poker
 * @license    All rights reserved
 */
class Evaluate {
    // $cards = 3378524412361665
    // $cards = 2181499788985344
    public static function evaluate7($cards = 2181499788985344, $numberOfCards = 7) {
        $retval = 0;
        $four_mask;
        $three_mask;
        $two_mask;

        $sc = ($cards >> 0) & 0x1fff;
        $sd = ($cards >> 13) & 0x1fff;
        $sh = ($cards >> 26) & 0x1fff;
        $ss = ($cards >> 39) & 0x1fff;

        $ranks = $sc | $sd | $sh | $ss;
        $n_ranks = Tables::$N_BITS_TABLE[$ranks];
        $n_dups = ($numberOfCards - $n_ranks);

        if ($n_ranks >= 5)
        {
            if (Tables::$N_BITS_TABLE[$ss] >= 5)
            {
                if (Tables::$STRAIGHT_TABLE[$ss] != 0)
                    return 134217728 + (Tables::$STRAIGHT_TABLE[$ss] << 16);
                else
                    $retval = 83886080 + Tables::$TOP_FIVE_CARDS_TABLE[$ss];
            }
            else if (Tables::$N_BITS_TABLE[$sc] >= 5)
            {
                if (Tables::$STRAIGHT_TABLE[$sc] != 0)
                    return 134217728 + (Tables::$STRAIGHT_TABLE[$sc] << 16);
                else
                    $retval = 83886080 + Tables::$TOP_FIVE_CARDS_TABLE[$sc];
            }
            else if (Tables::$N_BITS_TABLE[$sd] >= 5)
            {
                if (Tables::$STRAIGHT_TABLE[$sd] != 0)
                    return 134217728 + (Tables::$STRAIGHT_TABLE[$sd] << 16);
                else
                    $retval = 83886080 + Tables::$TOP_FIVE_CARDS_TABLE[$sd];
            }
            else if (Tables::$N_BITS_TABLE[$sh] >= 5)
            {
                if (Tables::$STRAIGHT_TABLE[$sh] != 0)
                    return 134217728 + (Tables::$STRAIGHT_TABLE[$sh] << 16);
                else
                    $retval = 83886080 + Tables::$TOP_FIVE_CARDS_TABLE[$sh];
            }
            else
            {
                $st = Tables::$STRAIGHT_TABLE[$ranks];
                if ($st != 0)
                    $retval = 67108864 + ($st << 16);
            };

            if ($retval != 0 && $n_dups < 3) 
                return $retval;
        }

        switch ($n_dups)
        {
            case 0:
                return Tables::$TOP_FIVE_CARDS_TABLE[$ranks];
            case 1: {
                    $t; $kickers;
                    $two_mask = $ranks ^ ($sc ^ $sd ^ $sh ^ $ss);
                    $retval = (16777216 + (Tables::$TOP_CARDS_TABLE[$two_mask] << 16));
                    $t = $ranks ^ $two_mask;
                    $kickers = (Tables::$TOP_FIVE_CARDS_TABLE[t] >> 4) & -16;
                    $retval += $kickers;
                    return $retval;
                }

            case 2:
                $two_mask = $ranks ^ ($sc ^ $sd ^ $sh ^ $ss);
                if ($two_mask != 0)
                {
                    $t = $ranks ^ $two_mask;
                    $retval = (33554432 
                        + (Tables::$TOP_FIVE_CARDS_TABLE[$two_mask]
                        & 1044480)
                        + (Tables::$TOP_CARDS_TABLE[t] << $THIRD_CARD_SHIFT));

                    return $retval;
                }
                else
                {
                    $t; $second;
                    $three_mask = (($sc & $sd) | ($sh & $ss)) & (($sc & $sh) | ($sd & $ss));
                    $retval = (50331648 + (Tables::$TOP_CARDS_TABLE[$three_mask] << 16));
                    $t = $ranks ^ $three_mask; /* Only one bit set in three_mask */
                    $second = Tables::$TOP_CARDS_TABLE[t];
                    $retval += ($second << 12);
                    $t ^= (1 << $second);
                    $retval += (Tables::$TOP_CARDS_TABLE[t] << $THIRD_CARD_SHIFT);
                    return $retval;
                }

            default:
                $four_mask = $sh & $sd & $sc & $ss;
                if ($four_mask != 0)
                {
                    $tc = Tables::$TOP_CARDS_TABLE[$four_mask];
                    $retval = (117440512
                        + ($tc << 16)
                        + ((Tables::$TOP_CARDS_TABLE[$ranks ^ (1 << $tc)]) << 12));
                    return $retval;
                }

                $two_mask = $ranks ^ ($sc ^ $sd ^ $sh ^ $ss);
                if (Tables::$N_BITS_TABLE[$two_mask] != $n_dups)
                {
                    $tc; $t;
                    $three_mask = (($sc & $sd) | ($sh & $ss)) & (($sc & $sh) | ($sd & $ss));
                    $retval = 100663296;
                    $tc = Tables::$TOP_CARDS_TABLE[$three_mask];
                    $retval += ($tc << 16);
                    $t = ($two_mask | $three_mask) ^ (1 << $tc);
                    $retval += (Tables::$TOP_CARDS_TABLE[$t] << 12);
                    return $retval;
                }

                if ($retval != 0)
                    return $retval;
                else
                {
                    $top; $second;
                    $retval = 33554432;
                    $top = Tables::$TOP_CARDS_TABLE[$two_mask];
                    $retval += ($top << 16);
                    $second = Tables::$TOP_CARDS_TABLE[$two_mask ^ (1 << $top)];
                    $retval += ($second << 12);
                    $retval += ((Tables::$TOP_CARDS_TABLE[$ranks ^ (1 << $top) ^ (1 << $second)]) << $THIRD_CARD_SHIFT);
                    return $retval;
                }
        }
    }
}
?>