
import torch
from transformers import AutoModelForSequenceClassification

MODEL_NAME = "indobenchmark/indobert-base-p1"

NUM_LABELS = 9

LABEL_COLUMNS = [
    "product_inquiry",
    "order_status",
    "payment_issue",
    "refund_request",
    "product_complaint",
    "order_cancellation",
    "address_change",
    "shipping_schedule",
    "shipping_issue",
]


def build_model():
    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_NAME,
        num_labels=NUM_LABELS,
        problem_type="multi_label_classification",
        id2label={
            i: label for i, label in enumerate(LABEL_COLUMNS)
        },
        label2id={
            label: i for i, label in enumerate(LABEL_COLUMNS)
        },
    )

    return model


if __name__ == "__main__":
    model = build_model()

    print(model.config)
    print("\nModel loaded successfully!")

    # Dummy input for architecture testing
    input_ids = torch.randint(0, 1000, (2, 128))
    attention_mask = torch.ones((2, 128), dtype=torch.long)

    outputs = model(
        input_ids=input_ids,
        attention_mask=attention_mask,
    )

    print("\nLogits shape:", outputs.logits.shape)
