<?php



if(!isset($_POST['codice_richiesta'])) {

    header("HTTP/1.1 400 Bad Request", false, 400);

    exit;

}

require "../db_connection/connection.php";

$u = $conn->prepare("UPDATE utente SET stato=:stato WHERE codice_richiesta=:c AND parent=:p");
$u->bindValue(':c', $_POST['codice_richiesta']);
$u->bindValue(':p', $_POST['parent']);
$u->bindValue(':stato', $_POST['stato']);
$u->execute();

//$conn = null;
