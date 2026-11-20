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


    def predict(self,text:str,thresshold=0.45,fallback_thresshold=0.35):
        encoder = self.tokenizer(text, return_tensors="pt", truncation = True, padding=True, max_length=128)
        input_ids = encoder["input_ids"].to(self.device)
        attention_mask = encoder["attention_mask"].to(self.device)
        with torch.inference_mode():
            logits = self.model(input_ids,attention_mask)
            probabilities = torch.sigmoid(logits)[0]
            predicted_class = torch.where(probabilities >= thresshold)[0]
            if len(predicted_class) > 0:
                predicted_intents = [
            {
                "predicted_class": idx.item(),
                "intent": self.label_mapping[str(idx.item())],
                "confidence": probabilities[idx].item()
            }
            for idx in predicted_class]
                method = "thresshold"
                status = "classified"
            else:
                best_idx = torch.argmax(probabilities)
                best_probability = probabilities[best_idx]
                if best_probability >= fallback_thresshold:
                    predicted_intents = [
                        {
                            "predicted_class": best_idx.item(),
                            "intent": self.label_mapping[str(best_idx.item())],
                            "confidence": best_probability.item()
                        }
                    ]
                    method = "fallback"
                    status = "classified"
                else:
                    predicted_intents = []
                    method = "none"
                    status = "uncertain"

        return {
            "intents": predicted_intents,
            "threshold": thresshold,
            "fallback_thresshold": fallback_thresshold,
            "method": method,
            "status": status
        }