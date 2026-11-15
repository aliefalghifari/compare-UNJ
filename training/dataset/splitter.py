from sklearn.model_selection import train_test_split
import pandas as pd
from pathlib import Path

class DataSplitter:
    def __init__(self):
        self.dataset = pd.read_csv(Path("intent_classifier/data.csv"))

    def split(self):
        X = self.dataset["message"]
        y = self.dataset.drop(columns=["message"])

        X_train, X_temp, y_train, y_temp = train_test_split(
            X,
            y,
            test_size=0.2,
            random_state=42,
            shuffle=True
        )

        X_val, X_test, y_val, y_test = train_test_split(
            X_temp,
            y_temp,
            test_size=0.5,
            random_state=42,
            shuffle=True
        )

        return (
            X_train, X_val, X_test,
            y_train, y_val, y_test
        )