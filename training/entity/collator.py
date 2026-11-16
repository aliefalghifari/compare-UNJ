class EntityCollator:
    def __init__(self, processor):
        self.processor = processor

    def __call__(self, samples):
        batch = self.processor.process_token(samples)

        return (
            batch["input_ids"],
            batch["attention_mask"],
            batch["labels"]
        )