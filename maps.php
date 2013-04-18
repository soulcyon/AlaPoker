<?php
set_time_limit(0);
ini_set("display_errors", true);
error_reporting(E_ALL);

require_once("lib/sdk.class.php");
define('AWS_KEY', 'KA9YTZ0VKCubmzFamJtZ');
define('AWS_SECRET_KEY', 'KqHNhlTuJUXTDJeSKsADvAcy07H33I2fDcc0rLvW');
define('AWS_CANONICAL_ID', 'sastad');
define('AWS_CANONICAL_NAME', 'sastad');
$HOST = 'objects.dreamhost.com';

$s3 = new AmazonS3(array(
	"key" => AWS_KEY,
	"secret" => AWS_SECRET_KEY
));
$s3->set_hostname($HOST);
$s3->allow_hostname_override(false);

$s3->enable_path_style();

$maps = scandir("/www/content/maps");

echo "Starting map upload.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
echo "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.";
echo "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).";
echo "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.";
$db = new PDO("mysql:host=localhost;dbname=haloindex", "root", '$erst23441.');

$sth = $db->query("SELECT `name` FROM `maps` ORDER BY `index` DESC");
$f = $sth->execute();
$latest = $sth->fetchColumn(0);
$start = false;

foreach($maps as $k => $v){
	if( $v == "." || $v == ".." ) continue;
	if( $latest == $v ) $start = true;
	if( !$start ) continue;

	$s3->create_object("haloindex", "haloindex-maps/" . $v, array(
		"body" => file_get_contents("/www/content/maps/" . $v)
	));
	$db->query("INSERT INTO `maps` (`name`) VALUES ('$v')");
	echo "Completed $v\n";
}
echo "Complete";
?>