<?php


if(!isset($_POST['codice_richiesta'])) {

    header("HTTP/1.1 400 Bad Request", false, 400);

    exit;

}

require "../db_connection/connection.php";

$insert = $conn->prepare("UPDATE utente SET 
nome=:nome,cognome=:cognome,codice_richiesta=:codice_richiesta,facolta=:facolta,ordinamento=:ordinamento
,anno=:anno,codice_fiscale=:codice_fiscale,email=:email,tel=:tel WHERE codice_richiesta=:codice_richiesta");


$insert->bindValue(':nome', $_POST['nome']);
$insert->bindValue(':cognome', $_POST['cognome']);
$insert->bindValue(':codice_richiesta', $_POST['codice_richiesta']);
$insert->bindValue(':facolta', $_POST['facolta']);
$insert->bindValue(':ordinamento', $_POST['ordinamento']);
$insert->bindValue(':anno', $_POST['anno']);
$insert->bindValue(':codice_fiscale', $_POST['codice_fiscale']);
$insert->bindValue(':tel', $_POST['tel']);
$insert->bindValue(':email', $_POST['email']);

$insert->execute();
