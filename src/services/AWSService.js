import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import userpool from '../utils/aws';
import { localData } from '../utils/storage';
import { toast } from 'react-toastify';
import Login from '../components/Login';

export const authenticate=(Email,Password)=>{
    return new Promise((resolve,reject)=>{
        const user=new CognitoUser({
            Username:Email,
            Pool:userpool
        });

        const authDetails= new AuthenticationDetails({
            Username:Email,
            Password,
        });
        user.authenticateUser(authDetails,{
            onSuccess:(result)=>{   
                resolve(result);
            },
            onFailure:(err)=>{
                //alert("aws service err => "+err);
                console.log("aws  service => ",err);
                reject(err);
            }
        });
    });
};

export const logout = () => {
    const user = userpool.getCurrentUser();
    user.signOut();
    localStorage.removeItem("TOKEN");
    localStorage.removeItem('loggedIn');
    toast.error("Logged Out");
    window.location.href = '/';
};