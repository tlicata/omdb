var OMDB_URL = "http://www.omdbapi.com/";

var detailsDOM = $("#movie-details");
var errorDOM = $("#error-message");
var resultsDOM = $("#search-results");

var clearPreviousResults = function () {
    detailsDOM.empty();
    errorDOM.empty();
    resultsDOM.empty();
};

var renderMovieResults = function (results) {
    if (results.Response === "False" || results.Error) {
        renderError(results.Error);
        return;
    }
    $.each(results.Search, function (index, movie) {
        var text = movie.Title + " (" + movie.Year + ")";
        var url = "http://www.imdb.com/title/" + movie.imdbID;
        var link = $("<a/>").text(text).attr("href", url);
        link.data("imdbID", movie.imdbID);
        var item = $("<li/>").append(link);
        resultsDOM.append(item);
    });
};

var detailsTemplate = _.template($("script.details").html());
var renderDetails = function (details) {
    detailsDOM.html(detailsTemplate(details));
};

var renderError = function (message) {
    errorDOM.append(message || "Oops, an error occurred");
};

var lookupMovieId = function (id) {
    $.ajax({
        data: {"i": id, "plot": "full"},
        dataType: "jsonp",
        url: OMDB_URL,
        success: renderDetails
    });
};
var searchForMovie = function (searchText) {
    clearPreviousResults();
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
    pageHistory.addState({id: id});
});

$("#movie-search-form").on("submit", function (event) {
    event.preventDefault();
    var query = $("#movie-search-query").val();
    searchForMovie(query);
    pageHistory.newState({query: query});
});

// History Management
var pageHistory = (function () {

    // Determine if browser has HTML5 history available.
    var hasHistory = typeof window.history !== "undefined";

    // Read state at page load and initialize the UI.
    // Also, respond to history changes (e.g., back
    // button) by updating the UI to match the state.
    var updateState = function (state) {
        if (state) {
            if (state.query) {
                searchForMovie(state.query);
            }
            if (state.id) {
                lookupMovieId(state.id);
            }
        }
    };
    if (hasHistory) {
        updateState(history.state);
        window.onpopstate = function (event) {
            updateState(event.state);
        };
    }

    // Functions for modifying state. newState() sets
    // a completely new state while addState() builds
    // off the previous state.
    var newState = function (state) {
        history.pushState(state, "", "#"+$.param(state));
    };
    var addState = function (state) {
        newState($.extend({}, history.state, state));
    };
    var dummy = function () {};
    return {
        addState: hasHistory ? addState : dummy,
        newState: hasHistory ? newState : dummy
    };
})();
