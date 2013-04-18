<?php
require_once "inc/db.php";
require_once "inc/facebook.php";
require_once "inc/Shank.php";

session_start();

$db = new PDO("mysql:host=localhost;dbname=alapoker", DB_USER, DB_PASS);
$fb = new Facebook(array(
	"appId" => "234158256728205",
	"secret" => "985d627915e502a8568d9002ee88e515",
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
	Header("Location: http://ala-poker.com/");
}

function doFBLogin(){
	global $fb;
	var_dump($fb->getUser());
	Header("Location: " . $fb->getLoginUrl(array(
		"redirect_uri" => "http://ala-poker.com/login.php?type=finishLogin",
		"cancel_uri" => "http://ala-poker.com/",
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

	$sth = $db->query("SELECT `balance` FROM `users` WHERE `email` = '$id'");
	$rows = $sth->fetchAll();
	if( count($rows) === 0 ){
		$db->query("INSERT INTO `users` (`email`, `balance`) VALUES ('$id', 10000)");
		return json_encode(array(
			"email" => $id,
			"balance" => "10000"
		));
	} else {
		return json_encode(array(
			"email" => $id,
			"balance" => $rows[0]["balance"]
		));
	}
}
echo call_user_func($_REQUEST["type"]);