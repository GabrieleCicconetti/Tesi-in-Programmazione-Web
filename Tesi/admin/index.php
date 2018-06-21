
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="Un'applicazione web per il riconoscimento di CFU">
    <meta name="author" content="Gabriele Cicconetti">
    <link rel="icon" href="img/favicon.ico">

    <title>Tesi Gabriele Cicconetti</title>

    <!-- Bootstrap core CSS -->
    <link href="../css/bootstrap.min.css" rel="stylesheet">

    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <link href="../css/ie10-viewport-bug-workaround.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.10/css/all.css" integrity="sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg" crossorigin="anonymous">
    <link href="css/style_admin.css" rel="stylesheet">


    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>

<body>


<?php

$conn = new PDO("mysql:host=localhost;dbname=my_gabrielecicconetti;charset=utf8", "gabrielecicconetti", "");

$r = $conn->prepare("SELECT * FROM utente WHERE stato <> 1");

$r->execute();



$richieste = $r->fetchAll(PDO::FETCH_ASSOC);



?>

<div class="container">

    <h1 class="text-center">Richieste</h1>
    <div class="table-responsive">
        <table class="table">


            <thead>
                <th>Nome</th>
                <th>Cognome</th>
                <th>Data</th>
                <th>Stato</th>
                <th>Codice Richiesta</th>
            </thead>
            <tbody>

            <?php

                foreach($richieste as $ri) {


                    ?>


                    <tr>
                        <td><?=$ri['nome']?></td>
                        <td><?=$ri['cognome']?></td>
                        <td><?=$ri['data_richiesta']?></td>
                        <?php
                        $stato = $conn->prepare("SELECT * FROM stati WHERE id_stato = ".$ri['stato']);

                        $stato->execute();

                        ?>
                        <td><?=$stato->fetch()['nome_stato']?></td>
                        <td><a href="/Tesi/?admin&codice_richiesta=<?=$ri['codice_richiesta']?>"><?=$ri['codice_richiesta']?></a></td>
                    </tr>


                    <?php


                }



            $conn = null;
            ?>



            </tbody>



        </table>
    </div>

</div>


<!-- Bootstrap core JavaScript
  ================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="js/vendor/jquery.min.js"><\/script>')</script>
<script src="../js/bootstrap.min.js"></script>
<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
<script src="../js/ie10-viewport-bug-workaround.js"></script>
<script src="https://cdnjs.com/libraries/pdf.js" type="javascript"></script>



</body>
</html>
