// Photonic3D Modifications and Features to SLAcer

// Utils
function findPythagoreanC(a, b) {
	return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

function setPrinterCallibrationSettings(printer) {
	// console.log(printer);
	var slicingProfile = printer.configuration.slicingProfile;
	var monitorDriverConfig = printer.configuration.machineConfig.MonitorDriverConfig;
	var dotsPermmXYAverage = (slicingProfile.DotsPermmX + slicingProfile.DotsPermmY) / 2;
	var dotsPermmDiagonal = findPythagoreanC(dotsPermmXYAverage, dotsPermmXYAverage);
	var diagonalNumPixels = findPythagoreanC(monitorDriverConfig.DLP_X_Res, monitorDriverConfig.DLP_Y_Res);

	var diagonalMM = diagonalNumPixels / dotsPermmDiagonal;
	var buildVolXmm = Math.round(monitorDriverConfig.DLP_X_Res / dotsPermmXYAverage);
	var buildVolYmm = Math.round(monitorDriverConfig.DLP_Y_Res / dotsPermmXYAverage);

	$buildVolumeX.val(buildVolXmm);
	$buildVolumeY.val(buildVolYmm);
	updateBuildVolumeSettings();

	$('#screen-diagonal-unit-in').prop('checked', false);
	$('#screen-diagonal-unit-mm').prop('checked', true);
	$screenDiagonalSize.val(diagonalMM);

}

// Initialize values
function initializeValues() {
	$slicerSpeedYes[0].checked = true;
	$slicerSpeedNo[0].checked = false;
	updateSlicerSettings();

	var printer = $.get( "/services/printers/getFirstAvailablePrinter", function( data ) {
		if (data !== null && data !== undefined) {
			setPrinterCallibrationSettings(data);
		}
	});
}

$(window).bind('load', initializeValues);
// $(document).ready(initializeValues);
// initializeValues();
