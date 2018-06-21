<?php
if(!isset($_GET['codice_richiesta'])) {

    header("HTTP/1.1 400 Bad Request", false, 400);

    exit;

}

require '../db_connection/connection.php';

$codice_richiesta = $_GET['codice_richiesta'];

$r = array();

$richiesta_ = $conn->prepare("SELECT * FROM utente WHERE codice_richiesta=:cr");
$richiesta_->bindValue('cr', $codice_richiesta);
$richiesta_->execute();

$r['richiesta'] = $richiesta_->fetchAll(PDO::FETCH_ASSOC);


$stato = $conn->query("SELECT nome_stato FROM stati WHERE id_stato='".$r['richiesta'][0]['stato']."'");

$r['richiesta'][0]['stato'] = $stato->fetch()['nome_stato'];


$esami = $conn->prepare("SELECT * FROM esami_utente WHERE codice_richiesta=:cr");
$esami->bindValue('cr', $codice_richiesta);
$esami->execute();
$r['esami'] = $esami->fetchAll(PDO::FETCH_ASSOC);





$m = array();
foreach ($r['esami'] as $esame) {

    $id_esame = $esame['id']*1;


    $richiesta = $conn->prepare("SELECT * FROM matching WHERE id_esame_utente=:ide");
    $richiesta->bindValue(':ide', $id_esame);
    $richiesta->execute();


    array_push($m, $richiesta->fetchAll(PDO::FETCH_ASSOC));

}




$r['matching'] = $m;


$file = $conn->prepare("SELECT * FROM documenti WHERE codice_richiesta=:cr");
$file->bindValue('cr', $codice_richiesta);
$file->execute();
$r['files'] = $file->fetchAll(PDO::FETCH_ASSOC);

echo isset($_GET['pretty']) ?
    "<pre>".json_encode($r, JSON_PRETTY_PRINT).'</pre>'
    : json_encode($r,JSON_NUMERIC_CHECK);

$conn = null;
