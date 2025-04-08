import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../redux/authSlice';


function HandleRedirect() {
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    fetch('http://localhost:8000/get-tokens/', {
      credentials: 'include', // Required to send cookies
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
          console.log("Emtyyyy:", data);
          dispatch(
            loginSuccess({
              userId:data.user_id,
              accessToken: data.access_token,
              isAuthenticated: true,
            })
          );
          navigate('/');
        } else {
          console.error('Tokens not found in the response.');
          setErr('Tokens not found in the response.');
        }
      })
      .catch((error) => {
        console.error('Error fetching tokens:', error);
        setErr(error.message);
      });
  }, [navigate, dispatch]);

  return (
    <div>
      <h1>Redirecting...</h1>
      {err && <p className="text-red-700">{err}</p>}
    </div>
  );
}

export default HandleRedirect;

