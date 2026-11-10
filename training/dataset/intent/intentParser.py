from pathlib import Path
import sys

import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[3]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from training.dataset.splitter import DataSplitter


class IntentParser:

    def __init__(self, dataset):
        self.dataset = dataset
        self.splitter = DataSplitter(dataset)

    def parse(self):
        train, validation, test = self.splitter.split()

        return train, validation, test


if __name__ == "__main__":

    dataset = pd.read_csv(Path(__file__).with_name("data.csv"))

    parser = IntentParser(dataset)

    train, validation, test = parser.parse()

    print("Training:", len(train))
    print("Validation:", len(validation))
    print("Test:", len(test))