from mongoengine import Document, ReferenceField, ListField, EmbeddedDocument, EmbeddedDocumentField, FloatField, DateTimeField, StringField, IntField
from datetime import datetime
from .user import User

class OrderItem(EmbeddedDocument):
    product_id = StringField(required=True)
    product_name = StringField(required=True)
    quantity = IntField(required=True, min_value=1)
    price = FloatField(required=True, min_value=0)

class Order(Document):
    user = ReferenceField(User, required=True)
    items = ListField(EmbeddedDocumentField(OrderItem), required=True)
    total = FloatField(required=True, min_value=0)
    status = StringField(default='completed', choices=['completed', 'cancelled'])
    created_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'orders',
        'ordering': ['-created_at']
    }
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': str(self.id),
            'user_id': str(self.user.id),
            'items': [{
                'product_id': item.product_id,
                'product_name': item.product_name,
                'quantity': item.quantity,
                'price': item.price
            } for item in self.items],
            'total': self.total,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }
