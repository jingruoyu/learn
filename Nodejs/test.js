var bin = new Buffer([ 0x68, 0x65, 0x6c, 0x6c, 0x6f ]);
var sub = bin.slice(2);

console.log(sub);
console.log(bin); // => <Buffer 68 65 65 6c 6f>