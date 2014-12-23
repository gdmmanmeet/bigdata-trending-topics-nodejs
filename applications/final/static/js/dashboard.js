$( function() {
    $('#settings_tab a').click( function( e ) {
        e.preventDefault();
        $( this ).tab( 'show' );
    } );

    $( '#data_rate' ).change( function() {
        $.post( '/final/source/start', { 'data_rate' : $( '#data_rate' ).val() } );
    } );

    $( '#score_rate' ).change( function() {
        $.post( '/final/sink/set_cron', { 'score_rate' : $('#score_rate').val() } );
    } );

    setInterval( function() {
        $.post('/final/query/trends', {
            'db_name' : dbName,
            'site_name' : siteName
        }, function ( data ) {
            if ( data ) {
                $('#trend_list').html( data );
            }
        } );
    }, 30000 );

} );
