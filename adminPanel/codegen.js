const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  "schema": [
    {
      // "someurl": {
      //   "headers": {
      //     "Authorization": "Bearer " + process.env.AUTH_TOKEN
      //   }
      // }
    }
  ],
  "overwrite": true,
  "documents": [
    "./src/**/*.tsx",
    "./src/**/*.ts"
  ],
  "generates": {
    "./src/apps/common/api/graphql.tsx": {
      "plugins": [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      "config": {
        "skipTypename": false,
        "withHooks": true,
        "withHOC": false,
        "withComponent": false
      }
    }
  }
};