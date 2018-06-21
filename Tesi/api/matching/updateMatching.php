<?php

require "../db_connection/connection.php";

$update = $conn->prepare("UPDATE matching SET cfu=:cfu WHERE id=:id");
parse_str(file_get_contents("php://input"),$_POST);

$update->bindValue(':id', $_POST['id']);
$update->bindValue(':cfu', $_POST['cfu']);

$update->execute();


$conn = null;
