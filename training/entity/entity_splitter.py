import torch

from torch.utils.data import random_split


class EntityDataSplitter:
    def __init__(
        self,
        dataset,
        train_ratio=0.8,
        val_ratio=0.1,
        test_ratio=0.1,
        seed=42
    ):
        self.dataset = dataset
        self.train_ratio = train_ratio
        self.val_ratio = val_ratio
        self.test_ratio = test_ratio
        self.seed = seed

        total_ratio = train_ratio + val_ratio + test_ratio

        if abs(total_ratio - 1.0) > 1e-8:
            raise ValueError("Total rasio harus sama dengan 1")

    def split(self):
        total_size = len(self.dataset)

        train_size = int(total_size * self.train_ratio)
        val_size = int(total_size * self.val_ratio)
        test_size = total_size - train_size - val_size

        generator = torch.Generator().manual_seed(self.seed)

        train_dataset, val_dataset, test_dataset = random_split(
            self.dataset,
            [train_size, val_size, test_size],
            generator=generator
        )

        return train_dataset, val_dataset, test_dataset
