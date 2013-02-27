<?php

Header("Content-type: application/json");
require_once("AlaPoker.php");

// $ala = new AlaPoker($_POST["hand"], $_POST["board"], $_POST["dead"]);
$ala = new AlaPoker("AH KH", "AC KC", "QH QC TC");
$ala->getOdds();

echo json_encode($ala->getOdds());

?>