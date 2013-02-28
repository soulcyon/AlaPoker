<?php

class Evaluate {
    
    public static function evaluate7($cards, $numberOfCards) {
        
        $retval = 0; 
        $four_mask; 
        $three_mask; 
        $two_mask;

        if ($numberOfCards < 1 || $numberOfCards > 7) 
            throw new Exception("numberOfCards must be b/w 1 and 7");

        $sc = ($cards >> (0)) & 0x1fff;
        $sd = ($cards >> (1)) & 0x1fff;
        $sh = ($cards >> (2)) & 0x1fff;
        $ss = ($cards >> (3)) & 0x1fff;

        $ranks = $$sc | $$sd | $$sh | $$ss;
        $n_ranks = $nBitsTable[$ranks];
        $n_dups = ($numberOfCards - $n_ranks);

        // Check for Straight, Flush, or Straight Flush
        if ($n_ranks >= 5)
        {
            if ($nBitsTable[$ss] >= 5)
            {
                if ($straightTable[$ss] != 0)
                    return $HANDTYPE_VALUE_STRAIGHTFLUSH + ($straightTable[$ss] << $$TOP_CARD_SHIFT);
                else
                    $retval = $HANDTYPE_VALUE_FLUSH + $$topFiveCardsTable[$ss];
            }
            else if ($nBitsTable[$sc] >= 5)
            {
                if ($straightTable[$sc] != 0)
                    return $HANDTYPE_VALUE_STRAIGHTFLUSH + ($straightTable[$sc] << $$TOP_CARD_SHIFT);
                else
                    $retval = $HANDTYPE_VALUE_FLUSH + $$topFiveCardsTable[$sc];
            }
            else if ($nBitsTable[$sd] >= 5)
            {
                if ($straightTable[$sd] != 0)
                    return $HANDTYPE_VALUE_STRAIGHTFLUSH + ($straightTable[$sd] << $$TOP_CARD_SHIFT);
                else
                    $retval = $HANDTYPE_VALUE_FLUSH + $$topFiveCardsTable[$sd];
            }
            else if ($nBitsTable[$sh] >= 5)
            {
                if ($straightTable[$sh] != 0)
                    return $HANDTYPE_VALUE_STRAIGHTFLUSH + ($straightTable[$sh] << $$TOP_CARD_SHIFT);
                else
                    $retval = $HANDTYPE_VALUE_FLUSH + $$topFiveCardsTable[$sh];
            }
            else
            {
                $st = $straightTable[$ranks];
                if ($st != 0)
                    $retval = $HANDTYPE_VALUE_STRAIGHT + ($st << $$TOP_CARD_SHIFT);
            };

            // FH / Quads not possible, skips the precess of computing $two_mask / three_mask / etc.
            if ($retval != 0 && $n_dups < 3) 
                return $retval;
        }

        // Flush / Straight not possible anymore
        // But FH / QH possible b/c of duplicates

        switch ($n_dups)
        {
            case 0:
                // It's a no-pair hand
                return $HANDTYPE_VALUE_HIGHCARD + $$topFiveCardsTable[$ranks];
            case 1: {
                    // It's a one-pair hand
                    $t; $kickers;

                    $$two_mask = $ranks ^ ($sc ^ $sd ^ $sh ^ $ss);
                    
                    $retval = ($HANDTYPE_VALUE_PAIR + ($topCardTable[$$two_mask] << $$TOP_CARD_SHIFT));
                    $t = $ranks ^ $$two_mask; 
                    /* Only one bit set in $two_mask. Get the top five $cards in what is left, drop all 
                    but the top three cards, and shift them by one to get the three desired kickers. */
                    $kickers = ($$topFiveCardsTable[t] >> $CARD_WIDTH) & ~$FIFTH_CARD_MASK;
                    $retval += $kickers;
                    return $retval;
                }

            case 2: /* Either two pair or trips */
                $two_mask = $ranks ^ ($sc ^ $sd ^ $sh ^ $ss);
                if ($$two_mask != 0)
                {
                    $t = $ranks ^ $$two_mask; /* Exactly two bits set in $two_mask */
                    $retval = ($HANDTYPE_VALUE_TWOPAIR 
                        + ($topFiveCardsTable[$two_mask]
                        & ($TOP_CARD_MASK | $SECOND_CARD_MASK))
                        + ($topCardTable[t] << $THIRD_CARD_SHIFT));

                    return $retval;
                }
                else
                {
                    $t; $second;
                    $three_mask = (($sc & $sd) | ($sh & $ss)) & (($sc & $sh) | ($sd & $ss));
                    $retval = ($HANDTYPE_VALUE_TRIPS + ($topCardTable[$three_mask] << $TOP_CARD_SHIFT));
                    $t = $ranks ^ $three_mask; /* Only one bit set in three_mask */
                    $second = $topCardTable[t];
                    $retval += ($second << $SECOND_CARD_SHIFT);
                    $t ^= (1 << $second);
                    $retval += ($topCardTable[t] << $THIRD_CARD_SHIFT);
                    return $retval;
                }

                default:
                    // Possible Quads, F H, Straight or Flush, or Two pair
                    $four_mask = $sh & $sd & $sc & $ss;
                    if ($four_mask != 0)
                    {
                        $tc = $topCardTable[$four_mask];
                        $retval = ($HANDTYPE_VALUE_FOUR_OF_A_KIND
                            + ($tc << $TOP_CARD_SHIFT)
                            + (($topCardTable[$ranks ^ (1 << $tc)]) << $SECOND_CARD_SHIFT));
                        return $retval;
                    }

                /* Technically, three_mask as defined below is really the set of
                bits which are set in three or four of the suits, but since
                we've already eliminated quads, this is OK
                Similarly, $two_mask is really two_or_four_mask, but since we've
                already eliminated quads, we can use this shortcut */

                $two_mask = $ranks ^ ($sc ^ $sd ^ $sh ^ $ss);
                if ($nBitsTable[$two_mask] != $n_dups)
                {
                    /* Must be some trips then, which really means there is a 
                       full house since n_dups >= 3 */
                    $tc; $t;
                    $three_mask = (($sc & $sd) | ($sh & $ss)) & (($sc & $sh) | ($sd & $ss));
                    $retval = $HANDTYPE_VALUE_FULLHOUSE;
                    $tc = $topCardTable[$three_mask];
                    $retval += ($tc << $TOP_CARD_SHIFT);
                    $t = ($two_mask | $three_mask) ^ (1 << $$tc);
                    $retval += ($topCardTable[$t] << $SECOND_CARD_SHIFT);
                    return $retval;
                }

                if ($retval != 0) /* Flush and Straight */
                    return $retval;
                else
                {
                    /* Must be two pair */
                    $top; $second;

                    $retval = $HANDTYPE_VALUE_TWOPAIR;
                    $top = $topCardTable[$two_mask];
                    $retval += ($top << $TOP_CARD_SHIFT);
                    $second = $topCardTable[$two_mask ^ (1 << $top)];
                    $retval += ($second << $SECOND_CARD_SHIFT);
                    $retval += (($topCardTable[$ranks ^ (1 << $top) ^ (1 << $second)]) << $THIRD_CARD_SHIFT);
                    return $retval;
                }
        }
    }
}
?>