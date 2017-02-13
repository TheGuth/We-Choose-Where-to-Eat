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
  searchParameters: {
    style: '',
    near: '',
    offset: 0,
    limit: 6,
    category_filter: '',
    sort: '',
    radius_filter: ''
  },
  currentPage: 'homePage',
  possiblePages: ['homePage', 'choicePage', 'resultsPage', 'finalPage'],
  business_pick: '',
}





































