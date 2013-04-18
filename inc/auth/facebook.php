<?php
require_once "facebook/provider.php";

class AuthProvider {
	private $fb;
	public function __construct(){
		$this->fb = new Facebook(array(
			"appId" => "234158256728205",
			"secret" => "985d627915e502a8568d9002ee88e515",
			"fileUpload" => false
		));
		return true;
	}
	public function login(){
		return $this->fb->getLoginUrl(array(
			"redirect_uri" => "http://m.alapoker.net/login/?complete=true",
			"cancel_uri" => "http://m.alapoker.net/login/?cancel=true",
			"scope" => "email"
		));
	}
	public function isLoggedIn(){
		$real = $this->fb->api('me');
		return $this->fb->getUser() && isset($real["email"]) ? $real["email"] : false;
	}
}