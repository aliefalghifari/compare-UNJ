class EntityCollator:
    def __init__(self, processor):
        self.processor = processor

    def __call__(self, samples):
        batch = self.processor.process_token(samples)

        return {
            "input_ids":batch["input_ids"],
            "attention_mask":batch["attention_mask"],
            "labels":batch["labels"]
        }