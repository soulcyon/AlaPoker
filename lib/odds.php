<?php
ini_set("display_errors", true);
error_reporting(E_ALL);
Header("Content-type: application/json");
require_once("AlaPoker.php");

// $ala = new AlaPoker($_POST["hand"], $_POST["board"], $_POST["dead"]);
$ala = new AlaPoker("QH QC JH JC", "", "AH AC AS");
$ala->getOdds();

echo json_encode($ala->getOdds());
?>