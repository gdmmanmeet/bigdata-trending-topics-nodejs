$( function() {
    var keywordDensityGraphData = [];
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
                var html = '';
                html +='<table><th>Trending Tag </th><th> Score </th> <th> Expected Tags </th>';
                var trendingTopics = data[ 'trending_tags' ];
                var db_name = data[ 'db_name' ];
                var site_name = data[ 'site_name' ];
                var expected_tags = data['expected_tags'];
                for( var i = 0; i < trendingTopics.length;  i++ ) {
                    var tag = trendingTopics[ i ];
                    var score = tag['z-score']? tag['z-score'] : (tag['iir-score'] ? tag['iir-score'] :tag['hybrid-score'] );
                    html += '<tr><td><a href="/final/query/messages/' + db_name +'/' + site_name + '/' + tag.text + '">' + tag.text +"</a></td>'<td>"+ score + '</td><td>' + ( expected_tags ? expected_tags[ i ] : '' ) +'</td></tr>';
                }
                $('#trend_list').html(  "<h2>Trend List</h2> <br/>" + html + '</table><br/> <span class="percentage_match">Percentage Match = ' + data['percentage_match'] +"</span>");
                $( '#trend_list a' ).on( 'click', function() {
                    $( '#trend_list' ).load( $(this).attr('href') );
                    return false;
                });
                keywordDensityGraphData.push( data['percentage_match'] );
            }
        } );
        $.get( '/final/query/performance', function( data ){
            var html = '<div><h2>Performance Factors</h2><table><tr><td> Average Message Fetch Time:</td><td>' +
            data[ 'message_fetch_time' ] + ' ms </td></tr><tr><td> Average Tag Fetch Time: </td><td>' +
            data[ 'tag_fetch_time' ] + ' ms </td></tr><tr><td> Average Ram Usage: </td><td> ' +
            ( data[ 'ram' ].rss / 1000000 ).toFixed( 4 ) +' MB resident set size <br/>' +
            ( data[ 'ram' ].heapUsed / 10000000 ).toFixed( 4 ) + ' MB heap used <br/>' +
            ( data[ 'ram' ].heapTotal / 1000000 ).toFixed( 4 ) + 'MB total heap </td></tr></table></div>';
            $('#performance_widget').html( html );
            takeSnapshot();
        } );
        return fetchTrends;
    }(), 30000 );

    takeSnapshot = function() {
        var trendList = '<table>' +$('#trend_list table').html() +'</table>';
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
