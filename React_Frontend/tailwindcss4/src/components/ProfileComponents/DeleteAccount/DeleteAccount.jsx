import React from 'react'
import "./DeleteAccount.css"
const DeleteAccount = () => {
  return (
    <div className="h-full w-[100%]  p-10 flex flex-col">
    <div className="h-[100px] w-[100%] m-2 flex flex-row justify-start items-center">
        <div className="j">
            <i class="fa-solid  fa-trash text-4xl p-6"></i>
        </div>
        <h1 className="text-4xl font-bold">Account Deactivation</h1>
    </div>
    <div className="h-[100%] w-[100%]  m-2 flex flex-col  items-center">

    <div className="h-full w-[100%] font-bold text-md   m-1 flex flex-col ">
    <div className='h-[540px] w-[100%] border-1 border-gray-200 shadow-2xl rounded-4xl flex flex-row justify-center p-4'>
  <div className='h-[100%] w-[100%] p-4'>
    <h1>Deactivate ? </h1>
    <h3><input className='border-1 border-blue-500' type="checkbox" /> Yes, I Want to deactivate my account</h3>
    <button className='bg-red-500 hover:bg-red-600 hover:text-white hover:text-md rounded-lg m-4 px-4 py-2 '>Deactivate account</button>

  </div>
  <div className='h-[100%] w-[100%] bg-gray-300 p-4'>
    <h2 className='text-xl pb-2'>Deactivating your account</h2>
    <p className='text-[16px] pt-2'>
      We’re sorry to see you go! By deactivating your account, you will permanently lose access to your profile, orders, saved preferences, and wishlists. Any ongoing subscriptions or services linked to your account will be canceled, and your data will be removed from our platform. Please note that this action is irreversible and cannot be undone. If you’re unsure about this decision or simply wish to take a break, we recommend logging out instead. However, if you still wish to proceed, click the "Deactivate My Account" button. If you have any concerns or need further assistance, feel free to contact our support team at [support@yourwebsite.com].
    </p>

  </div>
    </div>
    </div>

    </div>
</div>
  )
}

export default DeleteAccount
