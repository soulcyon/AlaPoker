<?php
class AuthProvider {
    public function __construct(){
    }
    public function login(){
        $url = "https://verifier.login.persona.org/verify";
        $c = curl_init($url);
        curl_setopt_array($c, array(
            CURLOPT_RETURNTRANSFER  => true,
            CURLOPT_POST            => true,
            CURLOPT_POSTFIELDS      => "assertion=" . $_POST["assertion"] . "&audience=http://m.alapoker.net/",
            CURLOPT_SSL_VERIFYPEER  => true,
            CURLOPT_SSL_VERIFYHOST  => 2
        ));
        $result = curl_exec($c);
        curl_close($c);

        $response = json_decode($result);
        if ($response->status == "okay") {
            $_SESSION["user"] = $response->email;
        }
        return false;
    }
    public function isLoggedIn(){
        return isset($_SESSION["user"]) ? $_SESSION["user"] : false;
    }
}

?>