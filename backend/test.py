from app.models.model_loader import IntentModelLoader
from services.inference_service import IntentInference


def main():
    # Load model dan tokenizer
    loader = IntentModelLoader()
    model, tokenizer = loader.load_intent_model()

    # Inisialisasi inference service
    inference = IntentInference(
        model=model,
        tokenizer=tokenizer,
        device=loader.device
    )

    # Uji prediksi
    text = "Kak, pesanan saya sudah dikirim belum?"

    result = inference.predict(text)

    print("Input:", text)
    print("Hasil prediksi:", result)


if __name__ == "__main__":
    main()