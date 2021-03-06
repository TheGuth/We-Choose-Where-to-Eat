# Cuisine Quest

Thinkful (https://www.thinkful.com) Unit 1 capstone Exercise - jQuery app integrating with *Yelp*'s Open Platform API

##Background

I built this app drawing from a common argument that my wife and i always have when we are trying to decide where to go out to eat. This app will take a user's location, and style of food they like and find the 20 closest / best rated restaurants near you. The user then has the option to look through the results to pick a restaurant to go to, or click the choose for me button, to have the app randomly pick a restaurant for you to go to.

##Use Case

Why is this app useful? If you struggle with deciding on a place to eat, then why stress out over it, when you can let our app do the stressing for you. It takes away the hard decision of finding a place and leaves it up to fate.

##Initial UX

The initial wireframes can be seen below:

[Initial WireFrames](https://github.com/TheGuth/We-Choose-Where-to-Eat/tree/master/images/Wireframes)

<!-- ![Screenshot](https://github.com/TheGuth/We-Choose-Where-to-Eat/blob/master/images/home-page-wirefram.png?raw=true) -->

## Mobile UX

Pictures of the website for mobile devices can be seen below:

[Mobile pictures](https://github.com/TheGuth/We-Choose-Where-to-Eat/tree/master/images/Mobile_pictures)

## Working Prototype

Pictures of the website can be seen below:

[Website pictures](https://github.com/TheGuth/We-Choose-Where-to-Eat/tree/master/images/Website_pictures)

You can access a working prototype of the app here:

[Cuisine Quest](https://theguth.github.io/We-Choose-Where-to-Eat/)

##Functionality
The app's functionality includes:

* Grabs and displays restaurants from user entered location and style preferences.
* Lists 6 restaurants at a time displaying rating, review snipped, and name.
* Allows for the user to randomly select a restaurant.
* When a user selects or has a restaurant randomly assigned to them, they will be displayed with a phone number and address.

##Technical

The app is built Using jQuery, HTML, and CSS and makes use of AJAX calls to *Yelp*'s Open Platform API to return the data. All data is held in memory during the user's session. It has been built to be fully responsive across mobile, tablet and desktop screen resolutions.

##Development Roadmap

this is v1.0 of the app, but future enhancements are expected to include:

###Features to Implement

* Add website url if available
* add pointer to cursor when going over result item.
* add stars * to ratings
* location validation
* Fix next and prev where you start at the bottom of the screen when the list loads.
* Add Restaurants website URL
* General css/cleaning up code/app
* update html code to use template string in app.js
* dont' have code lines longer than 80 characters


###Completed

* create wider search parameter for random function (currently only grabbing from 6 results)
* Add a choose again button on final page and fix js for it
* Add mobile break points for css
* Add css to buttons to make them look like they click
* Add media queries
* comment code base
* make address and phone clickable.
* Style of food filter to work with AJAX request
* Get offset to work with AJAX request       
* Condense results page to 6 results
* add synopsis to each restaurant on results page
* Add functionality to next and prev buttons on results page


###Future developments:

* fixed delay from ajax call
* google map api to show result.
* Remember Location (cookie used to record user location for future use);
* optional parameters (radius_filter up to 25 miles) & (deals_filter switch boolean on whether to exclusively look for businesses with deals or not)
* optional parameters (sort mode: 0=Best(default), 1=Distance, 2=Highest Rated)






