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

    $( '#trend_list a' ).on( 'click', function() {
        $( '#trend_list' ).load( $(this).attr('href') );
        return false;
    });

    setInterval( function fetchTrends() {
        $.post('/final/query/trends', {
            'db_name' : dbName,
            'site_name' : siteName,
            'approach' : approach
        }, function ( data ) {
            if ( data ) {
                $('#trend_list').html( data );
                $( '#trend_list a' ).on( 'click', function() {
                    $( '#trend_list' ).load( $(this).attr('href') );
                    return false;
                });
            }
        } );
        $( '#performance_widget' ).load( '/final/query/performance', function(){
           takeSnapshot();
        } );
        return fetchTrends;
    }(), 30000 );

    takeSnapshot = function() {
        var trendList = '';
        $( '#trend_list a' ).each( function( index, element ) {
            trendList += $( element ).html()+'<br>';
        } );
            var snapshotHtml = $( '#snapshot_widget' ).html();
            $( '#snapshot_widget' ).html( snapshotHtml + '<span>' + new Date().toLocaleTimeString() + '<br/>' + trendList + '</span>' );
    }
 
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
} );
