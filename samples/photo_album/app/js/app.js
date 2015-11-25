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
      scope: { title:'@', maxClientWidth:'@', maxClientHeight:'@' },
      controller: ['$scope', '$rootScope', '$routeParams', '$location',
        /* Uploading with jQuery File Upload */
        function($scope, $rootScope, $routeParams, $location) {
          $scope.files = {};
          $scope.widget = $(".cloudinary_fileupload")
            .unsigned_cloudinary_upload($.cloudinary.config().upload_preset, {tags: '', context:'photo='}, {
              // Uncomment the following lines to enable client side image resizing and validation.
              // Make sure cloudinary/processing is included the js file
              disableImageResize: false,
              imageMaxWidth: $scope.maxClientWidth,
              imageMaxHeight: $scope.maxClientHeight,
              acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|ico)$/i,
              maxFileSize: 20000000, // 20MB
              dropZone: "#direct_upload_jquery",
              start: function (e) {
                $scope.status = "Starting upload...";
                $scope.files = {};
                $scope.$apply();
              },
              fail: function (e, data) {
                $scope.status = "Upload failed";
                $scope.$apply();
              }
            })
            .on("cloudinaryprogress", function (e, data) {
              var name = data.files[0].name;
              var file = $scope.files[name] || {};
              file.progress = Math.round((data.loaded * 100.0) / data.total);
              file.status = "Uploading... " + file.progress + "%";
              $scope.files[name] = file;
              $scope.$apply();
              })
            .on("cloudinaryprogressall", function (e, data) {
              $scope.progress = Math.round((data.loaded * 100.0) / data.total);
              $scope.status = "Uploading... " + $scope.progress + "%";
              $scope.$apply();
            })
            .on("cloudinarydone", function (e, data) {
              $rootScope.photos = $rootScope.photos || [];
              data.result.context = {custom: {photo: $scope.title}};
              $scope.result = data.result;
              var name = data.files[0].name;
              var file = $scope.files[name] ||{};
              file.name = name;
              file.url = data.result.url;
              file.result = data.result;
              $scope.files[name] = file;
              $rootScope.photos.push(data.result);
              $scope.$apply();
            }).on("cloudinaryfail", function(e, data){
                var file = $scope.files[name] ||{};
                file.name = name;
                file.result = data.result;
                $scope.files[name] = file;
      
              });
        }],
      template : "<div id='direct_upload_jquery' ng-model='files'>" + 
                  "<form>" + 
                    "<div class='form_line'>" +
                      "<div class='form_controls'>" + 
                        "<div class='upload_button_holder'>" + 
                          "<a href='#' class='upload_button'>Upload</a>" + 
                          "<input type='file' name='file' class='cloudinary_fileupload' multiple ng-model='$parent.files'>" + 
                        "</div>" +
                      "</div>" + 
                    "</div>" +
                  "</form>" +
                  "<div class='file' ng-repeat='file in files'>" +
                    "<div ng-show='!file.name'>" + 
                      "<div class='status'>{{file.status}}</div>" + 
                      "<div class='progress-bar'>" + 
                        "<div class='progress' style='width: {{file.progress}}%' ng-init='progress=0'></div>" + 
                      "</div>" + 
                    "</div>" + 
                    "<div class='form_line'>" + 
                      "<div class='form_controls'>" + 
                        "<div class='preview'>" + 
                          "<img src='{{file.url}}' alt='' />" + 
                        "</div>" +
                      "</div>" + 
                    "</div>" +
                  "</div>" +
                  "</div>"
    };
  }]);