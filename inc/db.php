<?php
class MySQL {
	private static $db;

	private static function init(){
		self::$db = new PDO("mysql:host=localhost;dbname=alapoker", 'root', '$erst23441.');
		self::$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
		self::$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}

	public static function query($st, $var){
		if( self::$db === null )
			self::init();

		// Execute DB query
		$sth = self::$db->prepare($st);
		$sth->execute($var);
		return $sth;
	}

	public static function log($log){
		if( self::$db === null )
			self::init();
		
		// Logging queries
		$ip = isset($_SERVER["HTTP_CF_CONNECTING_IP"]) ? $_SERVER["HTTP_CF_CONNECTING_IP"] : $_SERVER["REMOTE_ADDR"];
		$sth = self::$db->prepare("INSERT INTO `logger` (`query`, `referer`, `ip`) VALUES (?, ?, INET_ATON(?))");
		$sth->execute(array($log, $_SERVER["HTTP_REFERER"], $ip));
		return $sth;
	}

	public static function getLastID(){
		if( self::$db === null )
			self::init();

		return self::$db->lastInsertId();
	}
}