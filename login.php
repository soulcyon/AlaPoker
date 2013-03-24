<?php
require_once "inc/db.php";
require_once "inc/facebook.php";
require_once "inc/Shank.php";

session_start();

$db = new PDO("mysql:host=localhost;dbname=alapoker", DB_USER, DB_PASS);
$fb = new Facebook(array(
	"appId" => "234158256728205",
	"secret" => "45c13e33eba1de7a21e62ccdb5fa5a62",
	"fileUpload" => false
));

function showLogin(){
	Header("Content-type: text/html");
	echo ShankTemplate::parse("header.html");
	echo ShankTemplate::parse("login.html");
	echo ShankTemplate::parse("footer.html");
}

function isLoggedIn(){
	global $fb;

	Header("Content-type: application/json");
	if( isset($_SESSION["user"]) ) return json_encode(true);

	$user = $fb->getUser();

	if( !$user ){
		return json_encode(false);
	} else {
		$realUser = $fb->api('me');
		if( isset($realUser["email"]) ){
			$_SESSION["user"] = $realUser["email"];
			return json_encode(true);
		}
	}
	return json_encode(false);
}

function finishLogin(){
	global $fb;
	$fb->getUser();
	$fb->api('me');
	//Header("Location: http://dijjit.com/mihir/AlaPoker/beta/");
}

function doLogin(){
	global $fb;

	Header("Location: " . $fb->getLoginUrl(array(
		"redirect_uri" => "http://dijjit.com/mihir/AlaPoker/beta/login.php?type=finishLogin",
		"cancel_uri" => "http://dijjit.com/mihir/AlaPoker/beta/",
		"scope" => "email"
	)));
	return json_encode(false);
}

function getData(){
	global $fb, $db;

	Header("Content-type: application/json");
	$realUser = $fb->api('me');
	if( !isset($realUser["email"]) ){
		return false;
	}
	$id = $realUser["email"];

	$sth = $db->query("SELECT * FROM `users` WHERE `username` = '$id'");
	$rows = $sth->fetchAll();
	if( count($rows) === 0 ){
		$db->query("INSERT INTO `users` (`username`, `balance`) VALUES ('$id', 1000000)");
		return array(
			"email" => $id,
			"balance" => "1000000"
		);
	} else {
		return json_encode(array(
			"email" => $id,
			"balance" => $rows[0]["balance"]
		));
	}
}
echo call_user_func($_REQUEST["type"]);