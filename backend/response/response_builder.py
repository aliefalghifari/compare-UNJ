class ResponseBuilder:

    STATUS_MESSAGES = {
        "success": "Produk berhasil ditemukan.",
        "not_found": "Produk tidak ditemukan.",
        "need_clarification": "Informasi produk belum lengkap.",
        "unsupported": "Permintaan belum didukung."
    }

    def build(self, handler_result: dict) -> dict:
        status = handler_result.get("status", "error")

        if status == "success":
            return self._build_product_response(handler_result)

        if status == "not_found":
            return self._build_product_response(handler_result)

        return {
            "success": False,
            "draft_response": self.STATUS_MESSAGES.get(
                status,
                "Maaf kak, permintaan belum dapat diproses."
            )
        }

    

    def _build_product_response(self, handler_result: dict):
        status = handler_result.get("status")
        data = handler_result.get("data", [])
        if status == "not_found":
            message = ("maaf kak, produk yang dicari belum berhasil ditemukan"
                       "Bisa diperiksa kembali nama produknya?")

        elif status == "success":
            products = [
                self._format_product(product)
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
            "draft_response":message
        }

    def _format_product(self, product: dict) -> dict:
        return {
            "nama": product.get("nama"),
            "sku": product.get("sku"),
            "harga": product.get("harga_jual"),
            "stok": product.get("stok")
        }