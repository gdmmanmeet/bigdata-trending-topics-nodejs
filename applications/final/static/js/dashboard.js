$( function() {
    var keywordDensityGraphData = [];
    $('#settings_tab a').click( function( e ) {
        e.preventDefault();
        $( this ).tab( 'show' );
    } );

//Performance graph
   var line1 = new TimeSeries();
   var line2 = new TimeSeries();
   var line3 = new TimeSeries();
   var smoothie1 = new SmoothieChart({millisPerPixel:1000, minValue:10, maxValue:200, grid:{millisPerLine:30000}});
   smoothie1.streamTo(document.getElementById("resident-size"));
   var smoothie2 = new SmoothieChart({millisPerPixel:1000, minValue:10, maxValue:200, grid:{millisPerLine:30000}});
   smoothie2.streamTo(document.getElementById("heap-used"));
   var smoothie3 = new SmoothieChart({millisPerPixel:1000, minValue:10, maxValue:200, grid:{millisPerLine:30000}});
   smoothie3.streamTo(document.getElementById("total-heap"));
//--------------------------------------------


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
       var residentSize = ( data[ 'ram' ].rss / 1000000 ).toFixed( 4 ); 
       var heapUsed = ( data[ 'ram' ].heapUsed / 1000000 ).toFixed( 4 ); 
       var totalHeap = ( data[ 'ram' ].heapTotal / 1000000 ).toFixed( 4 );
	console.log(residentSize);
	console.log(heapUsed);
	console.log(totalHeap);
            var html = '<div><h2>Performance Factors</h2><table><tr><td> Average Message Fetch Time:</td><td>' +
            data[ 'message_fetch_time' ] + ' ms </td></tr><tr><td> Average Tag Fetch Time: </td><td>' +
            data[ 'tag_fetch_time' ] + ' ms </td></tr><tr><td> Average Ram Usage: </td><td> ' +
            residentSize  +' MB resident set size <br/>' +
            heapUsed  + ' MB heap used <br/>' +
            totalHeap  + 'MB total heap </td></tr></table></div>';
            $('#performance_widget').html( html );
            takeSnapshot();

//-----------update performance graphs-----------------
       line1.append(new Date().getTime(), residentSize);
       line2.append(new Date().getTime(), heapUsed);
       line3.append(new Date().getTime(), totalHeap);
//-------------------------------------------------------

        } );
        return fetchTrends;
    }(), 30000 );

//---------smoothie performance graphs -------------
    smoothie1.addTimeSeries(line1);
    smoothie2.addTimeSeries(line2);
    smoothie3.addTimeSeries(line3);

//--------------------------------------------------------

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
