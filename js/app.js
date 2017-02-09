// user enters article query
// pulls up list of articles 5-10
// has next and prev button to load the next 5-10 articles

// if user clicks on an article it will take them to another
// screen displaying what sources that particular article
// cited. The user then can click a button to proceed to 
// the actual article on New York Times Website.

// User can also click a back button that will take them to
// the previous page with the 5-10 articles.

// possibly opern source React Component
// use news api grab url, go into url find all article text select all
// a elements and then sort a element urls as sources.

//////////////////////////////////////////////

// user enters article query
// displays a list of most common citations among 100 most
// rescent articles.
// also displays a list of most common writers for the given
// topic.

// var newYorkTimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json'

// var state = {
//   query: {
//     'api-key': '9155b4fa4d3043e690af47c195a7f7a7',
//     q: 'Trump',
//     // offset: 0, // if set to 1 gives next 10 results.

//   },
// }

// function getDataFromApi(searchTerm, callback) {
//   state.query.q = searchTerm;

//   $.getJSON(newYorkTimesUrl, state.query, callback);
// }

// function displayData(data) {
//   console.log(data);
// }

// $(function() {
//   getDataFromApi(state.query.q, displayData);
// });





////////////////////////////////////


// Yelp API

// Consumer Key:  JRfPQyRFca4z4jtJEeiCjA

// Consumer Secret: pHfG8vmxkQN_4HBlHkmxwCQHMEA

// Token: B9rsoCApBausDw-RSRROWGh0koyogVqg

// Token Secret:  4VWQZ_IYvEyeA8BXTuhGwlggdJE

// ///////////////////////////////

// each request must have:

// 1. oauth_consumer_key

// 2. oauth_token

// 3. oauth_signautre_method

// 4. oauth_signature

// 5. oauth_timestamp

// 6. oauth_nounce

///////////////////////////////////////////////

// Pseudo Code:

// user enters location, type




var auth = {
  //
  // Update with your auth tokens.
  //
  consumerKey : "JRfPQyRFca4z4jtJEeiCjA",
  consumerSecret : "pHfG8vmxkQN_4HBlHkmxwCQHMEA",
  accessToken : "B9rsoCApBausDw-RSRROWGh0koyogVqg",
  // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
  // You wouldn't actually want to expose your access token secret like this in a real application.
  accessTokenSecret : "4VWQZ_IYvEyeA8BXTuhGwlggdJE",
  serviceProvider : {
    signatureMethod : "HMAC-SHA1"
  }
};
function constructParameters(location, style) {
  var terms = 'Restaurants';
  var near = location;
  var accessor = {
    consumerSecret : auth.consumerSecret,
    tokenSecret : auth.accessTokenSecret
  };
  parameters = [];
  parameters.push(['term', terms]);
  parameters.push(['location', near]);
  // parameters.push(['category_filter', style]);
  parameters.push(['callback', 'cb']);
  parameters.push(['oauth_consumer_key', auth.consumerKey]);
  parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  parameters.push(['oauth_token', auth.accessToken]);
  parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

  var message = {
    'action' : 'http://api.yelp.com/v2/search',
    'method' : 'GET',
    'parameters' : parameters
  };

  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);
  var parameterMap = OAuth.getParameterMap(message.parameters);
  parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)

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

var state = {
  data: '',
  businesses: [],
  currentSearch: [],
  style: '',
  near: '',
  offset: 0,
  category_filter: '',
  business_pick: '',

}

function initializeState(data) {
  state.data = data
  console.log(state.data);
  state.businesses = state.data.businesses;
  console.log(state.businesses);
}

function displayChoice() {
  $('header h1').text('Calulations Complete');
  $('header p').text('Please choose whether or not you want us to pick or for you to pick');
  $('.choice-page button').toggle('hidden');
}

function displayResults() {
  $('header h1').text('Results');
  $('header p').text('Results show only 6 restaurants at a time: Please select the restaurant you would like to go to.');
  $('.choice-page button').toggle('hidden');
  $('.js-results-container').toggle('hidden');
}

function populateResultList() {
  state.businesses.forEach(function(business) {
    $('.js-results-list').append('<li><h3>' + business.name + '</h3>' + 
                                 '<img src="' + business.image_url + '">' +
                                 '<p>' + business.rating + '</p></li>')
  });
}

function displayFinalChoice() {
  $('header h1').toggle('hidden');
  $('header p').toggle('hidden');
  $('.js-results-container').toggle('hidden');
  $('.final-choice-page').toggle('hidden');
  $('.final-choice-page .js-restaurant-choice').text(state.business_pick.name);
  $('.final-choice-page img').attr('src', state.business_pick.image_url);
  $('.final-choice-page .rating').text(state.business_pick.rating);
}


function initializeEventListeners() {

  $('.js-query').submit(function(e) {
    state.businesses = [];
    $('.js-results-list').empty();
    e.preventDefault();
    state.search = $(this).serializeArray();
    state.near = state.search[0].value;
    state.style = state.search[1].value;
    $('.home-page').toggle('hidden');
    displayChoice()
    
    constructParameters(state.near, state.style);
    // constructs parameters and then calls api
  });

  $('.user-pick').click(function(e) {
    displayResults();
    populateResultList();
  });

  $('.computer-pick').click(function(e) {
    $('header').toggle('hidden');
    $('.choice-page button').toggle('hidden');
    $('.final-choice-page').toggle('hidden');

  });

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

}

$(function() {
  initializeEventListeners();
});





