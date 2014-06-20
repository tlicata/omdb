# Movie Search - Powered by OMDB

A single page app that displays movie info. It uses the 
API from http://www.omdbapi.com/ to search for and display 
info about movies.

It uses jQuery for AJAX requests, event handling, and some 
DOM manipulation. Movie details are rendered via Underscore.js 
templates.

The HTML5 History API is used to manage state. The URL is 
updated with both the current search term and the ID of the 
currently displayed movie info. If the page is refreshed, 
then the UI will be restored to the previous state. This 
also allows the forward and back buttons to work with the 
search results.
