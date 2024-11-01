const {Buffer} = require("buffer");
const { log } = require("console");

const string = Buffer.from("Hello")

const output = string.toString("hex");
// string.toJSON()

log(output)
Buffer.concat()
Buffer.length()
Buffer.byteLength()
Buffer.alloc(10)
