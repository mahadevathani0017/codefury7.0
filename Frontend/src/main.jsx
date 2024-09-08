import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom"
import Home from './Components/Home/Home.jsx'

import Dangerform from './Components/Danger/Dangerform.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import RegisterForm from './Components/AuthForms/RegistrationForm.jsx'
import { Provider } from 'react-redux'
import { store,persistor } from './store/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import LoginForm from './Components/AuthForms/LoginForm.jsx'
import ChangePasswordForm from './Components/AuthForms/ChangePassword.jsx'

const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path=''  element={<Home/>}/>
      <Route path='/danger-form'  element={<Dangerform/>}/>
      <Route path='/register'  element={<RegisterForm/>}/>
      <Route path='/login'  element={<LoginForm/>}/>
      <Route path='/change-password'  element={<ChangePasswordForm/>}/>
    </Route>

  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    < PersistGate loading={null} persistor={persistor}>
 <React.StrictMode>
    <RouterProvider router={router}>
    <App />
   
    
  </RouterProvider>
  <ToastContainer 
     position="top-right"
     autoClose={5000} 
     hideProgressBar={false} 
     newestOnTop={false} 
     closeOnClick 
     rtl={false} 
     pauseOnFocusLoss
     draggable 
     pauseOnHover
    />
  
  </React.StrictMode>
  </PersistGate>
  </Provider>
)
