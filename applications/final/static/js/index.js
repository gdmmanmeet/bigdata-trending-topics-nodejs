$( function() {
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
        var inputs = [ 'data_rate', 'approach', 'db_name', 'site_name', 'score_rate', 'garbage_collector_rate' ];
        if ( validateInput( inputs ) ) {
            var data = {};
            inputs.forEach(function(input){
                data[ input ] = $( '#' + input ).val().trim();
            });
            $.post( '/final/source/start', data );
            $('body').load( '/final/defaultController/dashboard' );
        }
    });
});
