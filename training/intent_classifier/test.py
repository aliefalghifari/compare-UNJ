import torch 
import torch.nn.functional as F
from pathlib import Path
from transformers import AutoTokenizer
from intent_classifier.model import IntentClassifier
BASE_DIR = Path(__file__).resolve().parent
SAVE_DIR = BASE_DIR / "saved_model"
WEIGHT_PATH = SAVE_DIR / "intent_classifier_weight.pth"
TOKENIZER = SAVE_DIR / "tokenizer"
model_name = "indobenchmark/indobert-base-p1"
num_labels=9
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
tokenizer = AutoTokenizer.from_pretrained(TOKENIZER)
model = IntentClassifier(model_name=model_name, num_labels=9).to(device)
state_dict = torch.load(
    WEIGHT_PATH,
    map_location=device,
    weights_only=True)
model.load_state_dict(state_dict)
model.eval()

def predict(text:str):
    encoder = tokenizer(text, return_tensors="pt", truncation = True, padding=True)
    input_ids = encoder["input_ids"].to(device)
    attention_mask = encoder["attention_mask"].to(device)

    with torch.no_grad():
        logits = model(input_ids, attention_mask)
        probabilities = F.softmax(logits,dim=1)
        confidence, predicted_class = torch.max(probabilities, dim=1)
        print("Logits:", logits)
        print("Probabilities:", probabilities)
        print("Predicted class:", predicted_class.item())
        print("Confidence:", confidence.item())

if __name__ == "__main__":
    message = input("masukkan pesan: ")
    predict(message)
