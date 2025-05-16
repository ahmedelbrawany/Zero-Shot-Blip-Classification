from transformers import BlipProcessor, BlipForQuestionAnswering
import nltk

# Download the NLTK data for part-of-speech tagging
# Ensure you have the necessary NLTK data files
nltk.download('averaged_perceptron_tagger_eng')


# Set the local directory to cache the model
cache_dir = "./blip_model"

# Download and cache the processor and model
BlipProcessor.from_pretrained("Salesforce/blip-vqa-base", cache_dir=cache_dir)
BlipForQuestionAnswering.from_pretrained("Salesforce/blip-vqa-base", cache_dir=cache_dir)

print("Model and processor downloaded to", cache_dir)