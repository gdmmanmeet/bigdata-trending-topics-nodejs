$( function() {
    dbName = null;
    siteName = null;
    var validateInput = function( inputs ) {
        var valid = true;
        inputs.forEach( function( input ) {
            if ( $( '#' + input ).val().trim() )
            $( '#' + input ).removeClass( 'error' );
            else {
                $( '#' + input ).addClass( 'error' );
                valid = false;
            }
        } );
        return valid;
    };

    $( '#start_app' ).click( function() {
        var inputs = [ 'data_rate', 'approach', 'db_name', 'site_name', 'score_rate'];
        if ( validateInput( inputs ) ) {
            var data = {};
            inputs.forEach(function(input){
                data[ input ] = $( '#' + input ).val().trim();
            });
            $.post( '/final/source/start', data );
            var data_rate_val = $('#data_rate').val();
            var score_rate_val = $('#score_rate').val();
            dbName  = $( '#db_name' ).val().trim();
            siteName = $( '#site_name' ).val().trim();
            $('.hero-unit').load( '/final/defaultController/dashboard', function(){
                $( '#data_rate' ).val( data_rate_val );
                $( '#score_rate' ).val( score_rate_val );
                $.post('/final/query/trends', {
                    'db_name' : dbName,
                    'site_name' : siteName
                }, function ( data ) {
                    if ( data ) {
                        $('#trend_list').html( data );
                    }
                } );
            } );
        }
    });
});
