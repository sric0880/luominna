var all_tags = [];
$(function(){
    $.ajax({
        url: "get_all_tags",
        type: "GET",
        success : function(json) {
            all_tags = json['data'];
            console.log(all_tags);
            $(document).ready(function(){
                $('#id_tags').tagit({
                    availableTags : all_tags
                });
            })
        },
    });
});
function create_tag(tag) {
    tag_name = $('#id_tags').tagit('tagLabel', tag);
    $.ajax({
        url: "add_tag",
        type: "GET",
        data: { "tag" : tag_name },
        error: function(xhr, errmsg, err) {
            console.error(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        },
        success: function(json){
            console.log(json)
            if (json['retcode'] == 200) {
                $(tag).find("input:first").attr("value", json["msg"]);
            }
        }
    });
};
$(document).ready(
    function() {
        $('#id_tags').tagit({
            afterTagAdded: function(evt, ui) {
                if (!ui.duringInitialization) {
                    create_tag( ui.tag );
                }
            },
            fieldName : 'tags',
            removeConfirmation: true,
        });
});