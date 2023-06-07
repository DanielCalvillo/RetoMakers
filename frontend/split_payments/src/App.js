import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import GroupLists from './components/GroupList';
import GroupDetails from './components/GroupDetails';
import GroupCreate from './components/GroupCreate';
import RecoverPassword from './components/RecoverPassword'
import ExpensesDetails from './components/ExpensesDetails';
import axios from 'axios';

import Navbar from './components/Navbar';

function Layout() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

const App = () => {
  const token = localStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return (
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/recover_password' element={<RecoverPassword />} />
            <Route element={<ProtectedRoute token={token} />} >
              <Route path='/groups' element={<GroupLists />} />
              <Route path='/groups/:id' element={<GroupDetails />} />
              <Route path='/groups/create' element={<GroupCreate />} />
              <Route path="/expenses/:id" element={<ExpensesDetails />} />
            </Route>
          </Route>
        </Routes>
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