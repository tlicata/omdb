var renderMovieResults = function (results) {
    console.log("rendering results", results);
};

var renderError = function () {
    console.log("oops, an error occurred");
};

var searchForMovie = function (searchText) {
    $.ajax({
        data: {"s": searchText},
        dataType: "jsonp",
        url: "http://www.omdbapi.com/",
        success: renderMovieResults,
        error: renderError
    });
};

$("#movie-search-form").on("submit", function (event) {
    event.preventDefault();
    var query = $("#movie-search-query").val();
    searchForMovie(query);
});
