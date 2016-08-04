// Photonic3D Modifications and Features to SLAcer

// Utils
function findPythagoreanC(a, b) {
	return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

function setPrinterCallibrationSettings(printer) {
	// console.log(printer);
	var slicingProfile = printer.configuration.slicingProfile;
	var monitorDriverConfig = printer.configuration.machineConfig.MonitorDriverConfig;
	var dotsPermmX = slicingProfile.DotsPermmX;
	var dotsPermmY = slicingProfile.DotsPermmY;
	var dotsPermmXYAverage = (dotsPermmX + dotsPermmY) / 2;
	if (Math.abs(dotsPermmX - dotsrPermmY) >= 0.1) {
		return true;
	}
	var dotsPermmDiagonal = findPythagoreanC(dotsPermmXYAverage, dotsPermmXYAverage);
	var diagonalNumPixels = findPythagoreanC(monitorDriverConfig.DLP_X_Res, monitorDriverConfig.DLP_Y_Res);
	var diagonalMM = diagonalNumPixels / dotsPermmDiagonal;
	var buildVolXmm = Math.round(monitorDriverConfig.DLP_X_Res / dotsPermmXYAverage);
	var buildVolYmm = Math.round(monitorDriverConfig.DLP_Y_Res / dotsPermmXYAverage);

	// $buildVolumeX.val(buildVolXmm);
	// $buildVolumeY.val(buildVolYmm);
	// updateBuildVolumeSettings();
    
    /* This is part of updateBuildVolumeSettings() from main.js. I only copied
    the necessary code that won't result in geometry error */
    var unit = $('#build-volume input[type=radio]:checked').val();

    settings.set('buildVolume', {
        size: {
            x: buildVolXmm,
            y: buildVolYmm,
            z: $buildVolumeZ.val()
        },
        unit: unit
    });
    viewer3d.setBuildVolume(settings.get('buildVolume'));
    updateBuildVolumeUI();


	$('#screen-diagonal-unit-in').prop('checked', false);
	$('#screen-diagonal-unit-mm').prop('checked', true);
	$screenDiagonalSize.val(diagonalMM);
	updateScreenSettings();

	// No error occurred so return false
	return false;
}

// Initialize values
function initializeValues() {
	$slicerSpeedYes[0].checked = true;
	$slicerSpeedNo[0].checked = false;
	$slicerSpeedDelay.val = 0;
	$settings.set('#slicer.panel.collapsed', true);
	$slicerBody.collapse('hide');

	updateSlicerSettings();
	var XYerr = false;
	var printer = $.get( "/services/printers/getFirstAvailablePrinter", function( data ) {
		if (data !== null && data !== undefined) {
			XYerr = setPrinterCallibrationSettings(data);
		}
	});

	if (XYerr) {
		// Error handling
	}
}

// $(window).bind('load', initializeValues);
$(document).ready(initializeValues);
// initializeValues();