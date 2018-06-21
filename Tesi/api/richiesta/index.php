<?php


parse_str(file_get_contents("php://input"),$_POST);



$method = $_SERVER['REQUEST_METHOD'];


switch ($method) {

    case 'GET':

        require 'getRichiesta.php';

        break;

    case 'POST':

        require 'addRichiesta.php';

        break;

    case 'PUT' && isset($_POST['stato']):

        require 'updateStatoRichiesta.php';

        break;

    case 'PUT' && !isset($_POST['stato']):

        require 'updateRichiesta.php';

        break;

    case 'DELETE':

        break;

    default:

        header("HTTP/1.1 405 Method Not Allowed", false, 405);

}


