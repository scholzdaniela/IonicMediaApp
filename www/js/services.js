angular.module('starter.services', [])

.constant("baseURL", "http://mediaapp-restserver.eu-gb.mybluemix.net/api/")
		//change base url also at mailfactory manually

.factory('AuthenticationService', ['$http', 'baseURL', '$rootScope', '$timeout', 'UserService', '$localStorage', function ($http, baseURL, $rootScope, $timeout, UserService, $localStorage) {
    var service = {};

    service.Login = Login;
    service.SetCredentials = SetCredentials;
    service.ClearCredentials = ClearCredentials;
    service.Logout = Logout;
    service.getUsername = getUsername;
    service.isAuthenticated = isAuthenticated;
    service.getUserId = getUserId;
    service.getStatus = getStatus;
    service.decode = decode;
    service.setAuthHeader = setAuthHeader;
    service.resetPassword = resetPassword;
    service.RefreshCredentials = RefreshCredentials;

    function Login(username, password, callback) {

        /* Dummy authentication for testing, uses $timeout to simulate api call
         ----------------------------------------------*/
        //$timeout(function () {
        //    var response;
        //    UserService.GetByUsername(username)
        //        .then(function (user) {
        //            if (user !== null && user.password === password) {
        //                response = { success: true };
        //            } else {
        //                response = { success: false, message: 'Username or password is incorrect' };
        //            }
        //            callback(response);
        //        });
        //}, 1000);

        /* Use this for real authentication
         ----------------------------------------------*/
        $http.post(baseURL + 'members/login', { username: username, password: password })
            .then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                response.success = true;
                callback(response);
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                response.success = false;
                callback(response);
            });

    }

    function SetCredentials(username, password, userid, authToken, firstname, lastname, email) {
        var authdata = Base64.encode(username + ':' + password);


        $rootScope.globals = {
            currentUser: {
                username: username,
                authdata: authdata,
                userid: userid,
                authToken: authToken,
                firstname: firstname,
                lastname: lastname,
                email: email,
                admin: false //to do: read from api
            }
        };

        $http.defaults.headers.common['x-access-token'] = authToken; // jshint ignore:line
        $localStorage.storeObject('globals', $rootScope.globals);
        //$cookieStore.put('globals', $rootScope.globals);
    }

    function RefreshCredentials(username, firstname, lastname, email) {
        var authdata = $rootScope.globals.currentUser.authdata;
        var userid = $rootScope.globals.currentUser.userid;
        var authToken = $rootScope.globals.currentUser.authToken;



        $rootScope.globals = {
            currentUser: {
                username: username,
                authdata: authdata,
                userid: userid,
                authToken: authToken,
                firstname: firstname,
                lastname: lastname,
                email: email,
                admin: false //to do: read from api
            }
        };

        $localStorage.storeObject('globals', $rootScope.globals);
        //$cookieStore.put('globals', $rootScope.globals);
    }

    function ClearCredentials() {
        $rootScope.globals = {};
        $localStorage.storeObject('globals', {});
        //$cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic';
    }

    function setAuthHeader(authToken) {
        $http.defaults.headers.common['x-access-token'] = authToken; // jshint ignore:line
    }


    //logout
    function Logout() {
        $http.post(baseURL + 'members/logout')
            .then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                ClearCredentials();

            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                //response.success = false;
                //callback(response);
            });
    }


    function getUsername() {
        return $rootScope.globals.currentUser.username;
    }

    function getUserId() {
        return $rootScope.globals.currentUser.userid;
    }

    function getStatus() {
        return $rootScope.globals.currentUser.admin;
    }

    function isAuthenticated() {
        if ($rootScope.globals == {}) {
            return false;
        } else {
            return true;
        }
    }

    function decode(string) {
        return Base64.decode(string);
    }

    function resetPassword() {
        $http.post(baseURL + 'members/reset')
            .then(function successCallback(response) {
                //todo
                //also todo on server side

            }, function errorCallback(response) {

            });
    }







    // Base64 encoding service used by AuthenticationService
    var Base64 = {

        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

    return service;

}])


.factory('UserService', ['$http', 'baseURL', '$rootScope', function ($http, baseURL, $rootScope) {
    var service = {};

    service.GetAll = GetAll;
    service.GetById = GetById;
    service.GetByUsername = GetByUsername;
    service.Create = Create;
    service.Update = Update;
    service.Delete = Delete;




    function GetAll() {
        return $http.get(baseURL + 'members').then(handleSuccess, handleError('Error getting all users'));
    }

    function GetById(id) {
        console.log($http.get(baseURL + 'members/' + id));
        return $http.get(baseURL + 'members/' + id).then(handleSuccess, handleError('Error getting user by id'));
    }

    function GetByUsername(username) {
        return $http.get(baseURL + 'members/' + username).then(handleSuccess, handleError('Error getting user by username'));
    }

    function Create(user) {
        return $http.post(baseURL + 'members', user).then(handleSuccess, handleError('Error creating user'));
    }

    function Update(user) {
        return $http.put(baseURL + 'members/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
    }

    function Delete(id) {
        return $http.delete(baseURL + 'members/' + id).then(handleSuccess, handleError('Error deleting user'));
    }

    // private functions

    function handleSuccess(res) {
        return res.data;
    }

    function handleError(error) {
        return function () {
            return { success: false, message: error };
        };
    }




    return service;

}])


    .factory('productFactory', ['$http', 'baseURL', function ($http, baseURL) {
        var productFactory = {};

        productFactory.getProducts = function () {
            return $http.get(baseURL + 'products');
        };

        productFactory.getProduct = function (id) {
            return $http.get(baseURL + 'products' + '/' + id);
        };

        productFactory.insertProduct = function (obj) {
            return $http.post(baseURL + 'products', obj);
        };

        productFactory.updateProduct = function (obj) {
            return $http.put(baseURL + 'products' + '/' + obj.id, obj);
        };

        productFactory.deleteProduct = function (id) {
            return $http.delete(baseURL + 'products' + '/' + id);
        };

        productFactory.getDocuments = function (id) {
            return $http.get(baseURL + 'products' + '/' + id + '/document');
        };

        productFactory.getPublications = function (id) {
            return $http.get(baseURL + 'products' + '/' + id + '/publication');
        };


        return productFactory;

    }])


    .factory('$localStorage', ['$window', function ($window) {
        return {
            store: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            remove: function (key) {
                $window.localStorage.removeItem(key);
            },
            storeObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key, defaultValue) {
                return JSON.parse($window.localStorage[key] || defaultValue);
            }
        }
    }])


    .factory('mailFactory', ['$http', 'baseURL', function ($http, baseURL) {
        var mailFactory = {};



        mailFactory.sendMail = function (options) {
            return $http.post('http://mediaapp-restserver.eu-gb.mybluemix.net/' + 'mail', options);
        };


        return mailFactory;

    }])


    	.factory('listFactory', ['$http', 'baseURL', function ($http, baseURL) {
    	    var listFactory = {};

    	    listFactory.getList = function (title, userid) {
    	        if (title == 'Notes') {
    	            console.log(title, userid);
    	            console.log($http.get(baseURL + 'members/' + userid + '/note'));
    	            return $http.get(baseURL + 'members/' + userid + '/note');
    	        } else if (title == 'Customers') {
    	            return $http.get(baseURL + 'members/' + userid + '/customer');
    	        } else if (title == 'Scribbles') {
    	            return $http.get(baseURL + 'members/' + userid + '/scribble');
    	        } else {
    	            throw {
    	                name: "ListFactoryException",
    	                message: "Something is wrong with the title",
    	            }
    	        }

    	    };


    	    return listFactory;

    	}])


    .factory('notesFactory', ['$http', 'baseURL', 'AuthenticationService', '$rootScope', function ($http, baseURL, AuthenticationService, $rootScope) {
        var notesFactory = {};

        var userId = $rootScope.globals.currentUser.userid;

        notesFactory.getNotes = function () {
            return $http.get(baseURL + 'members/' + userId + '/note');
        };

        notesFactory.getNote = function (id) {
            return $http.get(baseURL + 'members/' + userId + '/note/' + id);
        };

        notesFactory.insertNote = function (name, content) {
            console.log(baseURL + 'members/' + userId + '/note', { name: name, content: content });
            return $http.post(baseURL + 'members/' + userId + '/note', { name: name, content: content });
        };

        notesFactory.updateNote = function (name, content, id) {
            return $http.put(baseURL + 'members/' + userId + '/note/' + id, { name: name, content: content });
        };

        notesFactory.deleteNote = function (id) {
            return $http.delete(baseURL + 'members/' + userId + '/note' + '/' + id);
        };




        return notesFactory;

    }])

		.factory('customerFactory', ['$http', 'baseURL', 'AuthenticationService', '$rootScope', function ($http, baseURL, AuthenticationService, $rootScope) {
		    var customerFactory = {};

		    var userId = $rootScope.globals.currentUser.userid;

		    customerFactory.getCustomers = function () {
		        return $http.get(baseURL + 'members/' + userId + '/customer');
		    };

		    customerFactory.getCustomer = function (id) {
		        return $http.get(baseURL + 'members/' + userId + '/customer/' + id);
		    };

		    customerFactory.insertCustomer = function (obj) {
		        console.log(baseURL + 'members/' + userId + '/customer', obj);
		        return $http.post(baseURL + 'members/' + userId + '/customer', obj);
		    };

		    customerFactory.updateCustomer = function (obj, id) {
		        return $http.put(baseURL + 'members/' + userId + '/customer/' + id, obj);
		    };

		    customerFactory.deleteCustomer = function (id) {
		        return $http.delete(baseURL + 'members/' + userId + '/customer' + '/' + id);
		    };




		    return customerFactory;

		}])


		.factory('scribbleFactory', ['$http', 'baseURL', '$rootScope', function ($http, baseURL, $rootScope) {
		    var scribbleFactory = {};

		    var username = $rootScope.globals.currentUser.username;

		    scribbleFactory.uploadScribble = function (File) {
		        console.log(baseURL + 'docs/' + username + '/upload');
		        return $http.post(baseURL + 'docs/' + username + '/upload', File, {
		            transformRequest: angular.identity,
		            headers: { 'Content-Type': undefined }
		        });
		    };

		    scribbleFactory.getScribbles = function () {
		        return $http.get(baseURL + 'docs/' + username + '/files');
		    };

		    scribbleFactory.getDownloadURL = function (filename) {
		        return baseURL + 'docs/' + username + '/download/' + filename + '?access_token=' + $rootScope.globals.currentUser.authToken;
		    };

		    scribbleFactory.deleteScribble = function (filename) {
		        return $http.delete(baseURL + 'docs/' + username + '/files/' + filename);
		    };

		    scribbleFactory.findScribbleContainerByUser = function () {
		        return $http.get(baseURL + 'docs/' + username);
		    };

		    scribbleFactory.createScribbleContainer = function () {
		        return $http.post(baseURL + 'docs', { name: username });
		    };



		    return scribbleFactory;

		}])


    .factory('calcFactory', ['$http', 'baseURL', function ($http, baseURL) {
        var calcFactory = {};
        //types
        calcFactory.getTypes = function () {
            return $http.get(baseURL + 'advertisementtypes');
        };

        calcFactory.getType = function (id) {
            return $http.get(baseURL + 'advertisementtypes' + '/' + id);
        };

        calcFactory.insertType = function (obj) {
            return $http.post(baseURL + 'advertisementtypes', obj);
        };

        calcFactory.updateType = function (obj) {
            return $http.put(baseURL + 'advertisementtypes' + '/' + obj.id, obj);
        };

        calcFactory.deleteType = function (id) {
            return $http.delete(baseURL + 'advertisementtypes' + '/' + id);
        };

        //color
        calcFactory.getColors = function () {
            return $http.get(baseURL + 'colors');
        };

        calcFactory.getColor = function (id) {
            return $http.get(baseURL + 'colors' + '/' + id);
        };

        calcFactory.insertColor = function (obj) {
            return $http.post(baseURL + 'colors', obj);
        };

        calcFactory.updateColor = function (obj) {
            return $http.put(baseURL + 'colors' + '/' + obj.id, obj);
        };

        calcFactory.deleteColor = function (id) {
            return $http.delete(baseURL + 'colors' + '/' + id);
        };

        //pricetypes
        calcFactory.getPricetypes = function () {
            return $http.get(baseURL + 'pricetypes');
        };

        calcFactory.getPricetype = function (id) {
            return $http.get(baseURL + 'pricetypes' + '/' + id);
        };

        calcFactory.insertPricetype = function (obj) {
            return $http.post(baseURL + 'pricetypes', obj);
        };

        calcFactory.updatePricetype = function (obj) {
            return $http.put(baseURL + 'pricetypes' + '/' + obj.id, obj);
        };

        calcFactory.deletePricetype = function (id) {
            return $http.delete(baseURL + 'pricetypes' + '/' + id);
        };

        //price not correct yet, and is missing
        calcFactory.getPrice = function (productId, publicationId, colorId, pricetypeId, advertisementtypeId) {
            return $http.get(baseURL + 'prices/' + '?filter[where][productId]=' + productId + '&filter[where][publicationId]=' + publicationId + '&filter[where][pricetypeId]=' + pricetypeId + '&filter[where][colorId]=' + colorId + '&filter[where][advertisementtypeId]=' + advertisementtypeId);
        };


        //todo
        calcFactory.insertPrice = function (obj) {
            return $http.post(baseURL + 'pricetypes', obj);
        };

        calcFactory.updatePrice = function (obj) {
            return $http.put(baseURL + 'pricetypes' + '/' + obj.id, obj);
        };

        calcFactory.deletePrice = function (id) {
            return $http.delete(baseURL + 'pricetypes' + '/' + id);
        };




        return calcFactory;

    }])



;
