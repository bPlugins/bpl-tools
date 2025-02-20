import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Support from './Pages/Support';

import "./app.scss"

const App = (props) => {
  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<Dashboard {...props}/>} />
        <Route path="/support" element={<Support {...props}/>} />

        {/* When no routes match, it will redirect to this route path. Note that it should be registered above. */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </>
  )
}

export default App;