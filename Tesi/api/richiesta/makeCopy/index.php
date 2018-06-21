<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$codice_richiesta_to_copy = $_GET['codice_richiesta'];

$richiesta = json_decode(file_get_contents("http://gabrielecicconetti.altervista.org/Tesi/api/richiesta/getRichiesta.php?codice_richiesta={$codice_richiesta_to_copy}"));



require "../../db_connection/connection.php";

$ch = curl_init();

$post_fields = "nome={$richiesta->richiesta[0]->nome}&cognome={$richiesta->richiesta[0]->cognome}
                &facolta={$richiesta->richiesta[0]->facolta}&ordinamento={$richiesta->richiesta[0]->ordinamento}
                &anno={$richiesta->richiesta[0]->anno}&codice_fiscale={$richiesta->richiesta[0]->codice_fiscale}
                &tel={$richiesta->richiesta[0]->tel}&email={$richiesta->richiesta[0]->email}";



curl_setopt($ch, CURLOPT_URL,"http://gabrielecicconetti.altervista.org/Tesi/api/richiesta/index.php");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);


curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

$server_output = curl_exec($ch);


$codice_richiesta_copied = $server_output;

$update = $conn->prepare("UPDATE utente SET parent=:p, stato=3 WHERE codice_richiesta=:cr");
$update->bindValue(":p", $server_output);
$update->bindValue(":cr", $codice_richiesta_to_copy);
$update->execute();

$update = $conn->prepare("UPDATE utente SET stato=3 WHERE codice_richiesta=:cr2");
$update->bindValue(":cr2", $server_output);
$update->execute();



$nuovi_esami = array();




foreach ($richiesta->esami as $esame) {

    $insert = $conn->prepare("INSERT INTO esami_utente (nome, codice_richiesta, cfu) VALUES (:nome, :codice_richiesta, :cfu)");

    $insert->bindValue(':nome', $esame->nome);
    $insert->bindValue(':codice_richiesta', $codice_richiesta_copied);
    $insert->bindValue(':cfu', $esame->cfu);

    $insert->execute();


    array_push($nuovi_esami, $conn->lastInsertId());


}

if(count($nuovi_esami) == 0) {
    echo -1;
    exit;
}

$i = 0;

foreach ($richiesta->matching as $match) {

    foreach ($match as $single_match) {

        $insert = $conn->prepare("INSERT INTO matching (id_esame_utente,
                                                          id_esame_facolta,
                                                          cfu) 
                                                          VALUES 
                                                          (:id_esame_utente,
                                                          :id_esame_facolta,
                                                          :cfu)");


        $insert->bindValue(':id_esame_utente', $nuovi_esami[$i]);
        $insert->bindValue(':id_esame_facolta', $single_match->id_esame_facolta);
        $insert->bindValue(':cfu', $single_match->cfu);

        $insert->execute();


    }

    $i++;

}


foreach ($richiesta->files as $file) {
    $insert = $conn->prepare("INSERT INTO documenti (url, codice_richiesta) VALUES (:url, :codice_richiesta)");
    $insert->bindValue(":codice_richiesta", $codice_richiesta_copied);
    $insert->bindValue(":url", $file->url);
    $insert->execute();
}




curl_close ($ch);


echo $codice_richiesta_copied;

