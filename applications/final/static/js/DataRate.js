$(function(){
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
        }
    });
    var validateStartDataSource = function(){
        var dataRate = $('#dataRate').val();
        var dbName = $('#db_name').val();
        var siteName = $('#site_name').val();
        if (!dbName)
        {
            $('#db_name').addClass('error');
            return 0;
        }
        else
            $('#db_name').removeClass('error');
        if (!siteName)
        {
            $('#site_name').addClass('error');
            return 0;
        }
        else
            $('#site_name').removeClass('error');
        return 1;
    }
});

