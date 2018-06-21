<?php

if(!isset($_GET['ordinamento'])) {

    header("HTTP/1.1 400 Bad Request", false, 400);

    exit;
}

require "../db_connection/connection.php";

$ordinamento = $_GET['ordinamento'];

/* aggiorno l'ordinamento nella richiesta */


$anno = $_GET['anno'];

$e = $conn->prepare("SELECT anno_esame.id, esami_facolta.nome, esami_facolta.cfu FROM esami_facolta INNER JOIN anno_esame ON esami_facolta.id=anno_esame.id_esame WHERE anno_esame.id_anno=$ordinamento AND esami_facolta.parent=0");
$e->execute();


echo isset($_GET['pretty']) ?
"<pre>".json_encode($e->fetchAll(PDO::FETCH_ASSOC), JSON_PRETTY_PRINT).'</pre>'
: json_encode($e->fetchAll(PDO::FETCH_ASSOC),JSON_NUMERIC_CHECK);

$conn = null;
