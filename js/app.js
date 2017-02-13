
// Cuisine Quest using Yelp API

// auth object containing my consumberkey, token, and secrets
// wouldn't want this exposed in an application.
var auth = {

  consumerKey : "JRfPQyRFca4z4jtJEeiCjA",
  consumerSecret : "pHfG8vmxkQN_4HBlHkmxwCQHMEA",
  accessToken : "B9rsoCApBausDw-RSRROWGh0koyogVqg",
  // You wouldn't actually want to expose your access token 
  // secret like this in a real application.
  accessTokenSecret : "4VWQZ_IYvEyeA8BXTuhGwlggdJE",
  serviceProvider : {
    signatureMethod : "HMAC-SHA1"
  }
};

// constructParameters(updates my parameter array with the correct
// location, style, and offset whenever we call constructParameters
// We will also call callApi() function.)
function constructParameters(location, style, offset, limit) {
  var terms = 'Restaurants';
  var near = location;
  var accessor = {
    consumerSecret : auth.consumerSecret,
    tokenSecret : auth.accessTokenSecret
  };
  parameters = [];
  parameters.push(['term', terms]);
  parameters.push(['location', near]);
  parameters.push(['offset', offset]);
  parameters.push(['limit', limit]);
  parameters.push(['category_filter', style]);
  parameters.push(['callback', 'cb']);
  parameters.push(['oauth_consumer_key', auth.consumerKey]);
  parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  parameters.push(['oauth_token', auth.accessToken]);
  parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

  var message = {
    'action' : 'https://api.yelp.com/v2/search',
    'method' : 'GET',
    'parameters' : parameters
  };

  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);
  var parameterMap = OAuth.getParameterMap(message.parameters);
  parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)

  // callApi function sends AJAX request with the callback
  // callback function being initializeState.
  function callApi() {
    var data = $.ajax({
      'url' : message.action,
      'data' : parameterMap,
      'cache' : true,
      'dataType' : 'jsonp',
      'jsonpCallback' : 'initializeState',
      'success' : function(data, textStats, XMLHttpRequest) {
      }
    });
  }

  callApi();
}

// updates our state object with the data we receive from our
// AJAX request.
function initializeState(data) {
  state.data = data
  state.businesses = state.data.businesses;
}

// State object that is updated through various functions
var state = {
  data: '',
  businesses: [],
  currentSearch: [],
  style: '',
  near: '',
  offset: 0,
  limit: 6,
  category_filter: '',
  business_pick: '',
}

// updates the DOM so that our header and paragraph populate with new text.
// we then toggle our .choice-page buttons so that they show up
function displayChoice() {
  $('header h1').text('Choose Wisely');
  $('header p').text('Please select whether you want to see a list of nearby restaurants or have a restaurant randomly selected for you.');
  $('.choice-page').toggle('hidden');
}

// Update the header and paragraph with our Results page information.
// remove choice-page buttons
// toggle our results container 
function displayResults() {
  $('header h1').text('Results');
  $('header p').text('Results show only 6 restaurants at a time: Please select the restaurant you would like to go to.');
  $('.choice-page').toggle('hidden');
  $('.js-results-container').toggle('hidden');
}

// constructs our results list items that get appended to our 'ul'
function populateResultList() {
  state.businesses.forEach(function(business) {
    $('.js-results-list').append('<li><h3>' + business.name + '</h3>' + 
                                 '<img src="' + business.image_url + '">' +
                                 '<p class="business-snippet"><b>Review Snippet:</b> ' + business.snippet_text + '</p>' +
                                 '<p><b>Rating:</b> ' + business.rating + '/5</p></li>')
  });
}

// hides html elements except for those related to the final page
function toggleFinalPage() {
  $('.home-page-container').toggle('hidden');
  $('.js-results-container').toggle('hidden');
  $('.final-choice-page').toggle('hidden');
}

function displayFinalChoice() {
  toggleFinalPage();
  $('.final-choice-page .js-restaurant-choice').text(state.business_pick.name);
  $('.final-choice-page img').attr('src', state.business_pick.image_url);
  $('.final-choice-page .rating').html('<b>Rating</b><br>' + state.business_pick.rating);

  $('.final-choice-page .phone').html('<b>Phone</b><br>' + '<a href="tel:' + 
                                      state.business_pick.display_phone + '">' +
                                      state.business_pick.display_phone + '</a>');

  $('.final-choice-page .address').html('<b>Address</b><br>' + '<a href="http://maps.google.com/maps?q=' + 
                                        state.business_pick.location.display_address.join(', ').split(' ').join('+') +
                                        '">' + state.business_pick.location.display_address.join(', ') + '</a>');
}

function randomRestaurant() {
  randomIndex = Math.floor(Math.random() * 6); 
  // provides a random number between 0 and 19
  state.business_pick = state.businesses[randomIndex];
}

function initializeEventListeners() {

  // listens for the search button on home page
  $('.js-query').submit(function(e) {
    state.businesses = [];
    $('.js-results-list').empty();
    e.preventDefault();

    state.search = $(this).serializeArray();
    // creates search in state set to an array which holds the search values for location and style
    state.near = state.search[0].value;
    state.style = state.search[1].value;
    $('.home-page').toggle('hidden');
    displayChoice()
    
    constructParameters(state.near, state.style, state.offset, state.limit);
    // constructs parameters and then calls api
  });

  // listens for see results button
  $('.user-pick').click(function(e) {
    displayResults();
    populateResultList();
  });

  // listens for random selection button
  $('.computer-pick').click(function(e) {
    $('.choice-page button').toggle('hidden');
    $('.js-next-and-prev-buttons').toggle('hidden');
    $('.js-results-container').toggle('hidden');
    constructParameters(state.near, state.style, state.offset, 20);
    setTimeout(function() {
      randomRestaurant();
      displayFinalChoice();
    }, 500)
  });

  // listens for next button on results page
  $('.js-next-btn').click(function(e) {
    state.offset += 6;
    constructParameters(state.near, state.style, state.offset, state.limit);
    $('.js-results-list').empty();
    setTimeout(function() {
      populateResultList();
      }, 1000);
  });

  // listens for previous button on results page
  $('.js-prev-btn').click(function(e) {
    if (state.offset >= 6) {
      state.offset -= 6;
      constructParameters(state.near, state.style, state.offset, state.limit);
      $('.js-results-list').empty();
      setTimeout(function() {
        populateResultList();
        }, 1000);
    }
  });

  // listens for each business image to be clicked on results page
  $('.js-results-list').on('click', 'li img', function(e) {
    var image = $(this).attr('src');
    state.businesses.forEach(function(business, index) {
      if (business.image_url === image) {
        state.business_pick = business;
        console.log(business);
      }
    });

    displayFinalChoice();
  });

  $('.js-restart-btn').click(function() {
    window.location.reload(false);
  });
}

// loads when document is ready.
$(function() {
  initializeEventListeners();
});




