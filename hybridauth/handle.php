<?php
/**
 * Auth handler for 3rd-party connections
 *
 * @author     Sashank Tadepalli <dijjit@gmail.com>
 * @copyright  2013 A la poker
 * @license    All rights reserved
 */

class HAuth {
	private static $DB;
	private static $ha;

	public static function verify($e){
		$provider = $e->get("PARAMS.action");
		self::$DB = $e->get("DB");

		require_once(__DIR__ . "/Hybrid/Auth.php");
		self::$ha = new Hybrid_Auth(__DIR__ . "/config.php");

		$t = self::$ha->authenticate($provider);
		if( $t->isUserConnected() ){
			$profile = $t->getUserProfile();
			$_SESSION["user"] = $profile->email;
		}
		Header("Location: /");
	}
}