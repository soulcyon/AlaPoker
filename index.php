<?php
error_reporting(E_ALL);
ini_set("display_errors", true);
require_once "inc/Shank.php";
require_once "inc/db.php";

session_start();

Shank::config("root", str_replace("index.php", "", $_SERVER["SCRIPT_NAME"]));
Shank::config("debug", true);

Shank::route("GET /", function(){
	html("header", "index", "footer");
});
Shank::route("GET /ladder", function(){
	Header("Location: /ladder/");
});
Shank::route("GET /ladder/", function(){
	html("header", "ladder", "footer");
});
Shank::route("GET /logout", function(){
	Header("Location: /logout/");
});
Shank::route("GET /logout/", function(){
	session_destroy();
	Header("Location: /");
});
Shank::route("GET /login", function(){
	Header("Location: /login/");
});
Shank::route("GET /login/", function(){
	if( isset($_SESSION["user"]) ){
		Header("Location: /");
	} else {
		html("header", "login", "footer");
	}
});
Shank::route("GET /login/*", function(){
	require_once "inc/auth/facebook.php";
	$t = new AuthProvider();
	if( ($_SESSION["user"] = $t->isLoggedIn()) ){
		Header("Location: /");
	} else {
		Header("Location: /login/");
	}
});
Shank::route("POST /login/", function(){
	$db = new PDO("mysql:host=localhost;dbname=alapoker", DB_USER, DB_PASS);
	switch($_POST["type"]){
		case "isLoggedIn":
			Header("Content-type: application/json");
			if( isset($_SESSION["user"]) ){
				$id = $_SESSION["user"];
				$sth = $db->query("SELECT `nickname` FROM `users` WHERE `email` = '$id'");
				$rows = $sth->fetchAll();
				if( empty($rows[0][0]) || $rows[0][0] == "New User" ){
					die(json_encode(array("result" => -1)));
				} else {
					die(json_encode(array("result" => true)));
				}
			} else {
				die(json_encode(array("result" => false)));
			}
		break;
		case "nick":
			$nick = $_POST["nick"];
			$id = $_SESSION["user"];
			$sth = $db->query("SELECT `nickname` FROM `users` WHERE `email` = '$id'");
			$rows = $sth->fetchAll();
			if( empty($rows[0][0]) || $rows[0][0] == "New User" ){
				$db->query("UPDATE `users` SET `nickname` = '$nick' WHERE `email` = '$id'");
			}
		break;
		case "getData":
			Header("Content-type: application/json");
			$id = $_SESSION["user"];
			$sth = $db->query("SELECT `nickname`, `balance` FROM `users` WHERE `email` = '$id'");
			$rows = $sth->fetchAll();
			if( count($rows) === 0 ){
				$db->query("INSERT INTO `users` (`email`, `balance`) VALUES ('$id', 10000)");
				die(json_encode(array(
					"nickname" => "New User",
					"balance" => "10000"
				)));
			} else {
				die(json_encode(array(
					"nickname" => $rows[0]["nickname"],
					"balance" => $rows[0]["balance"]
				)));
			}
		break;
		case "facebook":
			require_once "inc/auth/facebook.php";
		break;
		case "persona":
			require_once "inc/auth/persona.php";
		break;
		default:
			Header("Location: /");
	}
	$t = new AuthProvider();
	die($t->login());
});
Shank::route("POST /", function(){
	require_once "inc/Game.php";
	if( !isset($_POST["type"]) ) die("");

	$g = new Game($_POST["type"], $_POST);
});
Shank::route("GET /analytics/", function(){

});
// Enable BeastMode
Shank::beastMode();

function html(){
	Header("Content-type: text/html");
	ShankTemplate::set("Ptime", filemtime("js/plugins.js"));
	ShankTemplate::set("Mtime", filemtime("js/main.js"));
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