<?php
/**
 * Yield.php
 *
 * @author     Sashank Tadepalli <dijjit@gmail.com>
 * @author     Mihir Sanghavi <mihir.h.sanghavi@gmail.com>
 * @copyright  2013 A la poker
 * @license    All rights reserved
 */
class Yield {
    private static function bitCount($i){
        return
            Tables::$BITS_TABLE[$i & 0x00000000000000FF] +
            Tables::$BITS_TABLE[($i & 0x000000000000FF00) >> 8] +
            Tables::$BITS_TABLE[($i & 0x0000000000FF0000) >> 16] +
            Tables::$BITS_TABLE[($i & 0x00000000FF000000) >> 24] +
            Tables::$BITS_TABLE[($i & 0x000000FF00000000) >> 32] +
            Tables::$BITS_TABLE[($i & 0x0000FF0000000000) >> 40] +
            Tables::$BITS_TABLE[($i & 0x00FF000000000000) >> 48] +
            Tables::$BITS_TABLE[($i & 0xFF00000000000000) >> 56];
    }
	public static function generate($shared, $dead, $numberOfCards) {
        $dead |= $shared;
        switch ($numberOfCards - self::bitCount($shared))
        {
            case 7:
                for ($i1 = $numberOfCards - 1; $i1 >= 0; $i1--)
                {
                    $card1 = Tables::$CARD_MASKS_TABLE[$i1];
                    if (($dead & $card1) != 0) continue;
                    for ($i2 = $i1 - 1; $i2 >= 0; $i2--)
                    {
                        $card2 = Tables::$CARD_MASKS_TABLE[$i2];
                        if (($dead & $card2) != 0) continue;
                        $n2 = $card1 | $card2;
                        for ($i3 = $i2 - 1; $i3 >= 0; $i3--)
                        {
                            $card3 = Tables::$CARD_MASKS_TABLE[$i3];
                            if (($dead & $card3) != 0) continue;
                            $n3 = $n2 | $card3;
                            for ($i4 = $i3 - 1; $i4 >= 0; $i4--)
                            {
                                $card4 = Tables::$CARD_MASKS_TABLE[$i4];
                                if (($dead & $card4) != 0) continue;
                                $n4 = $n3 | $card4;
                                for ($i5 = $i4 - 1; $i5 >= 0; $i5--)
                                {
                                    $card5 = Tables::$CARD_MASKS_TABLE[$i5];
                                    if (($dead & $card5) != 0) continue;
                                    $n5 = $n4 | $card5;
                                    for ($i6 = $i5 - 1; $i6 >= 0; $i6--)
                                    {
                                        $card6 = Tables::$CARD_MASKS_TABLE[$i6];
                                        if (($dead & $card6) != 0) continue;
                                        $n6 = $n5 | $card6;
                                        for ($i7 = $i6 - 1; $i7 >= 0; $i7--)
                                        {
                                            $card7 = Tables::$CARD_MASKS_TABLE[$i7];
                                            if (($dead & $card7) != 0) continue;
                                            $result = $n6 | $card7 | $shared;
                                            return $result;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                break;
            case 6:
                for ($i1 = $numberOfCards - 1; $i1 >= 0; $i1--)
                {
                    $card1 = Tables::$CARD_MASKS_TABLE[$i1];
                    if (($dead & $card1) != 0) continue;
                    for ($i2 = $i1 - 1; $i2 >= 0; $i2--)
                    {
                        $card2 = Tables::$CARD_MASKS_TABLE[$i2];
                        if (($dead & $card2) != 0) continue;
                        $n2 = $card1 | $card2;
                        for ($i3 = $i2 - 1; $i3 >= 0; $i3--)
                        {
                            $card3 = Tables::$CARD_MASKS_TABLE[$i3];
                            if (($dead & $card3) != 0) continue;
                            $n3 = $n2 | $card3;
                            for ($i4 = $i3 - 1; $i4 >= 0; $i4--)
                            {
                                $card4 = Tables::$CARD_MASKS_TABLE[$i4];
                                if (($dead & $card4) != 0) continue;
                                $n4 = $n3 | $card4;
                                for ($i5 = $i4 - 1; $i5 >= 0; $i5--)
                                {
                                    $card5 = Tables::$CARD_MASKS_TABLE[$i5];
                                    if (($dead & $card5) != 0) continue;
                                    $n5 = $n4 | $card5;
                                    for ($i6 = $i5 - 1; $i6 >= 0; $i6--)
                                    {
                                        $card6 = Tables::$CARD_MASKS_TABLE[$i6];
                                        if (($dead & $card6) != 0)
                                            continue;
                                        return $n5 | $card6 | $shared;
                                    }
                                }
                            }
                        }
                    }
                }
                break;
            case 5:
                for ($i1 = $numberOfCards - 1; $i1 >= 0; $i1--)
                {
                    $card1 = Tables::$CARD_MASKS_TABLE[$i1];
                    if (($dead & $card1) != 0) continue;
                    for ($i2 = $i1 - 1; $i2 >= 0; $i2--)
                    {
                        $card2 = Tables::$CARD_MASKS_TABLE[$i2];
                        if (($dead & $card2) != 0) continue;
                        $n2 = $card1 | $card2;
                        for ($i3 = $i2 - 1; $i3 >= 0; $i3--)
                        {
                            $card3 = Tables::$CARD_MASKS_TABLE[$i3];
                            if (($dead & $card3) != 0) continue;
                            $n3 = $n2 | $card3;
                            for ($i4 = $i3 - 1; $i4 >= 0; $i4--)
                            {
                                $card4 = Tables::$CARD_MASKS_TABLE[$i4];
                                if (($dead & $card4) != 0) continue;
                                $n4 = $n3 | $card4;
                                for ($i5 = $i4 - 1; $i5 >= 0; $i5--)
                                {
                                    $card5 = Tables::$CARD_MASKS_TABLE[$i5];
                                    if (($dead & $card5) != 0) continue;
                                    return $n4 | $card5 | $shared;
                                }
                            }
                        }
                    }
                }
                break;
            case 4:
                for ($i1 = $numberOfCards - 1; $i1 >= 0; $i1--)
                {
                    $card1 = Tables::$CARD_MASKS_TABLE[$i1];
                    if (($dead & $card1) != 0) continue;
                    for ($i2 = $i1 - 1; $i2 >= 0; $i2--)
                    {
                        $card2 = Tables::$CARD_MASKS_TABLE[$i2];
                        if (($dead & $card2) != 0) continue;
                        $n2 = $card1 | $card2;
                        for ($i3 = $i2 - 1; $i3 >= 0; $i3--)
                        {
                            $card3 = Tables::$CARD_MASKS_TABLE[$i3];
                            if (($dead & $card3) != 0) continue;
                            $n3 = $n2 | $card3;
                            for ($i4 = $i3 - 1; $i4 >= 0; $i4--)
                            {
                                $card4 = Tables::$CARD_MASKS_TABLE[$i4];
                                if (($dead & $card4) != 0) continue;
                                return $n3 | $card4 | $shared;
                            }
                        }
                    }
                }

                break;
            case 3:
                for ($i1 = $numberOfCards - 1; $i1 >= 0; $i1--)
                {
                    $card1 = Tables::$CARD_MASKS_TABLE[$i1];
                    if (($dead & $card1) != 0) continue;
                    for ($i2 = $i1 - 1; $i2 >= 0; $i2--)
                    {
                        $card2 = Tables::$CARD_MASKS_TABLE[$i2];
                        if (($dead & $card2) != 0) continue;
                        $n2 = $card1 | $card2;
                        for ($i3 = $i2 - 1; $i3 >= 0; $i3--)
                        {
                            $card3 = Tables::$CARD_MASKS_TABLE[$i3];
                            if (($dead & $card3) != 0) continue;
                            return $n2 | $card3 | $shared;
                        }
                    }
                }
                break;
            case 2:
                $length = count(Tables::$TWO_CARD_TABLE);
                for ($i1 = 0; $i1 < $length; $i1++)
                {
                    $card1 = Tables::$TWO_CARD_TABLE[$i1];
                    if (($dead & $card1) != 0) continue;
                    return $card1 | $shared;
                }
                break;
            case 1:
                $$length = Tables::$CARD_MASKS_TABLE.$length;
                for ($i1 = 0; $i1 < $length; $i1++)
                {
                    $card1 = Tables::$CARD_MASKS_TABLE[$i1];
                    if (($dead & $card1) != 0) continue;
                    return $card1 | $shared;
                }
                break;
            case 0:
                return $shared;
                break;
            default:
                return 0;
                break;
        }
    }
}
?>