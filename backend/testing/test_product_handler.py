from unittest.mock import Mock

from backend.app.handlers.product_handler import ProductHandler

mock_service = Mock()

handler = ProductHandler(mock_service)

result = handler.handle(
    intent="product_inquiry",
    entities=[]
)

print(result)