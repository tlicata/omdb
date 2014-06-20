var OMDB_URL = "http://www.omdbapi.com/";

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
        var url = "http://www.imdb.com/title/" + movie.imdbID;
        var link = $("<a/>").text(text).attr("href", url);
        link.data("imdbID", movie.imdbID);
        var item = $("<li/>").append(link);
        resultsDOM.append(item);
    });
};

var renderDetails = function (details) {
    console.log("renderDetails", details);
};

var renderError = function (message) {
    clearPreviousResults();
    errorDOM.append(message || "Oops, an error occurred");
};

var lookupMovieId = function (id) {
    $.ajax({
        data: {"i": id},
        dataType: "jsonp",
        url: OMDB_URL,
        success: renderDetails
    });
};
var searchForMovie = function (searchText) {
    $.ajax({
        data: {"s": searchText},
        dataType: "jsonp",
        url: OMDB_URL,
        success: renderMovieResults,
        error: renderError
    });
};

resultsDOM.on("click", "a", function (event) {
    event.preventDefault();
    var id = $(this).data("imdbID");
    lookupMovieId(id);
});

$("#movie-search-form").on("submit", function (event) {
    event.preventDefault();
    var query = $("#movie-search-query").val();
    searchForMovie(query);
});
