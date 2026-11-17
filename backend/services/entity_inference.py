import torch
from pathlib import Path
import json

class EntityInference:
    def __init__(self,model,tokenizer,device):
        self.model = model
        self.tokenizer = tokenizer
        # print("Tokenizer class:", type(self.tokenizer))
        # print("Is fast:", self.tokenizer.is_fast)
        # print("Backend tokenizer:", getattr(self.tokenizer, "backend_tokenizer", None))
        self.device = device
        print(type(self.tokenizer))
        print("Is fast:", self.tokenizer.is_fast)
        self.model.eval()
        mapping_path = Path(__file__).resolve().parent.parent/"app"/"models"/"entity_mapping.json"
        with open(mapping_path, "r", encoding="utf-8") as file:
            self.label_mapping = json.load(file)


    def predict(self,text:str):
        encoder = self.tokenizer(text, return_tensors="pt", truncation = True, padding=True, max_length=128,return_offsets_mapping=True)
        print(encoder.keys())
        offsets = encoder.pop("offset_mapping")[0].tolist()
        input_ids = encoder["input_ids"].to(self.device)
        attention_mask = encoder["attention_mask"].to(self.device)
        with torch.inference_mode():
            outputs = self.model(input_ids=input_ids,attention_mask=attention_mask)
            logits = outputs.logits
            predicted_class = torch.argmax(logits, dim=-1)[0].tolist()
            predicted_labels = [
            self.label_mapping[str(class_id)]
            for class_id in predicted_class
        ]
        print("Input:", text)
        print("Tokens:", self.tokenizer.convert_ids_to_tokens(input_ids[0]))
        print("Offsets:", offsets)
        print("Predicted labels:", predicted_labels)    
        entities = []
        current_entity = None

        def flush_entity():
            nonlocal current_entity
            if current_entity is not None:
                start = current_entity["start"]
                end = current_entity["end"]
                entities.append({
                    "text": text[start:end],
                    "label": current_entity["label"],
                    "start":start,
                    "end":end,
                })
                current_entity = None
        for label, (start,end), mask in zip(predicted_labels,offsets,attention_mask[0].tolist()):
            if mask == 0 or start == end:
                continue
            if label == "O":
                flush_entity()
                continue
            if "-" not in label:
                raise ValueError(f"invalid label:{label}")
            prefix, entity_type = label.split("-",1)
            if prefix not in ("B","I"):
                raise ValueError(f"invalid prefix:{label}")
            if prefix == "B":
                flush_entity()
                current_entity= {
                    "label": entity_type,
                    "start":start,
                    "end":end
                }
            elif prefix == "I":
                if (current_entity is not None and current_entity["label"]==entity_type):
                    current_entity["end"]=end
                else:
                    flush_entity()
                    current_entity = {
                        "label": entity_type,
                        "start":start,
                        "end":end
                    }
        flush_entity()
        return {
            "entities":entities
        }