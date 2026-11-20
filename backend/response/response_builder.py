class ResponseBuilder:

    STATUS_MESSAGES = {
        "success": "Produk berhasil ditemukan.",
        "not_found": "Produk tidak ditemukan.",
        "need_clarification": "Informasi produk belum lengkap.",
        "unsupported": "Permintaan belum didukung."
    }

    def build(self, handler_result: dict) -> dict:
        status = self.handler_result.get("status", "error")

        response = {
            "intent": handler_result.get("intent"),
            "status": status,
            "message": self.STATUS_MESSAGES.get(
                status,
                "Terjadi kesalahan saat memproses permintaan."
            )
        }

        # Pertahankan data hasil handler
        if "data" in handler_result:
            response["data"] = handler_result["data"]

        # Informasi yang perlu diklarifikasi
        if "required" in handler_result:
            response["required"] = handler_result["required"]

        return response

    def build(self,handler_result:dict):
        if not self.handler_result.get("succes"):
            return {
                "succes":False,
                "draft_response":None
            }

    def _build_product_response(self,data:dict):
        status = self.handler_result.get("status")
        data = self.handler_result.get("data",[])
        if status == "not_found":
            message = ("maaf kak, produk yang dicari belum berhasil ditemukan"
                       "Bisa diperiksa kembali nama produknya?")

        elif status == "success":
            products = [
                self._formaat_product(product)
                for product in data
            ]
            response = []
            for product in products:
                nama = product["nama"]
                stok = product["stok"]
                harga = product["harga"]
                product_response = (
                f"Untuk {nama}, stok pada data kami "
                f"{stok} kemasan/paket, Kak. "
                f"Harga satuannya Rp{harga:,}. "
                "Mau ambil berapa?")
                response.append(product_response)
            message = "\n\n".join(response)

        else:
            message = ("maaf kak, informasi belum dapat kami tampilkan untuk saat ini")
        return {
            "success":True,
            "draft_reponse":message
        }

    def _format_product(self, product: dict) -> dict:
        return {
            "nama": product.get("nama"),
            "sku": product.get("sku"),
            "harga": product.get("harga_jual"),
            "stok": product.get("stok")
        }