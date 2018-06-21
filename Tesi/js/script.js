


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



    /* stati */


    /*
    * [{"id_stato":1,"nome_stato":"Bozza"},
    * {"id_stato":2,"nome_stato":"Inviata"},
    * {"id_stato":3,"nome_stato":"Presa in carico"},
    * {"id_stato":4,"nome_stato":"Accettata"},
    * {"id_stato":5,"nome_stato":"Rifiutata"},
    * {"id_stato":6,"nome_stato":"Proposta di modifica"}]
    * */

    /* ESAMI FACOLTA D'ANNUNZIO */

    var esamiFacolta = []

    /***************/

    /* ESAMI UTENTE */

    var esamiUtente = []

    /***************/

    /* "TABELLA" DEL MATCHING */

    var match = []

    /* IL BASE URL PER LE RICHIESTE SE DOVESSE SERVIRE (con " / " finale) */

    var base = ""


    /* NOTA
    *
    * */


    /* API */

    /*

    api/...

    esami/?ordinamento=(id_ordinamento) Tutti gli esami dell'ordinamento
    esami/addMatching.php
    esami/removeMatching.php

    esamiUtente/addEsame.php?nome & cfu & codice_richiesta aggiunta esame utente
    esamiUtente/deleteEsame.php?id



     */



/*********************/

    /* se c'è sto entrando nella mia richiesta */
    if(window.codice_richiesta == undefined) {
        var codice_richiesta = ''
    }



$(window).load(function(){


    jQuery.event.props.push('dataTransfer');
    const loaderEsamiFacolta = $('.container-esami-facolta .loader')
    loaderEsamiFacolta.hide()

    $('.send-container .loader').hide()



    const salvaEsame            = $('#salva-esame')
    var documenti               = []
    var docForDelete            = []
    const annullaAggiuntaEsame  = $('#annulla-esame')
    const loaderAnagrafica      = $('.container-anagrafica .loader')
    loaderAnagrafica.hide()
    const submitAnagrafica      = $('.submit-anagrafica')
    const modalAggiuntaEsame    = $('#modal-aggiungi-esame')
    const containerEsamiUtente  = $('.container-esami-utente .inner')
    const containerEsamiFacolta = $('.container-esami-facolta .inner')
    const containerRiepilogo    = $('.riepilogo')
    const campiMancantiEsame    = $('#campi-mancanti-esame')
    const loaderEsamiUtente     = $('.container-esami-utente .loader')
    const selectOrdinamento     = $('#ordinamento')
    const selectAnno            = $('#anno')
    const nomeEsame             = '#nome-esame'
    const pesoEsame             = '#peso-esame'
    const esame                 = '<div class="esame">' +
        '<i class="fas fa-minus"></i>' +
        '<span class="qty"></span>' +
        '<i class="fas fa-plus"></i>' +
        '<span class="nome"></span>' +
        '<i class="fas fa-times"></i>' +
        '</div>'
    var   isModifingEsameUtente = false
    var   idEsamePerModifica    = -1
    var ordinamento             = 0
    var anno                    = 0
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


    submitAnagrafica.click(function(){

        //valori
        loaderAnagrafica.show()

        console.log(codice_richiesta)


        var nome = $('input#nome').val()
        var cognome = $('input#cognome').val()
        var tel = $('input#tel').val()
        var email = $('input#email').val()
        var cf = $('input#codice_fiscale').val()
        var facolta = $('input#facolta').val()
        var anno = $('select#anno').val()
        var ordinamento = $('select#ordinamento').val()

        var campi = checkCampi([nome,cognome,tel,email,facolta,cf,anno,ordinamento])

            if(cf.length != 16 && !campi) {
                loaderAnagrafica.hide()
                alert('Codice fiscale non valido')
                return
            }
            else if (campi)
            {
                loaderAnagrafica.hide()
                alert('Campi obbligatori')
                return
            }

        /* add richiesta */
        $.post(
             base + "api/richiesta/index.php",
        {
            nome: nome,
            cognome: cognome ,
            tel: tel ,
            email: email ,
            facolta: facolta ,
            codice_fiscale: cf ,
            anno: anno ,
            ordinamento: ordinamento
        },function (e) {


                loaderAnagrafica.show()
                console.log(e)


                ////
                submitAnagrafica.remove()

                $('.codice_richiesta').html('Questo è il tuo codice richiesta: <u>'+e+'</u> <br> Ti servirà per accedere a questa richiesta in futuro.')
                
                codice_richiesta = e

                $('.matching-container').css('display', 'block')
                loaderAnagrafica.hide()

                $('html, body').animate({
                    scrollTop: $('.matching-container').offset().top - 30
                }, 700, function() {
                    $('.matching-container').animate({
                        opacity: 1
                    }, 400, function() {
                        ////
                        submitAnagrafica.text('Aggiorna')
                        submitAnagrafica.off('click')
                        submitAnagrafica.click(updateAnagrafica)
                        $('.add-document-container .loader').remove()
                    })

                })
            }
        )
    })

    function updateAnagrafica(){
        //valori
        loaderAnagrafica.show()

        console.log(codice_richiesta)


        var nome = $('input#nome').val()
        var cognome = $('input#cognome').val()
        var tel = $('input#tel').val()
        var email = $('input#email').val()
        var cf = $('input#codice_fiscale').val()
        var facolta = $('input#facolta').val()
        var anno = $('select#anno').val()
        var ordinamento = $('select#ordinamento').val()

        var campi = checkCampi([nome,cognome,tel,email,facolta,cf,anno,ordinamento])

        if(cf.length != 16 && !campi) {
            loaderAnagrafica.hide()
            alert('Codice fiscale non valido')
            return
        }
        else if (campi)
        {
            loaderAnagrafica.hide()
            alert('Campi obbligatori')
            return
        }

        /* update richiesta */
        $.ajax({
            url: base + "api/richiesta/index.php",
            method: "PUT",

        data: {
                nome: nome,
                cognome: cognome ,
                tel: tel ,
                email: email ,
                facolta: facolta ,
                codice_fiscale: cf ,
                anno: anno ,
                ordinamento: ordinamento,
                codice_richiesta: codice_richiesta
            },
            success: function (e) {
                loaderAnagrafica.hide()
            }
        })
    }





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

                $.post(
                    base + "api/esamiUtente/index.php",
                {
                    codice_richiesta: codice_richiesta,
                    nome: nome,
                    cfu: cfu
                },
                    function (e) {

                        var id = parseInt(e)

                        addEsameUtente({id: id, nome: nome, cfu: cfu})
                        console.log(e)
                        console.log(esamiUtente)

                        getRowEsameUtente(id, nome, cfu, function (data) {

                            containerEsamiUtente.append(data)

                            const rowEsameUtente = $('.row-esame-utente:last')

                            const idEsameUtente = rowEsameUtente.attr('id')

                            rowEsameUtente.on("dragstart", onDragStart)

                            rowEsameUtente.find('.elimina-esame-utente').click({id: idEsameUtente}, removeEsameUtente)
                            rowEsameUtente.find('.modifica-esame-utente').click({id: idEsameUtente}, modificaEsameUtente)
                            /* loader */
                            loaderEsamiUtente.css('display', 'none')  //
                        })
                    }
                )
                // sto modificando
            } else {
                updateEsameUtente(idEsamePerModifica, nome, parseInt(cfu))
                $('#' + idEsamePerModifica + '-eu .nome-esame-utente h6').text(nome)
                $('#' + idEsamePerModifica + '-eu .cfu-esame-utente h6').text('0 / '+cfu)
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


    /* SELECT ORDINAMENTO E ANNO DI CORSO */

    selectOrdinamento.change(function(){
        console.log('change')
        if($(this).val() != '') {
            selectAnno.removeAttr('disabled')
            ordinamento = $(this).val()
        } else {
            selectAnno.attr('disabled', 'disabled')
            selectAnno.val('')
        }
    })

    selectOrdinamento.change(function () {
        var anno = $(this).val()
        if(anno == '') return
       /* if(codice_richiesta == '') {
            alert('C\'è stato un\'errore durante la creazione della richiesta. Riprova.')
            selectOrdinamento.val('')
            return false
        }*/

        if(match.length != 0) {
            if(!confirm('Questa operazione annullerà tutti progressi. Continuare?')){
                return
            } else {
                loaderEsamiFacolta.show()
                loaderEsamiUtente.show()
                for(var k = 0;k<match.length;k++) {

                    $('#'+match[k].id+'-m, #'+match[k].id+'-r').remove()
                    var esameUtente = getEsame(match[k].idEsameUtente, 'utente')
                    var esameFacolta = getEsame(match[k].idEsameFacolta, '')

                    esameUtente.riconosciuti = 0
                    esameUtente.rimanenti = esameUtente.cfu

                    $('#'+match[k].idEsameUtente+'-eu .cfu-esame-utente h6').text("0 / "+esameUtente.cfu)


                }
                match = []
                esameFacolta = []
                loaderEsamiFacolta.hide()
                loaderEsamiUtente.hide()
            }
        }

        loaderEsamiFacolta.show()
        containerEsamiFacolta.html('')
        /* INSERISCO GLI ESAMI DELLA FACOLTA (cosa da fare successivamente in base all'ordinamento di riferimento)*/
            $.ajax({
                url: base+"api/esamiFacolta/?ordinamento="+ordinamento+"&codice_richiesta="+codice_richiesta,
                method: 'GET',
                success: function(e) {
                    //console.log(e)
                    esamiFacolta = JSON.parse(e)
                    var efc = 0;
                    esamiFacolta.forEach(function (e) {

                        e['rimanenti'] = parseInt(e.cfu)

                        getRowEsameFacolta(e.id, e.nome, e.cfu, function (data) {

                            containerEsamiFacolta.append(data)

                            // REGISTRO GLI EVENTI (solo sull'ultimo inserito altrimenti ognuno avrebbe eventi multipli)
                            const dropTarget = $('.drop-zone:last')
                            dropZoneHeight = dropTarget.height()
                            dropTarget.on('dragenter', onDragEnter)
                            dropTarget.on('dragover', function (e) {
                                e.preventDefault()
                            })
                            dropTarget.on('dragleave', onDragLeave)
                            dropTarget.on('drop', onDrop)
                            dropTarget.find('.ghost').on('mouseenter', function () {
                                $(this).css('display', 'inline-block')
                            })
                            if (efc == esamiFacolta.length - 1) {
                                loaderEsamiFacolta.hide()
                            }
                            efc++
                        })
                    })
                    console.log(esamiFacolta)
                }
            })
        })

        /********************/

    /*+++++++++++++++*/






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
        // qui controllo che quando lascio la drop-zone non sia sul "ghost", altrimenti sparirebbe anche quando passo
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

        console.log("already matched " +  alreadyMatched(idEsameUtente, idEsameFacolta))
        console.log("can match " + canMatch(idEsameUtente, idEsameFacolta))

        if(!alreadyMatched(idEsameUtente, idEsameFacolta) && canMatch(idEsameUtente, idEsameFacolta)) {



            loaderEsamiFacolta.show()
            const esame_ = $(esame)



            const esameUtente  = getEsame(idEsameUtente, 'utente')
            const esameFacolta = getEsame(idEsameFacolta, '')


            /*if(esameUtente.rimanenti >= esameFacolta.rimanenti){
                esameUtente.rimanenti  -= esameFacolta.rimanenti
                esameFacolta.rimanenti = 0
            } else {
                esameFacolta.rimanenti -= esameUtente.rimanenti
                esameUtente.rimanenti = 0
            }*/

            // ORA CHE L'UTENTE SCEGLIE QUANTI CREDITI RICONOSCERE, ALL'INIZIO SARA' SEMPRE 1

            esameUtente.rimanenti  -= 1
            esameFacolta.rimanenti -= 1
            esameUtente.riconosciuti = 1



            var nome_esame_utente = e.dataTransfer.getData("nome_esame_utente")

            esame_.find('.nome').text(nome_esame_utente)


            //inserisco il matching
            $.post(
                base + "api/matching/index.php",
            {
                id_esame_utente: idEsameUtente,
                id_esame_facolta: idEsameFacolta,
                cfu: 1
            },
                function (r) {

                    console.log(r)

                    const matchId = parseInt(r)

                    addMatching({id: matchId, esameUtente: esameUtente, esameFacolta: esameFacolta})

                    // aggiungo l'id del matching per identificarlo nell'html

                    esame_.attr('id', matchId + '-m')

                    // appendo l'esame nella drop-zone
                    esame_.insertBefore(ghost)

                    /* registro l'evento per la rimozione */

                    esame_.find('i.fa-times').click(removeMatching)

                    esame_.find('i.fa-plus').click(aggiungiCrediti)

                    esame_.find('i.fa-minus').click(rimuoviCrediti)

                    esame_.find('.qty').text("1")



                    // aggiunta esame


                    console.log(match)

                    loaderEsamiFacolta.hide()

                }
            )
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

        nomeEsameTemp = $(target).find('.nome-esame-utente h6').text()
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
        //var id = l > 0 ? (esamiUtente[l - 1].id + 1) : 1


        var id = esame.id

        esamiUtente.push({
            id: id,
            nome: esame.nome,
            cfu: parseInt(esame.cfu),
            rimanenti: parseInt(esame.cfu),
            riconosciuti: esame.riconosciuti != undefined ? esame.riconosciuti : 1
        })
        return id
    }

    function removeEsameUtenteFromMatching(id){
        var ids = []

        for(i = 0; i < match.length; i++){
            if(id == match[i].idEsameUtente){
                //rimuovo il matching dall'array e il relativo riepilogo (che hanno lo stesso id)
                //adjustCFU(getEsame(match[i].idEsameUtente, 'utente'), getEsame(match[i].idEsameFacolta, ''))
                var esameUtente = getEsame(match[i].idEsameUtente, 'utente')
                var esameFacolta = getEsame(match[i].idEsameFacolta, '')

                // correggno i cfu rimanenti
                //adjustCFU(esameUtente, esameFacolta)

                // riconosciuti per questo matching

                var riconosciuti = parseInt($('#' + match[i].id + '-m .qty').text())

                //

                esameUtente.rimanenti += riconosciuti
                esameUtente.riconosciuti -= riconosciuti

                esameFacolta.rimanenti += riconosciuti

                $('#' + esameUtente.id + '-eu .cfu-esame-utente h6').text((esameUtente.cfu - esameUtente.rimanenti) + '/' + esameUtente.cfu)
                $('#' + esameFacolta.id + '-ref .cfu-esame-facolta').text(esameFacolta.rimanenti + '/' + esameFacolta.cfu)

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
            loaderEsamiUtente.show()
            $.ajax({
               url: base + "api/esamiUtente/index.php",
               method: "DELETE",
            data: {
                id: e.data.id
            },
               success: function () {

                    $('#' + e.data.id).remove()

                    const id = parseHTMLId(e.data.id)

                    removeEsameUtenteFromMatching(id)

                    for (i = 0; i < esamiUtente.length; i++) {
                        if (id == esamiUtente[i].id) {
                            esamiUtente.splice(i, 1)
                            loaderEsamiUtente.hide()
                            break
                        }
                    }
                }
            })
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
                $('#' + match[f].id + '-m .nome').text(nome)
                $('#' + match[f].id + '-r .nome-esame-utente h6').text(nome)
            }
        }
    }


    /* FUNZIONI MATCHING */



    function aggiungiCrediti(){


        var target = $(this).parent()

        var idMatching = parseHTMLId(target.attr('id'))

        var matchingData = getDataFromMatching(idMatching)

        if(matchingData.esameUtente.rimanenti != 0 &&
            (matchingData.esameUtente.riconosciuti < matchingData.esameFacolta.cfu ) && matchingData.esameFacolta.rimanenti != 0) {

            loaderEsamiFacolta.show()
            var newCfu = parseInt(target.find('.qty').text()) + 1

            $.ajax({
                url: base + "api/matching/index.php",
                method: "PUT",
                data: {
                    id: idMatching,
                    cfu: newCfu
                },
                success: function (r) {

                    console.log(r)

                    matchingData.esameUtente.riconosciuti += 1
                    matchingData.esameUtente.rimanenti -= 1

                    matchingData.esameFacolta.rimanenti -= 1

                    $('#' + matchingData.esameUtente.id + '-eu .cfu-esame-utente h6').text((matchingData.esameUtente.cfu - matchingData.esameUtente.rimanenti) + '/' + matchingData.esameUtente.cfu)
                    $('#' + matchingData.esameFacolta.id + '-ref .cfu-esame-facolta').text(matchingData.esameFacolta.rimanenti + '/' + matchingData.esameFacolta.cfu)


                    target.find('.qty').text(newCfu)

                    loaderEsamiFacolta.hide()

                }
            })
        }

        console.log(esamiUtente, esamiFacolta)




    }


    function rimuoviCrediti(){

        var target = $(this).parent()

        var idMatching = parseHTMLId(target.attr('id'))

        var matchingData = getDataFromMatching(idMatching)

        if(matchingData.esameUtente.rimanenti != matchingData.esameUtente.cfu - 1) {

            loaderEsamiFacolta.show()
            var newCfu = parseInt(target.find('.qty').text()) - 1

            $.ajax({
                url: base + "api/matching/index.php",
                method: "PUT",
                data: {
                    id: idMatching,
                    cfu: newCfu
                },
                success: function (r) {

                    matchingData.esameUtente.riconosciuti -= 1
                    matchingData.esameUtente.rimanenti += 1

                    matchingData.esameFacolta.rimanenti += 1

                    $('#' + matchingData.esameUtente.id + '-eu .cfu-esame-utente h6').text((matchingData.esameUtente.cfu - matchingData.esameUtente.rimanenti) + '/' + matchingData.esameUtente.cfu)
                    $('#' + matchingData.esameFacolta.id + '-ref .cfu-esame-facolta').text(matchingData.esameFacolta.rimanenti + '/' + matchingData.esameFacolta.cfu)


                    target.find('.qty').text(newCfu)

                    loaderEsamiFacolta.hide()

                }
            })
        }

        console.log(esamiUtente, esamiFacolta)

    }


    function getDataFromMatching(idMatching) {

        var matchData = {}

        for(var m = 0;m < match.length; m++) {

            if(match[m].id == idMatching) {
                matchData = {
                    match: match[m],
                    esameUtente: getEsame(match[m].idEsameUtente, 'utente'),
                    esameFacolta: getEsame(match[m].idEsameFacolta, '')
                }
            }

        }
        console.log(matchData)
        return matchData

    }





    function addMatching(matchData) {
        const l = match.length
        //const id = l > 0 ? (match[l - 1].id + 1) : 1

        id = matchData.id

        match.push({
            id: id,
            idEsameUtente: matchData.esameUtente.id,
            idEsameFacolta: matchData.esameFacolta.id
        })

        var riepilogoCfu = 0

        // LO AGGIUNGO AL RIEPILOGO



        getRowRiepilogo(id, matchData.esameUtente.nome, matchData.esameUtente.cfu, matchData.esameFacolta.nome, matchData.esameFacolta.cfu, '', function(data){
            $(containerRiepilogo).append(data)

            $('#'+matchData.esameUtente.id+'-eu .cfu-esame-utente h6').text((matchData.esameUtente.cfu - matchData.esameUtente.rimanenti) + '/' + matchData.esameUtente.cfu)
            $('#'+matchData.esameFacolta.id+'-ref .cfu-esame-facolta').text(matchData.esameFacolta.rimanenti + '/' + matchData.esameFacolta.cfu)

        })

        console.log(matchData.esameUtente)
        console.log(matchData.esameFacolta)

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



        const parent = $(this).parent()
        const idMatching = parseHTMLId(parent.attr('id'))

        loaderEsamiFacolta.show()

        $.ajax({
            url: base + "api/matching/index.php",
            method: "DELETE",
            data: {
                id: idMatching
            },
            success: function () {



                //rimuovo la riga dal riepilogo (che ha lo stesso id del match)


                /////

                for (i = 0; i < match.length; i++) {
                    if (match[i].id == idMatching) {

                        var esameUtente = getEsame(match[i].idEsameUtente, 'utente')
                        var esameFacolta = getEsame(match[i].idEsameFacolta, '')

                        // correggno i cfu rimanenti
                        //adjustCFU(esameUtente, esameFacolta)

                        // riconosciuti per questo matching

                        var riconosciuti = parseInt($('#' + idMatching + '-m .qty').text())

                        //

                        console.log(riconosciuti)

                        esameUtente.rimanenti += riconosciuti
                        esameUtente.riconosciuti -= riconosciuti

                        esameFacolta.rimanenti += riconosciuti

                        $('#' + esameUtente.id + '-eu .cfu-esame-utente h6').text((esameUtente.riconosciuti) + '/' + esameUtente.cfu)
                        $('#' + esameFacolta.id + '-ref .cfu-esame-facolta').text(esameFacolta.rimanenti + '/' + esameFacolta.cfu)


                        match.splice(i, 1)

                        loaderEsamiFacolta.hide()

                        break
                    }
                }

                $('#' + idMatching + '-r, #' + idMatching + '-m').remove()
                console.log(esamiFacolta)
                console.log(esamiUtente)
            }
        })
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
            if(arrayEsami[j].id == id){
                return arrayEsami[j]
            }
        }
        return null
    }














    /* DOCUMENTI */


    $('.add-canvas').click(function(){


        if(documenti.length + docForDelete.length != $('.canvas-container').length) {

            return
        }

        var index = $('.canvas-container').length + 1

        $('.inner-canvas').append(
            "<div class=\"canvas-container\" id=\"canvas-container-"+index+"\">"+
            "<canvas id=\"canvas-"+index+"\"></canvas>"+
            "<i class=\"fas fa-plus\"></i>"+
            "<i class=\"fas fa-minus\"></i>"+
            "<input accept=\"application/pdf, image/*, .doc, .docx, .txt, .rtf\" type=\"file\" id=\"doc-"+index+"\">"+
            "</div>"
            )
        $('#canvas-container-'+index+' i.fa-plus').click(function(){
            $('#doc-'+index).trigger('click')
        })
        $('#canvas-container-'+index+' i.fa-minus').click(function(){
            $("#canvas-container-"+index).remove()
            documenti.splice(index-1, 1)
            console.log(documenti)
        })
        getDocumentPreview('#doc-'+index, '#canvas-'+index)

    })





    getDocumentPreview('#doc-1', '#canvas-1')

    $('#canvas-container-1 i.fa-plus').click(function(){
        $('#doc-1').trigger('click')
        console.log('click')
    })
    $('#canvas-container-1 i.fa-minus').click(function(){
        //$("#canvas-container-1").remove()
        documenti.splice(0, 1)
        var c2 = document.querySelector("#canvas-container-1 canvas")
        var ctx = c2.getContext("2d");
        ctx.clearRect(0, 0, c2.width, c2.height);
        $(this).hide()
        $('#canvas-container-1 i.fa-plus').show()
        $('#canvas-container-1 canvas').removeAttr('style')
        console.log(documenti)
    })

    function getDocumentPreview(id, canvas) {


        document.querySelector(id).addEventListener("change", function(e){

            // MOSTRO LA PRIMA PAGINE DEL PDF SCELTO
            // https://mozilla.github.io/pdf.js/
            // https://codepen.io/Shiyou/pen/JNLwVO

            $('.add-document-container .loader').show()



            if(e.target.files[0].type == "application/pdf"){
                putFirstPDFPage(canvas, e.target.files[0], -1)
            }
            if(e.target.files[0].type.includes("image")) {
                putImagePreview(canvas, e.target.files[0], -1)
            }

        })
    }

    function putImagePreview(canvas, file, fileid){
        var canvasElement = document.querySelector(canvas)
        // var file = e.target.files[0]
        if(fileid==-1)documenti.push({id: fileid, file: file})
        var fileReader = new FileReader();

        fileReader.onload = function(e) {

            canvasElement.style.backgroundImage = 'url('+e.target.result+')'

            $(canvas).parent().find('.fa-plus').hide()
            $(canvas).parent().find('.fa-minus').show()

                $('.add-document-container .loader').hide()

        };

        fileReader.readAsDataURL(file);
    }

    function putFirstPDFPage(canvas, file, fileid) {

        var canvasElement = document.querySelector(canvas)
       // var file = e.target.files[0]
        if(fileid==-1)documenti.push({id: fileid, file: file})


        var fileReader = new FileReader();

        fileReader.onload = function() {
            var typedarray = new Uint8Array(this.result);

            PDFJS.getDocument(typedarray).then(function(pdf) {
                // you can now use *pdf* here
                console.log("the pdf has ",pdf.numPages, "page(s).")
                pdf.getPage(1).then(function(page) {
                    // you can now use *page* here
                    var viewport = page.getViewport(2.0);
                    /*var canvas = document.querySelector(canvas)
                     console.log(canvas)*/
                    canvasElement.height = viewport.height;
                    canvasElement.width = viewport.width;

                    $(canvas).parent().find('.fa-plus').hide()
                    $(canvas).parent().find('.fa-minus').show()




                    page.render({
                        canvasContext: canvasElement.getContext('2d'),
                        viewport: viewport
                    });

                    $('.add-document-container .loader').hide()

                });

            });
        };

        fileReader.readAsArrayBuffer(file);
    }




        /*****************************/


        $('.load-richiesta').click(function(){
            if($('#cr').val() != '')location.href = '/Tesi/?codice_richiesta='+$('#cr').val()
        })


        $('.send').click(inviaRichiesta)



    function inviaRichiesta(){

        //$('.send-container .loader').show()

        //$('.send').hide()

        var percent = $('#modal-upload h6')

        if(documenti.length == 0) {
            $('#modal-upload h5').text($(this).hasClass("send") ? "Invio la richiesta" : "Aggiorno la richiesta")
            percent.remove()
        }

        $('#modal-upload').modal('show')

        updateAnagrafica()

        var formData = new FormData()

        for(var i = 0;i < documenti.length;i++)
            formData.append('documento-'+i, documenti[i].file)

        formData.append('codice_richiesta', codice_richiesta)
        formData.append('stato', 2)
        console.log(documenti)




        $.ajax({
            xhr: function() {
                var xhr = new window.XMLHttpRequest();

                xhr.upload.addEventListener("progress", function(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        console.log(percentComplete)
                        percent.text(Math.ceil(percentComplete*100)+' %')
                    }
                }, false);

                return xhr;
            },
            url: base + "api/documenti/index.php",
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(e) {
                console.log(e)
                location.href = '/Tesi/?codice_richiesta=' + codice_richiesta
            }
        })



    }

    function annullaRichiesta(){

       // $('.send-container .loader').show()

        //$('.send').css('opacity', 0)

        var percent = $('#modal-upload h6')

            $('#modal-upload h5').text("Annullo la richiesta")
            percent.remove()


        $('#modal-upload').modal('show')
        $.ajax({
            url: base + "api/richiesta/index.php",
            method: "PUT",
            data: {
                stato: 1,
                codice_richiesta: codice_richiesta
            },
            success: function (e) {

                $('.send-container .loader').hide()
                $('.send').show()
                location.href = '/Tesi/?codice_richiesta=' + codice_richiesta
            }
        })
    }


    if(codice_richiesta != '') {
        /* costruisco l'interfaccia */
        loaderAnagrafica.show()

        $('.add-document-container .loader').show()


        $.ajax({
            url: base + "api/richiesta/?codice_richiesta="+codice_richiesta,
            success: function (e) {
                var richiesta = JSON.parse(e)
                if(richiesta.richiesta.length == 0) {
                    alert('Richiesta inesistente.')
                    loaderAnagrafica.hide()
                    return
                }
                console.log(richiesta)

                $('.stato').text('Stato richiesta: '+ richiesta.richiesta[0].stato)

                if(richiesta.richiesta[0].stato == 2) {
                    var send = $('.send')
                    send.off('click')
                    send.text('Annulla richiesta')
                    send.removeClass("btn-info").addClass("btn-danger")
                    send.click(annullaRichiesta)
                }

                $('input#nome').val(richiesta.richiesta[0].nome)
                $('input#cognome').val(richiesta.richiesta[0].cognome)
                $('input#facolta').val(richiesta.richiesta[0].facolta)
                $('select#anno').val(richiesta.richiesta[0].anno)
                $('select#ordinamento').val(richiesta.richiesta[0].ordinamento)
                $('input#codice_fiscale').val(richiesta.richiesta[0].codice_fiscale)
                $('input#tel').val(richiesta.richiesta[0].tel)
                $('input#email').val(richiesta.richiesta[0].email)


                /* ESAMI UTENTE */

                for(var u = 0;u < richiesta.esami.length; u++) {


                    var id = richiesta.esami[u].id

                    addEsameUtente({id: id, nome: richiesta.esami[u].nome, cfu: richiesta.esami[u].cfu})

                    getRowEsameUtente(id, richiesta.esami[u].nome, richiesta.esami[u].cfu, function (data) {

                        containerEsamiUtente.append(data)

                        const rowEsameUtente = $('.row-esame-utente:last')

                        const idEsameUtente = rowEsameUtente.attr('id')

                        rowEsameUtente.on("dragstart", onDragStart)

                        rowEsameUtente.find('.elimina-esame-utente').click({id: idEsameUtente}, removeEsameUtente)
                        rowEsameUtente.find('.modifica-esame-utente').click({id: idEsameUtente}, modificaEsameUtente)
                        /* loader */
                        loaderEsamiUtente.css('display', 'none')  //
                    })
                }
                console.log(esamiUtente)




                /* ESAMI FACOLTA */

                $.ajax({
                    url: base+"api/esamiFacolta/?ordinamento="+richiesta.richiesta[0].ordinamento,
                    success: function(e) {
                        esamiFacolta = JSON.parse(e)
                        var efc = 0;
                        esamiFacolta.forEach(function (e) {

                            e['rimanenti'] = parseInt(e.cfu)

                            getRowEsameFacolta(e.id, e.nome, e.cfu, function (data) {

                                containerEsamiFacolta.append(data)

                                // REGISTRO GLI EVENTI (solo sull'ultimo inserito altrimenti ognuno avrebbe eventi multipli)
                                const dropTarget = $('.drop-zone:last')
                                dropZoneHeight = dropTarget.height()
                                dropTarget.on('dragenter', onDragEnter)
                                dropTarget.on('dragover', function (e) {
                                    e.preventDefault()
                                })
                                dropTarget.on('dragleave', onDragLeave)
                                dropTarget.on('drop', onDrop)
                                dropTarget.find('.ghost').on('mouseenter', function () {
                                    $(this).css('display', 'inline-block')
                                })
                                if (efc == esamiFacolta.length - 1) {


                                    var match_ = richiesta.matching


                                    /* MATCHING :/ */

                                    for (var n = 0; n < match_.length; n++) {

                                        for (var m = 0; m < match_[n].length; m++) {


                                        var esame_ = $(esame)

                                        var currentMatch = match_[n][m]


                                        esame_.attr('id', currentMatch.id + '-m')


                                        var esameUtente = getEsame(currentMatch.id_esame_utente, 'utente')
                                        var esameFacolta = getEsame(currentMatch.id_esame_facolta, '')


                                        /*if(esameUtente.rimanenti >= esameFacolta.rimanenti){
                                         esameUtente.rimanenti  -= esameFacolta.rimanenti
                                         esameFacolta.rimanenti = 0
                                         } else {
                                         esameFacolta.rimanenti -= esameUtente.rimanenti
                                         esameUtente.rimanenti = 0
                                         }*/


                                        esameUtente.rimanenti -= currentMatch.cfu
                                        esameUtente.riconosciuti = currentMatch.cfu

                                        esameFacolta.rimanenti -= currentMatch.cfu

                                        $('#' + esameUtente.id + '-eu .cfu-esame-utente h6').text((esameUtente.cfu - esameUtente.rimanenti) + '/' + esameUtente.cfu)


                                        //var nome_esame_utente = e.dataTransfer.getData("nome_esame_utente")

                                        esame_.find('.nome').text(esameUtente.nome)


                                        addMatching({
                                            id: currentMatch.id,
                                            esameUtente: esameUtente,
                                            esameFacolta: esameFacolta
                                        })

                                        $('#' + esameFacolta.id + '-ref .cfu-esame-facolta').text(esameFacolta.rimanenti + '/' + esameFacolta.cfu)

                                        esame_.find('i.fa-times').click(removeMatching)

                                        esame_.find('i.fa-plus').click(aggiungiCrediti)

                                        esame_.find('i.fa-minus').click(rimuoviCrediti)

                                        esame_.find('.qty').text(esameUtente.riconosciuti)

                                        console.log(esame_)

                                        esame_.insertBefore($('#' + esameFacolta.id + '-ef .ghost'))


                                        // aggiungo l'id del matching per identificarlo nell'html

                                        // appendo l'esame nella drop-zone

                                        /* registro l'evento per la rimozione */


                                        // aggiunta esame


                                        console.log(match)


                                        /////


                                    }
                                }




                                    loaderEsamiFacolta.hide()
                                }
                                efc++
                            })

                        })



                        /* file qui */


                        /* FILES */




                        var files = richiesta.files
                        var name = '';

                        if(files.length == 0)
                            $('.add-document-container .loader').hide()


                        files.forEach(function(e, index){


                            console.log("file", e.url)


                            docForDelete.push(e.url)

                            var req = new XMLHttpRequest();
                            req.responseType = "blob";
                            req.onload = function (event) {
                                //var blob = new File(req.response);

                                var file = new File([req.response], e.url, {type: req.response.type});

                                console.log("file blob", file)


                                $('.inner-canvas').prepend(
                                    "<div class=\"canvas-container\" id=\"canvas-loaded-container-"+index+"\">"+
                                        "<canvas id=\"canvas-loaded-"+index+"\"></canvas>"+
                                        "<i class=\"fas fa-plus\"></i>"+
                                        "<i class=\"fas fa-minus\"></i>"+
                                    "</div>"
                                )

                                setTimeout(function() {

                                    if(file.type == "application/pdf") {
                                        putFirstPDFPage("#canvas-loaded-" + index, file, e.id)
                                    }

                                    if(file.type.includes("image")) {
                                        putImagePreview("#canvas-loaded-" + index, file, e.id)
                                    }

                                    $("#canvas-loaded-" + index).parent().find("i.fa-minus").click(function(){
                                        deleteFile(index)
                                    })

                                    $("#canvas-loaded-" + index).css('cursor', 'pointer')
                                    $("#canvas-loaded-" + index).click(function(){

                                        window.open(base + "api/documenti/uploads/" + e.url,'_blank');
                                    })


                                    if(files.length-1 == index) {
                                        $('.add-document-container .loader').hide()
                                        console.log(docForDelete)
                                    }


                                }, 500)


                            }
                            req.open("GET", "../Tesi/api/documenti/uploads/"+e.url, true);
                            req.send();

                        })



                        loaderEsamiFacolta.hide()


                    }
                })


                submitAnagrafica.remove()


                loaderAnagrafica.hide()
                $('.codice_richiesta').html('Codice richiesta: <u>'+richiesta.richiesta[0].codice_richiesta+'</u>')
                $('.matching-container').css('display', 'block')
                $('html, body').animate({
                    scrollTop: $('.matching-container').offset().top - 30
                }, 700, function() {
                    $('.matching-container').animate({
                        opacity: 1
                    }, 400, function() {
                        ///
                        ///

                        if(richiesta.richiesta[0].stato == 2) $('.send-container').append(submitAnagrafica)
                        submitAnagrafica.text('Aggiorna Richiesta')
                        submitAnagrafica.off('click')
                        submitAnagrafica.click(inviaRichiesta)
                    })

                })


                /* Sei l'admin?????? */

                if(window.isAdmin != undefined && window.isAdmin) {


                    /* anagrafica non modificabile */

                    $('.container-anagrafica *').attr('disabled', 'disabled')



                    $('.send').remove()

                    console.log(richiesta.richiesta[0].stato)

                    if(richiesta.richiesta[0].stato == "Inviata") {

                        $('.prendi-in-carico').click(function () {

                            $(this).attr('disabled', 'disabled')
                            $(this).text("Prendo in carico...")

                            $.ajax({
                                url: base + 'api/richiesta/makeCopy/index.php?codice_richiesta=' + codice_richiesta,
                                method: 'GET',
                                success: function (e) {

                                    location.href = '/Tesi/?codice_richiesta=' + e + '&admin'

                                }
                            })

                        })
                    } else if(richiesta.richiesta[0].stato == "Presa in carico" ){


                        $('.prendi-in-carico').remove()


                        $('.send-container').append(
                            "<button class=\"btn btn-danger rifiuta-richiesta\">Rifiuta</button>"
                        )
                        $('.send-container').append(
                            "<button style=\"margin: 0 15px;\" class=\"btn btn-success accetta-richiesta\">Accetta</button>"
                        )

                        $('.rifiuta-richiesta').click(function() {
                            $.ajax({
                                url: base + 'api/richiesta/index.php',
                                method: "PUT",
                                data: {
                                    codice_richiesta: codice_richiesta,
                                    parent: richiesta.richiesta[0].parent,
                                    stato: 5
                                },
                                success: function(e) {
                                    location.href = '/Tesi/?codice_richiesta=' + codice_richiesta + '&admin'
                                }
                            })
                        })

                        $('.accetta-richiesta').click(function() {
                            $.ajax({
                                url: base + 'api/richiesta/index.php',
                                method: "PUT",
                                data: {
                                    codice_richiesta: codice_richiesta,
                                    parent: richiesta.richiesta[0].parent,
                                    stato: 4
                                },
                                success: function(e) {
                                    location.href = '/Tesi/?codice_richiesta=' + codice_richiesta + '&admin'
                                }
                            })
                        })

                        $('.send-container').append(submitAnagrafica)
                        submitAnagrafica.text('Aggiorna Richiesta')
                        submitAnagrafica.off('click')
                        submitAnagrafica.click(inviaRichiesta)

                    } else if(richiesta.richiesta[0].stato == "Accettata" || richiesta.richiesta[0].stato == "Rifiutata") {
                        submitAnagrafica.remove()
                        $('.prendi-in-carico').remove()
                    }

                }

                /* si...sei l'admin */






                /* per ora se è stata inviata blocco la UI */

                if(richiesta.richiesta[0].stato == 2 && !window.isAdmin) {
                    $('button, input, select').attr('disabled', 'disabled')
                    $('i').off('click')
                }



            }
        })


    }



    function deleteFile(index) {

        console.log("deleteing ", docForDelete[index])


        $('.add-document-container .loader').show()

        $.ajax({
            url: base +'api/documenti/index.php',
            method: "DELETE",
            data: {
                name: docForDelete[index]
            },
            success: function (e) {
                console.log(e)
                $("#canvas-loaded-"+index).parent().remove()
                docForDelete.splice(index, 1)
                console.log(documenti)

                $('.add-document-container .loader').hide()
            }
        })

    }







})
