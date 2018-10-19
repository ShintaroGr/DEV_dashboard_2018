

Dashboard EPITECH (*Web*)
=================

Just another web dashboard [(see demo)](http://dashboard.shintaro.ovh)

List of functionalities:
  * For youtube :
    * Show informations about a youtube channel (views, subscriber, videos)
    * Show last video of a youtube channel
  * For New York Times :
    * Show last articles about a keyword
  * For Reddit :
    * Show last reddit post on a specific subreddit
  * For OpenWeatherMap :
    * Show actual weather and others informations like wind speed
  * For Hogwarts
    * Show the scores of the house in the city choosen
  * For TheMovieDB :
    * Show the upcoming or now playing movies near you
  * For Guildwars2 :
    * Show the exchange rate of gems (buy/sells)
    * Show your wallet
    * Show your Black Lion delivery box

**Libraries**
-

* [VueJs](https://vuejs.org/)
* [VueX](https://vuex.vuejs.org/guide/)
* [Axios](https://github.com/axios/axios)
* [VueRouter](https://router.vuejs.org/)
* [VueDraggable](https://github.com/SortableJS/Vue.Draggable)
* [Quasar Framework](https://quasar-framework.org/)


**API** 
-

* [guilwars2.com](https://guildwars2.com) / [API](https://wiki.guildwars2.com/wiki/API:Main)
* [themoviedb.org](https://www.themoviedb.org/) / [API](https://www.themoviedb.org/documentation/api)
* [openweathermap.org](https://openweathermap.org) / [API](https://openweathermap.org/api)
* [reddit.com](https://www.reddit.com/) / [API](https://www.reddit.com/dev/api/)
* [youtube.com](https://www.youtube.com/) / [API](https://developers.google.com/youtube/)
* [hogwarts.epitest.eu](https://hogwarts.epitest.eu/) / 404 Not Found
* [nytimes.com](https://www.nytimes.com/) / [API](https://developer.nytimes.com/)


**Authors**
-------

**Thomas GRANDJEAN** /
thomas.grandjean@epitech.eu

**Benoît Hoffman** /
benoit.hoffman@epitech.eu


**Documentation**
-------


###Create widget

#####How to create new widget (BackEnd):
  1. Create your new model in **_/api/models_** by following the **_example.js_**
  2. Add a new route in **_/api/routes/api_** for your newly created model:
  3. Don't forget to add your widget to the **_about.json_** in **_/api/routes_**
  4. And you're done for the backend of the widget
  
#####How to create new widget (FrontEnd):
  1. Create your new component in **_/web/dashboard/components_** by following the **_example.vue_**
  2. Import your component in **_/web/dashboard/pages/Index.vue_**:
  3. And you're done creating your very own widget
  
