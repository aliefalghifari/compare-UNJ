
class BaseHandler:

    def __init__(self, handlers: dict):
        self.handlers = handlers

    def process(self, intent_result:dict, entities:list[dict]) -> dict:
        if intent_result.get("status") != "classified":
            return {
                "status" : "uncertain",
                "result" : []}
        result = []
        for item in intent_result["intents"]:
            intent_name = item["intent"]
            handler = self.handlers.get(intent_name)

            if handler is None:
                result.append({
                    "intent": intent_name,
                    "status": "unsupported"
                })
                continue

            response = handler.handle(intent_name, entities)
            result.append(response)
        return {
            "status":"processed",
            "result":result
        }

