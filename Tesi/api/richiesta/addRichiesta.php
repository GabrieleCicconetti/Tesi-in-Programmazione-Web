<?php


$codice_richiesta = '';
require "../db_connection/connection.php";
try {



    $codice_richiesta = str_replace("==", "", base64_encode(time()+1));
    //genero il codice della richiesta e controllo che non esista (difficile, ma la controllo comunque)

    $passcheck = $conn->prepare("SELECT * FROM utente WHERE codice_richiesta=:c");
    $passcheck->bindValue(':c', $codice_richiesta);
    $passcheck->execute();

    while($passcheck->fetch()) {
        $codice_richiesta = str_replace("==", "", base64_encode(time()+1));
        $passcheck->bindValue(':c', $codice_richiesta);
        $passcheck->execute();
    }


    $insert = $conn->prepare("INSERT INTO utente (nome,cognome,codice_richiesta,facolta,ordinamento,anno,codice_fiscale,email,tel,stato)
VALUES (:nome,:cognome,:codice_richiesta,:facolta,:ordinamento,:anno,:codice_fiscale, :email,:tel,:stato)");


    $insert->bindValue(':nome', $_POST['nome']);
    $insert->bindValue(':cognome', $_POST['cognome']);
    $insert->bindValue(':codice_richiesta', $codice_richiesta);
    $insert->bindValue(':facolta', $_POST['facolta']);
    $insert->bindValue(':ordinamento', $_POST['ordinamento']);
    $insert->bindValue(':anno', $_POST['anno']);
    $insert->bindValue(':codice_fiscale', $_POST['codice_fiscale']);
    $insert->bindValue(':tel', $_POST['tel']);
    $insert->bindValue(':email', $_POST['email']);
    $insert->bindValue(':stato', 1);

    $insert->execute();
}  catch (PDOException $e) {
    echo $e->getMessage();
}


echo $codice_richiesta;



$conn = null;


header("HTTP/1.1 201 Created", false, 201);
