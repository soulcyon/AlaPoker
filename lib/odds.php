<?php
Header("Content-type: application/json");
require_once("AlaPoker.php");
$ala = new AlaPoker($_POST["hand"], $_POST["board"], $_POST["dead"]);
echo json_encode($ala->getOdds());
?>