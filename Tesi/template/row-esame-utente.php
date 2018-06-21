
<div class="col-xs-12 row-esame-utente" draggable="true" id="<?=$_GET['id']?>-eu">

    <div class="row">

        <div class="col-xs-2 border-right text-center"><button class="modifica-esame-utente btn btn-info"><i class="far fa-edit"></i></button></div>
        <div class="col-xs-2 text-center border-right"><button class="elimina-esame-utente btn btn-danger"><i class="far fa-trash-alt"></i></button></div>
        <div class="col-xs-5 nome-esame-utente border-right"><h6 class="text-center"><?=$_GET['nome']?></h6></div>
        <div class="col-xs-2 cfu-esame-utente border-right"><h6 class="text-center">0 / <?=$_GET['cfu']?></h6></div>
        <div class="col-xs-1 center-vertical drag-action"><img draggable="false" src="img/arrow.png" alt=""></div>

    </div>


</div>

