import torch
from dataset.splitter import DataSplitter


class Train:
    def __init__(self,train_loader,Val_loader,model,device):
        self.train_loader = train_loader
        self.val_loader = Val_loader
        self.device = device
        self.model = model.to(self.device)
        self.optimizer = torch.optim.AdamW(model.parameters(), lr=2e-5)
        self.criterion = torch.nn.CrossEntropyLoss(ignore_index=-100)
        

    def training_step(self):
        self.model.train()
        total_loss = 0
        for batch in self.train_loader:
            input_ids, attention_mask, labels = [tensor.to(self.device) for tensor in batch]
            self.optimizer.zero_grad()
            outputs = self.model(input_ids=input_ids, attention_mask=attention_mask)
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
                outputs = self.model(input_ids=input_ids, attention_mask=attention_mask)
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