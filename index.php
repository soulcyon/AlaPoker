<?php
error_reporting(E_ALL);
ini_set("display_errors", true);
require_once "inc/Shank.php";

Shank::config("root", str_replace("index.php", "", $_SERVER["SCRIPT_NAME"]));
Shank::config("debug", true);

Shank::route("GET /*", function(){
	html("header", "index", "footer");
});
Shank::route("POST /", function(){
	require_once "inc/Game.php";
	if( !isset($_POST["type"]) ) die("");

	$g = new Game($_POST["type"], $_POST);
});

// Enable BeastMode
Shank::beastMode();

function html(){
	Header("Content-type: text/html");
	foreach(func_get_args() as $file){
		echo ShankTemplate::parse($file . ".html");
	}
}
function json($e){
	if( isset($e["error"]) ){
		Header("Status: 505");
	}
	Header("Content-type: application/json");
	echo json_encode($e);
}
?>