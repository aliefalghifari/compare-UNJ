import pandas as pd
from sklearn.model_selection import train_test_split

class DataSplitter:

    def __init__(self, dataset):
        self.dataset = dataset

    def split(self):
        train, temporary = train_test_split(
            self.dataset,
            test_size=0.2,
            random_state=42,
            shuffle=True
        )

        
        validation, test = train_test_split(
            temporary,
            test_size=0.5,
            random_state=42,
            shuffle=True
        )

        return train, validation, test