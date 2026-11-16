import torch
from pathlib import Path
import json

class IntentInference:
    def __init__(self,model,tokenizer,device):
        self.model = model
        self.tokenizer = tokenizer
        self.device = device
        mapping_path = Path(__file__).resolve().parent.parent/"app"/"models"/"label_mapping.json"
        with open(mapping_path, "r", encoding="utf-8") as file:
            self.label_mapping = json.load(file)


    def predict(self,text:str):
        encoder = self.tokenizer(text, return_tensors="pt", truncation = True, padding=True, max_length=128)
        input_ids = encoder["input_ids"].to(self.device)
        attention_mask = encoder["attention_mask"].to(self.device)
        with torch.inference_mode():
            logits = self.model(input_ids,attention_mask)
            probabilities = torch.softmax(logits, dim=1)
            predicted_class = torch.argmax(probabilities, dim=1).item()
            predicted_label = self.label_mapping[str(predicted_class)]
            confidence = probabilities[0,predicted_class].item()
            return {
                "predicted_class": predicted_class,
                "intent": predicted_label,
                "confidence":confidence 
            }