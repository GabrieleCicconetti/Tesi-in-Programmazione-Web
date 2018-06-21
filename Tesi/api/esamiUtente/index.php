<?php


parse_str(file_get_contents("php://input"),$_POST);



$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'POST':

        require 'addEsame.php';

        break;

    case 'DELETE':

        require 'deleteEsame.php';

        break;

    default:

        header("HTTP/1.1 405 Method Not Allowed", false, 405);

}


