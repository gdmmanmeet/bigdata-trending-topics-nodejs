$( function() {
    $('#settings_tab a').click( function( e ) {
        e.preventDefault();
        $( this ).tab( 'show' );
    } );

    $( '#data_rate' ).change( function() {
        $.post( '/final/source/start', { 'data_rate' : $( '#data_rate' ).val() } );
    } );
} );
