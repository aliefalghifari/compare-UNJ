import torch
from torch.utils.data import DataLoader
from transformers import AutoTokenizer
from pathlib import Path
from entity.dataset_entity import EntityDataset
from entity.entity_splitter import EntityDataSplitter
from entity.entity_loader import EntityDataProcess
from entity.collator import EntityCollator
from entity.entity_model import EntityClassifier
from entity.entity_train import Train


BASE_MODEL = "indobenchmark/indobert-base-p1"
DATASET_PATH = "entity/entity_dataset (1).jsonl"
SAVE_PATH = "saved_model/entity"

NUM_LABELS = 15
BATCH_SIZE = 8
EPOCHS = 5
LEARNING_RATE = 2e-5
MAX_LENGTH = 128


def main():
    # 1. Device
    save_path = Path(SAVE_PATH)
    save_path.mkdir(parents=True, exist_ok=True)
    device = torch.device(
        "cuda" if torch.cuda.is_available() else "cpu"
    )
    print(f"Device: {device}")

    # 2. Tokenizer
    tokenizer = AutoTokenizer.from_pretrained(
        BASE_MODEL,
        use_fast=True
    )

    if not tokenizer.is_fast:
        raise ValueError("Tokenizer harus menggunakan fast tokenizer")

    # 3. Dataset
    dataset = EntityDataset(DATASET_PATH)

    print(f"Total dataset: {len(dataset)}")

    # 4. Split dataset
    splitter = EntityDataSplitter(dataset)
    train_dataset, val_dataset, test_dataset = splitter.split()

    print(f"Train: {len(train_dataset)}")
    print(f"Validation: {len(val_dataset)}")
    print(f"Test: {len(test_dataset)}")

    # 5. Processor dan collator
    processor = EntityDataProcess(
        tokenizer=tokenizer,
        max_length=MAX_LENGTH
    )

    collator = EntityCollator(processor)

    # 6. DataLoader
    train_loader = DataLoader(
        train_dataset,
        batch_size=BATCH_SIZE,
        shuffle=True,
        collate_fn=collator
    )

    val_loader = DataLoader(
        val_dataset,
        batch_size=BATCH_SIZE,
        shuffle=False,
        collate_fn=collator
    )

    # 7. Model
    model = EntityClassifier(
        model_name=BASE_MODEL,
        num_labels=NUM_LABELS
    )

    # 8. Trainer
    trainer = Train(
        train_loader=train_loader,
        val_loader=val_loader,
        model=model,
        device=device,
        learning_rate=LEARNING_RATE
    )

    # 9. Training
    history = trainer.fit(
        epochs=EPOCHS,
        save_path=SAVE_PATH
    )

    # 10. Simpan tokenizer
    tokenizer.save_pretrained(SAVE_PATH)

    print("Training selesai.")
    print(history)


if __name__ == "__main__":
    main()