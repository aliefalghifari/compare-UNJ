import torch
from torch.utils.data import Dataset



class CSIntentDataset(Dataset):
    def __init__(
        self,
        text,
        labels,
        tokenizer,
        max_length=128
    ):
        self.text = text.tolist()
        self.labels = labels.to_numpy(dtype="float32")
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.text)

    def __getitem__(self, idx):
        text = str(self.text[idx])
        label = self.labels[idx]

        encoding = self.tokenizer(
            text,
            padding="max_length",
            truncation=True,
            max_length=self.max_length,
            return_tensors="pt"
        )

        return { 
            "input_ids": encoding["input_ids"].squeeze(0),
            "attention_mask": encoding["attention_mask"].squeeze(0),
            "labels": torch.tensor(
                label,
                dtype=torch.float
            )
        }
