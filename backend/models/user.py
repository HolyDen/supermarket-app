from mongoengine import Document, StringField, EmailField, BooleanField
import bcrypt

class User(Document):
    username = StringField(required=True, unique=True, max_length=50)
    email = EmailField(required=True, unique=True)
    password_hash = StringField(required=True)
    is_admin = BooleanField(default=False)
    
    meta = {'collection': 'users'}
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        """Check if password matches hash"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': str(self.id),
            'username': self.username,
            'email': self.email,
            'is_admin': self.is_admin
        }
