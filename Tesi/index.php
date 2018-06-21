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
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <link href="css/ie10-viewport-bug-workaround.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.10/css/all.css" integrity="sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg" crossorigin="anonymous">
    <link href="css/style.css" rel="stylesheet">


    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>

  <body>

  <div class="container main">

      <div class="row">
          <div style="font-size: 13px;" class="col-xs-4">
              <label for="cr">Hai già effettuato una richiesta? Inserisci il codice.</label>
              <div class="input-group">
                  <input type="text" class="form-control" id="cr">
                  <span class="input-group-btn">
                    <button class="btn btn-info load-richiesta" type="button">Vai</button>
                  </span>
              </div><!-- /input-group -->
          </div>
      </div>

      <div class="container-anagrafica row">

          <h1 class="text-center margin-bottom">Dati Anagrafici</h1>

          <div class="col-xs-4">
              <div class="form-group">
                  <label for="nome">Nome</label>
                  <input type="text" class="form-control" id="nome">
              </div>
          </div>
          <div class="col-xs-4">
              <div class="form-group">
                  <label for="cognome">Cognome</label>
                  <input type="text" class="form-control" id="cognome">
              </div>
          </div>
          <div class="col-xs-4">
              <div class="form-group">
                  <label for="codice_fiscale">Codice Fiscale</label>
                  <input type="text" class="form-control" id="codice_fiscale">
              </div>
          </div>
          <div class="col-xs-4">
              <div class="form-group">
                  <label for="email">E-Mail</label>
                  <input type="email" class="form-control" id="email">
              </div>
          </div>
          <div class="col-xs-4">
              <div class="form-group">
                  <label for="tel">Telefono</label>
                  <input type="text" class="form-control" id="tel">
              </div>
          </div>
          <div class="col-xs-4">
              <div class="form-group">
                  <label for="facolta">Facolta di provenienza</label>
                  <input type="text" class="form-control" id="facolta">
              </div>
          </div>
          <div class="col-xs-6 margin-bottom">
              <label for="ordinamento">Ordinamento</label>
              <select class="form-control" id="ordinamento">
                  <option value="">Scegli l'ordinamento</option>
                  <option value="1">2014/2015</option>
                  <option value="2">2015/2016</option>
                  <option value="3">2016/2017</option>
                  <option value="4">2017/2018</option>
              </select>
          </div>
          <div class="col-xs-6 ">
              <label for="anno">Anno</label>
              <select class="form-control" id="anno">
                  <option value="">Scegli l'anno</option>
                  <option value="1">1°</option>
                  <option value="2">2°</option>
                  <option value="3">3°</option>
              </select>
          </div>

          <div class="margin-bottom text-right col-xs-12">
            <button class="btn btn-info submit-anagrafica">Avanti <i class="fas fa-chevron-right"></i></button>
          </div>

          <div class="loader"><img src="img/loader.gif" alt=""></div>

      </div>

    <div class="matching-container">

        <h5 class="codice_richiesta text-center"></h5>

        <h4 class="text-center stato">Stato richiesta: Bozza <!--<i class="color-draft fas fa-circle"></i>--></h4>

        <?php

        if(isset($_GET['admin'])) {

            ?>

            <button style="display: block; margin: 0 auto;" class="prendi-in-carico btn btn-info">Prendi in carico</button>

        <?php

        }

            ?>


      <div class="margin-bottom margin-top">
       <!-- <div class="col-xs-8 col-xs-push-2">
          <div class="col-xs-6 text-center margin-bottom">
            <select class="form-control" id="ordinamento">
              <option value="">Scegli l'ordinamento</option>
              <option value="1">2014/2015</option>
              <option value="2">2015/2016</option>
              <option value="3">2016/2017</option>
              <option value="4">2017/2018</option>
            </select>
          </div>
          <div class="col-xs-6 text-center">
            <select class="form-control" disabled id="anno">
              <option value="">Scegli l'anno</option>
              <option value="1">1°</option>
              <option value="2">2°</option>
              <option value="3">3°</option>
            </select>
          </div>
        </div> -->
      </div>

      <div class="row">

        <!-- aggiunta esami da parte dell'utente -->

          <div class="col-xs-6 container-esami-utente">

            <div class="row">

              <h4 class="col-xs-9 text-center">Esami da riconoscere</h4>
              <div class="col-xs-3 text-right"><button class="btn btn-default" id="aggiungi-esame" data-toggle="modal" data-target="#modal-aggiungi-esame">+</button></div>

            </div>

            <div class="row margin-top">
                <div class="col-xs-12">
                  <div class="row flex-center-vertical text-center scroll-bar-padding">
                    <div class="col-xs-2 border-right text-center">Modifica</div>
                    <div class="col-xs-2">Elimina</div>
                    <div class="col-xs-5 text-center border-right border-left">NOME</div>
                    <div class="col-xs-2 text-center border-right">CFU</div>
                  </div>
                </div>
            </div>

            <div class="row inner margin-top">




            </div>

            <!-- loader -->

            <div class="loader"><img src="img/loader.gif" alt=""></div>

          </div>

        

        <!-- esami della facoltà a cui ci si vuole iscrivere -->

        <div class="col-xs-6 container-esami-facolta">

          <div class="row">

            <h4 class="col-xs-12 text-center">Esami della facoltà scelta</h4>

          </div>

          <div class="row margin-top">
            <div class="col-xs-12">
              <div class="row scroll-bar-padding">
                <div class="col-xs-10 text-center border-right">NOME</div>
                <div class="col-xs-2 text-center">CFU</div>
              </div>
            </div>
          </div>

          <div class="row inner margin-top">




          </div>


          <!-- loader -->

          <div class="loader"><img src="img/loader.gif" alt=""></div>

        </div>

      </div>

      <h3 class="text-center margin-top margin-bottom">Aggiungi documenti (.pdf, .png, .jpg, .doc) <button class="add-canvas btn btn-info"><i class="fas fa-plus"></i></button></h3>

        <div class="row add-document-container">
            <div class="inner-canvas col-xs-12">
                <div class="canvas-container" id="canvas-container-1">
                    <canvas id="canvas-1"></canvas>
                    <i class="fas fa-plus"></i>
                    <i class="fas fa-minus"></i>
                    <input accept="application/pdf, image/*, .doc, .docx, .txt, .rtf" type="file" id="doc-1">
                </div>
            </div>
            <div class="loader"><img src="img/loader.gif" alt=""></div>
        </div>


      <h1 class="text-center margin-top margin-bottom">Riepilogo</h1>

      <div class="row riepilogo">



      </div>


      <div style="position: relative;" class="send-container text-center margin-top margin-bottom">

        <button class="btn btn-info send">Invia Richiesta</button>


          <div class="loader"><img src="img/loader.gif" alt=""></div>

      </div>

    </div>

    </div>



    <!-- MODAL PER AGGIUNTA ESAME DA PARTE DELL'UTENTE -->

    <div id="modal-aggiungi-esame" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modulo di aggiunta esame</h5>
          </div>
          <div class="modal-body">
            <label for="nome-esame">Nome: <input type="text" id="nome-esame"></label>
            <label for="peso-esame">CFU: <input type="number" id="peso-esame"></label>
          </div>
          <div class="modal-footer">
            <span id="campi-mancanti-esame">Compila tutti i campi</span>
            <button type="button" class="btn btn-info" id="salva-esame">SALVA</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal" id="annulla-esame">ANNULLA</button>
          </div>
        </div>
      </div>
    </div>

  <!-- MODAL PER UPLOAD -->

  <div id="modal-upload" data-backdrop="static" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
          <div class="modal-content">
              <div class="modal-header">
                  <h4 class="modal-title">Caricamento...</h4>
              </div>
              <div class="modal-body">
                  <h5 class="text-center">Carico i file...</h5>
                  <h6 class="text-center">0%</h6>
              </div>
          </div>
      </div>
  </div>



    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="js/vendor/jquery.min.js"><\/script>')</script>
    <script src="js/bootstrap.min.js"></script>
    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <script src="js/ie10-viewport-bug-workaround.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/pdf.js/1.8.349/pdf.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.489/pdf.worker.min.js"></script>
  <?php

  if(isset($_GET['codice_richiesta'])){
      ?>
      <script>
          window.codice_richiesta = "<?=$_GET['codice_richiesta'];?>"
          window.isAdmin = "<?=isset($_GET['admin']);?>"
      </script>
      <?php
  }

  ?>
    <script src="js/script.js"></script>



  </body>
</html>
