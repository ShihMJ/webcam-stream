async function setupCamera(device_id) {
	if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
		throw new Error(
			'Browser API navigator.mediaDevices.getUserMedia not available');
	}

	const videoElement = document.getElementById('camera');

	stopExistingVideoCapture(videoElement);

	const stream = await navigator.mediaDevices.getUserMedia(
	{
		audio: false, 
		video: {
			deviceId: {exact: device_id},
			width: { min: 1280, ideal: 1920, max: 1920 },
			height: { min: 720, ideal: 1080, max: 1080 }
		}
	});

	videoElement.srcObject = stream;
}


async function getVideoInputs() {
	if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
		console.log('enumerateDevices() not supported.');
		return [];
	}

	const devices = await navigator.mediaDevices.enumerateDevices();
	console.log(devices);
	const videoDevices = devices.filter(device => device.kind === 'videoinput');

	return videoDevices;
}

function stopExistingVideoCapture(videoElement) {
	if(videoElement.srcObject) {
		videoElement.srcObject.getTracks().forEach(track => {
			track.stop();
		})
		videoElement.srcObject = null;
	}
}

async function init() {
	try {
		await setupCamera();
		document.getElementById("camera").play();
		const video_input = await getVideoInputs();
		const camera_select = document.getElementById("camera_select");
		video_input.forEach(video => {
			const option = document.createElement("option");
			option.value = video.deviceId;
			option.innerText = video.label;
			camera_select.add(option);
		});
		camera_select.addEventListener("change", (e) => {
			setupCamera(e.target.value);
		});
	} catch (err) {
		console.log(err);
	}
	
}

window.onload = init;