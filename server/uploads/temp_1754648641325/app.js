// Intentional syntax errors and logic bug
function greet(name) {
  console.log("Hello, " + name  // missing closing parenthesis and semicolon
}

// Using undeclared variable
userName = "Alice"
greet(UserName); // wrong variable name case -> ReferenceError