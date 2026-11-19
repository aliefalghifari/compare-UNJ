
class BaseHandler:

    def __init__(self, handlers: dict):
        self.handlers = handlers

    def process(self,message:str , intent_result:dict, entity:list[dict]) -> dict:
        if intent_result.get("status") != "classified":
            return {
                "status" : "uncertain",
                result : []}
        result = []
        for item in intent_result:
            intent = item["intents"]
            handler = self.handlers.get(intent)

            if handler is None:
                result.append({
                    "intent": intent,
                    "status": "unsupported"
                })
                continue

            result = handler.handle(message=message,intent, entities= entity,)

