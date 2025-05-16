from transformers import BlipProcessor, BlipForQuestionAnswering
from PIL import Image
import torch
import nltk


# nltk.download('averaged_perceptron_tagger_eng')

class ZeroShotBlipClassifier:
    def __init__(self):
        cache_dir = "./blip_model"

        self.processor = BlipProcessor.from_pretrained("Salesforce/blip-vqa-base", cache_dir=cache_dir, local_files_only=True)
        self.model = BlipForQuestionAnswering.from_pretrained("Salesforce/blip-vqa-base", cache_dir=cache_dir, local_files_only=True)

    def is_noun(self, text):
        """
        Check if a word is a noun using NLTK's part-of-speech tagger.
        
        Args:
            word (str): Word to check
            
        Returns:
            bool: True if word is a noun, False otherwise
        """
        ans = nltk.pos_tag([text])

        # ans returns a list of tuple
        val = ans[0][1]

        # checking if it is a noun or not
        if(val == 'NN' or val == 'NNS' or val == 'NNPS' or val == 'NNP'):
            return True
        else:
            return False 
        
    def classify_image(self, image):
        # Load and process the image
        if isinstance(image, str):
            image = Image.open(image)
        else:
            image = image.convert("RGB")
        
        
        # Prepare the question to get a noun-based classification
        question = "What is the main object or subject in this image? Answer with a single noun."
        
        # Process inputs
        inputs = self.processor(image, question, return_tensors="pt")
        
        # # Generate answer
        # out = self.model.generate(**inputs)
        # # Decode the output
        # answer = self.processor.decode(out[0], skip_special_tokens=True)

       # Generate with num_return_sequences=10 to get top 10 possibilities
        out = self.model.generate(
            **inputs,
            max_length=2,  # Keep this small to get just the next token
            num_beams=10,  # Use beam search
            num_return_sequences=10,  # Get top 10 sequences
            temperature=1.0,
            do_sample=True,
            top_k=10,
            output_scores=True,  # Get the scores/probabilities
            return_dict_in_generate=True  # Return as dictionary with scores
        )
        
        # Get sequences and their scores
        sequences = out.sequences
        scores = torch.nn.functional.softmax(out.scores[0], dim=-1)  # Convert to probabilities
        
        # Get top probabilities and their corresponding tokens
        top_probs, top_indices = torch.topk(scores[0], k=10)
        
        print("\nTop 10 predictions with probabilities:")
        for prob, seq in zip(top_probs, sequences):
            text = self.processor.decode(seq, skip_special_tokens=True)
            print(f"{text}: {prob.item():.4f}")
            if self.is_noun(text):
                answer = text
                break
    
        
        return answer.strip()

def main():
    # Initialize the classifier
    classifier = ZeroShotBlipClassifier()
    
    # Example usage
    image_path = r"C:\Users\Ahmed\Pictures\Saved Pictures\3.jpg"# Replace with your image path
    result = classifier.classify_image(image_path)
    print(f"Classification result: {result}")

if __name__ == "__main__":
    main()