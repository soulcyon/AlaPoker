<?php
/**
 * Authentication engine
 *
 * @author     Sashank Tadepalli <dijjit@gmail.com>
 * @copyright  2013 A la poker
 * @license    All rights reserved
 */

class Auth extends API {
	public static function register($e){
		$DB = $e->get("DB");

		$id = $_POST["email"];
		$ip = isset($_SERVER["HTTP_CF_CONNECTING_IP"]) ? $_SERVER["HTTP_CF_CONNECTING_IP"] : $_SERVER["REMOTE_ADDR"];
		$pass = self::hash($_POST["pass1"]);
		$nick = $_POST["nick"];

		$rows = $DB->exec("SELECT * FROM `users` WHERE `email`=?", $id);
		if( count($rows) != 0 )
			die(self::json(array("error" => "Email is already registered.")));

		if( !filter_var($id, FILTER_VALIDATE_EMAIL) )
			die(self::json(array("error" => "Invalid Email")));

		if( !isset($nick) || empty($_POST["nick"]) )
			die(self::json(array("error" => "Invalid Nickname")));

		if( !isset($_POST["pass1"]) || !isset($_POST["pass2"]) ||
			empty($_POST["pass1"]) || empty($_POST["pass2"]) || 
			$_POST["pass1"] != $_POST["pass2"] )
			die(self::json(array("error" => "Passwords do not match")));

		// Send Mail
		$message = '<html><body>';
		$message .= '<img src="http://alapoker.net/wp-content/uploads/2013/05/Logo-2-jpg11.jpg" alt="A la Poker" />';
		$message .= '<h3>We cannot recover your password at a future date.  Please keep this email safe.</h3>';
		$message .= '<table rules="all" style="border-color: #666;" cellpadding="10">';
		$message .= "<tr style='background: #eee;'><td><strong>Login:</strong> </td><td>" . strip_tags($id) . "</td></tr>";
		$message .= "<tr><td><strong>Password:</strong> </td><td>" . strip_tags($_POST['pass1']) . "</td></tr>";
		$message .= "</table>";
		$message .= "</body></html>";

		$headers = "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
		mail($id, "AlaPoker :: Thanks for signing up!", $message, $headers);

		echo self::json($DB->exec("INSERT INTO `users` (`email`, `balance`, `ip`, `nickname`, `pass`)
			VALUES (?, 10000, INET_ATON(?), ?, ?)", array(1=>$id, 2=>$ip, 3=>$nick, 4=>$pass)));
	}
	public static function raw($e){
		$DB = $e->get("DB");

		$id = $_POST["email"];
		$pass = self::hash($_POST["pass"]);
		$rows = $DB->exec("SELECT `email`,`balance`,`nickname` FROM `users` WHERE `email` = ? AND `pass` = ?",
			array(1=>$id, 2=>$pass));

		if( count($rows) === 1 ){
			$_SESSION["user"] = $rows[0]["email"];
		}

		echo self::json($rows);
	}
	public static function verify($e){
		$DB = $e->get("DB");

		$result = false;
		if( isset($_SESSION["user"]) ){
			$id = $_SESSION["user"];
			$rows = $DB->exec("SELECT nickname FROM users WHERE email=?", $id);
			if( empty($rows[0]) || $rows[0]["nickname"] == "New User" ){
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
		$rows = $DB->exec("SELECT nickname FROM users WHERE email=?", $id);
		if( empty($rows[0]) || $rows[0]["nickname"] == "New User" ){
			$nick = $_POST["nick"];
			$DB->exec("UPDATE users SET nickname = ? WHERE email=?", array(1=>$nick, 2=>$id));
			$result = true;
		}
		echo self::json($result);
	}

	public static function data($e){
		$DB = $e->get("DB");

		$id = $_SESSION["user"];
		$rows = $DB->exec("SELECT nickname, balance FROM users WHERE email=?", $id);
		if( count($rows) === 0 ){
			$ip = isset($_SERVER["HTTP_CF_CONNECTING_IP"]) ? $_SERVER["HTTP_CF_CONNECTING_IP"] : $_SERVER["REMOTE_ADDR"];
			$DB->exec("INSERT INTO `users` (`email`, `balance`, `ip`) VALUES (?, 10000, INET_ATON(?))",
				array(1=>$id, 2=>$ip));
			$rows = array(
				array("nickname" => "New User", "balance" => 10000)
			);
		}
		echo self::json(array(
			"nickname" => $rows[0]["nickname"],
			"balance" => $rows[0]["balance"]
		));
	}
}
?>