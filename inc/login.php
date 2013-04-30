<?php
class Login extends API {
	public static function register($e){
		if( !filter_var($email, FILTER_VALIDATE_EMAIL) )
			die(self::json(array("error" => "Invalid Email")));

		if( !isset($_POST["nick"]) || empty($_POST["nick"]) )
			die(self::json(array("error" => "Invalid Nickname")));

		if( !isset($_POST["pass1"]) || !isset($_POST["pass2"]) ||
			empty($_POST["pass1"]) || empty($_POST["pass2"]) || 
			$_POST["pass1"] != $_POST["pass2"] )
			die(self::json(array("error" => "Passwords do not match")));

		$DB = $e->get("DB");

		$id = $_POST["email"];
		$ip = isset($_SERVER["HTTP_CF_CONNECTING_IP"]) ? $_SERVER["HTTP_CF_CONNECTING_IP"] : $_SERVER["REMOTE_ADDR"];
		$pass = self::hash($_POST["pass1"]);
		$nick = $_POST["nick"];

		echo self::json($DB->exec("INSERT INTO `users` (`email`, `balance`, `ip`, `nick`, `pass`)
			VALUES (?, 10000, INET_ATON(?), ?, ?)", array($id, $ip, $nick, $pass)));
	}
	public static function rawAuth($e){
		$DB = $e->get("DB");

		$id = $_POST["email"];
		$pass = self::hash($_POST["pass"]);

		echo self::json($DB->exec("SELECT FROM `users` WHERE `email` = ? AND `pass` = ?",
			array($id, $pass)));
	}
	public static function verify($e){
		$DB = $e->get("DB");

		$result = false;
		if( isset($_SESSION["user"]) ){
			$id = $_SESSION["user"];
			$sth = $DB->exec("SELECT `nickname` FROM `users` WHERE `email` = ?", array($id));
			$rows = $sth->fetchAll();
			if( empty($rows[0][0]) || $rows[0][0] == "New User" ){
				$result = -1;
			} else {
				$result = true;
			}
		}
		echo self::json(array("result" => $result));
	}
	public static function nick($e){
		$DB = $e->get("DB");

		$result = false;
		$id = $_SESSION["user"];
		$sth = $DB->exec("SELECT `nickname` FROM `users` WHERE `email` = ?", array($id));
		$rows = $sth->fetchAll();
		if( empty($rows[0][0]) || $rows[0][0] == "New User" ){
			$nick = $_POST["nick"];
			$DB->exec("UPDATE `users` SET `nickname` = ? WHERE `email` = ?", array($nick, $id));
			$result = true;
		}
		echo self::json($result);
	}
	public static function data($e){
		$DB = $e->get("DB");

		$id = $_SESSION["user"];
		$sth = $DB->exec("SELECT `nickname`, `balance` FROM `users` WHERE `email` = ?", array($id));
		$rows = $sth->fetchAll();
		if( count($rows) === 0 ){
			$ip = isset($_SERVER["HTTP_CF_CONNECTING_IP"]) ? $_SERVER["HTTP_CF_CONNECTING_IP"] : $_SERVER["REMOTE_ADDR"];
			$DB->exec("INSERT INTO `users` (`email`, `balance`, `ip`) VALUES (?, 10000, INET_ATON(?))", array($id, $ip));
			$rows = array(
				array("nickname" => "New User", "balance" => 10000)
			);
		}
		echo self::json(array(
			"nickname" => $rows[0]["nickname"],
			"balance" => $rows[0]["balance"]
		));
	}
	public static function facebook($e){
		require_once "inc/auth/facebook.php";
		$t = new AuthProvider();
		$t->login();
	}
	public static function facebookVerify($e){
		require_once "inc/auth/facebook.php";
		$t = new AuthProvider();
		if( ($_SESSION["user"] = $t->isLoggedIn()) ){
			Header("Location: /");
		} else {
			Header("Location: /login/");
		}
	}
	public static function persona($e){
		require_once "inc/auth/persona.php";
		$t = new AuthProvider();
		$t->login();
	}
	public static function raw($e){
		require_once "inc/auth/raw.php";
		$t = new AuthProvider();
		$t->login();
	}
}
?>