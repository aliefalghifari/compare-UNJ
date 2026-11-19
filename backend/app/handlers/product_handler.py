class ProductHandler:
    def __init__(self,product_service):
        self. product_service = product_service
        self.ENTITY_MAPPING = {
            "PRODUCT":"product_name",
            "QUANTITY":"quantity"
        }

    def handle(self, intent:str, entities:list):
        if intent != "product_inquiry":
            return {
                "intent":intent,
                "status":"unsupported"
            }
        product_entities = self._filter_entities(entities)
        missing = self._validate_entities(product_entities)
        if missing :
            return {
                "intent":intent,
                "status":"need_clarification",
                "required":missing
            }
        return {
            "intent":intent,
            "status": "ready_for_lookup",
            "entities":product_entities
        }

    def _filter_entities(self,entities:list[dict]):
        filtered = {
            "product_name":None,
            "quantity":None
        }

        for item in entities:
            entity_name = self.ENTITY_MAPPING.get(item.get("label"))
            if entity_name:
                filtered[entity_name] = item.get("text")
        return filtered

    def _validate_entities(self,entities:list):
        missing = []
        if not entities.get("product_name"):
            missing.append("product_name")
        return missing