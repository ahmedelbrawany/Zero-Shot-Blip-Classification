# Zero-Shot Image Classification with BLIP

A web-based application that performs zero-shot image classification using the BLIP (Bootstrapping Language-Image Pre-training) model. This application allows users to either upload images or take photos using their device's camera for classification.

## Features

- 📷 Camera capture support
- 🖼️ Drag and drop image upload
- 🔄 Real-time image preview
- 🤖 Zero-shot classification using BLIP
- 📱 Responsive design
- 🔒 Secure HTTPS support for camera access

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Zero-Shot-Blip-Classification.git
cd Zero-Shot-Blip-Classification
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
.\venv\Scripts\activate
```

3. Install the required packages:
```bash
pip install -r requirements.txt
```

## Requirements

- Python 3.8+
- Flask
- PyTorch
- Transformers
- Pillow
- pyOpenSSL (for HTTPS support)

## Project Structure

```
Zero-Shot-Blip-Classification/
├── app.py                  # Flask application
├── zeroShotBlip.py        # BLIP model implementation
├── requirements.txt        # Project dependencies
├── static/
│   ├── css/
│   │   └── style.css      # Styling
│   ├── js/
│   │   └── main.js        # Frontend functionality
│   └── img/
│       ├── upload.svg     # Upload icon
│       └── camera.svg     # Camera icon
└── templates/
    └── index.html         # Main webpage
```

4. pre-Download Model locally for faster loading
```bash
python run_once_script.py
```
## Usage

1. Start the Flask server:
```bash
python app.py
```

2. Open your web browser and navigate to:
```
https://localhost:5000
```

3. Choose either:
   - Upload an image using drag & drop or file selection
   - Take a photo using your device's camera

4. Click "Classify Image" to get the results

## Development

### Running in Development Mode

```bash
python app.py
```

The application will run in debug mode with hot-reloading enabled.

### HTTPS Configuration

For camera access, HTTPS is required. The application uses Flask's built-in SSL context:
```python
app.run(ssl_context='adhoc')
```


## License

This project is licensed under the MIT License - see the LICENSE file for details.

