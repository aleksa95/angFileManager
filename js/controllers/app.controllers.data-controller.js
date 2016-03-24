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
			var pathFolders = folderPath.split('/'),
			    fullStop = folderName.charAt(0),
			    object = $scope.tree.root,
				isThereFolder,
				depth,
				newFolder = {
					"name" : folderName,
					"parent" : parent,
					"path" : folderPath,
					"depth": depth,
					"children" : []			
				};



			// goes through tree and checks if the folder we are trying to reach exists
			function searhForFolder(obj, pathFolder, depth) {
				for (item in obj) {						
					if (pathFolder === obj[item].name && obj[item].depth == pathFolders.length) {		
							console.log("the folder "+ obj[item].name + " was found in " + obj[item].parent + " and the depth is " + obj[item].depth);
							result.push(true);
					} else {
						searhForFolder(obj[item].children, pathFolder, depth);
					}
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
				newFolder.depth = 1;					
				$scope.tree.root.push(newFolder);
				clearForm();

			// deletes the last forward slash from pathFolders array
			// makes the last folder of folderPath the parrent							
			} else if (pathFolders[pathFolders.length - 1] === '') {				
 				pathFolders.pop();
 				pathFolders.shift(); 
 				newFolder.depth = pathFolders.length;
				newFolder.parent = pathFolders[pathFolders.length-1];			
				var result = [];
								
				// checks if Folder Path input is true
				for(var i = 0; i< pathFolders.length; i++){
					searhForFolder(object, pathFolders[i], pathFolders[pathFolders.length-2]);
				}

				// error if Folder Path input is false
				if (result[0] !== true) {				
					$("input[name = 'folderPath']").css('border-color', 'red');
					$scope.folderPathErrorMsg = 'Folder path is incorrect';

				// pushes new folder to folder specified in root Folder	
				} else {

					//FUNCTION THAT PUSHES THE NEW FOLDER INTO EXISTING FOLDER -UNKNOWN
					console.log("PUSH FOLDER");
					clearForm();			
				}			
			}				
		}
		/*ADD FOLDER END*/


		/*ADD FILE*/
		$scope.addFile = function(fileName, filePath) {
			var pathFolders = filePath.split('/'),
			    fullStop = fileName.charAt(0),
			    object = $scope.tree.root,
				isThereFolder,
				depth,
				correctExtension,
				filePath,
				newFile = {
					'fileName' : fileName,
					'parent' : parent,
					'path' : filePath,
					'depth'	: depth,
					'path' : filePath					
				},
				extension = ['php','js','css','html'],
				fileNameExtension = fileName.substr(fileName.lastIndexOf('.') + 1);

			// goes through tree and checks if the folder we are trying to reach exists
			function searhForFolder(obj, pathFolder, depth) {
				for (item in obj) {						
					if (pathFolder === obj[item].name && obj[item].depth == pathFolders.length) {		
							console.log("the folder "+ obj[item].name + " was found in " + obj[item].parent + " and the depth is " + obj[item].depth);
							result.push(true);
					} else {
						searhForFolder(obj[item].children, pathFolder, depth);
					}
				}
			}	

			function clearForm() {
				$("input[name = 'fileName']").css('border-color', '#ccc');
				$("input[name = 'filePath']").css('border-color', '#ccc');
				$scope.fileNameErrorMsg = "";
				$scope.filePathErrorMsg = "";
				$scope.fileName = null;				
			}

			// sorts files in the folder where the file is made
			function sort() {
				
			}


			// goes through correct extension and returns 
   			// true if the inputed extension is correct	
			for(var i = 0; i <  extension.length;i++) {
				if(fileNameExtension === extension[i]) {
						correctExtension = true;	 
				} 
			}


			/*CUSTOM FORM VALIDATION*/
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
			} else if (filePath === 'root/') {
				newFile.path = filePath;
				newFile.parent = "root";
				newFile.depth = 1;					
				$scope.tree.root.push(newFile);
				clearForm();

				// sorts files in root
				$scope.tree.root.sort(function(a, b){
    				if(a.fileName < b.fileName) return -1;
    				if(a.fileName > b.fileName) return 1;
    				return 0;
			 	});

			// deletes the last forward slash from pathFolders array
			// makes the last folder of folderPath the parrent					 					
			} else if (pathFolders[pathFolders.length - 1] === '') {
 				pathFolders.pop();
 				pathFolders.shift(); 
 				newFile.depth = pathFolders.length;
				newFile.parent = pathFolders[pathFolders.length-1];			
				var result = [];
								
				// checks if File Path input is true
				for(var i = 0; i< pathFolders.length; i++){
					searhForFolder(object, pathFolders[i], pathFolders[pathFolders.length-2]);
				}

				// error if Folder Path input is false
				if (result[0] !== true) {				
					$("input[name = 'folderPath']").css('border-color', 'red');
					$scope.filePathErrorMsg = 'Folder path is incorrect';

				// pushes new folder to folder specified in root Folder	
				} else {
					//FUNCTION THAT PUSHES THE NEW File INTO EXISTING FOLDER -UNKNOWN
					console.log("PUSH File");
					clearForm();				
				}				

			}

		}


		/*DELETE FOLDERS*/
		$scope.delete = function(parent,data) {
			delete data.name;
			delete data.parent;		
			delete data.path;
			delete data.depth;			
			delete parent.data.children;
			delete parent.data;
    	};


    	/*DELETE FILES*/
    	$scope.deleteFile = function(parent,data) {
			delete data.fileName;
			delete data.filePath;
			delete parent.data;
			delete data.path;
			delete data.depth;
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
	