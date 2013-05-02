<?php
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

		mail("$id", "AlaPoker :: Thanks for signing up!", "Your password is $pass");

		echo self::json($DB->exec("INSERT INTO `users` (`email`, `balance`, `ip`, `nickname`, `pass`)
			VALUES (?, 10000, INET_ATON(?), ?, ?)", array(1=>$id, 2=>$ip, 3=>$nick, 4=>$pass)));
	}
	public static function rawAuth($e){
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
	public static function janrain($e){
		if( !isset($_POST["token"]) ){
			return Header("Location: /");
		}
		$token = $_POST["token"];
		$res = json_decode(Auth::rain(array(
			"token" => $token,
			"apiKey" => "9cc9fa11fef4c01c327c1c296e5a25460b0c9ea4"
		)), true);
		if( $res["stat"] === "ok" ){
			$_SESSION["user"] = $res["profile"]["email"];
		}
		Header("Location: /");
	}
	public static function raw($e){
		require_once "inc/providers/raw.php";
		$t = new AuthProvider();
		$t->login();
	}
	private static function rain($fields){
		$url = 'https://rpxnow.com/api/v2/auth_info';
		$fields_string = "";

		foreach($fields as $key=>$value) {
			$fields_string .= $key.'='.$value.'&';
		}
		rtrim($fields_string, '&');

		$ch = curl_init();

		curl_setopt($ch,CURLOPT_URL, $url);
		curl_setopt($ch,CURLOPT_POST, count($fields));
		curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
		curl_setopt($ch,CURLOPT_RETURNTRANSFER, 1);

		$result = curl_exec($ch);

		curl_close($ch);

		return $result;
	}
}
?>