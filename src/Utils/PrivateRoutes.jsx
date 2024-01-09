// import { Outlet, Navigate } from 'react-router-dom';

// const PrivateRoutes = ({ loggedIn }) => {
//   return (
//     loggedIn ? <Outlet /> : <Navigate to="/login" />
    
//   );
// };

// export default PrivateRoutes;

import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
  let auth = sessionStorage.getItem('loggedIn');
  
  return auth === 'true' ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;