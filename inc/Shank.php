<?php

	class Shank {
		private static $debug = false;
		private static $routes = array();
		private static $root = '';

		public static function config($name, $value){
			switch(strtolower($name)){
				case 'debug' : 
					self::$debug = !!$value;
				break;
				case 'root' :
					self::$root = rtrim($value, '/');
				break;
			}
		}

		public static function beastMode(){
			$method = trim(strtoupper($_SERVER['REQUEST_METHOD']));
			$request = str_replace(self::$root, '',
					(trim((substr($_SERVER['REQUEST_URI'], 0, 1) != '/' ? '/' : '') . $_SERVER['REQUEST_URI']))
			);
			$key = $method . ' ' . $request;
			foreach (self::$routes as $k => $fn) {
				$k = str_replace("*", "(.*)+", $k);
				if (($t = preg_match("/^" . str_replace("/", "\\/", $k) . "$/", $key)) != 0) 
					return $fn();
			}
			self::_404($request);
		}
		
		private static function _404($uri = null){
			if ($uri === null)  $uri = $_SERVER['REQUEST_URI'];

			Header('HTTP/1.0 404 Not Found');
			ShankTemplate::set('location', $uri);
			ShankTemplate::display('404.html');
		}

		public static function route($request, $function){
			self::$routes[$request] = $function;
		}

		public static function error($str){
			if (self::$debug === true)  echo $str;
			Header("HTTP/1.0 500 Internal Server Error");
			exit;
		}
	}

	class ShankTemplate {
		private static $tempvars = array();
		private static $ui_folder = 'ui';

		public static function set($name, $value){
			self::$tempvars[$name] = $value;
		}

		public static function get($name){
			return self::$tempvars[$name];
		}
		public static function parse($file = ""){
			$location = self::$ui_folder . '/' . $file;
			if (!file_exists($location)) {
				return Shank::error("Template file <strong>" . $location . "</strong> does not exist!");
			}

			$data = file_get_contents($location);
			$offset = 0;
			foreach (self::$tempvars as $key => $value) {
				$data = str_replace('{{' . $key . '}}', $value, $data);
			}
			return $data;
		}
		public static function display($file = ""){
			$data = self::parse($file);
			echo $data;
		}
	}
?>