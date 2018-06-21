
<?php

if(!isset($_POST['id'])) {

    header("HTTP/1.1 400 Bad Request", false, 400);

    exit;

}


require "../db_connection/connection.php";

$del = $conn->prepare("DELETE FROM esami_utente WHERE id=:id");

$del->bindValue(':id', $_POST['id']);

$del->execute();

$del = $conn->prepare("DELETE FROM matching WHERE id_esame_utente=:id");

$del->bindValue(':id', $_POST['id']);

$del->execute();

$conn = null;
