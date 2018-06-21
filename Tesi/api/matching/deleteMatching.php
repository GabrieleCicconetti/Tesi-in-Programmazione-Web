
<?php

require "../db_connection/connection.php";

$insert = $conn->prepare("DELETE FROM matching WHERE id=:id");

$insert->bindValue(':id', $_POST['id']);

$insert->execute();

$conn = null;
