samples = [
    {
        "text": "Saya pesan kopi arabica 500gr",
        "entities": [
            {"text": "kopi arabica", "label": "PRODUCT"},
            {"text": "500gr", "label": "QUANTITY"}
        ]
    },
    {
        "text": "Pesanan ORD123 dikirim besok jam 10 pagi",
        "entities": [
            {"text": "ORD123", "label": "ORDER_ID"},
            {"text": "besok", "label": "DATE"},
            {"text": "10 pagi", "label": "TIME"}
        ]
    },
    {
        "text": "Halo kak, saya ingin bertanya",
        "entities": []
    }
]

from transformers import AutoTokenizer
from .entity_loader import EntityDataProcess

REPO_NAME = "penakluknaga/intent-classifier"

tokenizer = AutoTokenizer.from_pretrained(REPO_NAME)

processor = EntityDataProcess(tokenizer)
result = processor.process_token(samples)

processor = EntityDataProcess(tokenizer)
result = processor.process_token(samples)

print("Input IDs:", result["input_ids"].shape)
print("Attention Mask:", result["attention_mask"].shape)
print("Labels:", result["labels"].shape)

print("\nLabel tensor:")
print(result["labels"])