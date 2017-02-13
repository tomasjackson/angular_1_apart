'use strict';

/*---------------------------------------------------
*   Crop Image Controller
*   Here you can get the cropping image controller
----------------------------------------------------*/
angular.module('frontendApp')
  .controller('CropImageController', function (MediaStoryService , MediaService) {

  	var self = this;	//	Get instance
    self.currentImg = '';
    self.croppedImage = '';
  	var image = MediaStoryService.selected_Media;
    MediaService.Getbase64(image.id , function(response) {
        if (response) {
            self.currentImg = response;
        }
    });



	// function getBase64Image(img) {
	//   	var canvas = document.createElement("canvas");
	//   	canvas.width = img.width;
	//   	canvas.height = img.height;
	//   	var ctx = canvas.getContext("2d");
	//   	ctx.drawImage(img, 0, 0);
	//   	var dataURL = canvas.toDataURL("image/png");
	//   	return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
	// }

	// console.log(base64);
	// var reader = new FileReader();
	// reader.onload = function (e) {
	// 	console.log(e.target.result);	
	//     // MediaService.AddMediaFromDevice(e.target.result.substring(e.target.result.search('base64,') + 7 , e.target.result.length) , file.type , file.size , function(response){
	//     //     if (!response) {
	//     //     }   else    {
	//     //         self.added_media_count = MediaService.ImportMediaList.length;
	//     //         MediaService.ImportMediaBlobList.push(e.target.result);
	//     //     }
	//     // });

	// };
	// reader.readAsDataURL(image.path.original);


    /*--------------------------------
    *   Close modal dialog
    --------------------------------*/
    self.CloseModal = function() {
      ModalInstanceStore.crop_image_modal.close();
    }


});
