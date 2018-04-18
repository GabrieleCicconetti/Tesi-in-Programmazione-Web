


$(window).load(function(){


    getRowEsameUtente(function(data){
            console.log(data)
        })


    $('.dragright').on('dragover', function(e){
        e.preventDefault()
    })

    $('.dragright').on('drop', function(){
        console.log('asdasd')
    })


    function getRowEsameUtente(completion){
        $.ajax({
            url: "./template/row-esame-utente.html",
            async: false,
            success: function (data){
                completion(data)
            }
        });
    }


})
