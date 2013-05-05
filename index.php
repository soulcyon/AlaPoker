<?php
/**
 * A la Poker!
 *
 * @author     Sashank Tadepalli <dijjit@gmail.com>
 * @copyright  2013 A la poker
 * @license    All rights reserved
 */

// Sessions only, no long-term cookies
define("session.cookie_lifetime", 1800);
define("session.gc_maxlifetime", 1800);
session_start();

// Required libraries
require_once "inc/API.php";
require_once "inc/Auth.php";
require_once "inc/Game.php";

$f3 = require("lib/base.php");
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
	$e->set("loggedin", isset($_SESSION["user"]) ? "true" : "false");
	return parseTemplate("index");
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

// User Auth Handle
$f3->route("POST /auth/@action", "Auth::@action");

// Game API Handle
$f3->route("POST /game/@action", "Game->@action");

// BeastMode
$f3->run();

// Generic template parsing
function parseTemplate($e, $title = "default"){
	global $f3;

	$js = "ui/js/$e.js";

	$f3->set("title", $title);
	$f3->set("page", $e);
	$f3->set("ptime", file_exists($js) ? filemtime($js) : "");
	echo Template::instance()->render("$e.html");
}
?>