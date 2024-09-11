import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  //UserPoolId: "us-west-1_z39Oz1cs0",
  UserPoolId:"us-west-1_t3OD8KmM4",
  //ClientId: "5ssh4knlm7geuel5h236d82qc2"
  ClientId:"3b5renmm811p54mo8p5k4jtjme"
};

export default new CognitoUserPool(poolData);