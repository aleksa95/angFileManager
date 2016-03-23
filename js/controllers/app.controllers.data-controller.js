angular.module('app.controllders.dataController',[]).controller("DataController", function($http, $scope) {

		// setting the defalut value of folder or file path to root
		$scope.currentPath = 'root/';
		$scope.filePath = 'root/';
		$scope.folderPath = 'root/';



		/*RETRIEVING ROOT*/
		$http.get('js/data/data.json').success(function(data){
				$scope.tree = data;
				$scope.tree.root = data.root;
		});


		/*ADD FOLDER*/
		$scope.addFolder = function (folderName, folderPath) {

			// converts path into object dot notation
			var path = folderPath.split("/").join('.').slice(0,(folderPath.lastIndexOf('.')));
			var pathItems = folderPath.split('/');
			var rootLentgth = $scope.tree.root.length;
			var fullStop = folderName.charAt(0);
			var newFolder = {
				"name" : folderName,
				"parent" : parent,
				"path" : folderPath,
				"children" : []				
			}
			var object = $scope.tree.root;
			var isThereFolder;


			
			

			/*CUSTOM FORM VALIDATION*/
			// alert if folder name starts with a fullstop	
			if (fullStop === ".") {
				$("input[name = 'folderName']").css('border-color', 'red');
				$scope.folderNameErrorMsg = "Folder name can not start with a fullstop";

			// alert if folder path does not end with a forward slash
			} else if ((folderPath.substring(folderPath.length-1)) !== '/') {
				$("input[name = 'folderPath']").css('border-color', 'red');
				$scope.folderPathErrorMsg = 'Folder path must end with a forward slash';

			// when Folder Path is defalut generates folder in root						
			} else if (folderPath === 'root/') {
				newFolder.path = folderPath;
				newFolder.parent = "root";					
				$scope.tree.root.push(newFolder);
				clearForm();

			// deletes the last forward slash from pathItems array
			// makes the last folder of folderPath the parrent							
			} else if (pathItems[pathItems.length - 1] === '') {				
 				pathItems.pop();
				newFolder.parent = pathItems[pathItems.length-1];
				var parent = newFolder.parent;				
				console.log('parent : ' + parent);

				// RECURSIVE FUNCTION THAT CHECKS WETHER THE LAST FOLDER 
				// IN FODLER PATH EXISTS (true or false)
				traverse(object, parent)
				// isThereFolder = recursive function result
				


				// error if there is no folder to put the new folder in
				if (isThereFolder === false) {				
					$("input[name = 'folderPath']").css('border-color', 'red');
					$scope.folderPathErrorMsg = 'Parent folder does not exist';

				// pushes new folder to folder specified in root Folder	
				} else  {

					//FUNCTION THAT PUSHES THE NEW FOLDER INTO EXISTING FOLDER -UNKNOWN

					clearForm();			
				}
			
			}
				// goes through tree and checks if the folder we are trying to reach exists
				// NOT WORKING
				// can not get function to return a value
				function traverse(jsonObj, parent) {
				    if( typeof jsonObj == "object" ) {
				        $.each(jsonObj, function(key,value) {
				            console.log(key + " : "+value);
				            if(key === 'name' && value === parent) {
				            	console.log("exist");
				            	
				            } else if(key === 'name' && value !== parent) {
				            	console.log("a");
				            }
				            traverse(value, parent);
				        });
				    }
				}	
					

			// clears form
			function clearForm() {
					$("input[name = 'folderName']").css('border-color', '#eee');
					$("input[name = 'folderPath']").css('border-color', '#eee');
					$scope.folderPathErrorMsg = '';
					$scope.folderNameErrorMsg = '';
					$scope.folderName = null;				
			}		
		}
		/*ADD FOLDER END*/


		/*ADD FILE*/
		$scope.addFile = function(fileName, filePath) {
			// converts path into object dot notation
			var path = filePath.split("/").join('.').slice(0,(filePath.lastIndexOf('.')));
			var newFile = {
				'fileName' : fileName,
				'path' : 'root/' + filePath,						
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
			// alert if file name starts with a fullstop	
			if (fullStop === '.') {
				$scope.fileNameErrorMsg = "File name can not start with a fullstop";
				$("input[name = 'fileName']").css('border-color', 'red');
			// alert if extension is not supported	
			} else if (correctExtension !== true) {
				$scope.fileNameErrorMsg = "File extension is not supported";
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
		
		/*DISPLAYS PATH TO CURRENT FOLDER*/
		$scope.showPath= function(data) {
			$scope.currentPath = data.path;
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
	