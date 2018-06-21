<?php


require "../db_connection/connection.php";

$insert = $conn->prepare("INSERT INTO matching (id_esame_utente,
                                                          id_esame_facolta,
                                                          cfu) 
                                                          VALUES 
                                                          (:id_esame_utente,
                                                          :id_esame_facolta,
                                                          :cfu)");


$insert->bindValue(':id_esame_utente', $_POST['id_esame_utente']);
$insert->bindValue(':id_esame_facolta', $_POST['id_esame_facolta']);
$insert->bindValue(':cfu', $_POST['cfu']);

$insert->execute();

header("HTTP/1.1 201 Created", false, 201);
echo $conn->lastInsertId();

$conn = null;
