document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const classifyBtn = document.getElementById('classify-btn');
    const resultContainer = document.getElementById('result-container');
    const classificationResult = document.getElementById('classification-result');
    const confidenceScore = document.getElementById('confidence-score');
    const newImageBtn = document.getElementById('new-image-btn');
    const loading = document.getElementById('loading');
    const uploadBtn = document.getElementById('upload-btn');
    const cameraBtn = document.getElementById('camera-btn');
    const cameraContainer = document.getElementById('camera-container');
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('capture-btn');
    const retakeBtn = document.getElementById('retake-btn');
    
    let stream = null;

    // Drag and drop handlers
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drop-zone-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drop-zone-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drop-zone-over');
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            updateImagePreview();
        }
    });

    // Button click handlers
    uploadBtn.addEventListener('click', () => {
        hideAllContainers();
        dropZone.classList.remove('hidden');
    });

    cameraBtn.addEventListener('click', async () => {
        hideAllContainers();
        cameraContainer.classList.remove('hidden');
        
        // Check if mediaDevices is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Camera access is not supported in your browser or requires HTTPS');
            return;
        }

        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });
            video.srcObject = stream;
        } catch (err) {
            console.error('Camera error:', err);
            alert('Error accessing camera. Make sure you\'re using HTTPS and camera permissions are granted.');
        }
    });

    captureBtn.addEventListener('click', () => {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
            
            displayPreview(file);
            stopCamera();
        }, 'image/jpeg');
    });

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', updateImagePreview);

    classifyBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        loading.classList.remove('hidden');
        classifyBtn.disabled = true;

        try {
            const response = await fetch('/classify', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.success) {
                classificationResult.textContent = data.classification;
                resultContainer.classList.remove('hidden');
                if (data.confidence) {
                    confidenceScore.textContent = (data.confidence * 100).toFixed(2);
                    confidenceScore.parentElement.classList.remove('hidden');
                }
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            alert('Error classifying image: ' + error.message);
        } finally {
            loading.classList.add('hidden');
            classifyBtn.disabled = false;
        }
    });

    newImageBtn.addEventListener('click', () => {
        hideAllContainers();
        dropZone.classList.remove('hidden');
        fileInput.value = '';
    });

    retakeBtn.addEventListener('click', async () => {
        hideAllContainers();
        cameraContainer.classList.remove('hidden');
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            video.srcObject = stream;
        } catch (err) {
            alert('Error accessing camera: ' + err.message);
        }
    });

    // Helper functions
    function hideAllContainers() {
        dropZone.classList.add('hidden');
        cameraContainer.classList.add('hidden');
        previewContainer.classList.add('hidden');
        resultContainer.classList.add('hidden');
        if (stream) {
            stopCamera();
        }
    }

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
    }

    function displayPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            hideAllContainers();
            previewContainer.classList.remove('hidden');
            retakeBtn.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }

    function updateImagePreview() {
        const file = fileInput.files[0];
        if (file) {
            displayPreview(file);
            retakeBtn.classList.add('hidden');
        }
    }
});