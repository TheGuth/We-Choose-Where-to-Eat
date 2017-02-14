const auth = {

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
  const terms = 'Restaurants';
  const near = location;
  const accessor = {
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

  const message = {
    'action' : 'https://api.yelp.com/v2/search',
    'method' : 'GET',
    'parameters' : parameters
  };

  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);
  const parameterMap = OAuth.getParameterMap(message.parameters);
  parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)

  // callApi function sends AJAX request with the callback
  // callback function being initializeState.
  function callApi() {
    const data = $.ajax({
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

function initializeState(data) {
  state.data = data
  state.businesses = state.data.businesses;
}

state = {
  data: '',
  businesses: [],
  style: '',
  near: '',
  offset: 0,
  limit: 6,
  category_filter: '',
  sort: '',
  radius_filter: '',
  currentPage: 'homePage',
  possiblePages: ['homePage', 'choicePage', 'resultsPage', 'finalPage'],
  business_pick: '',
}

function displayChoice(state) {
  $('.choice-page').show();
}

function displayResults(state) {
  $('.choice-page').hide();
  $('.js-results-container').show();
}

function populateResultList({businesses}) {
  businesses.forEach((business) => {
    console.log(business);
    $('.js-results-list').append(`<li><h3>${business.name}</h3><img src="${business.image_url}">
                                 <p class="business-snippet"><b>Review Snippet:</b>${business.snippet_text}</p>
                                 <p><b>Rating:</b>${business.rating}/5</p></li>`);
  });
}

function displayFinalChoice({business_pick}) {
  console.log(business_pick);
  $('.js-results-container').hide();
  $('.choice-page').hide();
  $('.final-choice-page').show();

  $('.final-choice-page .js-restaurant-choice').text(business_pick.name);
  $('.final-choice-page img').attr('src', business_pick.image_url);
  $('.final-choice-page .rating').html(`<b>Rating</b><br>${business_pick.rating}`);

  $('.final-choice-page .phone').html(`<b>Phone</b><br><a href="tel: ${business_pick.display_phone}
                                       ">${business_pick.display_phone}</a>`);

  $('.final-choice-page .address').html(`<b>Address</b><br><a href="http://maps.google.com/maps?q= 
                                         ${business_pick.location.display_address.join(', ').split(' ').join('+')}
                                        ">${state.business_pick.location.display_address.join(', ')}</a>`);
}

function randomRestaurant({businesses}) {
  randomIndex = Math.floor(Math.random() * 6);
  state.business_pick = businesses[randomIndex];
}

function resetList() {
  constructParameters(state.near, state.style, state.offset, state.limit);
  $('.js-results-list').empty();
  setTimeout(() => {
      populateResultList(state);
    }, 1000)
}

function initializeEventListeners(state) {
  $('.js-query').submit(function(event) {
    event.preventDefault();

    state.search = $(this).serializeArray();
    // creates search in state set to an array which holds the search values for location and style
    state.near = state.search[0].value;
    state.style = state.search[1].value;
    $('.home-page').hide();
    displayChoice();

    constructParameters(state.near, state.style, state.offset, state.limit)
  });

  $('.user-pick').click(function(event) {
    displayResults(state);
    populateResultList(state);
  });

  $('.computer-pick').click(function(event) {
    $('.js-results-container').show();
    constructParameters(state.near, state.style, state.offset, 20);
    setTimeout(() => {
      randomRestaurant(state);
      displayFinalChoice(state);
    }, 500)
  });

  $('.js-prev-btn').click(function(event) {
    if (state.offset >= 6) {
      state.offset -= 6
      resetList();
    }
  });

  $('.js-next-btn').click(function(event) {
    state.offset += 6;
    resetList();
  });


  $('.js-results-list').on('click', 'li img', function(event) {
    var image = $(this).attr('src');
    state.businesses.forEach((business, index) => {
      if (business.imagr_url === image) {
        state.business_pick = business;
      }
    });

    displayFinalChoice(state);
  });

  $('.js-restart-btn').click(function(event) {
    window.location.reload(false);
    // reloads webapp from cach.
  });
}

$(function() {
  initializeEventListeners(state);
});



























