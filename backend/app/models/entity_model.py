import torch.nn as nn
from transformers import AutoModel
from transformers.modeling_outputs import TokenClassifierOutput
class EntityClassifier(nn.Module):
    def __init__(self, model_name:str, num_labels:int, dropout:float=0.1):
        super().__init__()
        self.num_labels = num_labels
        self.encoder = AutoModel.from_pretrained(model_name)
        hidden_size = self.encoder.config.hidden_size
        self.dropout = nn.Dropout(dropout)
        self.classifier = nn.Linear(hidden_size, num_labels)

    def forward(self, input_ids, attention_mask, labels=None):
        outputs = self.encoder(input_ids=input_ids, attention_mask=attention_mask)
        hidden_states = outputs.last_hidden_state
        hidden_states = self.dropout(hidden_states)
        logits = self.classifier(hidden_states)
        loss = None
        if labels is not None:
            criterion = nn.CrossEntropyLoss(ignore_index=-100)
            loss = criterion(logits.reshape(-1, self.num_labels), labels.reshape(-1))
        return TokenClassifierOutput(logits=logits,loss=loss)