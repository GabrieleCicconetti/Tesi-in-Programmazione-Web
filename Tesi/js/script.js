


    /* FAKE DATABASE */

    /* L'IDEA E' QUELLA DI CREARE UN DATABASE LATO CLIENT E RIDURRE AL MASSIMO LE CHIAMATE AL SERVER
     * CREDO SIA POSSIBILE FARLO IN QUANTO IL SUDDETTO DATABASE E' MOLTO SEMPLICE */

    /* GLI "ESAMI FACOLTA" SONO QUELLI CHE RIGUARDANO L'ANNO DI CORSO IN QUESTIONE, GLI "ESAMI UTENTE" SONO
     * QUELLI INSERITI DALL'UTENTE */

    /* USERO' L'id PER GLI ELEMENTI IN HTML PER PERMETTERE LA CORRISPONDENZA TRA ELEMENTO HTML ED ESAME NELL'ARRAY DEGLI ESAMI */

    /* COME ID NON USERO' GLI INDICI DEGLI ARRAY ALTRIMENTI AD OGNI RIMOZIONE DOVREI AGGIORNARE TUTTI GLI ID DEGLI ELEMENTI HTML
    *  ANCHE SE COSI DOVRO' SCORRERE SEMPRE TUTTO L'ARRAY DEGLI ESAMI PER ACCEDERE AD UNO SPECIFICO ESAME,
     *  MA IN QUESTO CASO NON MI SEMBRA UN GROSSO PROBLEMA,
    *  AVENDO A CHE FARE, COMUNQUE, CON ARRAY MOLTO PICCOLI (immagino massimo 5 - 10 posizioni)*/

    /* gli id in html sono 1-eu per gli esami utente, 1-ef per gli esami facolta e 1-m per il matching(dato all'elemento .esame)
    * ho inserito -ef -eu -m perchè ovviamente gli id sono univoci in html*/


    /* ESAMI FACOLTA D'ANNUNZIO */

    var esamiFacolta = []

    esamiFacolta.push({id: 1, nome: 'Programmazione WEB', cfu: 9, rimanenti: 9})
    esamiFacolta.push({id: 2, nome: 'Diritto privato', cfu: 9, rimanenti: 9})
    esamiFacolta.push({id: 3, nome: 'Basi di dati', cfu: 3, rimanenti: 3})
    esamiFacolta.push({id: 4, nome: 'Programmazione I', cfu: 6, rimanenti: 6})
    esamiFacolta.push({id: 5, nome: 'Laboratorio di prorgammazione', cfu: 3, rimanenti: 3})

    /***************/

    /* ESAMI UTENTE */

    var esamiUtente = []

    /***************/

    /* "TABELLA" DEL MATCHING */

    var match = []



/*********************/




$(window).load(function(){

    jQuery.event.props.push('dataTransfer');


    const salvaEsame            = $('#salva-esame')
    const annullaAggiuntaEsame  = $('#annulla-esame')
    const modalAggiuntaEsame    = $('#modal-aggiungi-esame')
    const containerEsamiUtente  = $('.container-esami-utente .inner')
    const containerEsamiFacolta = $('.container-esami-facolta .inner')
    const containerRiepilogo    = $('.riepilogo')
    const campiMancantiEsame    = $('#campi-mancanti-esame')
    const loaderEsamiUtente     = $('.container-esami-utente .loader')
    const nomeEsame             = '#nome-esame'
    const pesoEsame             = '#peso-esame'
    const esame                 = '<div class="esame"><span></span><i class="fas fa-times"></i></div>'
    var   isModifingEsameUtente = false
    var   idEsamePerModifica    = -1
    // uso queste variabili per salvare il nome dell'esame durante il drag, cosi posso darlo all'elemento "ghost"
    // e simulare le vere dimensione dell'esame che appenderò nell'evento "drop".
    // sembra che il dataTrasfer funzioni solo sul drop e non sul "dragOver"
    var   nomeEsameTemp         = ''
    var   idEsameUtenteTemp     = -1
    ////////////////////////////////
    var   enterTarget           = null;
    var   targetId              = ''
    var dragImg = document.createElement("img");
    dragImg.src = "./img/arrow.png";



    /* INSERISCO GLI ESAMI DELLA FACOLTA (cosa da fare successivamente in base all'ordinamento di riferimento)*/
    var efc = 0;
    esamiFacolta.forEach(function(e){

        getRowEsameFacolta(e.id, e.nome, e.cfu, function(data){

            containerEsamiFacolta.append(data)

            // REGISTRO GLI EVENTI (solo sull'ultimo inserito altrimenti ognuno avrebbe eventi multipli)
            const dropTarget = $('.drop-zone:last')
            dropZoneHeight   = dropTarget.height()
            dropTarget.on('dragenter', onDragEnter)
            dropTarget.on('dragover', function(e){e.preventDefault()})
            dropTarget.on('dragleave', onDragLeave)
            dropTarget.on('drop', onDrop)
            dropTarget.find('.ghost').on('mouseenter', function(){
                $(this).css('display', 'inline-block')
            })
            if(efc == esamiFacolta.length - 1) {
                $('.container-esami-facolta .loader').hide()
            }
            efc++
        })
    })

    /********************/




    // CLICK SUL TASTO ANNULLA DELLA MODAL DI AGGIUNTA ESAME

    annullaAggiuntaEsame.click(function(){
        $(nomeEsame).val('')
        $(pesoEsame).val('')
        modalAggiuntaEsame.modal('hide')
        isModifingEsameUtente = false
    })

    // CLICK PER MODIFICA ESAME UTENTE


    // SALVATAGGIO ESAME DALLA MODAL

    salvaEsame.click(function(){


        const nome = $(nomeEsame).val()
        const cfu  = parseInt($(pesoEsame).val())
        const self = $(this)

        //DISABILITO IL TASTO PER EVITARE CHE SI POSSA CLICCARE DI NUOVO
        self.attr('disabled', 'disabled')
        /**************/

        if(!checkCampi([nome, cfu])) {

            /* loader */ loaderEsamiUtente.css('display', 'block')  //

            //non sto modificando
            if(!isModifingEsameUtente) {

                const id = addEsameUtente({nome: nome, cfu: cfu})
                console.log(esamiUtente)

                getRowEsameUtente(id, nome, cfu, function (data) {

                    containerEsamiUtente.append(data)

                    const rowEsameUtente = $('.row-esame-utente:last')

                    const idEsameUtente = rowEsameUtente.attr('id')

                    rowEsameUtente.on("dragstart", onDragStart)

                    rowEsameUtente.find('.elimina-esame-utente').click({id: idEsameUtente}, removeEsameUtente)
                    rowEsameUtente.find('.modifica-esame-utente').click({id: idEsameUtente}, modificaEsameUtente)
                    /* loader */ loaderEsamiUtente.css('display', 'none')  //
                })
                // sto modificando
            } else {
                updateEsameUtente(idEsamePerModifica, nome, parseInt(cfu))
                $('#' + idEsamePerModifica + '-eu .nome-esame-utente h6').text(nome)
                $('#' + idEsamePerModifica + '-eu .cfu-esame-utente h6').text(cfu)
                /* loader */ loaderEsamiUtente.css('display', 'none')  //
            }

        } else {
            campiMancantiEsame.css('display', 'inline')
        }


        modalAggiuntaEsame.modal('hide')
        $(nomeEsame).val('')
        $(pesoEsame).val('')
        self.removeAttr('disabled')
    })

    /*********************************/







    //ACCESSORI

    $('#modal-aggiungi-esame input').focus(function(){campiMancantiEsame.css('display', 'none')})


    /********************/

    /* FUNZIONI DRAG & DROP */

    function onDragEnter(e){
        e.preventDefault()

        /* salvo il target "drop-zone" da riprendere in OnDragLeave */
        enterTarget = e.target

        // prendo l'id dell'esame della facoltà su cui mi trovo
        if(targetId == '') targetId = $(enterTarget).attr('id')

        /* VERIFICO LA POSSIBILITA' DI MATCHING. SE NON E' STATO GIA' AGGIUNTO E SE I CREDITI SONO TROPPI */

        /* se esiste già o non puo matchare */

        if(alreadyMatched(idEsameUtenteTemp, parseHTMLId(targetId)) || !canMatch(idEsameUtenteTemp, parseHTMLId(targetId))){
            $(enterTarget).css('border-color', 'red')
            return
        }
        else {
            const ghost = $(this).find('.ghost')
            // do il nome dell'esame anche al "ghost" per dargli altezza e larghezza realisitici (con color trasparente)
            ghost.text(nomeEsameTemp)
            ghost.css('display', 'inline-block')
        }


    }

    function onDragLeave(e){
        e.preventDefault()
        // qui controllo che quando lascio la drop-zone non si sul "ghost", altrimenti sparirebbe anche quando passo
        // sull'elemento stesso, succede la stessa cosa anche su "esame" e gli altri figli di drop-zone

        if (enterTarget == e.target) {
            $(this).find('.ghost').css('display', 'none')
            $(enterTarget).css('border-color', 'transparent')
            targetId = ''
        }
    }

    function onDrop(e){
        e.preventDefault();

        const idEsameUtente  = parseInt(e.dataTransfer.getData("id_esame_utente"))
        const idEsameFacolta = parseHTMLId($(this).attr('id'))

        //  QUI CONTROLLO SE POSSO FARE IL MATCHING BASANDOMI SUI CREDITI RICONOSCIUTI E NON

        const ghost = $(this).find('.ghost')
        ghost.css('display', 'none')

        console.log("already matched" +  alreadyMatched(idEsameUtente, idEsameFacolta))
        console.log("can match" + canMatch(idEsameUtente, idEsameFacolta))

        if(!alreadyMatched(idEsameUtente, idEsameFacolta) && canMatch(idEsameUtente, idEsameFacolta)) {



            const esame_ = $(esame)

            //inserisco il matching

            const matchId = addMatching({idEsameUtente: idEsameUtente, idEsameFacolta: idEsameFacolta})

            // aggiungo l'id del matching per identificarlo nell'html

            esame_.attr('id', matchId + '-m')

            // appendo l'esame nella drop-zone
            esame_.insertBefore(ghost)

            /* registro l'evento per la rimozione */

            esame_.find('i').click(removeMatching)


            // aggiunta esame

            const nome_esame_utente = e.dataTransfer.getData("nome_esame_utente")
            esame_.find('span').text(nome_esame_utente)




            console.log(match)

            /////


        }


        ghost.text('')
        nomeEsameTemp = ''
        $('.drop-zone').css('border-color', 'transparent')
        enterTarget = null
        targetId = ''

    }


    function onDragStart(e) {
        //e.preventDefault()
        e.dataTransfer.setDragImage(dragImg, 0, 0)
        const target = e.target

        nomeEsameTemp = $(target).find('.nome-esame-utente').text()
        idEsameUtenteTemp   = parseHTMLId($(target).attr('id'))

        e.dataTransfer.setData("nome_esame_utente", nomeEsameTemp)
        e.dataTransfer.setData("id_esame_utente", idEsameUtenteTemp)
    }

    /********************/





    // FUNZIONI

    function getRowEsameUtente(id, nome, cfu, completion){

        $.ajax({
            url: "./template/row-esame-utente.php?nome=" + nome + "&cfu=" + cfu + "&id=" + id,
            success: function (data) {
                completion(data)
            }
        })

    }
    function getRowEsameFacolta(id, nome, cfu, completion){

        $.ajax({
            url: "./template/row-esame-facolta.php?nome=" + nome + "&cfu=" + cfu + "&id=" + id,
            success: function (data) {
                completion(data)
            }
        })

    }
    function getRowRiepilogo(id, nomeEsameUtente, cfuEsameUtente, nomeEsameFacolta, cfuEsameFacolta, cfuRiepilogo,completion){

        $.ajax({
            url: "./template/row-riepilogo.php?id=" + id + "&nome_esame_utente=" + nomeEsameUtente + "&cfu_esame_utente=" + cfuEsameUtente + "&nome_esame_facolta=" + nomeEsameFacolta + "&cfu_esame_facolta=" + cfuEsameFacolta + "&riepilogo_cfu=" + cfuRiepilogo,
            success: function (data) {
                completion(data)
            }
        })

    }


    function checkCampi(campi) {

        var emptyFields = false
        var i = 0

        while(i < campi.length){
            emptyFields |= campi[i] == ""
            i++
        }

        return emptyFields

    }

    /* FUNZIONI ESAME UTENTE */


    function addEsameUtente(esame) {
        const l = esamiUtente.length
        const id = l > 0 ? (esamiUtente[l - 1].id + 1) : 1
        esamiUtente.push({
            id: id,
            nome: esame.nome,
            cfu: esame.cfu,
            rimanenti: esame.cfu
        })
        return id
    }

    function removeEsameUtenteFromMatching(id){
        var ids = []

        for(i = 0; i < match.length; i++){
            if(id == match[i].idEsameUtente){
                //rimuovo il matching dall'array e il relativo riepilogo (che hanno lo stesso id)
                adjustCFU(getEsame(match[i].idEsameUtente, 'utente'), getEsame(match[i].idEsameFacolta, ''))
                $('#' + match[i].id + '-m, #' + match[i].id + '-r').remove()
                ids.push(i)

            }
        }

        // rimuovo qui

        for(i=0;i<ids.length;i++){
            match.splice(ids[i], 1)
        }
    }

    function removeEsameUtente(e){
        if(confirm("Operazione irreversibile. Continuare?")) {
            $('#' + e.data.id).remove()

            const id = parseHTMLId(e.data.id)

            removeEsameUtenteFromMatching(id)

            for (i = 0; i < esamiUtente.length; i++) {
                if (id == esamiUtente[i].id) {
                    esamiUtente.splice(i, 1)
                    break
                }
            }
        }
        console.log(esamiUtente)
        console.log(esamiFacolta)
        console.log(match)
    }
    //mostro la modal con i dati
    function modificaEsameUtente(e){

        isModifingEsameUtente = true
        modalAggiuntaEsame.modal('show')

        idEsamePerModifica = parseHTMLId(e.data.id)


        const esame = getEsame(idEsamePerModifica, 'utente')

        $(nomeEsame).val(esame.nome)
        $(pesoEsame).val(esame.cfu)


        /*****/

    }
    //modifico l'array al click
    function updateEsameUtente(id, nome, cfu){

        for(k = 0; k < esamiUtente.length; k++) {
            if(id == esamiUtente[k].id) {
                esamiUtente[k].nome = nome

                /* QUI DEVO MODIFICARE ANCHE I NOMI NELLE DROP-ZONE E NEL RIEPILOGO (graficamente) */

                updateDropZoneFor(esamiUtente[k].id, nome)

                /* PER ORA CONTROLLO SE L'UTENTE HA MODIFICATO ANCHE I CFU, IN TAL CASO LO RIMUOVO
                * DAL MATCHING*/
                if(esamiUtente[k].cfu != cfu) {
                    removeEsameUtenteFromMatching(esamiUtente[k].id)
                }
                esamiUtente[k].cfu  = cfu
                break
            }
        }

        isModifingEsameUtente = false
        console.log(esamiUtente)

    }


    /*************/

    function updateDropZoneFor(idEsameUtente, nome){

        for(f = 0; f < match.length; f++) {
            if(idEsameUtente == match[f].idEsameUtente) {
                $('#' + match[f].id + '-m span').text(nome)
                $('#' + match[f].id + '-r .nome-esame-utente h6').text(nome)
            }
        }
    }


    /* FUNZIONI MATCHING */

    function addMatching(matchData) {
        const l = match.length
        const id = l > 0 ? (match[l - 1].id + 1) : 1
        match.push({
            id: id,
            idEsameUtente: matchData.idEsameUtente,
            idEsameFacolta: matchData.idEsameFacolta
        })

        const esameUtente  = getEsame(matchData.idEsameUtente, 'utente')
        const esameFacolta = getEsame(matchData.idEsameFacolta, '')
        var riepilogoCfu = 0

        // LO AGGIUNGO AL RIEPILOGO



        getRowRiepilogo(id, esameUtente.nome, esameUtente.cfu, esameFacolta.nome, esameFacolta.cfu, '', function(data){
            $(containerRiepilogo).append(data)
        })

        if(esameUtente.rimanenti >= esameFacolta.rimanenti){
            esameUtente.rimanenti  -= esameFacolta.rimanenti
            esameFacolta.rimanenti = 0
        } else {
            esameFacolta.rimanenti -= esameUtente.rimanenti
            esameUtente.rimanenti = 0
        }



        console.log(esamiUtente)
        console.log(esamiFacolta)

        return id
    }

    function alreadyMatched(idEsameUtente, idEsameFacolta) {

        for(i = 0; i < match.length; i++){
            if(match[i].idEsameUtente == idEsameUtente && match[i].idEsameFacolta == idEsameFacolta){
                return true
            }
        }
        return false
    }

    function canMatch(idEsameUtente, idEsameFacolta) {

        const esameUtente = getEsame(idEsameUtente, 'utente')
        const esameFacolta = getEsame(idEsameFacolta, '')

        // SE I RIMANENTI DELL'ESAME UTENTE DEVONO ESSERE MINORI DEI RIMANENTI DELL'ESAME FACOLTA

        //var checkRimanenti;

        /* se i cfu dell'esame utente sono maggiori */

        //checkRimanenti = esameUtente.rimanenti <= esameFacolta.rimanenti

        return esameUtente.rimanenti != 0 && esameFacolta.rimanenti != 0

    }



    function removeMatching(){

        $(this).parent().remove()

        const idMatching = parseHTMLId($(this).parent().attr('id'))

        //rimuovo la riga dal riepilogo (che ha lo stesso id del match)

        $('#' + idMatching + '-r').remove()

        /////

        for(i = 0; i < match.length; i++){
            if(match[i].id == idMatching){

                const esameUtente = getEsame(match[i].idEsameUtente, 'utente')
                const esameFacolta = getEsame(match[i].idEsameFacolta, '')

                // correggno i cfu rimanenti
                adjustCFU(esameUtente, esameFacolta)

                match.splice(i, 1)

                break
            }
        }
        console.log(esamiFacolta)
        console.log(esamiUtente)
    }


    function adjustCFU(esameUtente, esameFacolta) {
        if(esameUtente.cfu >= esameFacolta.cfu) {
            esameUtente.rimanenti += esameFacolta.cfu
            esameFacolta.rimanenti = esameFacolta.cfu
        } else {
            esameFacolta.rimanenti += esameUtente.cfu
            esameUtente.rimanenti = esameUtente.cfu
        }
    }



    /////////////////////////////


    function parseHTMLId(idEsame){
        /* prendo l'id dell'esame dall'id dell'elemento html {id-eu} o {id-ef} */
        return parseInt(idEsame.split('-')[0])
    }


    function getEsame(idEsame, type) {
        /* se il tipo è utente prendo i relativi esami altrimenti quelli della facolta */
        const arrayEsami = type == 'utente' ? esamiUtente : esamiFacolta

        const id = idEsame

        for(j = 0; j < arrayEsami.length; j++) {
            if(arrayEsami[j].id === id){
                return arrayEsami[j]
            }
        }
        return null
    }













    /* DOCUMENTI */


    function getFirstPDFPage() {
        document.querySelector("#pdf-upload").addEventListener("change", function(e){

            // MOSTRO LA PRIMA PAGINE DEL PDF SCELTO
            // https://mozilla.github.io/pdf.js/
            // https://codepen.io/Shiyou/pen/JNLwVO

            var canvasElement = document.querySelector("canvas")
            var file = e.target.files[0]
            if(file.type != "application/pdf"){
                console.error(file.name, "is not a pdf file.")
                return
            }

            var fileReader = new FileReader();

            fileReader.onload = function() {
                var typedarray = new Uint8Array(this.result);

                PDFJS.getDocument(typedarray).then(function(pdf) {
                    // you can now use *pdf* here
                    console.log("the pdf has ",pdf.numPages, "page(s).")
                    pdf.getPage(1).then(function(page) {
                        // you can now use *page* here
                        var viewport = page.getViewport(2.0);
                        var canvas = document.querySelector("canvas")
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;


                        page.render({
                            canvasContext: canvas.getContext('2d'),
                            viewport: viewport
                        });
                    });

                });
            };

            fileReader.readAsArrayBuffer(file);
        })
    }



})
