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
            approach = $( '#approach' ).val().trim();
            $('.hero-unit').load( '/final/defaultController/dashboard', function(){
                $( '#data_rate' ).val( data_rate_val ).change();
                $( '#score_rate' ).val( score_rate_val ).change();
            } );
        }
    });

    var valueOutput = function( element ) {
        var value = element.value;
        var output = element.parentNode.getElementsByTagName( 'output' )[ 0 ];
        output.innerHTML = value;
    }

    var $element = $( '[type="range"]' );

    for( var i  = $element.length - 1; i >=0; i -- )
        valueOutput( $element[i] );

    $(document).on( 'change', 'input[type="range"]', function( e ) {
        valueOutput( e.target );
    } );

    $element.rangeslider( {
        polyfill : false
    } );
});
