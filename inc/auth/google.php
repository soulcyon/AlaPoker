<?php

error_reporting(E_ALL);
ini_set("display_errors", true);

require_once "google/openid.php";

class AuthProvider {
	private $openid;
	public function __construct(){
		$this->openid = new LightOpenID('http://alapoker.net');
		if( $this->openid->mode == 'cancel' ){
			return false;
		}
		if( $this->openid->validate() ){
			return $this->openid->identity;
		}
		return true;
	}
	public function login(){
		$this->openid->identity = "https://www.google.com/accounts/o8/id";
		$this->openid->returnUrl = "http://alapoker.net/login/?google";
		$this->openid->realm = "http://alapoker.net";
		return $this->openid->authUrl(true);
	}
	public function isLoggedIn(){
		return $this->openid->validate() ? $this->openid->identity : false;
	}
}