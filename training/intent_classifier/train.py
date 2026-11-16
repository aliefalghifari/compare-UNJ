import torch
from intent_classifier.model import IntentClassifier
from intent_classifier.dataloader import IntentDataLoader
from dataset.splitter import DataSplitter
from preprocessing.tokenizer import DataProcess
from pathlib import Path
import pandas as pd
from transformers import AutoModel
from transformers import AutoTokenizer
from safetensors.torch import save_file

class Train:
    def __init__(self,train_loader,Val_loader,model,device):
        self.train_loader = train_loader
        self.val_loader = Val_loader
        self.device = device
        self.model = model.to(self.device)
        self.optimizer = torch.optim.AdamW(model.parameters(), lr=2e-5)
        self.criterion = torch.nn.CrossEntropyLoss()
        

    def training_step(self):
        self.model.train()
        total_loss = 0
        for batch in self.train_loader:
            input_ids, attention_mask, labels = [tensor.to(self.device) for tensor in batch]
            self.optimizer.zero_grad()
            outputs = self.model(input_ids, attention_mask)
            loss = self.criterion(outputs, labels)
            total_loss += loss.item()
            loss.backward()
            self.optimizer.step()
        return total_loss / len(self.train_loader)

    def validating_step(self):
        self.model.eval()
        total_loss = 0
        with torch.no_grad():
            for batch in self.val_loader:
                input_ids, attention_mask, labels = [tensor.to(self.device) for tensor in batch]
                outputs = self.model(input_ids, attention_mask)
                loss = self.criterion(outputs, labels)
                total_loss += loss.item()
        return total_loss / len(self.val_loader)

    def fit(self, epochs):
        for epoch in range(epochs):
            train_loss = self.training_step()
            val_loss = self.validating_step()
            print(f"Epoch {epoch+1}/{epochs} - Train Loss: {train_loss:.4f} - Val Loss: {val_loss:.4f}")

if __name__ == "__main__":
    data_splitter = DataSplitter()
    X_train, X_val, X_test, y_train, y_val, y_test = data_splitter.split()
    # print(f"{X_train.dtype}")
    # print(y_train)
    # print(X_train.head(5))
    tokenizer = AutoTokenizer.from_pretrained("indobenchmark/indobert-base-p1")
    train_loader = IntentDataLoader(X_train,y_train,tokenizer).get_dataloader(batch_size=32, shuffle=True)
    eval_loader = IntentDataLoader(X_val, y_val,tokenizer).get_dataloader(batch_size=32, shuffle=False)
    test_loader = IntentDataLoader(X_test,y_test,tokenizer).get_dataloader(batch_size=32, shuffle=False)
    model = IntentClassifier("indobenchmark/indobert-base-p1", num_labels=9, dropout=0.1)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    trainer = Train(train_loader, eval_loader, model, device)
    trainer.fit(3)
    save_dir = Path(__file__).resolve().parent / "saved_model"
    save_dir.mkdir(parents=True,exist_ok=True)
    torch.save(trainer.model.state_dict(),save_dir/"intent_classifier_weight.pth")
    tokenizer.save_pretrained(save_dir/"tokenizer")
    print("model berhasil dimuat")