import torch
from safetensors.torch import save_file

state_dict = torch.load(
    "intent_classifier/saved_model/intent_classifier_weight.pth",
    map_location="cpu",
    weights_only=True
)

save_file(
    state_dict,
    "model.safetensors"
)