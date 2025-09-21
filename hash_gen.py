import bcrypt

password = b"admin123456"

# ระบุ cost factor (rounds) เป็น 10
salt = bcrypt.gensalt(rounds=10)

hashed_password = bcrypt.hashpw(password, salt)

print(hashed_password.decode('utf-8'))