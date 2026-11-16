import torch
from transformers import AutoTokenizer
from app.models.intent_model import IntentClassifier
from huggingface_hub import hf_hub_download
from safetensors.torch import load_file

class EntityModelLoader:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.REPO_NAME = "penakluknaga/intent-classifier"
        self.BASE_MODEL = "indobenchmark/indobert-base-p1"