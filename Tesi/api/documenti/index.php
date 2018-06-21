<?php




$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'POST':

        require 'uploadDocumento.php';

        break;

    case 'DELETE':
        
        parse_str(file_get_contents("php://input"),$_POST);

        require 'deleteDocumento.php';

        break;

    default:

        header("HTTP/1.1 405 Method Not Allowed", false, 405);

}


