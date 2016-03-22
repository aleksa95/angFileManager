(function(){

	var app = angular.module("fileManager", []);


	// main app controller
	app.controller("DataController", function($http, $scope) {

		// setting the defalut value of folder or file path to root
		$scope.folderPath = 'root/';
		$scope.filePath = 'root/';


		/*RETRIEVING ROOT*/
		$http.get('js/data/data.json').success(function(data){
				$scope.tree = data;
				$scope.tree.root = data.root;
		});


		/*ADD FOLDER*/
		$scope.addFolder = function (folderName, folderPath) {
			// converts path into object dot notation
			var path = folderPath.split("/").join('.').slice(0,(folderPath.lastIndexOf('.')));
			var fullStop = folderName.charAt(0);
			var newFolder = {
				"name":folderName,
				"folderPath":path,
				"children":[]
			}
			
			/*custom Folder name and path validation*/
			// alert if folder path does not end with a forward slash
			if ((folderPath.substring(folderPath.length-1)) !== '/') {
				$("input[name = 'folderPath']").css('border-color', 'red');
				$scope.folderPathErrorMsg = 'Folder path must end with a forward slash';
			// alert if folder name starts with a fullstop	
			} else if (fullStop === ".") {
				$("input[name = 'folderName']").css('border-color', 'red');
				$scope.folderNameErrorMsg = "Folder name can not start with a fullstop";
			//alert if parent folder does not exist				
			} else if ($scope.tree[path] === undefined) {
				$("input[name = 'folderPath']").css('border-color', 'red');
				$scope.folderPathErrorMsg = 'Parent folder does not exist';
			} else {
				// clear form
				$("input[name = 'folderName']").css('border-color', '#eee');
				$("input[name = 'folderPath']").css('border-color', '#eee');
				$scope.folderPathErrorMsg = '';
				$scope.folderNameErrorMsg = '';
				$scope.folderName = null;

				/////*DO OVDE DOSAO*//////
				$scope.tree[path].push(newFolder);
			}
			
		}


		/*ADD FILE*/
		$scope.addFile = function(fileName, filePath) {
			// converts path into object dot notation
			var path = filePath.split("/").join('.').slice(0,(filePath.lastIndexOf('.')));
			var newFile = {
				'fileName' : fileName,
				'filePath' : path						
			};
			
			var extension = ['php','js','css','html'];
			var fileNameExtension = fileName.substr(fileName.lastIndexOf('.') + 1);
			var fullStop = fileName.charAt(0);
			var correctExtension;

			// goes through correct extension and returns 
   			// true if the inputed extension is correct	
			for(var i = 0; i <  extension.length;i++) {
				if(fileNameExtension === extension[i]) {
						correctExtension = true;	 
				} 
			}

			/*custom validation*/
			// alert if extension is not supported	
			if (correctExtension !== true) {
				$scope.fileNameErrorMsg = "File extension is not supported";
				$("input[name = 'fileName']").css('border-color', 'red');
			// alert if file name starts with a fullstop	
			} else if (fullStop === '.') {
				$scope.fileNameErrorMsg = "File name can not start with a fullstop";
				$("input[name = 'fileName']").css('border-color', 'red');	
			// alert if file path does not end with a forward slash						
			} else if ((filePath.substring(filePath.length-1)) !== '/') {
				$("input[name = 'filePath']").css('border-color', 'red');
				$scope.filePathErrorMsg = 'File path must end with a forward slash';
			//alert if parent folder does not exist		
			} else if ($scope.tree[path] === undefined) {
				$("input[name = 'filePath']").css('border-color', 'red');
				$scope.filePathErrorMsg = 'Parent folder does not exist';
			} else {
				// adds new file
				$scope.tree.root.push(newFile);

				/////*DO OVDE DOSAO*//////

				// sorts the files alphabetically
				$scope.tree.root.sort(function(a, b){
    				if(a.fileName < b.fileName) return -1;
    				if(a.fileName > b.fileName) return 1;
    				return 0;
			 	});

			 	// form reset
				$("input[name = 'fileName']").css('border-color', '#ccc');
				$("input[name = 'filePath']").css('border-color', '#ccc');
				$scope.fileNameErrorMsg = "";
				$scope.filePathErrorMsg = "";
				$scope.fileName = null;
			}

		}


		/*DELETE FOLDERS*/
		$scope.delete = function(parent,data) {
			delete data.name;
			delete data.children;
			delete data.folderPath;
			delete parent.data.children;
    	};

    	/*DELETE FILES*/
    	$scope.deleteFile = function(parent,data) {
			delete data.fileName;
			delete data.filePath;
			delete parent.data;
    	};


   		/*EDIT FOLDER NAME*/
   		$scope.edit = function(data) {
   			var newFolderName = prompt("Type in a new folder name");

   			// folder name edit prompt validation
	   		var tester = function(newFolderName){
	   			var fullStop = newFolderName.charAt(0);	
	   			// if new name is empty, prompt again
	   			if(newFolderName === '') {
   					alert('you must type in a new name');
   					newFolderName = prompt("Type in a new folder name");
   					tester(newFolderName);
   				// if new name starts with a dot, prompt again
   				} else if(fullStop === '.'){
   					alert('File name can not start with a fullstop');
   					newFolderName = prompt("Type in a new folder name");
   					tester(newFolderName);
   				} else {
   					data.name = newFolderName;   					
   				}
	   		}
	   		tester(newFolderName);
   		}


   		/*EDIT FILE NAME*/
   		$scope.editFileName = function(data) {
   			var newFileName = prompt("Type in a new file name");
   			
   			// file name edit prompt validation
   			var tester = function(newFileName) {
   				var fullStop = newFileName.charAt(0);
   				var fileNameExtension = newFileName.substr(newFileName.lastIndexOf('.') + 1);
   				var extension = ['php','js','css','html'];
   				var correctExtension;

   				// goes through correct extension and returns 
   				// true if the extension in prompt is correct
   				for(var i = 0; i <  extension.length;i++) {
					if(fileNameExtension === extension[i]) {
							correctExtension = true;	 
					} 
				};
				
				// if new name is empty, prompt again
	   			if(newFileName === '') {
	   				alert('you must type in a new name');
	   				newFileName = prompt("Type in a new file name");
	   				tester(newFileName);
	   			// if new name starts with a dot, prompt again
	   			} else if(fullStop === '.'){
	   				alert('File name can not start with a fullstop');
	   				newFileName = prompt("Type in a new file name");
	   				tester(newFileName);
	   			// if new name has an extension other than the supported ones, prompt again	
	   			} else if(correctExtension !== true) {
	   				alert('File Name must end with .php, .js, .css or .html');
	   				newFileName = prompt("Type in a new file name");
	   				tester(newFileName);	   				
	   			} else {
	   				data.fileName = newFileName;
	   			}
   			}
   			tester(newFileName);	 
   		}
		

		/*TOGGLES TABS*/
		$scope.tab = 1;
		$scope.selectTab = function(setTab) {
			$scope.tab = setTab;
		}
		$scope.isSelected = function(currentTab) {
			return $scope.tab === currentTab;
		}

	});
		
})();