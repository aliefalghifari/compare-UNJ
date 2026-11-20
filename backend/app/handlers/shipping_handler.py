

class ShippingHandler:
    def __init__(self,ops_service):
        self.ops_service = ops_service
        self.ENTITY_MAPPING = {
            "ORDER_DATE": "order_date",
            "ORDER_TIME": "order_time",
            "PRODUCT": "product_name",
            "QUANTITY": "quantity"
        }

    def handle(self, intent:str, entities:str):
        if intent != "shipping_schedule":
                    return {
                        "intent":intent,
                        "status":"unsupported"
                    }
        shipping_entitiess = self._filter_entities(entities)
        result = self._resolve_shipping_rule(shipping_entitiess)