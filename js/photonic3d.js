// Photonic3D Modifications and Features to SLAcer

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
	// if (Math.abs(dotsPermmX - dotsPermmY) >= 0.1) {
	// 	return true;
	// }
	var buildVolXmm = Math.round(monitorDriverConfig.DLP_X_Res / dotsPermmXYAverage);
	var buildVolYmm = Math.round(monitorDriverConfig.DLP_Y_Res / dotsPermmXYAverage);
	var diagonalMM = Math.round(findPythagoreanC(buildVolXmm, buildVolYmm));

    /* This is part of updateBuildVolumeSettings() from main.js. I only copied
    the necessary code that won't result in geometry error */
    $buildVolumeX.val(buildVolXmm);
    $buildVolumeY.val(buildVolYmm);
    $buildVolumeZ.val(printer.configuration.machineConfig.PlatformZSize);
    updateBuildVolumeSettings();


	$('#screen-diagonal-unit-in').prop('checked', false);
	$('#screen-diagonal-unit-mm').prop('checked', true);
	
	// After manually checking the mm unit, set the values then update UI
	$screenDiagonalSize.val(diagonalMM);
	updateScreenSettings();

	// No error occurred so return false
	return false;
}

// Initialize values
function initializeValues() {
	$slicerSpeedYes[0].checked = true;
	$slicerSpeedNo[0].checked = false;
	$slicerSpeedDelay.val(0);
	makeButton();

	// Update global javascript object with slicer settings
    settings.set('slicer.speed', $slicerSpeedYes[0].checked);
    settings.set('slicer.speedDelay', $slicerSpeedDelay.val());
	
	settings.set('#slicer.panel.collapsed', true);
	$slicerBody.collapse('hide');

	var XYerr = false;
	var printer = $.get( "/services/printers/getFirstAvailablePrinter", function( data ) {
		if (data !== null && data !== undefined) {
			XYerr = setPrinterCalibrationSettings(data);
		}
	});

	if (XYerr) {
		// Error handling
	}

	

	// loader.load(/*insert file here*/);
}

function makeZip() {
	if (zipFile) {
        var name = 'SLAcer';
        if (loadedFile && loadedFile.name) {
            name = loadedFile.name;
        }
        uploadZip(zipFile.generate({type: 'blob'}), name + '.zip');
        //window.location = "/printablesPage";
    }
}

function uploadZip(zipFile, fileName) {
	var blob = zipFile;
    form = new FormData();
	form.append("file",blob,fileName);
	request = new XMLHttpRequest();
	request.open("POST", "/services/printables/uploadPrintableFile");
	request.send(form);
}

function makeButton() {
	//rename original zip button
	var btn	= document.getElementById("zip-button");
	btn.innerHTML = "Download Zip";	
	//create new zip button
	var newbtn = document.createElement("BUTTON");
	newbtn.onclick = function () {
	    makeZip();
	}
	newbtn.id = "new-zip-button";
	newbtn.className = "btn btn-primary";
	newbtn.innerHTML = "Upload ZIP To Printables";
	btn.parentNode.insertBefore(newbtn, btn);
}

$(document).ready(initializeValues);

