import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import axios from "axios"

import { toast } from "react-toastify"

import { login } from "../../Features/userSlicer.js"
import { useDispatch } from "react-redux"






function RegisterForm(){
    const navigate=useNavigate()
        const {register,handleSubmit,watch,formState:{errors}}=useForm()
    const [error,setError]=useState("")

    
    const dispatch=useDispatch()

   

    const CreateUser=async(data)=>{
        console.log("sending data")
        setError("")

        try{
            const formData=new FormData();
            formData.append("fullname",data.fullname)
            formData.append("username",data.username)
            formData.append("email",data.email)
            formData.append("password",data.password)
            formData.append("avatar",data.avatar[0])
            
            console.log(formData)

            const response=await axios.post("http://localhost:8000/api/v1/users/register",formData,{
                headers:{
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response)
            toast.success("SuccessFully Registered")
            dispatch(login(response.data))
            

            navigate("/")

            
        }catch (error) {
            
            if (error.response) {
              
              const errorMessage = error.response.data.message || "An error occurred";
              setError(errorMessage);
            } else {
              setError("Network error or server is down.");
            }
            
          }
    }

    
    const [preview, setPreview] = useState("https://cdn-icons-png.flaticon.com/128/17487/17487660.png");


   
    const avatarFile = watch('avatar');

    // Effect to update the preview when a new file is selected
    useEffect(() => {
      if (avatarFile && avatarFile[0]) {
        const file = avatarFile[0];
        if (file.type.startsWith('image/')) {
          const imageURL = URL.createObjectURL(file);
          setPreview(imageURL);
  
          // Cleanup function to release the object URL when the component unmounts
          return () => URL.revokeObjectURL(imageURL);
        } else {
          alert('Please select a valid image file.');
        }
      }
    }, [avatarFile]);

    



     return (
        <>
       

<section className="bg-white dark:bg-gray-900">
  <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
    <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
      <img
        alt=""
        src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </aside>

    <main
      className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
    >
      <div className="max-w-xl lg:max-w-3xl">
        
          

        <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl dark:text-white">
          Welcome to Squid 🦑
        </h1>

        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        
         
    

        <form onSubmit={handleSubmit(CreateUser)} className="mt-8 grid grid-cols-6 gap-6">
        <div className="w-96">
    
    <div className="justify-center">
    <img
    className="inline-block h-32 w-32 rounded-full object-cover"
    src={preview}
    />
    </div>
    
    <label className="block">
     
      <input type="file"  className="block w-full text-sm text-slate-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-violet-50 file:text-violet-700
        hover:file:bg-violet-100"
        {...register("avatar")}
        
        />
    </label>
  </div>

          <div className="col-span-6 ">
            <label
              htmlFor="FirstName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Full Name
            </label>

            <input
              type="text"
              id="fullname"
              name="fullname"
              className="mt-1 w-full rounded-md border-gray-600 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 h-8 border "
              {...register("fullname",{
                required: true,
              })}
            />
            {errors.fullname && (
                    <span className="text-red-500 text-xs">
                      This field is required
                    </span>
                  )}
          </div>
          <div className="col-span-6 ">
            <label
              
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Username
            </label>

            <input
              type="text"
              id="username"
              name="username"
              className="mt-1 w-full rounded-md border-gray-600 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 h-8 border "
              {...register("username",{
                required: true,
              })}

            />
            {errors.username && (
                    <span className="text-red-500 text-xs">
                      This field is required
                    </span>
                  )}
          </div>

         

          <div className="col-span-6">
            <label htmlFor="Email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>

            <input
              type="email"
              id="email"
              name="email"
             className="mt-1 w-full rounded-md border-gray-600 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 h-8 border "
             {...register("email",{
                required: true,
                validate:(value)=>/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) || "Email address must be valid address"
              })}
            />
            {errors.email && (
                    <span className="text-red-500 text-xs">
                      {errors.email.message}
                    </span>)}
          </div>

          <div className="col-span-6 ">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 w-full rounded-md border-gray-600 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 h-8 border "
              {...register("password",{
                required: true,
                //validate:(value)=>/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\S+$).{8,20}$/.test(value) || "Password must contain 1 digit ,1 uppercase ,1 lowercase ,1 special character and whitout spaces and should be of minimum of 8 characters"
              })}
            />
            {errors.password && (
                    <span className="text-red-500 text-xs">
                      {errors.password.message}
                    </span>)}
          </div>
                
    
  


             
          

         

          

          

          <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
            <button type="submit"
              className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white"
            >
              Create an account
            </button>

            <p className="mt-4 text-sm text-gray-500 sm:mt-0 dark:text-gray-400">
              Already have an account?
              <a href="#" className="text-gray-700 underline dark:text-gray-200">Log in</a>.
            </p>
          </div>
        </form>
      </div>
    </main>
  </div>
</section>
        </>
     )
}

export default RegisterForm