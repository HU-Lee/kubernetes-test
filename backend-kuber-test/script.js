$(document).ready(function () {
    $.getJSON("/", function (result) {
        $("#backend").text(
            result['message']
        );
    });
 });