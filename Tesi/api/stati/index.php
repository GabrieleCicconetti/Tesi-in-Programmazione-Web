<?php

$conn = new PDO("mysql:host=localhost;dbname=my_gabrielecicconetti;charset=utf8", "gabrielecicconetti", "");

$stati = $conn->query("SELECT * FROM stati");


echo json_encode($stati->fetchAll(PDO::FETCH_ASSOC), JSON_NUMERIC_CHECK);
