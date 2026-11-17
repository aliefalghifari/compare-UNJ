
from pathlib import Path

import pandas as pd
import torch

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    precision_recall_fscore_support
)

from backend.app.models.model_loader import IntentModelLoader


# 1. Dataset
ROOT_DIR = Path(__file__).resolve().parents[2]

DATA_PATH = (
    ROOT_DIR
    / "training"
    / "intent_classifier"
    / "data.csv"
)

dataset = pd.read_csv(DATA_PATH)

X = dataset["message"]
y = dataset.drop(columns=["message"])


# 2. Reproduksi validation split
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


# 3. Load model
loader = IntentModelLoader()
model, tokenizer = loader.load_intent_model()

device = loader.device

model.eval()

# 4. Collect probabilities
all_probabilities = []
all_labels = []

batch_size = 16

with torch.inference_mode():

    for start in range(0, len(X_val), batch_size):

        texts = X_val.iloc[start:start + batch_size].tolist()

        labels = y_val.iloc[start:start + batch_size]

        encoded = tokenizer(
            texts,
            truncation=True,
            padding=True,
            max_length=128,
            return_tensors="pt"
        )

        input_ids = encoded["input_ids"].to(device)
        attention_mask = encoded["attention_mask"].to(device)

        logits = model(input_ids, attention_mask)

        probabilities = torch.sigmoid(logits)

        all_probabilities.append(
            probabilities.cpu()
        )

        all_labels.append(
            torch.tensor(
                labels.to_numpy(dtype="float32")
            )
        )


probabilities = torch.cat(all_probabilities).numpy()
y_true = torch.cat(all_labels).numpy()


# 5. Threshold evaluation
thresholds = [
    0.20, 0.25, 0.30, 0.35,
    0.40, 0.45, 0.50, 0.55,
    0.60, 0.65, 0.70, 0.75, 0.80
]

print("Jumlah validation samples:", len(y_true))
print("\nTHRESHOLD EVALUATION")

for threshold in thresholds:

    predictions = (
        probabilities >= threshold
    ).astype(int)

    precision, recall, f1, _ = (
        precision_recall_fscore_support(
            y_true,
            predictions,
            average="micro",
            zero_division=0
        )
    )

    macro_precision, macro_recall, macro_f1, _ = (
        precision_recall_fscore_support(
            y_true,
            predictions,
            average="macro",
            zero_division=0
        )
    )

    print(
        f"\nThreshold: {threshold:.2f}"
        f"\nMicro Precision: {precision:.4f}"
        f"\nMicro Recall:    {recall:.4f}"
        f"\nMicro F1:        {f1:.4f}"
        f"\nMacro Precision: {macro_precision:.4f}"
        f"\nMacro Recall:    {macro_recall:.4f}"
        f"\nMacro F1:        {macro_f1:.4f}"
    )


# 6. Per-intent evaluation at threshold 0.50
predictions = (probabilities >= 0.50).astype(int)

precision, recall, f1, support = (
    precision_recall_fscore_support(
        y_true,
        predictions,
        average=None,
        zero_division=0
    )
)

print("\nPER INTENT - THRESHOLD 0.50")

for idx, label in enumerate(y.columns):

    print(
        f"{label}: "
        f"Precision={precision[idx]:.4f}, "
        f"Recall={recall[idx]:.4f}, "
        f"F1={f1[idx]:.4f}, "
        f"Support={support[idx]}"
    )
