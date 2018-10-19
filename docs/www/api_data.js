define({ "api": [
  {
    "type": "post",
    "url": "/widget/guildwars2/wallet/:id",
    "title": "Get data from an guildwars2 currency",
    "name": "Gw2Item",
    "group": "Data",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of the currency</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "currency",
            "description": "<p>Currency informations</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "currency",
            "description": "<p>Currency informations</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes/api.js",
    "groupTitle": "Data"
  },
  {
    "type": "post",
    "url": "/widget/guildwars2/delivery/:id",
    "title": "Get data from an guildwars2 item",
    "name": "Gw2Item",
    "group": "Data",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of the item</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "item",
            "description": "<p>Item informations</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "item",
            "description": "<p>Item informations</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes/api.js",
    "groupTitle": "Data"
  },
  {
    "type": "post",
    "url": "/widget/guildwars2/delivery/:id/prices",
    "title": "Get the price of an guildwars2 item",
    "name": "Gw2Prices",
    "group": "Data",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of the item</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "item",
            "description": "<p>Item prices</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "item",
            "description": "<p>Item prices</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes/api.js",
    "groupTitle": "Data"
  },
  {
    "type": "get",
    "url": "/about.json",
    "title": "Request information about the server",
    "name": "Dashboard",
    "group": "Server",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "server",
            "description": "<p>Information about the server</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "client",
            "description": "<p>Information about the client</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes/api.js",
    "groupTitle": "Server"
  },
  {
    "type": "post",
    "url": "/signin",
    "title": "Login to a user",
    "name": "Signin",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of the User.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>True if the request is valid and saved</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>A token specific to the user</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>False if the request isn't valid and saved</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes/api.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/signup",
    "title": "Create a new user",
    "name": "Signup",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of the User.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>True if the request is valid and saved</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>False if the request isn't valid and saved</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes/api.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/widget/:id/data",
    "title": "Edit the widget with the id :id",
    "name": "Data",
    "group": "Widget",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of a widget</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>The data from the api_url of the models</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>The data from the api_url of the models</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes/api.js",
    "groupTitle": "Widget"
  },
  {
    "type": "delete",
    "url": "/widget/:id",
    "title": "Delete the widget with the id :id",
    "name": "Delete_by_id",
    "group": "Widget",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of a widget</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>True if the request is valid and saved</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes/api.js",
    "groupTitle": "Widget"
  },
  {
    "type": "put",
    "url": "/widget/:id",
    "title": "Edit the widget with the id :id",
    "name": "Edit_by_id",
    "group": "Widget",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of a widget</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>The new body of the widget</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>True if the request is valid and saved</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes/api.js",
    "groupTitle": "Widget"
  },
  {
    "type": "get",
    "url": "/widget",
    "title": "List all of the user's widget",
    "name": "Get_all",
    "group": "Widget",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>An array of all your widget</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>False if the request isn't valid and saved</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes/api.js",
    "groupTitle": "Widget"
  },
  {
    "type": "get",
    "url": "/widget/:id",
    "title": "Get the widget with the id :id",
    "name": "Get_by_id",
    "group": "Widget",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of a widget</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "widget",
            "description": "<p>The widget with the id</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>False if the request isn't valid and saved</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes/api.js",
    "groupTitle": "Widget"
  },
  {
    "type": "post",
    "url": "/widget/guildwars2/delivery",
    "title": "Create a new Gw2Delivery widget",
    "name": "Gw2Delivery",
    "group": "Widget",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "api_key",
            "description": "<p>Api Key from where to get informations</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "refresh",
            "description": "<p>Refresh timer in seconds</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>True if the request is valid and saved</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>False if the request isn't valid and saved</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes/api.js",
    "groupTitle": "Widget"
  },
  {
    "type": "post",
    "url": "/widget/guildwars2/gems",
    "title": "Create a new Gw2Gems widget",
    "name": "Gw2Gems",
    "group": "Widget",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gems_or_coins",
            "description": "<p>Which way the exchange is taken</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "refresh",
            "description": "<p>Refresh timer in seconds</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>True if the request is valid and saved</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>False if the request isn't valid and saved</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes/api.js",
    "groupTitle": "Widget"
  },
  {
    "type": "post",
    "url": "/widget/guildwars2/wallet",
    "title": "Create a new Gw2Wallet widget",
    "name": "Gw2Wallet",
    "group": "Widget",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "api_key",
            "description": "<p>Api Key from where to get informations</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "refresh",
            "description": "<p>Refresh timer in seconds</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>True if the request is valid and saved</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>False if the request isn't valid and saved</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes/api.js",
    "groupTitle": "Widget"
  },
  {
    "type": "post",
    "url": "/widget/hogwarts",
    "title": "Create a new Hogwarts widget",
    "name": "Hogwarts",
    "group": "Widget",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "city",
            "description": "<p>From where you want the point to be retrieved</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "refresh",
            "description": "<p>Refresh timer in seconds</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>True if the request is valid and saved</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>False if the request isn't valid and saved</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes/api.js",
    "groupTitle": "Widget"
  },
  {
    "type": "post",
    "url": "/widget/news",
    "title": "Create a new Movies widget",
    "name": "Movies",
    "group": "Widget",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sort",
            "description": "<p>now_playing or upcomming</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "refresh",
            "description": "<p>Refresh timer in seconds</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>True if the request is valid and saved</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>False if the request isn't valid and saved</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes/api.js",
    "groupTitle": "Widget"
  },
  {
    "type": "post",
    "url": "/widget/news",
    "title": "Create a new News widget",
    "name": "News",
    "group": "Widget",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "keyword",
            "description": "<p>Keyword of the articles wanted</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "refresh",
            "description": "<p>Refresh timer in seconds</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>True if the request is valid and saved</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>False if the request isn't valid and saved</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes/api.js",
    "groupTitle": "Widget"
  },
  {
    "type": "post",
    "url": "/widget/reddit",
    "title": "Create a new Reddit widget",
    "name": "Reddit",
    "group": "Widget",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "subreddit",
            "description": "<p>Which subreddit to retrieve data from</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "refresh",
            "description": "<p>Refresh timer in seconds</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>True if the request is valid and saved</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>False if the request isn't valid and saved</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes/api.js",
    "groupTitle": "Widget"
  },
  {
    "type": "post",
    "url": "/widget/weather",
    "title": "Create a new Weather widget",
    "name": "Weather",
    "group": "Widget",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "city",
            "description": "<p>where to take weather informations</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "refresh",
            "description": "<p>Refresh timer in seconds</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>True if the request is valid and saved</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>False if the request isn't valid and saved</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes/api.js",
    "groupTitle": "Widget"
  },
  {
    "type": "post",
    "url": "/widget/youtube/channel",
    "title": "Create a new youtube channel widget",
    "name": "YoutubeChannel",
    "group": "Widget",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "youtube_name",
            "description": "<p>Name of a youtube channel</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "refresh",
            "description": "<p>Refresh timer in seconds</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>True if the request is valid and saved</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>False if the request isn't valid and saved</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes/api.js",
    "groupTitle": "Widget"
  },
  {
    "type": "post",
    "url": "/widget/youtube/video",
    "title": "Create a new youtube video widget",
    "name": "YoutubeVideo",
    "group": "Widget",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "youtube_name",
            "description": "<p>Name of a youtube channel</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "refresh",
            "description": "<p>Refresh timer in seconds</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>True if the request is valid and saved</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>False if the request isn't valid and saved</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Message that describe handling of the request</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes/api.js",
    "groupTitle": "Widget"
  }
] });
