<?php

$f3 = require("lib/base.php");
$f3->set("AUTOLOAD","inc/");
$f3->set("UI","ui/");
$f3->set("DB", require("db.php"));

// Generic resource handling
$f3->route("GET /@folder/@file.@type", function($e){
	$folder = $e->get("PARAMS.folder");
	$type = $e->get("PARAMS.type");
	$file = $e->get("UI") . $folder . "/" . $e->get("PARAMS.file") . "." . $type;
	$types = array(
		"css" => "text/css",
		"js" => "text/javascript",
		"png" => "image/png",
		"jpg" => "image/jpeg",
		"jpeg" => "image/jpeg"
	);
	if( file_exists($file) ){
		Header("Content-type: $types[$type]");
		echo file_get_contents($file);
	} else {
		$e->error(404);
	}
});

// Homepage
$f3->route("GET /", function($e){
	return parseTemplate("index");
});

// Login
$f3->route("GET /login", function($e){
	if( isset($_SESSION["user"]) ){
		return $e->reroute("/");
	}
	return parseTemplate("login", "Login");
});

// Logout
$f3->route("GET /logout", function($e){
	session_destroy();
	$e->reroute("/");
});

// Admin
$f3->route("GET /admin", function($e){
	if( !isset($_SESSION["user"]) || $_SESSION["admin"] != "aef1a53c65791117bf612fd6e39a3632f9f063ae4b2b25ee26712711d5956875" ){
		return $e->reroute("/");
	}
	return parseTemplate("admin");
});

// User auth handling
$f3->route("POST /login/@action", "Login::@action");
$f3->route("GET /facebook/*", "Login::facebookVerify");

// API Handle
$f3->route("POST /api/@action", "Game->@action");

$f3->run();

function parseTemplate($e, $title = "default"){
	global $f3;

	$f3->set("title", $title);
	$f3->set("page", $e);
	echo Template::instance()->render("$e.html");
}

?>