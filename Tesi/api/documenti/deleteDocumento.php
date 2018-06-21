<?php

require "../db_connection/connection.php";

$delete = $conn->prepare("DELETE FROM documenti WHERE url=:name");

parse_str(file_get_contents("php://input"),$_POST);

$delete->bindValue(':name', $_POST['name']);
$delete->execute();
unlink("./uploads/".$_POST['name']);
