from flask import Flask, request, render_template, jsonify, url_for
from PIL import Image
from zeroShotBlip import ZeroShotBlipClassifier as zsb
import io

app = Flask(__name__, static_folder='static')

# Initialize the ZeroShotBlip class
classifier = zsb()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/classify', methods=['POST'])
def classify_image():
    try:
        # Check if image file is present in request
        if 'image' not in request.files:
            return jsonify({'error': 'No image file uploaded'}), 400

        image_file = request.files['image']
        
        # Read the image
        image = Image.open(io.BytesIO(image_file.read()))
        
        # Use the classifier from ZeroShotBlip class
        predicted_label = classifier.classify_image(image)
        
        return jsonify({
            'success': True,
            'classification': predicted_label
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000, ssl_context='adhoc')