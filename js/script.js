var errorDOM = $("#error-message");
var resultsDOM = $("#search-results");

var clearPreviousResults = function () {
    errorDOM.empty();
    resultsDOM.empty();
};

var renderMovieResults = function (results) {
    if (results.Response === "False" || results.Error) {
        renderError(results.Error);
        return;
    }
    clearPreviousResults();
    $.each(results.Search, function (index, movie) {
        var text = movie.Title + " (" + movie.Year + ")";
        resultsDOM.append($("<li/>").text(text));
    });
};

var renderError = function (message) {
    clearPreviousResults();
    errorDOM.append(message || "Oops, an error occurred");
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
