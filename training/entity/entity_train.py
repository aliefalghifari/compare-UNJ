
import torch
import torch.nn as nn

from pathlib import Path
from safetensors.torch import save_file


class Train:

    def __init__(
        self,
        train_loader,
        val_loader,
        model,
        device,
        learning_rate=2e-5
    ):

        self.train_loader = train_loader
        self.val_loader = val_loader

        self.device = torch.device(device)
        self.model = model.to(self.device)

        self.optimizer = torch.optim.AdamW(
            self.model.parameters(),
            lr=learning_rate,
            weight_decay=0.01
        )

        self.loss_fn = nn.CrossEntropyLoss(
            ignore_index=-100
        )

        self.best_val_loss = float("inf")
        self.best_epoch = None

    def _move_batch(self, batch):

        input_ids = batch["input_ids"].to(self.device)
        attention_mask = batch["attention_mask"].to(self.device)
        labels = batch["labels"].to(self.device)

        return input_ids, attention_mask, labels

    def _calculate_loss(self, logits, labels):

        return self.loss_fn(
            logits.reshape(-1, logits.shape[-1]),
            labels.reshape(-1)
        )

    def training_step(self):

        self.model.train()
        total_loss = 0.0

        for batch in self.train_loader:

            input_ids, attention_mask, labels = self._move_batch(batch)

            self.optimizer.zero_grad(set_to_none=True)

            logits = self.model(
                input_ids=input_ids,
                attention_mask=attention_mask
            )

            loss = self._calculate_loss(logits, labels)

            loss.backward()

            torch.nn.utils.clip_grad_norm_(
                self.model.parameters(),
                max_norm=1.0
            )

            self.optimizer.step()

            total_loss += loss.item()

        return total_loss / len(self.train_loader)

    def validating_step(self):

        self.model.eval()
        total_loss = 0.0

        with torch.inference_mode():

            for batch in self.val_loader:

                input_ids, attention_mask, labels = self._move_batch(batch)

                logits = self.model(
                    input_ids=input_ids,
                    attention_mask=attention_mask
                )

                loss = self._calculate_loss(logits, labels)

                total_loss += loss.item()

        return total_loss / len(self.val_loader)

    def save_model(self, path):

        save_path = Path(path)
        save_path.mkdir(parents=True, exist_ok=True)

        state_dict = {
            key: value.detach().cpu().contiguous()
            for key, value in self.model.state_dict().items()
        }

        weight_path = save_path / "entity_model.safetensors"

        save_file(
            state_dict,
            str(weight_path)
        )

        print(f"Weight saved: {weight_path}")

    def fit(self, epochs, save_path=None):

        if len(self.train_loader) == 0:
            raise ValueError("Train loader kosong")

        if len(self.val_loader) == 0:
            raise ValueError("Validation loader kosong")

        history = {
            "train_loss": [],
            "val_loss": []
        }

        for epoch in range(epochs):

            train_loss = self.training_step()
            val_loss = self.validating_step()

            history["train_loss"].append(train_loss)
            history["val_loss"].append(val_loss)

            print(
                f"Epoch {epoch + 1}/{epochs} "
                f"- Train Loss: {train_loss:.4f} "
                f"- Val Loss: {val_loss:.4f}"
            )

            if val_loss < self.best_val_loss:

                self.best_val_loss = val_loss
                self.best_epoch = epoch + 1

                if save_path is not None:
                    self.save_model(save_path)

                print("Best model updated.")

        print(f"Best epoch: {self.best_epoch}")
        print(f"Best validation loss: {self.best_val_loss:.4f}")

        return history
