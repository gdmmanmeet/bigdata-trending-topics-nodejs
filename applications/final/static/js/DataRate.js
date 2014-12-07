$(function(){
    var dataSourceStarted = false;
    $('#startDataSource').click(function(){
	    var dataRate = $('#dataRate').val();
	    var dbName = $('#db_name').val();
	    var siteName = $('#site_name').val();
        if (validateStartDataSource()){
	        $.post('/final/source/start',{
	            data_rate : dataRate,
	            db_name : dbName,
	            site_name : siteName
	        });
            $('#startDataSource').hide();
            $('#db_name').attr('disabled','disabled');
            $('#site_name').attr('disabled','disabled');
            dataSourceStarted = true;
        }
    });
    var validateStartDataSource = function(){
        var dataRate = $('#dataRate').val();
        var dbName = $('#db_name').val();
        var siteName = $('#site_name').val();
        if (!dbName)
        {
            $('#db_name').addClass('error');
            return false;
        }
        else
            $('#db_name').removeClass('error');
        if (!siteName)
        {
            $('#site_name').addClass('error');
            return false;
        }
        else
            $('#site_name').removeClass('error');
        return true;
    }

    $('#dataRate').change(function(){
        if (dataSourceStarted)
            $.post('/final/source/start',{data_rate : $('#dataRate').val()});
    });
});

