from torch.utils.data import TensorDataset, DataLoader
from preprocessing.tokenizer import DataProcess


class IntentDataLoader:
    def __init__(self, texts, labels, tokenizer, max_length=128):
        if len(texts) != len(labels):
            raise ValueError("panjang teks dan label harus sama.")
        self.data_process = DataProcess(tokenizer, max_length)
        self.tokenized_data = self.data_process.process_token(texts, labels)

    def get_dataloader(self, batch_size=32, shuffle=True):
        dataset = TensorDataset(
            self.tokenized_data["input_ids"],
            self.tokenized_data["attention_mask"],
            self.tokenized_data["labels"],
        )
        dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=shuffle)
        return dataloader