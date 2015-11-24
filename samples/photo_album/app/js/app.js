'use strict';

/* App Module */
var photoAlbumApp = angular.module('photoAlbumApp', [
  'ngRoute',
  'cloudinary',
  'photoAlbumAnimations',
  'photoAlbumControllers',
  'photoAlbumServices'
]);

photoAlbumApp.config(['$routeProvider',
  function($routeProvider) {    
    $routeProvider.
      when('/photos', {
        templateUrl: 'partials/photo-list.html',
        resolve: {
          photoList: function($q, $rootScope, album) {
            if (!$rootScope.serviceCalled) {
              return album.photos({}, function(v){
                $rootScope.serviceCalled = true;
                $rootScope.photos = v.resources;
              });
            } else {
              return $q.when(true);
            }
          }
        }
      }).
      when('/photos/new', {
        templateUrl: 'partials/photo-upload.html',
        controller: 'photoUploadCtrl'
      }).
      when('/photos/new_jquery', {
        templateUrl: 'partials/photo-upload-jquery.html',
        controller: 'photoUploadCtrlJQuery'
      }).
      otherwise({
        redirectTo: '/photos'
      });
  }]);

  photoAlbumApp.directive('clientUpload', [function(){
    return {
      restrict : 'E',
      scope: { title:'@' },
      template : "<div id='direct_upload_jquery' ng-model='files'>" + 
                    "<h1>New Photo</h1>" + 
                    "<h2>Direct upload from the browser with jQuery File Upload</h2>" + 
                    "<p>You can also drag and drop an image file into the dashed area.</p>" + 
                    "<form>" + 
                    "<div class='form_line'>" + 
                    "<label path='title'>Title:</label>" + 
                    "<div class='form_controls'>" + 
                    "<input type='text' class='form-control' placeholder='Title' ng-model='title' ng-change='updateTitle()' />" + 
                    "</div>" + 
                    "</div>" +
                    "<div class='form_line'>" +
                    "<label>Image:</label>" + 
                    "<div class='form_controls'>" + 
                    "<div class='upload_button_holder'>" + 
                    "<a href='#' class='upload_button'>Upload</a>" + 
                    "<input type='file' name='file' class='cloudinary_fileupload' multiple ng-model='$parent.files'>" + 
                    "</div>" +
                    "</div>" + 
                    "</div>" +
                    "</form>" +
                    "<h2>Status</h2>" + 
                    "<div class='file' ng-repeat='file in files'>" +
                    "<h3>{{file.name}}</h3>" + 
                    "<div class='status'>{{file.status}}</div>" + 
                    "<div class='progress-bar'>" + 
                    "<div class='progress' style='width: {{file.progress}}%' ng-init='progress=0'></div>" + 
                    "</div>" + 
                    "<div class='form_line'>" + 
                    "<div class='form_controls'>" + 
                    "<div class='preview'></div>" +
                    "</div>" + 
                    "</div>" +
                    "<div class='info'>" +
                    "<table>" +
                    "<tr ng-repeat='(key, value) in file.result'>" +
                    "<td> {{key}} </td>" +
                    "<td> {{ value }} </td>" +
                    "</tr>" +
                    "</table>" +
                    "</div>" +
                    "</div>" +
                    "</div>"
    };
  }]);