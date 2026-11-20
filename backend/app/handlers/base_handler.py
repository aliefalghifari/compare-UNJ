
class BaseHandler:

    def __init__(self, handlers: dict):
        self.handlers = handlers

    def process(self, intent_result:dict, entity:list[dict]) -> dict:
        if intent_result.get("status") != "classified":
            return {
                "status" : "uncertain",
                "result" : []}
        result = []
        for intent in intent_result("intent",[]):
            handler = self.handlers.get(intent)

            if handler is None:
                result.append({
                    "intent": intent,
                    "status": "unsupported"
                })
                continue

            response = handler.handle(intent, entity)
            result.append(response)
        return {
            "status":"processed",
            "result":result
        }

