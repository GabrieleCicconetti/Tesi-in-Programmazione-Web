<?php

require "../db_connection/connection.php";


if(isset($_FILES["documento-0"])) {



    print_r($_FILES);

    $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["documento-0"]["name"]);
   // $uploadOk = 1;
   // $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
//print_r($_FILES);
//print_r($_POST);
// Check if image file is a actual image or fake image

    // Check if file already exists

    $f = 0;

    while (isset($_FILES['documento-' . $f])) {

        $i = 0;
        $exists = file_exists($target_dir . $i . "-" . basename($_FILES["documento-" . $f]["name"]));

        if ($exists)
            while (file_exists($target_dir . $i . "-" . basename($_FILES["documento-" . $f]["name"]))) {
                $i++;
            }

        $target_file = $target_dir . $i . "-" . basename($_FILES["documento-" . $f]["name"]);


        if (move_uploaded_file($_FILES["documento-" . $f]["tmp_name"], $target_file)) {


            $insert = $conn->prepare("INSERT INTO documenti (url, codice_richiesta) VALUES (:url, :codice_richiesta)");
            $insert->bindValue(":codice_richiesta", $_POST['codice_richiesta']);
            $insert->bindValue(":url", $i . "-" . basename($_FILES["documento-" . $f]["name"]));
            $insert->execute();

            $i = 0;
            //
            //
            //echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";


        }
        $f++;
    }

}

//echo print_r($_POST);

        $u = $conn->prepare("UPDATE utente SET stato=:stato WHERE codice_richiesta=:c");
        $u->bindValue(':c', $_POST['codice_richiesta']);
        $u->bindValue(':stato', $_POST['stato']);
        $u->execute();

        $conn = null;

header("HTTP/1.1 201 Created", false, 201);

