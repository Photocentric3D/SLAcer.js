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
	var dotsPermmDiagonal = findPythagoreanC(dotsPermmXYAverage, dotsPermmXYAverage);
	var diagonalNumPixels = findPythagoreanC(monitorDriverConfig.DLP_X_Res, monitorDriverConfig.DLP_Y_Res);
	var diagonalMM = Math.round(diagonalNumPixels / dotsPermmDiagonal);
	var buildVolXmm = Math.round(monitorDriverConfig.DLP_X_Res / dotsPermmXYAverage);
	var buildVolYmm = Math.round(monitorDriverConfig.DLP_Y_Res / dotsPermmXYAverage);

    /* This is part of updateBuildVolumeSettings() from main.js. I only copied
    the necessary code that won't result in geometry error */
    settings.set('buildVolume', {
        size: {
            x: buildVolXmm,
            y: buildVolYmm,
            z: $buildVolumeZ.val()
        },
        unit: 'mm'
    });
    viewer3d.setBuildVolume(settings.get('buildVolume'));
    viewer3d.render();
    updateBuildVolumeUI();


	$('#screen-diagonal-unit-in').prop('checked', false);
	$('#screen-diagonal-unit-mm').prop('checked', true);
	
	// After manually checking the mm unit, set the values then update UI
 //    settings.set('screen', {
 //        width   : $screenWidth.val(),
 //        height  : $screenHeight.val(),
 //        diagonal: {
 //            size: diagonalMM,
 //            unit: 'mm'
 //        }
 //    });
	// updateScreenUI();

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
}

$(document).ready(initializeValues);

