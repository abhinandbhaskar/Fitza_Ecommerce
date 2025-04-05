import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { loginSuccess,logout } from '../../redux/authSlice';

function HandleRedirect() {
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const dispatch=useDispatch();
  const{user,accessToken,isAuthenticated}=useSelector((state)=>state.auth);
 

  console.log("IS Authenticated:", isAuthenticated);
  console.log("I am in HandleRedirect");

  useEffect(() => {
    // Fetch tokens from the backend
    fetch('http://localhost:8000/get-tokens/', {
      credentials: 'include', // Ensure cookies/session data is included
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.access_token && data.refresh_token) {
          console.log("AccessToken:", data.access_token);
          console.log("RefreshToken:", data.refresh_token);
          dispatch(
            loginSuccess({
              accessToken:data.access_token,
              isAuthenticated:true,
            })
          )

          // Navigate to the home page or another authenticated route
          navigate('/');
        } else {
          console.error('Tokens not found in the response.');
          setErr('Tokens not found in the response.');
        }
      })
      .catch((error) => {
        console.error('Error fetching tokens:', error);
        setErr(error.message); // Set error message in state
      });
  }, [navigate, isAuthenticated]);

  return (
    <div>
      <h1>Hello</h1>
      {err && <p className="text-red-700">{err}</p>} {/* Display error if it exists */}
    </div>
  );
}

export default HandleRedirect;
