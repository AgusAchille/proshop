import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: 'Agus Achille',
        email: 'agus@example.com',
        password: bcrypt.hashSync('123456', 10)
    },
    {
        name: 'Nan Acuña',
        email: 'nan@example.com',
        password: bcrypt.hashSync('123456', 10)
    }
]

export default users;