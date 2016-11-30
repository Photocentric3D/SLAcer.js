

// Utils
function findPythagoreanC(a, b) {
	return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

function setPrinterCalibrationSettings(printer) {
	var slicingProfile = printer.configuration.slicingProfile;
	var monitorDriverConfig = printer.configuration.machineConfig.MonitorDriverConfig;
	var dotsPermmX = slicingProfile.DotsPermmX;
	var dotsPermmY = slicingProfile.DotsPermmY;
	var dotsPermmXYAverage = (dotsPermmX + dotsPermmY) / 2;
	// Uncomment when not in testing anymore
	// if (Math.abs(dotsPermmX - dotsPermmY) >= 0.1) {
	// 	return true;
	// }
	var buildVolXmm = Math.round(slicingProfile.XResolution / dotsPermmX);
	var buildVolYmm = Math.round(slicingProfile.YResolution / dotsPermmY);
	var diagonalMM = Math.round(findPythagoreanC(buildVolXmm, buildVolYmm));

	$slicerSpeedYes[0].checked = true;
	$slicerSpeedNo[0].checked = false;
	$slicerSpeedDelay.val(0);
	// Convert mm to microns
	$slicerLayerHeight.val(slicingProfile.InkConfig[slicingProfile.selectedInkConfigIndex].SliceHeight * 1000);

    settings.set('slicer.speed', $slicerSpeedYes[0].checked);
    settings.set('slicer.speedDelay', $slicerSpeedDelay.val());
    settings.set('slicer.layers.height', $slicerLayerHeight.val());
	
    $buildVolumeX.val(buildVolXmm);
    $buildVolumeY.val(buildVolYmm);
    $buildVolumeZ.val(printer.configuration.machineConfig.PlatformZSize);
    updateBuildVolumeSettings();
	
	var unit = settings.get('screen.diagonal.unit')
	var convert = unit == 'in';
	
	$screenDiagonalSize.val(convert ? parseUnit(diagonalMM, unit) : diagonalMM);
	$screenWidth.val(slicingProfile.XResolution);
	$screenHeight.val(slicingProfile.YResolution);
	updateScreenSettings();
	if (convert) {
		$('#screen-diagonal-unit-in').prop('checked', false);
		$('#screen-diagonal-unit-mm').prop('checked', true);
		updateScreenSettings();		
	}

	// No error occurred so return false
	return false;
}

// Initialize values
function initializeValues() {
	// Photonic3D Modifications and Features to SLAcer
	// Photocentric add on
 	$('.verbergen').hide(1);

	var btn	= document.getElementById("print-button");
	btn.onclick= function(){makeZip(printZip);};

	btn	= document.getElementById("print-button");
	btn.onclick= function(){makeZip(saveZip);};

	// settings.set('#slicer.panel.collapsed', true);
	// $slicerBody.collapse('hide');

	var XYerr = false;
	$.get( "/services/printers/getFirstAvailablePrinter", function( data ) {
		if (data !== null && data !== undefined) {
			XYerr = setPrinterCalibrationSettings(data);
		}
	}).fail(function (data) {
		alert("Error: "+ data.responseText);
	});

	if (XYerr) {
		// Error handling
		alert("Your DotsPermmX and DotsPermmY are more than 0.1 mm apart");
	}

}

function makeZip(action) {
	$('#uploadzip-icon').prop('class', 'glyphicon glyphicon-refresh glyphicon-spin');
	if (zipFile === null || zipFile === undefined) {
		alert("You must first slice images to generate a zip file.");
	} else {
        var name = 'SLAcer';
        if (loadedFile && loadedFile.name) {
            name = loadedFile.name;
        }
        action(zipFile.generate({type: 'blob'}), name + '.zip');
    }
}

function printZip(zipFile, fileName) {
	var blob = zipFile;
    form = new FormData();
	form.append("file",blob,fileName);
	request = new XMLHttpRequest();
	request.open("POST", "/services/printables/uploadPrintableFile");
	// When the request is successfully sent, alert the user
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == 200) {
			// window.open('/printablesPage', '_self');
			$('#uploadzip-icon').prop('class', 'glyphicon glyphicon-upload');
			$.post("/services/printables/print/"+fileName, function(data){
				alert(fileName+" is now printing!");
			});
		}
	}
    request.send(form);
}

function saveZip(zipFile, fileName) {
	var blob = zipFile;
    form = new FormData();
	form.append("file",blob,fileName);
	request = new XMLHttpRequest();
	request.open("POST", "/services/printables/uploadPrintableFile");
	// When the request is successfully sent, alert the user
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == 200) {
			// window.open('/printablesPage', '_self');
			$('#uploadzip-icon').prop('class', 'glyphicon glyphicon-upload');
			alert("Saved! View the sliced file on the 'printables' page.");
		}
	}
    request.send(form);
}


var oldEndSlicing = endSlicing;

endSlicing = function() {
	oldEndSlicing();
	$('#print-button').prop('disabled', !zipFile);
	$('#upload-button').prop('disabled', !zipFile);
}

$(document).ready(initializeValues);

