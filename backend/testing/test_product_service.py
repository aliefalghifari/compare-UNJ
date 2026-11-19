
from backend.services.product_services import ProductService


def test_get_product():

    service = ProductService()

    # Pengujian pencarian produk
    products = service.get_product("Kurma Ajwa")

    # Tampilkan hasil
    print("\nHasil pencarian:")
    print(products)

    # Validasi hasil
    assert isinstance(products, list)

    if products:
        print("\nJumlah produk ditemukan:", len(products))

        for product in products:
            print(
                f"ID: {product['id']} | "
                f"Nama: {product['nama']} | "
                f"SKU: {product['sku']} | "
                f"Harga: {product['harga_jual']} | "
                f"Stok: {product['stok']}"
            )

    else:
        print("Produk tidak ditemukan.")


if __name__ == "__main__":
    test_get_product()
