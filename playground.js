const map = new Map(
    [
        ["nom", "name"],
        ["adresse", "address"],
        ["âge", "age"],
        ["code postal", "zipCode"],
        ["e-mail", "email"]
    ]
)

console.log(map.get('nom'));
map.set('a', 'A');

let counter1 = 0;
for (let key of map.keys()) {
    counter1++;
    console.log(counter1, key);
}

let counter2 = 0;
for (let value of map.values()) {
    counter2++;
    console.log(counter2, value);
}

let counter3 = 0;
for (let [key, value] of map.entries()) {
    ++counter3;
    console.log(counter3, [key, value]);
}