// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require("jsonwebtoken")

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function main() {
    const token = jwt.sign({
        sub: "9b5a7c2e-66a4-4e4f-bf01-d3931f70fd25",
      "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["adminUser"],
            "x-hasura-default-role": "adminUser",
            "x-hasura-user-id": "9b5a7c2e-66a4-4e4f-bf01-d3931f70fd25",
        }
    }, "1f79e93d-2da9-4770-bd0a-2f57954eac21");
  return token
}

console.log(main());
