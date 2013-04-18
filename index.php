<?php
error_reporting(E_ALL);
ini_set("display_errors", true);

require_once "inc/Shank.php";
require_once "inc/db.php";

session_start();

Shank::config("root", str_replace("index.php", "", $_SERVER["SCRIPT_NAME"]));
Shank::config("debug", true);

Shank::route("GET /", function(){
	ShankTemplate::set("Mtime", filemtime("js/main.js"));
	ShankTemplate::set("Ctime", filemtime("css/main.css"));
	html("header", "m.index", "footer");
});

Shank::route("GET /m*.png", function(){
	Header("Content-type: image/png");
	echo file_get_contents("img/trans.png");
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
	switch($_POST["type"]){
		case "isLoggedIn":
			Header("Content-type: application/json");
			if( isset($_SESSION["user"]) ){
				$id = $_SESSION["user"];
				$sth = MySQL::query("SELECT `nickname` FROM `users` WHERE `email` = ?", array($id));
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
			$sth = MySQL::query("SELECT `nickname` FROM `users` WHERE `email` = ?", array($id));
			$rows = $sth->fetchAll();
			if( empty($rows[0][0]) || $rows[0][0] == "New User" ){
				MySQL::query("UPDATE `users` SET `nickname` = '$nick' WHERE `email` = ?", array($id));
			}
		break;
		case "getData":
			Header("Content-type: application/json");
			$id = $_SESSION["user"];
			$ip = isset($_SERVER["HTTP_CF_CONNECTING_IP"]) ? $_SERVER["HTTP_CF_CONNECTING_IP"] : $_SERVER["REMOTE_ADDR"];
			$sth = MySQL::query("SELECT `nickname`, `balance` FROM `users` WHERE `email` = ?", array($id));
			$rows = $sth->fetchAll();
			if( count($rows) === 0 ){
				MySQL::query("INSERT INTO `users` (`email`, `balance`, `ip`) VALUES (?, 10000, INET_ATON(?))", array($id, $ip));
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
Shank::route("POST /top10", function(){
	Header("Content-type: application/json");
	Header("Access-Control-Allow-Origin: http://blog.alapoker.net");
	echo json_encode(MySQL::query("SELECT `nickname`,`balance` FROM `users` WHERE `nickname` != 'New User' AND `balance` != 10000 ORDER BY `balance` DESC LIMIT 0,10", array())->fetchAll(PDO::FETCH_NUM));
});
Shank::route("POST /", function(){
	require_once "inc/Game.php";
	if( !isset($_POST["type"]) ) die("");

	$g = new Game($_POST["type"], $_POST);
});

// Mikesauce analytics
Shank::route("GET /inc/transactions.json", function(){
	echo "<h1>Last Updated: " . date('m/d/y h:i:s', filemtime("inc/transactions.json")) . "</h1>";
	echo "<p><a href=\"/inc/transactions.json\">Transactions</a></p>";
	echo "<p><a href=\"/inc/games.json\">Games</a></p>";
});
// Mikesauce analytics
Shank::route("GET /inc/games.json", function(){
	echo "<h1>Last Updated: " . date('m/d/y h:i:s', filemtime("inc/transactions.json")) . "</h1>";
	echo "<p><a href=\"/inc/transactions.json\">Transactions</a></p>";
	echo "<p><a href=\"/inc/games.json\">Games</a></p>";
});
Shank::route("GET /analytics/", function(){
	echo "<h1>Last Updated: " . date('m/d/y h:i:s', filemtime("inc/transactions.json")) . "</h1>";
	echo "<p><a href=\"/inc/transactions.json\">Transactions</a></p>";
	echo "<p><a href=\"/inc/games.json\">Games</a></p>";
});

// Enable BeastMode
Shank::beastMode();

function html(){
	Header("Content-type: text/html");
	ShankTemplate::set("Ptime", filemtime("js/plugins.js"));
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