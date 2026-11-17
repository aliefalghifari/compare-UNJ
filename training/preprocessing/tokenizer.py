import torch

class DataProcess:
    def __init__(self, tokenizer, max_length=128):
        self.tokenizer = tokenizer
        self.max_length = max_length

    #mengubah teks menjadi token
    def process_text(self, texts):
        texts = texts.tolist()
        encoded = self.tokenizer(
            texts,
            truncation=True,
            padding=True,
            max_length=self.max_length,
            return_tensors="pt",
        )
        return {
            "input_ids": encoded["input_ids"],
            "attention_mask": encoded["attention_mask"],
        }

    #mengubah label menjadi token
    def process_labels(self, labels):
        return torch.tensor(
            labels.to_numpy(dtype="float32"),
            dtype=torch.float32
        )

    #mengubah teks dan label menjadi token
    def process_token(self, texts, labels):
        tokenized_texts = self.process_text(texts)
        tokenized_labels = self.process_labels(labels)

        return {
            "input_ids": tokenized_texts["input_ids"],
            "attention_mask": tokenized_texts["attention_mask"],
            "labels": tokenized_labels,
        }