import torch
from transformers import AutoTokenizer
from backend.app.models.intent_model import IntentClassifier
from huggingface_hub import hf_hub_download
from safetensors.torch import load_file


class IntentModelLoader:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.REPO_NAME = "penakluknaga/intent-classifier"
        self.BASE_MODEL = "indobenchmark/indobert-base-p1"

    def load_intent_model(self):
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        tokenizer = AutoTokenizer.from_pretrained(self.REPO_NAME)
        model = IntentClassifier(model_name=self.BASE_MODEL,num_labels=9,dropout=0.1)
        weight = hf_hub_download(repo_id=self.REPO_NAME, filename="intent_classifier_weight.safetensors")
        state_dict = load_file(weight,device="cpu")
        model.load_state_dict(state_dict)
        model.to(self.device)
        model.eval()
        return model,tokenizer