<?php
require_once "facebook/provider.php";

class AuthProvider {
	private $fb;
	public function __construct(){
		$this->fb = new Facebook(array(
			"appId" => "111833382353889",
			"secret" => "79d55e21c3ce5bdbf0c9caae1d8067b5",
			"fileUpload" => false
		));
		return true;
	}
	public function login(){
		return $this->fb->getLoginUrl(array(
			"redirect_uri" => "http://beta.alapoker.net/facebook/complete",
			"cancel_uri" => "http://beta.alapoker.net/facebook/cancel",
			"scope" => "email"
		));
	}
	public function isLoggedIn(){
		$real = $this->fb->api('me');
		return $this->fb->getUser() && isset($real["email"]) ? $real["email"] : false;
	}
}