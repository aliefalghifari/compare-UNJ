import torch
from transformers import AutoTokenizer
from backend.app.models.intent_model import IntentClassifier
from huggingface_hub import hf_hub_download
from safetensors.torch import load_file
from backend.app.models.entity_model import EntityClassifier

class EntityModelLoader:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.REPO_NAME = "penakluknaga/entity-extraction"
        self.BASE_MODEL = "indobenchmark/indobert-base-p1"
        self.NUM_LABELS = 15

    def load_entity_model(self):
        tokenizer = AutoTokenizer.from_pretrained(self.REPO_NAME,use_fast=True)
        if not tokenizer.is_fast:
            raise ValueError("entity inference requires fast")
        model = EntityClassifier(model_name=self.BASE_MODEL,num_labels=self.NUM_LABELS)
        checkpoint_path = hf_hub_download(repo_id=self.REPO_NAME,filename="entity_model.safetensors")
        state_dict = load_file(checkpoint_path)
        model.load_state_dict(state_dict, strict=True)
        model.to(self.device)
        model.eval()
        return model,tokenizer