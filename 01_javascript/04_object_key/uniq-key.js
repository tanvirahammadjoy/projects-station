const obj = {
    name: 'John',
}
obj.name = 'Doe'
const name = "uniq-key"
obj[name] = {
    name: 'Jane',
    age: 25,
}

console.log(obj) // { name: 'Jane' }
