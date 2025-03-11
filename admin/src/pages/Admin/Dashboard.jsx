import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'

const Dashboard = () => {

  const { aToken, getDashData, cancelBooking, dashData } = useContext(AdminContext)

  const { slotDateFormat } = useContext(AppContext)


  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    
    <div className='m-5'>

      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.totalServiceCenters
            }</p>
            <p className='text-gray-400'>Service Centers</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.
totalBookings}</p>
            <p className='text-gray-400'>Bookings</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.
totalUsers
}</p>
            <p className='text-gray-400'>Users</p></div>
        </div>
      </div>

      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {dashData.latestBookings.slice(0, 5).map((item, index) => (
            <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.sc_data.service_center_name}</p>
                <p className='text-gray-600 '>Booking on {slotDateFormat(item.slot_date)}</p>
              </div>
              {item.cancelled ? <p className='text-red-400 text-xs font-medium'>Cancelled</p> : item.isCompleted ? <p className='text-green-500 text-xs font-medium'>Completed</p> : <img onClick={() => cancelBooking(item.booking_id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />}
            </div>
          ))}
        </div>
      </div>

    </div>

  )
}

export default Dashboard