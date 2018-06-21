<?php



parse_str(file_get_contents("php://input"),$_POST);


$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'POST':

        require 'addMatching.php';

        break;

    case 'PUT':

        require 'updateMatching.php';

        break;

    case 'DELETE':

        require 'deleteMatching.php';

        break;

    default:

        header("HTTP/1.1 405 Method Not Allowed", false, 405);

}


