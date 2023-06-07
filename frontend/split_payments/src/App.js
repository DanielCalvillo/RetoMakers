import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import GroupLists from './components/GroupList';
import GroupDetails from './components/GroupDetails';
import GroupCreate from './components/GroupCreate';
import RecoverPassword from './components/RecoverPassword'
import axios from 'axios';

const App = () => {
  const token = localStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return (
      <div>

        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/recover_password' element={<RecoverPassword />} />
          <Route element={<ProtectedRoute token={token} />} >
            <Route path='/groupList' element={<GroupLists />} />
            <Route path='/groupList/:id' element={<GroupDetails />} />
            <Route path='/groups/create' element={<GroupCreate />} />
          </Route>
        </Routes>
      </div>
  );
};

const ProtectedRoute = ({
  token,
  redirectPath = '/',
  children,
}) => {
  console.log(token)
  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};


export default App;