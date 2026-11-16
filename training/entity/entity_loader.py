import torch

class EntityDataProcess:
    def __init__(self, tokenizer, max_length=128):
        self.tokenizer = tokenizer
        self.max_length = max_length
        self.label2id = {
            "O":0,
            "B-PRODUCT":1,
            "I-PRODUCT":2,
            "B-QUANTITY":3,
            "I-QUANTITY":4,
            "B-ORDER_ID":5,
            "I-ORDER_ID":6,
            "B-DATE":7,
            "I-DATE":8,
            "B-TIME":9,
            "I-TIME":10,
            "B-ADDRESS":11,
            "I-ADDRESS":12
        }
    def process_token(self,samples):
        text = [sample["text"] for sample in samples]
        encoded = self.tokenizer(
            text,
            truncation=True,
            padding=True,
            max_length = self.max_length,
            return_offsets_mapping=True,
            return_tensors="pt"
        )
        batch_label = []
        for index, sample in enumerate(samples):
            text = sample["text"]
            offsets = encoded["offset_mapping"][index]
            labels = [-100]*len(offsets)
            for token_idx,(start,end) in enumerate(offsets):
                if start != end:
                    labels[token_idx] = self.label2id["O"]
            spans = []
            search_cursor = 0
            for entity in sample["entities"]:
                entity_text = entity["text"]
                entity_label = entity["label"]

                if f"B-{entity_label}" not in self.label2id:
                    raise ValueError(f"label tidak dikenal: {entity_label}")
                start = text.find(entity_text, search_cursor)

                if start == -1:
                    raise ValueError(f"entitas {entity_text} tidak ditemukan")
                end = start + len(entity_text)
                spans.append((start,end,entity_label))
                search_cursor = end

            spans.sort(key=lambda x:x[0])
            for entity_start, entity_end,entity_label in spans:
                token_indices = []
                for token_idx, (start,end) in enumerate(offsets.tolist()):
                    if start < entity_end and end > entity_start:
                        token_indices.append(token_idx)
                if not token_indices:
                    raise ValueError("Entitas tidak memiliki token")
                last_token = offsets[token_indices[-1]][1].item()
                if last_token < entity_end:
                    raise ValueError(f"entitas terpotong oleh batas panjang: {text}")
                for position, token_idx in enumerate(token_indices):
                    label = f"B-{entity_label}" if position == 0 else f"I-{entity_label}"
                    if labels[token_idx] != self.label2id["O"]:
                        raise ValueError("anotasi menumpuk")
                    labels[token_idx] = self.label2id[label]
            batch_label.append(labels)
        print("Jumlah samples:", len(samples))
        print("Jumlah batch_label:", len(batch_label))
        print("Label shape:", torch.tensor(batch_label).shape)
        return {
            "input_ids": encoded["input_ids"],
            "attention_mask": encoded["attention_mask"],
            "labels": torch.tensor(batch_label, dtype=torch.long)
        }


