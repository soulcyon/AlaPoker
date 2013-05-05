<?php
return 
	array(
		"base_url" => "http://game.alapoker.net/hybridauth/", 

		"providers" => array ( 
			// openid providers
			"OpenID" => array (
				"enabled" => false
			),

			"AOL"  => array ( 
				"enabled" => false 
			),

			"Yahoo" => array ( 
				"enabled" => false,
				"keys"    => array ( "id" => "", "secret" => "" )
			),

			"Google" => array ( 
				"enabled" => true,
				"keys"    => array ( "id" => "508100890521.apps.googleusercontent.com", "secret" => "eOukQfrP67B3HBEY0Kd3w-3L" )
				//"scope"   => "https://www.googleapis.com/auth/userinfo.email"
			),

			"Facebook" => array ( 
				"enabled" => true,
				"keys"    => array ( "id" => "234158256728205", "secret" => "985d627915e502a8568d9002ee88e515" )
				//"scope"   => "email"
			),

			"Twitter" => array ( 
				"enabled" => true,
				"keys"    => array ( "key" => "KGj3bqQtqAKAr0hpKaOdvA", "secret" => "Jc4ue7cSE4XeWtJd5jitZYLesQpKU6eYJkjl0xp8XWg" ) 
			),

			// windows live
			"Live" => array ( 
				"enabled" => true,
				"keys"    => array ( "id" => "000000004C0EB423", "secret" => "hrKaun2LM06g6UbruJ0R9qkDgKstoSOU" ) 
			),

			"MySpace" => array ( 
				"enabled" => false,
				"keys"    => array ( "key" => "", "secret" => "" ) 
			),

			"LinkedIn" => array ( 
				"enabled" => true,
				"keys"    => array ( "key" => "ngv47ag5fe60", "secret" => "i35tPdjYO7q0t4N1" ) 
			),

			"Foursquare" => array (
				"enabled" => false,
				"keys"    => array ( "id" => "", "secret" => "" ) 
			),
		),

		// if you want to enable logging, set 'debug_mode' to true  then provide a writable file by the web server on "debug_file"
		"debug_mode" => true,

		"debug_file" => "/www/sites/log.log"
	);
