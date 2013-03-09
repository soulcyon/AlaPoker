<?php
Header("Content-type: application/json");
//require_once("AlaPoker.php");
//$ala = new AlaPoker($_POST["hand"], $_POST["board"], $_POST["dead"]);
$result = pokenum(PN_TEXAS, $_POST["hand"], $_POST["board"], $_POST["dead"]);
var_dump($result);
echo json_encode($result);
?>