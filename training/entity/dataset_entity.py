import json
from torch.utils.data import Dataset

class EntityDataset(Dataset):
    def __init__(self, file_path):
        self.samples = []

        with open(file_path, "r", encoding="utf-8") as file:
            for line in file:
                if line.strip():
                    self.samples.append(json.loads(line))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, index):
        return self.samples[index]