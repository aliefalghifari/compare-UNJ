from database.supabase_client import supabase

class ProductService:
    def get_product(self, product_name:str):
        response= (supabase
                   .table("produk")
                   .select("id, nama, sku, harga_jual, stok")
                   .ilike("nama", f"%{product_name}%")
                   .execute())
        return response.data