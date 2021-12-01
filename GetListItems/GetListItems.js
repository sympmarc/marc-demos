$(document).ready(function () {
    $().SPServices({
        operation: "GetListItems",
        async: false,
        listName: "Colors",
        CAMLViewFields: "<ViewFields><FieldRef Name='Title' /><FieldRef Name='HexCode' /><FieldRef Name='InfoLink' /></ViewFields>",
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                var infoLink = $(this).attr("ows_InfoLink").split(",");

                var liHtml = "<li>" +
                    "<span style='color:" + $(this).attr("ows_HexCode") + "'>" + $(this).attr("ows_Title") + "</span>" +
                    " - " +
                    "<a href='" + infoLink[0] + "'>" + infoLink[1] + "</a>" +
                    "</li>";
                $("#wpDemoColors2").append(liHtml);
            });
        }
    });
});
