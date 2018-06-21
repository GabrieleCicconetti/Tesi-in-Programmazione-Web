
<?php

require "../db_connection/connection.php";


$insert = $conn->prepare("INSERT INTO esami_utente (nome, codice_richiesta, cfu) VALUES (:nome, :codice_richiesta, :cfu)");

$insert->bindValue(':nome', $_POST['nome']);
$insert->bindValue(':codice_richiesta', $_POST['codice_richiesta']);
$insert->bindValue(':cfu', $_POST['cfu']);

$insert->execute();

header("HTTP/1.1 201 Created", false, 201);

echo $conn->lastInsertId();
$conn = null;
